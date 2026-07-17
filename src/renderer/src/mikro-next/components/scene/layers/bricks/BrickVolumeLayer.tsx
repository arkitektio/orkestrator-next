import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import { ProjectionMode } from "@/mikro-next/api/graphql";
import { marchResidentBricks } from "../../core/octree/brickSampling";
import { perfMonitor } from "../../managers/perfMonitor";
import { qualityGovernor } from "../../core/qualityGovernor";
import { climToUnit } from "../../core/dataRange";
import { intersectLocalVolumeBox } from "../../core/probeMath";
import { resolveProbeStrategy } from "../../core/probe/probeModes";
import { createRafCoalescer } from "../../core/probe/rafCoalesce";
import type { ProbeResult } from "../../core/probe/probeTypes";
import { buildAffineMatrix } from "../../core/worldTransform";
import { useModeStore } from "../../store/modeStore";
import { useSceneStore } from "../../store/sceneStore";
import { useSelectionStore } from "../../store/selectionStore";
import { useViewerStore, useViewerStoreApi } from "../../store/viewerStore";
import { useViewStore } from "../../store/viewStore";
import { createVolumeNodeMaterial, updateChannelNodes } from "./brickNodeMaterials";
import { buildChannelUniformData } from "./channelUniforms";

/**
 * Brick-pool replacement for the monolithic `VolumeLayer`/`VolumeTextureMesh`
 * path: a single unit-box raymarcher whose samples walk the page table
 * (`sampleBrickEx`), so the volume streams view-dependently — fine bricks
 * near the camera, coarser fallback everywhere else — with bounded GPU
 * memory by construction.
 *
 * Marching happens in BASE VOXEL space (not the unit box): per-level
 * coordinates, per-sample LOD-by-distance and brick-granular empty-space
 * skipping all become simple axis-aligned math there. Multi-channel
 * compositing (per-sample, ChunkPlane semantics) feeds the projection
 * accumulators lifted from VolumeTextureMesh (MIP / AttenuatedMIP / Volume /
 * Isosurface) plus the picking pass.
 */

const projectionModeToInt = (mode: ProjectionMode | undefined): number => {
  switch (mode) {
    case ProjectionMode.AttenuatedMip:
      return 1;
    case ProjectionMode.Volume:
      return 2;
    case ProjectionMode.Isosurface:
      return 3;
    default:
      return 0; // MIP
  }
};

const MAX_RAY_STEPS = 512;

