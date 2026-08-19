import { useCallback } from "react";
import * as THREE from "three";

import { AnnotationKind } from "@/mikro-next/api/graphql";
import { buildAffineMatrix } from "../core/worldTransform";
import { simplifyPath, type PathPoint } from "../core/trace/pathSimplify";
import { voxelWorldSize } from "../core/trace/traceBox";
import { traceChannelSlab, traceLayerShape, traceLevelSteps } from "../core/trace/traceLayer";
import { buildCostField, voxelCost } from "../core/skeleton/corridorCost";
import { marchTube, tubeClampValue } from "../core/skeleton/tubeMarch";
import {
  MAX_TUBE_SAVE_TRIANGLES,
  MESH_KIND,
  tubeVectors,
} from "../core/skeleton/tubePersist";
import {
  MAX_CORRIDOR_VOXELS,
  corridorVoxelCount,
  planCorridor,
  type CorridorBox,
} from "../core/skeleton/corridorPlan";
import { climToUnit } from "../core/dataRange";
import {
  backtrackPath,
  geodesicField,
  type GeodesicField,
} from "../core/skeleton/geodesicReference";
import { resampleStroke, type Vec3 } from "../core/skeleton/strokeModel";
import {
  useBrushSkeletonStoreApi,
  type TubeSurface,
} from "../store/brushSkeletonStore";
import { useSceneStoreApi } from "../store/sceneStore";
import { useViewerStoreApi } from "../store/viewerStore";
import { useCreateSceneAnnotation } from "./useCreateSceneAnnotation";

/**
 * The impure shell of the skeleton brush: stroke in the store → corridor →
 * cost field → geodesic → centerline candidate → PATH annotation. All
 * arithmetic lives in `core/skeleton/`; this decides WHICH layer, channel and
 * pyramid level, reads voxels out of the residency manager, and moves the
 * session through the store.
 *
 * Nothing here subscribes (the `useTraceHop` rule): every input is read from
 * a store API when the gesture calls it. Usable on BOTH sides of the Canvas
 * boundary — the in-canvas stroke session and the DOM toolbar panel share it.
 *
 * v1 runs the CPU reference (`geodesicReference`) directly; the GPU compute
 * path slots in front of it without changing this hook's contract.
 */

/** The stroke polyline the corridor test walks per voxel — kept small. */
const MAX_STROKE_POINTS = 128;

/**
 * Corridor ceiling for the CPU engine — deliberately under
 * `MAX_CORRIDOR_VOXELS`: Dijkstra over the corridor runs on the click, on
 * the main thread.
 */
const CPU_MAX_CORRIDOR_VOXELS = 1_000_000;

/** Default brush radius, in level voxels at the extraction level. */
const DEFAULT_RADIUS_VOXELS = 4;

/** Same simplification allowance the vector trace uses, in node steps. */
const SIMPLIFY_TOLERANCE_STEPS = 0.5;

/** How long a saved centerline stays as a local preview (poll is ~5s). */
const SAVED_PREVIEW_CLEAR_MS = 6_000;

/** Tube vertex caps: preview budgets, not persistence budgets (that one is
 * `MAX_TUBE_SAVE_TRIANGLES`). GPU appends into a preallocated buffer; the
 * CPU twin marches on the main thread, so it gets a smaller ceiling. */
const GPU_MAX_TUBE_VERTICES = 600_000;
const CPU_MAX_TUBE_VERTICES = 240_000;

/** Live-drag budgets: smaller than the release-time ones so every re-mesh
 * stays a few milliseconds of GPU. GPU-only — a per-drag CPU march would
 * jank the very pointer stream that is painting. */
const LIVE_MAX_CORRIDOR_VOXELS = 1_000_000;
const LIVE_MAX_TUBE_VERTICES = 300_000;

type PickedCorridor = {
  level: number;
  box: CorridorBox;
  step: readonly [number, number, number];
  spacing: Vec3;
  worldToLevelVoxel: (world: Vec3) => Vec3;
};

const pickScratch = new THREE.Vector3();

