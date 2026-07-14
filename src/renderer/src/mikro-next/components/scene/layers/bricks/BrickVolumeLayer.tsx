import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import { ProjectionMode } from "@/mikro-next/api/graphql";
import { marchResidentBricks } from "../../core/octree/brickSampling";
import { perfMonitor } from "../../managers/perfMonitor";
import { qualityGovernor } from "../../core/qualityGovernor";
import { climToUnit } from "../../core/dataRange";
import { intersectLocalVolumeBox } from "../../core/probeMath";
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

  // TSL node material (WebGPU + WebGL2-fallback backends). Recreated only when
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
  const probeCoordinateFromRay = (ray: THREE.Ray): [number, number, number] | null => {
    const mesh = meshRef.current;
    // Event-time read of the full plan — no render subscription needed for it.
    const plan = viewerStoreApi.getState().nodePlans[layerId];
    if (!mesh || !pool || !plan || !brickSystem) return null;
    const inverseMatrix = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
    const localOrigin = ray.origin.clone().applyMatrix4(inverseMatrix);
    const localDirection = ray.direction.clone().transformDirection(inverseMatrix).normalize();
    const bounds = intersectLocalVolumeBox(localOrigin, localDirection);
    if (!bounds) return null;

    const baseLevel = pool.geometry.levels[0];
    return marchResidentBricks({
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
      threshold: viewerStoreApi.getState().probeThreshold,
      sample: (baseVoxel, desiredLevel, channel) =>
        brickSystem.sampleResident(layerId, baseVoxel, desiredLevel, channel),
    }) as [number, number, number] | null;
  };

  const updateProbe = (localPos: [number, number, number] | null, save: boolean) => {
    const state = viewerStoreApi.getState();
    if (!localPos || !pool) {
      if (state.probedCoordinate?.layerId === layerId) state.setProbedCoordinate(null);
      return;
    }

    const shape = pool.geometry.levels[0].spatialShape;
    const clampIndex = (norm: number, extent: number) =>
      Math.max(0, Math.min(extent - 1, Math.floor(norm * extent)));
    const nextProbe = {
      layerId,
      localPos,
      voxelIndex: [
        clampIndex(localPos[0] + 0.5, shape[0]),
        clampIndex(0.5 - localPos[1], shape[1]),
        clampIndex(localPos[2] + 0.5, shape[2]),
      ] as [number, number, number],
    };

    const cur = state.probedCoordinate;
    if (
      cur?.layerId === nextProbe.layerId &&
      cur.voxelIndex.every((v, i) => v === nextProbe.voxelIndex[i])
    ) {
      return;
    }
    state.setProbedCoordinate(nextProbe);
    if (save) state.addSavedProbe(nextProbe);
  };

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
        const localPos = probeCoordinateFromRay(e.ray);
        updateProbe(localPos, false);
        if (localPos) e.stopPropagation();
      }}
      onPointerOut={() => interactionMode === "AUTO_PROBE" && updateProbe(null, false)}
      onPointerDown={(e) => {
        if (!["PROBE", "AUTO_PROBE"].includes(interactionMode)) return;
        e.stopPropagation();
        skipSelectionClickRef.current = true;
        updateProbe(probeCoordinateFromRay(e.ray), e.shiftKey);
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