export const BrickVolumeLayer = ({ layerId }: { layerId: string }) => {
  perfMonitor.countRender("BrickVolumeLayer"); // no-op unless a perf recording is armed
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const skipSelectionClickRef = useRef(false);
  const invalidate = useThree((state) => state.invalidate);
  const viewerStoreApi = useViewerStoreApi();

  const register = useViewerStore((s) => s.register);
  const unregister = useViewerStore((s) => s.unregister);
  const lodBias = useViewerStore((s) => s.lodBias);
  const isDebug = useViewerStore((s) => s.debug);
  // SCALAR plan subscriptions only (P9c/P17): the plan OBJECT gets a new
  // identity on every replan (≤5/s during a pan — its node list changes), but
  // this component consumes only targetLevel/mode. Subscribing to the scalars
  // means re-rendering only when those actually change (zoom-level crossings).
  // Anything needing the full plan (the probe closure) reads it via
  // viewerStoreApi.getState() at call time.
  const planTargetLevel = useViewerStore((s) => s.nodePlans[layerId]?.targetLevel);
  const planMode = useViewerStore((s) => s.nodePlans[layerId]?.mode);
  // Pool appears/rebuilds/disposes → re-render. NOT residencyVersion: that
  // bumps per upload batch while streaming and would re-render this component
  // continuously during a pan for nothing (texture updates are imperative).
  useViewerStore((s) => s.poolsVersion);
  const brickSystem = useViewerStore((s) => s.brickSystem);

  // Scalar selectors ONLY: cameraPose/viewportSize are new objects on every
  // camera write (~16/s during an orbit) and would re-render all volume
  // layers continuously. The footprint scale depends on fov + viewport
  // height alone (both constant while orbiting); the camera position reaches
  // the shader through vOrigin.
  const pxPerVoxelAtUnitDistance = useViewStore((s) =>
    s.cameraPose?.isPerspective && s.cameraPose.fovY > 0
      ? s.viewportSize.height / (2 * Math.tan(s.cameraPose.fovY / 2))
      : 0,
  );
  const cameraMoving = useViewStore((s) => s.cameraMoving);
  // Quality tier / streaming flips are rare (P17-clean); re-runs the uniform
  // push below so uStepScale tracks the governor's profile.
  const qualityVersion = useSyncExternalStore(
    qualityGovernor.subscribe,
    () => qualityGovernor.getVersion(),
  );

  const layer = useSceneStore((s) => s.layers.find((l) => l.id === layerId));
  const interactionMode = useModeStore((s) => s.interactionMode);
  const isSelected = useSelectionStore((s) => s.selectedLayerId === layerId);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);

  useEffect(() => {
    const refProxy = { kind: "layer" as const, id: layerId, ref: groupRef };
    register(refProxy);
    return () => unregister(refProxy);
  }, [layerId, register, unregister]);

  const affineMatrix = useMemo(
    () => (layer ? buildAffineMatrix(layer) : new THREE.Matrix4().identity()),
    [layer],
  );

  const pool = brickSystem?.getLayerPool(layerId) ?? null;

  const channelData = useMemo(
    () =>
      buildChannelUniformData(
        layer,
        Math.max(0, (pool?.geometry.channelSlabCount ?? 1) - 1),
        pool?.minValue ?? 0,
        pool?.maxValue ?? 1,
        pool?.geometry,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      layer?.channels,
      layer?.phasors,
      layer?.sources,
      layer?.blend,
      layer?.colormap,
      layer?.color,
      pool?.geometry,
      pool?.spec.channelCount,
      pool?.minValue,
      pool?.maxValue,
    ],
  );

  // NOTE: the colormap atlas is NOT disposed per channelData change — the
  // material stays bound to one long-lived texture whose contents
  // `updateChannelNodes` refreshes in place (disposing a still-bound texture
  // made WebGPU sample its default white texture → gray composites). The
  // bound texture is disposed with the bundle below.

  // Step sizing from the plan's finest requested level: half a voxel of that
  // level. The actual per-sample step adapts to the LOD sampled at that point
  // (see stepLen in the shader); the in-shader rayLen/MAX_STEPS floor
  // guarantees every ray reaches its exit within the loop bound.
  const marchParams = useMemo(() => {
    if (!pool || planTargetLevel === undefined) return { minDelta: 1, steps: 128 };
    const level = pool.geometry.levels[Math.min(planTargetLevel, pool.geometry.levels.length - 1)];
    return { minDelta: 0.5 * level.scale[0], steps: MAX_RAY_STEPS };
  }, [pool, planTargetLevel]);

  // TSL node material. Recreated only when
  // the pool is rebuilt (mesh remounts on that key); everything dynamic flows
  // through the uniform NODES below.
  const bundle = useMemo(() => {
    if (!pool) return null;
    const created = createVolumeNodeMaterial(pool, pool, channelData);
    created.nodes.uBaseShape.value.set(
      pool.geometry.levels[0].spatialShape[0],
      pool.geometry.levels[0].spatialShape[1],
      pool.geometry.levels[0].spatialShape[2],
    );
    return created;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, pool?.structureSignature]);

  useEffect(() => {
    const material = bundle?.material;
    return () => {
      material?.dispose();
      // Whatever textures are bound at teardown (adoption keeps them long-lived).
      bundle?.nodes.colormapAtlas.value?.dispose();
      bundle?.nodes.sourceParams.value?.dispose();
      bundle?.nodes.cursorParams.value?.dispose();
    };
  }, [bundle]);

  // Dynamic uniform-node pushes (no material rebuild).
  useEffect(() => {
    if (!bundle || planTargetLevel === undefined) return;
    const n = bundle.nodes;
    updateChannelNodes(n, channelData);
    n.minValue.value = pool?.minValue ?? 0;
    n.maxValue.value = pool?.maxValue ?? 1;
    n.uDesiredLevel.value = planTargetLevel;
    n.uLodBias.value = lodBias;
    n.uPxPerVoxelAtUnitDist.value = pxPerVoxelAtUnitDistance;
    n.uMinDelta.value = marchParams.minDelta;
    // Coarser ray steps while ACTIVE (camera moving OR bricks streaming —
    // streaming frames recur for seconds after a gesture and were the residual
    // jank on slow GPUs, P19); the tier profile decides how coarse. Settle
    // restores the tier's full quality.
    const profile = qualityGovernor.getProfile();
    n.uStepScale.value =
      cameraMoving || qualityGovernor.isStreaming()
        ? profile.activeStepScale
        : profile.settledStepScale;
    n.projectionMode.value = projectionModeToInt(layer?.projection);
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle, channelData, planTargetLevel, lodBias, pxPerVoxelAtUnitDistance, cameraMoving, qualityVersion, marchParams, layer?.projection, invalidate]);

  // --- Probing: CPU march over the resident bricks (shader lockstep) -------
  const probeFromRay = (ray: THREE.Ray): ProbeResult | null => {
    const mesh = meshRef.current;
    // Event-time read of the full plan — no render subscription needed for it.
    const state = viewerStoreApi.getState();
    const plan = state.nodePlans[layerId];
    if (!mesh || !pool || !plan || !brickSystem) return null;
    const inverseMatrix = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
    const localOrigin = ray.origin.clone().applyMatrix4(inverseMatrix);
    const localDirection = ray.direction.clone().transformDirection(inverseMatrix).normalize();
    const bounds = intersectLocalVolumeBox(localOrigin, localDirection);
    if (!bounds) return null;

    // "Auto" picks the strategy matching what the projection shows on screen.
    const { strategy, threshold } = resolveProbeStrategy(
      state.probeMode,
      layer?.projection,
      state.probeThreshold,
    );
    const baseLevel = pool.geometry.levels[0];
    const hit = marchResidentBricks({
      origin: [localOrigin.x, localOrigin.y, localOrigin.z],
      direction: [localDirection.x, localDirection.y, localDirection.z],
      bounds: [Math.max(bounds.start, 0), bounds.end],
      baseShape: baseLevel.spatialShape,
      desiredLevel: plan.targetLevel,
      channel: channelData.channelIndex[0] ?? 0,
      minValue: pool.minValue,
      maxValue: pool.maxValue,
      // layer.climMin/climMax are absolute base-native; marchResidentBricks works
      // in the shader's normalized [0,1] space.
      climMin: climToUnit(layer?.climMin, pool.minValue, pool.maxValue, 0),
      climMax: climToUnit(layer?.climMax, pool.minValue, pool.maxValue, 1),
      gamma: layer?.gamma ?? 1,
      threshold,
      strategy,
      sample: (baseVoxel, desiredLevel, channel) =>
        brickSystem.sampleResident(layerId, baseVoxel, desiredLevel, channel),
    });
    if (!hit) return null;

    const localPos = [hit.position[0], hit.position[1], hit.position[2]] as [
      number,
      number,
      number,
    ];
    const shape = baseLevel.spatialShape;
    const clampIndex = (norm: number, extent: number) =>
      Math.max(0, Math.min(extent - 1, Math.floor(norm * extent)));
    const voxelIndex: [number, number, number] = [
      clampIndex(localPos[0] + 0.5, shape[0]),
      clampIndex(0.5 - localPos[1], shape[1]),
      clampIndex(localPos[2] + 0.5, shape[2]),
    ];
    // One all-channels read at the hit voxel (per hit, not per march step).
    const resident = brickSystem.sampleResidentEx(layerId, voxelIndex, plan.targetLevel);
    const channelCount = Math.max(1, pool.geometry.channelSlabCount);
    const world = new THREE.Vector3(...localPos).applyMatrix4(mesh.matrixWorld);
    return {
      layerId,
      localPos,
      voxelIndex,
      worldPos: [world.x, world.y, world.z],
      strategy,
      values: resident
        ? resident.values.map((value, channel) => ({ channel, value }))
        : Array.from({ length: channelCount }, (_, channel) => ({ channel, value: null })),
      provenance: resident
        ? { source: "resident", level: resident.level }
        : { source: "pending", level: plan.targetLevel },
      dtype: baseLevel.dtype,
      sliceSignature: pool.sliceSignature,
    };
  };

  const updateProbe = (probe: ProbeResult | null, save: boolean) => {
    const state = viewerStoreApi.getState();
    if (!probe) {
      if (state.probedCoordinate?.layerId === layerId) state.setProbedCoordinate(null);
      return;
    }

    // AUTO_PROBE fires per frame; only voxel-crossings (or strategy flips)
    // reach the store. Value freshness is the ProbeValueTracker's job.
    const cur = state.probedCoordinate;
    if (
      !save &&
      cur?.layerId === probe.layerId &&
      cur.strategy === probe.strategy &&
      cur.voxelIndex.every((v, i) => v === probe.voxelIndex[i])
    ) {
      return;
    }
    state.setProbedCoordinate(probe);
    if (save) state.addSavedProbe(probe);
  };

  // Pointermove storms coalesce to ≤1 march per frame: the handler schedules
  // a thunk (built at event time, so it closes over fresh props and a cloned
  // ray — R3F mutates the event's ray in place) and only the newest runs.
  const probeCoalescer = useMemo(() => createRafCoalescer<() => void>((run) => run()), []);
  useEffect(() => () => probeCoalescer.cancel(), [probeCoalescer]);

  if (layer?.visible === false) return null;
  if (planMode !== "3D" || !pool || !bundle) return null;

  const base = pool.geometry.levels[0];
  const volumeSize: [number, number, number] = [
    base.spatialShape[0] * base.scale[0],
    base.spatialShape[1] * base.scale[1],
    base.spatialShape[2] * base.scale[2],
  ];

  return (
    <group
      ref={groupRef}
      matrix={affineMatrix}
      matrixAutoUpdate={false}
      onPointerMove={(e) => {
        if (interactionMode !== "AUTO_PROBE" || e.buttons !== 0) return;
        // The event already raycast this volume's box, so the front-most
        // volume claims the hover; the march itself is deferred to the frame.
        e.stopPropagation();
        const ray = e.ray.clone();
        probeCoalescer.schedule(() => updateProbe(probeFromRay(ray), false));
      }}
      onPointerOut={() => {
        if (interactionMode !== "AUTO_PROBE") return;
        probeCoalescer.cancel();
        updateProbe(null, false);
      }}
      onPointerDown={(e) => {
        if (!["PROBE", "AUTO_PROBE"].includes(interactionMode)) return;
        e.stopPropagation();
        skipSelectionClickRef.current = true;
        // Synchronous: click latency matters, click storms don't.
        updateProbe(probeFromRay(e.ray), e.shiftKey);
      }}
      onClick={(e) => {
        if (skipSelectionClickRef.current) {
          skipSelectionClickRef.current = false;
          return;
        }
        if (["PROBE", "AUTO_PROBE"].includes(interactionMode) || e.altKey) return;
        e.stopPropagation();
        setSelectedLayerId(isSelected ? null : layerId);
      }}
    >
      <mesh
        key={pool.structureSignature}
        ref={meshRef}
        scale={volumeSize}
        renderOrder={1}
      >
        <boxGeometry args={[1, 1, 1]} />
        {/* TSL node raymarcher — see brickNodeMaterials.ts (WGSL + GLSL). */}
        <primitive object={bundle.material} attach="material" />
      </mesh>

      {isDebug && (
        <mesh scale={volumeSize} renderOrder={2}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#155e75" opacity={0.06} transparent={true} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
};