/**
 * Choose the corridor: start at the on-screen level and coarsen until the
 * stroke's dilated tube fits `maxVoxels` (`traceBox.chooseTraceLevel`
 * restated over a stroke tube). Shared by the release-time extraction and
 * the live drag preview.
 */
function pickCorridor(opts: {
  strokeWorld: readonly Vec3[];
  radiusWorld: number;
  inverse: THREE.Matrix4;
  voxelSize: readonly [number, number, number];
  levelSteps: readonly (readonly [number, number, number])[];
  shape: readonly [number, number, number];
  startLevel: number;
  maxVoxels: number;
}): PickedCorridor | null {
  const { strokeWorld, radiusWorld, inverse, voxelSize, levelSteps, shape } = opts;
  for (let level = opts.startLevel; level < levelSteps.length; level += 1) {
    const step = levelSteps[level];
    const spacing: Vec3 = [
      voxelSize[0] * step[0],
      voxelSize[1] * step[1],
      voxelSize[2] * step[2],
    ];
    const worldToLevelVoxel = (world: Vec3): Vec3 => {
      // The layer's local frame IS corner-anchored level-0 voxel space
      // (COORDINATE_SYSTEMS.md), so a level voxel is local / step.
      pickScratch.set(world[0], world[1], world[2]).applyMatrix4(inverse);
      return [pickScratch.x / step[0], pickScratch.y / step[1], pickScratch.z / step[2]];
    };
    const levelShape: Vec3 = [
      Math.max(1, Math.ceil(shape[0] / step[0])),
      Math.max(1, Math.ceil(shape[1] / step[1])),
      Math.max(1, Math.ceil(shape[2] / step[2])),
    ];
    const box = planCorridor({
      strokeWorld: strokeWorld as Vec3[],
      radiusWorld,
      worldToLevelVoxel,
      levelVoxelWorldSize: spacing,
      levelShape,
      maxVoxels: opts.maxVoxels,
    });
    if (box) return { level, box, step, spacing, worldToLevelVoxel };
  }
  return null;
}

/**
 * The layer's DISPLAY window in raw units — clim bounds resolved against the
 * pool's data range (`climToUnit`, the raymarcher's own convention).
 *
 * The brush normalizes intensity through THIS window, not the full data
 * range, on purpose: the user paints over what they SEE, and what they see
 * is clim-windowed. Wide-dtype data (uint16 microscopy) routinely lives in a
 * few percent of its dtype range — full-range normalization would make every
 * structure "dark" (a flat cost field, and a Wrap threshold that never
 * selects anything). Gamma stays out: it reshapes contrast monotonically, so
 * it moves no isosurface the slider can't reach.
 */
function climWindow(
  layer: unknown,
  pool: { minValue: number; maxValue: number },
): { min: number; max: number } {
  const range = Math.max(pool.maxValue - pool.minValue, 1e-5);
  const clim = layer as { climMin?: number | null; climMax?: number | null };
  const c0 = climToUnit(clim.climMin ?? null, pool.minValue, pool.maxValue, 0);
  const c1 = climToUnit(clim.climMax ?? null, pool.minValue, pool.maxValue, 1);
  return {
    min: pool.minValue + c0 * range,
    max: pool.minValue + Math.max(c1, c0 + 1e-3) * range,
  };
}

const soupScratch = new THREE.Vector3();

/** Level-voxel triangle soup → world, the volume's own index→physical map. */
function soupToWorld(
  levelPositions: Float32Array,
  step: readonly [number, number, number],
  affine: THREE.Matrix4,
): Float32Array {
  const out = new Float32Array(levelPositions.length);
  for (let i = 0; i < levelPositions.length; i += 3) {
    soupScratch
      .set(
        levelPositions[i] * step[0],
        levelPositions[i + 1] * step[1],
        levelPositions[i + 2] * step[2],
      )
      .applyMatrix4(affine);
    out[i] = soupScratch.x;
    out[i + 1] = soupScratch.y;
    out[i + 2] = soupScratch.z;
  }
  return out;
}

