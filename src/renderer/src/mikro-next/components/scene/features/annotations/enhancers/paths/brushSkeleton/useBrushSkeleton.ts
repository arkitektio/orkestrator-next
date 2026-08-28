import { useCallback } from "react";
import * as THREE from "three";

import { AnnotationKind } from "@/mikro-next/api/graphql";
import { buildAffineMatrix } from "../../../../../platform/coords/worldTransform";
import { voxelWorldSize } from "../../shared/planning";
import { traceChannelSlab, traceLayerShape, traceLevelSteps } from "../../shared/traceLayer";
import { voxelCost, type SkeletonWeights } from "../../shared/corridorCost";
import { corridorVoxelCount } from "../../shared/corridorPlan";
import { backtrackPath } from "../../shared/geodesicReference";
import { tubeClampValue } from "../../meshes/tubeMarch";
import {
  MAX_TUBE_SAVE_TRIANGLES,
  SURFACE_KIND,
  surfaceGeometry,
} from "../../meshes/tubePersist";
import { resampleStroke, type BrushSample, type Vec3 } from "../../shared/strokeModel";
import type {
  CenterlineResult,
  LevelTube,
  SkeletonEngine,
  SkeletonEngineContext,
  TubeOptions,
} from "../../shared/engine";
import { createCpuSkeletonEngine } from "../../shared/cpuEngine";
import { createGpuSkeletonEngine } from "../../shared/gpuEngine";
import { gpuSkeletonizerFor } from "../../shared/gpu/skeletonizerAccess";
import {
  boxRelative,
  centerlineToWorld,
  climWindow,
  pickCorridor,
  soupToWorld,
  touchesBoundary,
  type PickedCorridor,
} from "../../shared/planning";
import {
  useBrushSkeletonStoreApi,
  type TubeSurface,
} from "../../brushSkeletonStore";
import { useSceneStoreApi } from "../../../../../platform/stores/sceneStore";

import { useCreateSceneAnnotation } from "../../../useCreateSceneAnnotation";
import { useBrickStoreApi } from "../../../../bricks/store/brickSlice";

/**
 * The GESTURE orchestration of the skeleton brush and the smooth blob:
 * stroke/click in the store → engine extraction → candidate → annotations.
 *
 * The division of labour after the engine refactor:
 * - `features/annotations/enhancers/shared/`      — pure arithmetic (fields, geodesics, marching).
 * - `skeleton/planning`   — level/corridor choice and coordinate plumbing.
 * - `skeleton/cpuEngine`  — the reference pipeline on the main thread.
 * - `skeleton/gpuEngine`  — the same pipeline on the WGSL kernels.
 * - here                  — store transitions, the grow loop, persistence.
 *
 * Extraction walks the engine list (GPU first when a device is alive, CPU
 * always last), each planned at its own corridor budget; an engine answering
 * null simply passes to the next. Nothing here subscribes (the `useTraceHop`
 * rule): every input is read from a store API when the gesture calls it, so
 * the hook is usable on BOTH sides of the Canvas boundary.
 */

/** The stroke polyline the corridor test walks per voxel — kept small. */
const MAX_STROKE_POINTS = 128;

/** Default brush radius, in level voxels at the extraction level. */
const DEFAULT_RADIUS_VOXELS = 4;

/** How long a saved centerline stays as a local preview (poll is ~5s). */
const SAVED_PREVIEW_CLEAR_MS = 6_000;

/** Live-drag budgets: smaller than the release-time ones so every re-mesh
 * stays a few milliseconds of GPU. GPU-only — a per-drag CPU march would
 * jank the very pointer stream that is painting. */
const LIVE_MAX_CORRIDOR_VOXELS = 1_000_000;
const LIVE_MAX_TUBE_VERTICES = 300_000;

/** The GROW gesture (a click, not a stroke): the search sphere expands by
 * this factor per step until the surface stops touching its boundary. */
const GROW_FACTOR = 1.5;
const MAX_GROW_STEPS = 10;

/**
 * Everything an extraction needs about the target layer, resolved once per
 * gesture from the stores. Null when the scene can no longer answer.
 */
type ExtractionContext = {
  layerId: string;
  affine: THREE.Matrix4;
  inverse: THREE.Matrix4;
  voxelSize: readonly [number, number, number];
  levelSteps: readonly (readonly [number, number, number])[];
  shape: readonly [number, number, number];
  startLevel: number;
  engineContext: SkeletonEngineContext;
  /** GPU first when alive, CPU always last. */
  engines: SkeletonEngine[];
  plan: (opts: {
    strokeWorld: readonly Vec3[];
    radiusWorld: number;
    maxVoxels: number;
  }) => PickedCorridor | null;
};

export const useBrushSkeleton = () => {
  const sceneStoreApi = useSceneStoreApi();
  const viewerStoreApi = useBrickStoreApi();
  const brushApi = useBrushSkeletonStoreApi();
  const { createSceneAnnotation } = useCreateSceneAnnotation();

  const resolveContext = useCallback(
    (layerId: string): ExtractionContext | null => {
      const layer = sceneStoreApi
        .getState()
        .layers.find((candidate) => candidate.id === layerId);
      const brickSystem = viewerStoreApi.getState().brickSystem;
      const shape = layer ? traceLayerShape(layer) : null;
      if (!layer || !brickSystem || !shape) return null;
      const pool = brickSystem.getLayerPool(layerId);
      if (!pool) return null;

      const affine = buildAffineMatrix(layer);
      const inverse = affine.clone().invert();
      const voxelSize = voxelWorldSize(affine);
      const levelSteps = traceLevelSteps(layer);
      const startLevel = Math.min(
        Math.max(viewerStoreApi.getState().nodePlans[layerId]?.targetLevel ?? 0, 0),
        Math.max(0, levelSteps.length - 1),
      );

      const engineContext: SkeletonEngineContext = {
        channel: traceChannelSlab(layer),
        window: climWindow(layer, pool),
        pool,
        sampleResident: (baseVoxel, level, channel) =>
          brickSystem.sampleResident(layerId, baseVoxel, level, channel),
      };
      const engines: SkeletonEngine[] = [];
      const skeletonizer = gpuSkeletonizerFor(brickSystem);
      if (skeletonizer) engines.push(createGpuSkeletonEngine(engineContext, skeletonizer));
      engines.push(createCpuSkeletonEngine(engineContext));

      return {
        layerId,
        affine,
        inverse,
        voxelSize,
        levelSteps,
        shape,
        startLevel,
        engineContext,
        engines,
        plan: ({ strokeWorld, radiusWorld, maxVoxels }) =>
          pickCorridor({
            strokeWorld,
            radiusWorld,
            inverse,
            voxelSize,
            levelSteps,
            shape,
            startLevel,
            maxVoxels,
          }),
      };
    },
    [sceneStoreApi, viewerStoreApi],
  );

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
    if (!strokeLayerId || stroke.length < 1) return;
    brush.setExtracting();

    const ctx = resolveContext(strokeLayerId);
    if (!ctx) {
      brush.fail("The stroke's layer is no longer in the scene");
      return;
    }
    const radiusWorld =
      brush.radiusWorld ?? DEFAULT_RADIUS_VOXELS * Math.min(...ctx.voxelSize);
    const weights = brush.weights;
    // A threshold τ on windowed intensity IS a cost-space iso value: cost is
    // monotone in brightness, so the tube surface and the geodesic run on
    // the SAME field.
    const tubeIso = voxelCost(brush.tubeThreshold, weights);
    const stale = () => brushApi.getState().status !== "extracting";

    // --- The smooth-blob GROW gesture: one probed point, no stroke. Expand
    // the search sphere step by step, re-meshing the threshold surface each
    // round, until it stops touching the boundary (closed), stops growing
    // the budget allows, or runs out of steps. Each intermediate surface is
    // published as the live tube, so the expansion is visible. --------------
    if (brush.strokeMode === "blob") {
      const outcome = await runGrowLoop({
        ctx,
        seed: stroke[0],
        startRadius: radiusWorld,
        weights,
        tubeIso,
        smoothVoxels: Math.max(0, Math.floor(brush.blobSmoothness)),
        gapVoxels: Math.max(0, Math.floor(brush.blobGap)),
        tau: brush.tubeThreshold,
        stale,
        publishLive: (tube) => brushApi.getState().setLiveTube(tube),
      });
      if (stale()) return;
      const after = brushApi.getState();
      if (!outcome || outcome.tube.triangles === 0) {
        after.fail(
          "Nothing brighter than the Wrap threshold near the probe point — lower Wrap and try again",
        );
        return;
      }
      after.setCandidate(
        {
          points: [],
          layerId: strokeLayerId,
          level: outcome.level,
          holes: 0,
          tube: outcome.tube,
        },
        outcome.closed
          ? null
          : "Surface still touches the search boundary — the structure may extend further",
      );
      return;
    }

    // --- The stroke gesture: centerline (+ optional tube) over the painted
    // corridor. Engines in order, each at its own budget. -------------------
    const strokeWorld = resampleStroke(stroke, MAX_STROKE_POINTS);
    const tubeOptions: TubeOptions | null = brush.tubeEnabled
      ? {
          iso: tubeIso,
          clampValue: tubeClampValue(tubeIso),
          smoothVoxels: 0,
          connectivity: null,
        }
      : null;

    let picked: PickedCorridor | null = null;
    let result: CenterlineResult | null = null;
    for (const engine of ctx.engines) {
      const enginePick = ctx.plan({
        strokeWorld,
        radiusWorld,
        maxVoxels: engine.maxCorridorVoxels,
      });
      if (!enginePick) continue;
      result = await engine.centerline({
        picked: enginePick,
        strokeLevelPts: strokeWorld.map(enginePick.worldToLevelVoxel),
        radiusWorld,
        weights,
        seed: boxRelative(stroke[0].voxel, enginePick.box, enginePick.step),
        tube: tubeOptions,
      });
      if (stale()) return;
      if (result) {
        picked = enginePick;
        break;
      }
    }
    if (!picked || !result) {
      brush.fail("The stroke spans too much data — paint a shorter stroke");
      return;
    }

    // Tube asked for but not delivered (e.g. the GPU's tube pipeline is dead
    // while its centerline works): ask the CPU engine for the tube alone
    // rather than silently answering "just a path".
    let levelTube: LevelTube | null = result.tube;
    if (tubeOptions && !levelTube) {
      const cpu = ctx.engines.find((engine) => engine.kind === "cpu");
      if (cpu && corridorVoxelCount(picked.box) <= cpu.maxCorridorVoxels) {
        levelTube = await cpu.tube({
          picked,
          strokeLevelPts: strokeWorld.map(picked.worldToLevelVoxel),
          radiusWorld,
          weights,
          tube: tubeOptions,
        });
        if (stale()) return;
      }
    }

    const target = boxRelative(stroke[stroke.length - 1].voxel, picked.box, picked.step);
    const nodes = backtrackPath(result.field, picked.box, target);
    if (!nodes) {
      brush.fail(
        result.holes > 0
          ? "Could not connect the stroke's ends — data is still streaming in, try again"
          : "Could not connect the stroke's ends — try a larger radius",
      );
      return;
    }
    const points = centerlineToWorld(nodes, picked, ctx.affine);
    const tube: TubeSurface | null = levelTube
      ? {
          positions: soupToWorld(levelTube.positions, picked.step, ctx.affine),
          triangles: levelTube.triangles,
          truncated: levelTube.truncated,
        }
      : null;

    const notes: string[] = [];
    if (result.holes > 0) {
      notes.push(
        `Centerline may detour around ${result.holes} unloaded region${result.holes === 1 ? "" : "s"} — let streaming settle and re-extract`,
      );
    }
    if (tubeOptions && !tube) {
      notes.push("Tube surface unavailable (GPU tube kernel failed)");
    }
    if (tube?.truncated) {
      notes.push("Tube surface truncated — raise the threshold or shrink the radius");
    }

    const after = brushApi.getState();
    if (after.status !== "extracting") return; // a new stroke took over
    after.setCandidate(
      {
        points,
        layerId: strokeLayerId,
        level: picked.level,
        holes: result.holes,
        tube,
      },
      notes.length > 0 ? notes.join("; ") : null,
    );
  }, [brushApi, resolveContext]);

  /**
   * The live drag preview: re-mesh the tube around the stroke AS PAINTED —
   * the GPU engine's tube-only path, no geodesic, so one round answers in
   * milliseconds. GPU-only by design; without a device the tube still
   * arrives on release via the CPU engine. Results landing after the stroke
   * ended are dropped by the store (`setLiveTube` guards the status).
   */
  const previewLiveTube = useCallback(async () => {
    const brush = brushApi.getState();
    if (brush.status !== "painting" || !brush.tubeEnabled) return;
    const { stroke, strokeLayerId } = brush;
    if (!strokeLayerId || stroke.length < 2) return;

    const ctx = resolveContext(strokeLayerId);
    const gpu = ctx?.engines.find((engine) => engine.kind === "gpu");
    if (!ctx || !gpu) return;

    const radiusWorld =
      brush.radiusWorld ?? DEFAULT_RADIUS_VOXELS * Math.min(...ctx.voxelSize);
    const tubeIso = voxelCost(brush.tubeThreshold, brush.weights);
    // ONE snapshot of the stroke for both the plan and the kernel — samples
    // landing mid-call belong to the next preview round.
    const strokeWorld = resampleStroke(stroke, MAX_STROKE_POINTS);
    const picked = ctx.plan({
      strokeWorld,
      radiusWorld,
      maxVoxels: LIVE_MAX_CORRIDOR_VOXELS,
    });
    if (!picked) return;

    const result = await gpu.tube({
      picked,
      strokeLevelPts: strokeWorld.map(picked.worldToLevelVoxel),
      radiusWorld,
      weights: brush.weights,
      tube: {
        iso: tubeIso,
        clampValue: tubeClampValue(tubeIso),
        smoothVoxels: 0,
        connectivity: null,
        maxVertices: LIVE_MAX_TUBE_VERTICES,
      },
    });
    if (!result) return;
    const after = brushApi.getState();
    if (after.status !== "painting" || after.strokeLayerId !== strokeLayerId) return;
    after.setLiveTube({
      positions: soupToWorld(result.positions, picked.step, ctx.affine),
      triangles: result.triangles,
      truncated: result.truncated,
    });
  }, [brushApi, resolveContext]);

  const save = useCallback(async () => {
    const brush = brushApi.getState();
    const candidate = brush.candidate;
    if (!candidate || brush.status !== "preview") return;
    // A GROW candidate has no centerline — its whole payload is the tube.
    const hasPath = candidate.points.length >= 2;
    const tube = candidate.tube;
    if (!hasPath && !tube) return;
    brush.setSaving();
    let persistedAny = false;

    let after = brushApi.getState();
    if (hasPath) {
      const created = await createSceneAnnotation(
        AnnotationKind.Path,
        candidate.points.map((p) => [p[0], p[1], p[2]]),
      );
      after = brushApi.getState();
      if (after.candidate !== candidate) return; // a new stroke took over
      if (!created) {
        after.fail("Saving failed — the annotation was not created");
        return;
      }
      persistedAny = true;
    }

    // The tube rides along as a SURFACE annotation, into the same collection as
    // the centerline above — which is the point of it being an annotation at all:
    // the two halves of one stroke share a coordinate system and a registration,
    // so they cannot drift apart in space.
    //
    // A refusal still must not fail the whole save: whatever DID persist stays
    // persisted, and the tube falls back to a local preview that says why. The
    // ceiling is the one case that is not an error — a surface past it is a
    // legitimate extraction that is simply too big to send.
    let savedNote = "Saved";
    if (tube) {
      const prefix = hasPath ? "Centerline saved — tube" : "Tube";
      if (tube.triangles > MAX_TUBE_SAVE_TRIANGLES) {
        savedNote = `${prefix} too detailed to save (${tube.triangles} triangles), preview only`;
      } else {
        const { vectors, faces } = surfaceGeometry(tube.positions);
        const surface = await createSceneAnnotation(SURFACE_KIND, vectors, faces);
        after = brushApi.getState();
        if (after.candidate !== candidate) return;
        if (surface) {
          persistedAny = true;
        } else {
          savedNote = `${prefix} not saved — the server refused it`;
        }
      }
    }
    after.setCandidate(candidate, savedNote);
    // The persisted copy arrives with the annotation layer's next poll; keep
    // the local preview meanwhile so the shape never blinks off screen. When
    // NOTHING persisted, the preview is all there is — keep it indefinitely.
    if (persistedAny) {
      setTimeout(() => {
        const state = brushApi.getState();
        if (state.candidate === candidate && state.status === "preview") {
          state.clear();
        }
      }, SAVED_PREVIEW_CLEAR_MS);
    }
  }, [brushApi, createSceneAnnotation]);

  return { initRadiusForLayer, extract, previewLiveTube, save };
};