export const useBrushSkeleton = () => {
  const sceneStoreApi = useSceneStoreApi();
  const viewerStoreApi = useViewerStoreApi();
  const brushApi = useBrushSkeletonStoreApi();
  const { createSceneAnnotation } = useCreateSceneAnnotation();

  /**
   * Fill the store's blank radius from the layer's own scale — world units
   * vary by orders of magnitude between datasets, so the default has to be
   * derived, not chosen. Called on arming; a user-set radius is never moved.
   */
  const initRadiusForLayer = useCallback(
    (layerId: string) => {
      const layer = sceneStoreApi
        .getState()
        .layers.find((candidate) => candidate.id === layerId);
      if (!layer) return;
      const voxelSize = voxelWorldSize(buildAffineMatrix(layer));
      const finest = Math.min(...voxelSize);
      brushApi
        .getState()
        .initRadius(DEFAULT_RADIUS_VOXELS * finest, [finest, finest * 40]);
    },
    [sceneStoreApi, brushApi],
  );

  const extract = useCallback(async () => {
    const brush = brushApi.getState();
    const { stroke, strokeLayerId } = brush;
    if (!strokeLayerId || stroke.length < 2) return;
    brush.setExtracting();

    const layer = sceneStoreApi
      .getState()
      .layers.find((candidate) => candidate.id === strokeLayerId);
    const brickSystem = viewerStoreApi.getState().brickSystem;
    const shape = layer ? traceLayerShape(layer) : null;
    if (!layer || !brickSystem || !shape) {
      brush.fail("The stroke's layer is no longer in the scene");
      return;
    }
    const pool = brickSystem.getLayerPool(strokeLayerId);
    if (!pool) {
      brush.fail("No data resident for this layer yet — let it stream in");
      return;
    }

    const affine = buildAffineMatrix(layer);
    const inverse = affine.clone().invert();
    const voxelSize = voxelWorldSize(affine);
    const levelSteps = traceLevelSteps(layer);
    const channel = traceChannelSlab(layer);
    const radiusWorld =
      brush.radiusWorld ?? DEFAULT_RADIUS_VOXELS * Math.min(...voxelSize);
    const strokeWorld = resampleStroke(stroke, MAX_STROKE_POINTS);
    const weights = brush.weights;
    const tubeEnabled = brush.tubeEnabled;
    // Brightness is normalized through the DISPLAY window (see climWindow):
    // the brush operates on what the user sees.
    const dataWindow = climWindow(layer, pool);
    const windowRange = Math.max(dataWindow.max - dataWindow.min, 1e-5);
    // A threshold τ on windowed intensity IS a cost-space iso value: cost is
    // monotone in brightness, so the tube surface and the geodesic run on
    // the SAME field.
    const tubeIso = voxelCost(brush.tubeThreshold, weights);
    /** Windowed-intensity sampler over a picked corridor's level. */
    const samplerFor =
      (p: PickedCorridor) =>
      (levelVoxel: Vec3): number | null => {
        const raw = brickSystem.sampleResident(
          strokeLayerId,
          [
            levelVoxel[0] * p.step[0],
            levelVoxel[1] * p.step[1],
            levelVoxel[2] * p.step[2],
          ],
          p.level,
          channel,
        );
        if (raw === null) return null;
        return Math.min(1, Math.max(0, (raw - dataWindow.min) / windowRange));
      };

    // Start at what is on screen and coarsen until the corridor fits the
    // budget — the same reasoning as `traceBox.chooseTraceLevel`, restated
    // over a stroke tube.
    const startLevel = Math.min(
      Math.max(viewerStoreApi.getState().nodePlans[strokeLayerId]?.targetLevel ?? 0, 0),
      Math.max(0, levelSteps.length - 1),
    );

    const scratch = new THREE.Vector3();
    const planAtBudget = (maxVoxels: number): PickedCorridor | null =>
      pickCorridor({
        strokeWorld,
        radiusWorld,
        inverse,
        voxelSize,
        levelSteps,
        shape,
        startLevel,
        maxVoxels,
      });

    // Seed and target: the stroke's first/last PROBED voxels — they were on
    // the data when painted — brought to box-relative level coordinates.
    const boxRelative = (
      voxel: Vec3,
      box: CorridorBox,
      step: readonly [number, number, number],
    ): Vec3 => [
      Math.min(
        box.size[0] - 1,
        Math.max(0, Math.floor(voxel[0] / step[0]) - box.origin[0]),
      ),
      Math.min(
        box.size[1] - 1,
        Math.max(0, Math.floor(voxel[1] / step[1]) - box.origin[1]),
      ),
      Math.min(
        box.size[2] - 1,
        Math.max(0, Math.floor(voxel[2] / step[2]) - box.origin[2]),
      ),
    ];

    // --- GPU first: the corridor budget is larger because the field lives
    // and relaxes on the device; only dist/pred come back. ------------------
    const skeletonizer = brickSystem.getGpuSkeletonizer?.() ?? null;
    let field: GeodesicField | null = null;
    let holes = 0;
    let picked: PickedCorridor | null = null;
    /** Tube surface in LEVEL-voxel coords at `picked`'s level, or null. */
    let levelTube: { positions: Float32Array; triangles: number; truncated: boolean } | null =
      null;

    if (skeletonizer?.ready()) {
      const gpuPicked = planAtBudget(MAX_CORRIDOR_VOXELS);
      const pageOffset = gpuPicked
        ? pool.pageTable.layout.levelOffset[gpuPicked.level]
        : undefined;
      if (gpuPicked && pageOffset) {
        const result = await skeletonizer.run({
          atlas: pool.atlas,
          pageTable: pool.pageTable,
          level: gpuPicked.level,
          box: gpuPicked.box,
          strokeLevelPts: strokeWorld.map(gpuPicked.worldToLevelVoxel),
          radiusWorld,
          weights,
          channel,
          minValue: dataWindow.min,
          maxValue: dataWindow.max,
          emptyCeiling: pool.emptyBits === 24 ? 0xffffff : 0xff,
          poolMin: pool.minValue,
          poolRange: Math.max(pool.maxValue - pool.minValue, 1e-5),
          payload: pool.spec.payload,
          border: pool.spec.border,
          storedZ: pool.spec.stored[2],
          spacing: gpuPicked.spacing,
          seed: boxRelative(stroke[0].voxel, gpuPicked.box, gpuPicked.step),
          tube: tubeEnabled
            ? {
                iso: tubeIso,
                clampValue: tubeClampValue(tubeIso),
                maxVertices: GPU_MAX_TUBE_VERTICES,
              }
            : undefined,
        });
        if (result) {
          field = { dist: result.dist, pred: result.pred };
          holes = result.holes;
          picked = gpuPicked;
          levelTube = result.tube;
        }
      }
    }
    // The extraction awaited the device; a new stroke may own the session now.
    if (brushApi.getState().status !== "extracting") return;

    // --- CPU reference fallback (no device, pipelines broken, unconverged,
    // or the corridor outgrew the GPU) — over its own smaller budget. -------
    if (!field) {
      const cpuPicked = planAtBudget(CPU_MAX_CORRIDOR_VOXELS);
      if (!cpuPicked) {
        brush.fail("The stroke spans too much data — paint a shorter stroke");
        return;
      }
      picked = cpuPicked;
      const { box, step, spacing, worldToLevelVoxel } = cpuPicked;
      const built = buildCostField({
        box,
        strokeLevelPts: strokeWorld.map(worldToLevelVoxel),
        radiusWorld,
        spacing,
        weights,
        sample: samplerFor(cpuPicked),
      });
      holes = built.holes;
      field = geodesicField({
        cost: built.cost,
        box,
        spacing,
        seed: boxRelative(stroke[0].voxel, box, step),
      });
      if (tubeEnabled) {
        levelTube = marchTube({
          cost: built.cost,
          box,
          iso: tubeIso,
          maxVertices: CPU_MAX_TUBE_VERTICES,
        });
      }
    } else if (tubeEnabled && !levelTube && picked) {
      // The GPU delivered the centerline but not the tube (dead/latched tube
      // pipeline): march the CPU twin over the same corridor rather than
      // silently answering "just a path".
      if (corridorVoxelCount(picked.box) <= CPU_MAX_CORRIDOR_VOXELS) {
        const built = buildCostField({
          box: picked.box,
          strokeLevelPts: strokeWorld.map(picked.worldToLevelVoxel),
          radiusWorld,
          spacing: picked.spacing,
          weights,
          sample: samplerFor(picked),
        });
        levelTube = marchTube({
          cost: built.cost,
          box: picked.box,
          iso: tubeIso,
          maxVertices: CPU_MAX_TUBE_VERTICES,
        });
      }
    }

    const { level, box, step, spacing } = picked!;
    const target = boxRelative(stroke[stroke.length - 1].voxel, box, step);
    const nodes = backtrackPath(field, box, target);
    if (!nodes) {
      brush.fail(
        holes > 0
          ? "Could not connect the stroke's ends — data is still streaming in, try again"
          : "Could not connect the stroke's ends — try a larger radius",
      );
      return;
    }

    // Level-voxel centers → the layer's local frame → world: the IDENTICAL
    // index→physical map the volume itself renders through.
    const world = nodes.map((node) => {
      scratch
        .set(node[0] * step[0], node[1] * step[1], node[2] * step[2])
        .applyMatrix4(affine);
      return [scratch.x, scratch.y, scratch.z] as PathPoint;
    });
    const tolerance =
      SIMPLIFY_TOLERANCE_STEPS * Math.min(spacing[0], spacing[1], spacing[2]);
    const points = simplifyPath(world, tolerance) as Vec3[];

    // Level-voxel triangle soup → world, the same map as the centerline.
    const tube: TubeSurface | null = levelTube
      ? {
          positions: soupToWorld(levelTube.positions, step, affine),
          triangles: levelTube.triangles,
          truncated: levelTube.truncated,
        }
      : null;

    const notes: string[] = [];
    if (holes > 0) {
      notes.push(
        `Centerline may detour around ${holes} unloaded region${holes === 1 ? "" : "s"} — let streaming settle and re-extract`,
      );
    }
    if (tubeEnabled && !tube) {
      notes.push("Tube surface unavailable (GPU tube kernel failed)");
    }
    if (tube?.truncated) {
      notes.push("Tube surface truncated — raise the threshold or shrink the radius");
    }

    const after = brushApi.getState();
    if (after.status !== "extracting") return; // a new stroke took over
    after.setCandidate(
      { points, layerId: strokeLayerId, level, holes, tube },
      notes.length > 0 ? notes.join("; ") : null,
    );
  }, [brushApi, sceneStoreApi, viewerStoreApi]);

  /**
   * The live drag preview: re-mesh the tube around the stroke AS PAINTED —
   * cost + tube kernels only (`extractTube`), no geodesic, so one round
   * answers in milliseconds. GPU-only by design; without a device the tube
   * still arrives on release via the CPU twin. Results landing after the
   * stroke ended are dropped by the store (`setLiveTube` guards on painting).
   */
  const previewLiveTube = useCallback(async () => {
    const brush = brushApi.getState();
    if (brush.status !== "painting" || !brush.tubeEnabled) return;
    const { stroke, strokeLayerId } = brush;
    if (!strokeLayerId || stroke.length < 2) return;

    const layer = sceneStoreApi
      .getState()
      .layers.find((candidate) => candidate.id === strokeLayerId);
    const brickSystem = viewerStoreApi.getState().brickSystem;
    const shape = layer ? traceLayerShape(layer) : null;
    if (!layer || !brickSystem || !shape) return;
    const pool = brickSystem.getLayerPool(strokeLayerId);
    const skeletonizer = brickSystem.getGpuSkeletonizer?.() ?? null;
    if (!pool || !skeletonizer?.tubeReady()) return;

    const affine = buildAffineMatrix(layer);
    const inverse = affine.clone().invert();
    const voxelSize = voxelWorldSize(affine);
    const levelSteps = traceLevelSteps(layer);
    const radiusWorld =
      brush.radiusWorld ?? DEFAULT_RADIUS_VOXELS * Math.min(...voxelSize);
    // Same display-window normalization as the release-time extraction.
    const dataWindow = climWindow(layer, pool);
    const tubeIso = voxelCost(brush.tubeThreshold, brush.weights);
    const startLevel = Math.min(
      Math.max(viewerStoreApi.getState().nodePlans[strokeLayerId]?.targetLevel ?? 0, 0),
      Math.max(0, levelSteps.length - 1),
    );
    // ONE snapshot of the stroke for both the plan and the kernel — samples
    // landing mid-call belong to the next preview round.
    const strokeWorld = resampleStroke(stroke, MAX_STROKE_POINTS);
    const picked = pickCorridor({
      strokeWorld,
      radiusWorld,
      inverse,
      voxelSize,
      levelSteps,
      shape,
      startLevel,
      maxVoxels: LIVE_MAX_CORRIDOR_VOXELS,
    });
    if (!picked) return;
    const pageOffset = pool.pageTable.layout.levelOffset[picked.level];
    if (!pageOffset) return;

    const result = await skeletonizer.extractTube({
      atlas: pool.atlas,
      pageTable: pool.pageTable,
      level: picked.level,
      box: picked.box,
      strokeLevelPts: strokeWorld.map(picked.worldToLevelVoxel),
      radiusWorld,
      weights: brush.weights,
      channel: traceChannelSlab(layer),
      minValue: dataWindow.min,
      maxValue: dataWindow.max,
      emptyCeiling: pool.emptyBits === 24 ? 0xffffff : 0xff,
      poolMin: pool.minValue,
      poolRange: Math.max(pool.maxValue - pool.minValue, 1e-5),
      payload: pool.spec.payload,
      border: pool.spec.border,
      storedZ: pool.spec.stored[2],
      spacing: picked.spacing,
      tube: {
        iso: tubeIso,
        clampValue: tubeClampValue(tubeIso),
        maxVertices: LIVE_MAX_TUBE_VERTICES,
      },
    });
    if (!result) return;
    const after = brushApi.getState();
    if (after.status !== "painting" || after.strokeLayerId !== strokeLayerId) return;
    after.setLiveTube({
      positions: soupToWorld(result.positions, picked.step, affine),
      triangles: result.triangles,
      truncated: result.truncated,
    });
  }, [brushApi, sceneStoreApi, viewerStoreApi]);

  const save = useCallback(async () => {
    const brush = brushApi.getState();
    const candidate = brush.candidate;
    if (!candidate || brush.status !== "preview") return;
    brush.setSaving();

    const created = await createSceneAnnotation(
      AnnotationKind.Path,
      candidate.points.map((p) => [p[0], p[1], p[2]]),
    );
    let after = brushApi.getState();
    if (after.candidate !== candidate) return; // a new stroke took over
    if (!created) {
      after.fail("Saving failed — the annotation was not created");
      return;
    }

    // The tube rides along as a MESH annotation (SPHERE_KIND-precedent cast;
    // see tubePersist.ts). A refusal must not fail the save — the centerline
    // is persisted, the tube stays a local preview and says why.
    let savedNote = "Saved";
    const tube = candidate.tube;
    if (tube) {
      if (tube.triangles > MAX_TUBE_SAVE_TRIANGLES) {
        savedNote = `Centerline saved — tube too detailed to save (${tube.triangles} triangles), preview only`;
      } else {
        const mesh = await createSceneAnnotation(MESH_KIND, tubeVectors(tube.positions));
        after = brushApi.getState();
        if (after.candidate !== candidate) return;
        if (!mesh) {
          savedNote =
            "Centerline saved — tube not saved (the server may not support MESH annotations yet)";
        }
      }
    }
    after.setCandidate(candidate, savedNote);
    // The persisted copy arrives with the annotation layer's next poll; keep
    // the local line meanwhile so the shape never blinks off screen.
    setTimeout(() => {
      const state = brushApi.getState();
      if (state.candidate === candidate && state.status === "preview") {
        state.clear();
      }
    }, SAVED_PREVIEW_CLEAR_MS);
  }, [brushApi, createSceneAnnotation]);

  return { initRadiusForLayer, extract, previewLiveTube, save };
};