/**
 * The blob's grow loop: expand the search sphere, extract the (smoothed,
 * connectivity-masked) surface each round via the first engine that answers,
 * stop when the surface closes. Kept OUTSIDE the hook so its inputs are
 * explicit — it touches no store beyond the injected callbacks.
 */
async function runGrowLoop(opts: {
  ctx: ExtractionContext;
  seed: BrushSample;
  startRadius: number;
  weights: SkeletonWeights;
  tubeIso: number;
  smoothVoxels: number;
  gapVoxels: number;
  tau: number;
  stale: () => boolean;
  publishLive: (tube: TubeSurface) => void;
}): Promise<{ tube: TubeSurface; level: number; closed: boolean } | null> {
  const { ctx, seed, weights, tubeIso, stale } = opts;
  const seedWorld = seed.world;
  let radius = opts.startRadius;
  let grown: { tube: TubeSurface; level: number } | null = null;

  for (let step = 0; step < MAX_GROW_STEPS; step += 1) {
    if (stale()) return null;

    let stepTube: LevelTube | null = null;
    let stepPick: PickedCorridor | null = null;
    for (const engine of ctx.engines) {
      const picked = ctx.plan({
        strokeWorld: [seedWorld],
        radiusWorld: radius,
        maxVoxels: engine.maxCorridorVoxels,
      });
      if (!picked) continue;
      // Gap N bridges dark gaps up to ~N voxels: crossing a one-voxel gap
      // costs about one voxel of world length in the connectivity metric
      // (two half-priced boundary edges), and the +0.75 tolerates a seed
      // that probed a hair off the bright core.
      const gapLimitWorld = (opts.gapVoxels + 0.75) * Math.max(...picked.spacing);
      stepTube = await engine.tube({
        picked,
        strokeLevelPts: [picked.worldToLevelVoxel(seedWorld)],
        radiusWorld: radius,
        weights,
        tube: {
          iso: tubeIso,
          clampValue: tubeClampValue(tubeIso),
          smoothVoxels: opts.smoothVoxels,
          connectivity: {
            tau: opts.tau,
            gapLimitWorld,
            seed: boxRelative(seed.voxel, picked.box, picked.step),
          },
        },
      });
      if (stale()) return null;
      if (stepTube) {
        stepPick = picked;
        break;
      }
    }
    if (!stepTube || !stepPick) break; // every engine declined: keep the last

    const worldTube: TubeSurface = {
      positions: soupToWorld(stepTube.positions, stepPick.step, ctx.affine),
      triangles: stepTube.triangles,
      truncated: stepTube.truncated,
    };
    grown = { tube: worldTube, level: stepPick.level };
    const margin = 2 * Math.max(...stepPick.spacing);
    if (
      worldTube.triangles > 0 &&
      !touchesBoundary(worldTube.positions, seedWorld, radius, margin)
    ) {
      return { ...grown, closed: true };
    }
    if (worldTube.truncated) break; // growing further only truncates more
    opts.publishLive(worldTube); // the expansion animation
    radius *= GROW_FACTOR;
  }

  return grown ? { ...grown, closed: false } : null;
}
