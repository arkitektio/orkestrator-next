import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { createPlaneNodeMaterial, updateChannelNodes } from "../../render/bricks/brickNodeMaterials";
import { buildChannelUniformData } from "../../render/bricks/channelUniforms";
import { buildAffineMatrix } from "../../core/worldTransform";
import {
  buildSliceMap,
  resolveSpatialSelection,
  resolveVoxelIndex,
  type AxisSelection,
} from "../../core/selection";
import { createRafCoalescer } from "../../core/probe/rafCoalesce";
import type { ProbeResult } from "../../core/probe/probeTypes";
import { useModeStore } from "../../store/modeStore";
import { useSceneStore } from "../../store/sceneStore";
import { useViewerStore, useViewerStoreApi } from "../../store/viewerStore";
import { perfMonitor } from "../../managers/perfMonitor";
import { getBackendTexture, type SceneRenderer } from "../../render/gpu/sceneRenderer";

/**
 * Brick-pool replacement for `PlaneLayer` + per-chunk `ChunkPlane` meshes:
 * ONE full-layer quad whose fragment shader samples the layer's brick atlas
 * through the page table (`sampleBrick`), falling back to coarser resident
 * bricks per pixel — which is what retires the whole cover/backdrop
 * machinery. The multi-channel compositor (colormap atlas, clim/gamma/
 * opacity/invert, blend modes) is lifted from ChunkPlane verbatim.
 */

type ProbeGeometryContext = {
  xSelection: AxisSelection;
  ySelection: AxisSelection;
  zSelection: AxisSelection;
  volumePosition: [number, number, number];
  volumeSize: [number, number, number];
};

export const BrickPlaneLayer = ({ layerId }: { layerId: string }) => {
  perfMonitor.countRender("BrickPlaneLayer"); // no-op unless a perf recording is armed
  const groupRef = useRef<THREE.Group>(null!);

  const register = useViewerStore((s) => s.register);
  const unregister = useViewerStore((s) => s.unregister);
  const currentZ = useViewerStore((s) => s.currentZ);
  // SCALAR plan subscriptions only (P9c/P17, see BrickVolumeLayer): the plan
  // object churns identity per replan; this component consumes only these.
  const planTargetLevel = useViewerStore((s) => s.nodePlans[layerId]?.targetLevel);
  const planSlabZ = useViewerStore((s) => s.nodePlans[layerId]?.slabZ);
  const planHasNodes = useViewerStore(
    (s) => (s.nodePlans[layerId]?.nodes.length ?? 0) > 0,
  );
  // Re-render when the pool handle appears/rebuilds/disposes — pool lifecycle
  // only (see BrickVolumeLayer), never the streaming residency counter.
  useViewerStore((s) => s.poolsVersion);
  const brickSystem = useViewerStore((s) => s.brickSystem);
  const isDebug = useViewerStore((s) => s.debug);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const viewerStoreApi = useViewerStoreApi();

  const layer = useSceneStore((s) => s.layers.find((l) => l.id === layerId));
  const interactionMode = useModeStore((s) => s.interactionMode);

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

  // --- Channel derivation (ChunkPlane parity) -------------------------------
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

  /** INTEGER base-voxel z of the displayed slab. The shader's slab mode
   * applies the planner's floor chain per level itself (nodePlanning
   * `slabLevelZ` ↔ makeSampleBrickEx slabZ) — adding 0.5 here made the two
   * disagree at non-integer z scales (fetched z=1, sampled z=2). planSlabZ is
   * in level-0 slices; scale to base voxels like `slabLevelZ` does. */
  const slabBaseZ = (planSlabZ ?? 0) * (pool?.geometry.levels[0]?.scale[2] ?? 1);

  // TSL node material. Recreated only when
  // the pool is rebuilt (mesh remounts on that key); everything dynamic flows
  // through the uniform NODES below.
  const bundle = useMemo(() => {
    if (!pool) return null;
    const created = createPlaneNodeMaterial(pool, pool, channelData);
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

  // Push dynamic values straight to the uniform nodes (no material rebuild).
  useEffect(() => {
    if (!bundle || planTargetLevel === undefined) return;
    updateChannelNodes(bundle.nodes, channelData);
    bundle.nodes.minValue.value = pool?.minValue ?? 0;
    bundle.nodes.maxValue.value = pool?.maxValue ?? 1;
    bundle.nodes.uDesiredLevel.value = planTargetLevel;
    bundle.nodes.uSlabBaseZ.value = slabBaseZ;

    // Channel-compositor diagnostic (debug overlay on): the exact uniform +
    // colormap-row state the shader consumes, one line per update. Pair with
    // the debug report's channelSlabProbe (atlas slab contents) to separate
    // LUT bugs / repack bugs / shader-tap bugs when channels look wrong.
    if (isDebug) {
      const atlasData = channelData.atlas.image.data as Uint8Array;
      const rows = Math.max(1, channelData.numChannels);
      console.log(`[bricks] ${layerId} channel uniforms`, {
        numChannels: channelData.numChannels,
        channelIndex: channelData.channelIndex.slice(0, rows),
        visible: channelData.visible.slice(0, rows),
        row: channelData.row.slice(0, rows),
        climMin: channelData.climMin.slice(0, rows),
        climMax: channelData.climMax.slice(0, rows),
        // Center texel of each LUT row — the tint the shader multiplies by
        // the channel's normalized intensity.
        rowColors: Array.from({ length: rows }, (_, r) => {
          const idx = (r * 256 + 128) * 4;
          return [atlasData[idx], atlasData[idx + 1], atlasData[idx + 2]];
        }),
        // Backend GPU handles (of the BOUND textures): false = three is
        // sampling its default texture (silent-substitution family).
        colormapAtlasOnGpu: !!getBackendTexture(
          gl as unknown as SceneRenderer,
          bundle.nodes.colormapAtlas.value,
        ),
        brickAtlasOnGpu: pool
          ? !!getBackendTexture(gl as unknown as SceneRenderer, pool.atlas.texture)
          : null,
        slabDepth: pool?.spec.stored[2],
        channelCount: pool?.spec.channelCount,
        slabBaseZ,
        targetLevel: planTargetLevel,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle, channelData, planTargetLevel, slabBaseZ, isDebug]);

  // Debug: dump the GENERATED fragment shader (WGSL on WebGPU) once per
  // material — ground truth for how TSL compiled the channel loop /
  // uniform-array indexing (the CPU-side uniform state can be perfect while
  // the codegen collapses e.g. `element(i)` — this is how we catch it).
  useEffect(() => {
    if (!isDebug || !bundle) return;
    const group = groupRef.current;
    const mesh = group?.children.find((child) => (child as THREE.Mesh).isMesh);
    if (!mesh) return;
    const debugApi = (
      gl as unknown as {
        debug?: {
          getShaderAsync?: (
            scene: THREE.Scene,
            camera: THREE.Camera,
            object: THREE.Object3D,
          ) => Promise<{ fragmentShader: string | null }>;
        };
      }
    ).debug;
    if (!debugApi?.getShaderAsync) return;
    void debugApi
      .getShaderAsync(scene, camera, mesh)
      .then(({ fragmentShader }) => {
        console.log(`[bricks] ${layerId} fragment shader\n`, fragmentShader);
      })
      .catch((error) => {
        console.warn(`[bricks] ${layerId} shader dump failed`, error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDebug, bundle]);

  // --- Probing (PlaneLayer parity, targetLod → plan.targetLevel) ------------
  // Reads shapes/scales from the pool's (deduplicated) level geometry — the
  // raw dataArrays list may contain duplicate resolutions, so its indices do
  // not align with plan levels.
  const resolveProbeGeometryContext = useCallback((): ProbeGeometryContext | null => {
    if (!layer || !pool) return null;

    const levelIndex = Math.min(
      planTargetLevel ?? pool.geometry.levels.length - 1,
      pool.geometry.levels.length - 1,
    );
    const level = pool.geometry.levels[levelIndex];
    const [shapeX, shapeY, shapeZ] = level.spatialShape;
    const [scaleX, scaleY, scaleZ] = level.scale;

    const sliceMap = buildSliceMap(layer.lens.slices);
    const xSelection = resolveSpatialSelection(sliceMap[layer.xAxis ?? ""], shapeX);
    const ySelection = resolveSpatialSelection(sliceMap[layer.yAxis ?? ""], shapeY);

    let zSelection = resolveSpatialSelection(
      layer.zAxis ? sliceMap[layer.zAxis] : undefined,
      shapeZ,
    );
    if (currentZ !== undefined && Number.isFinite(currentZ)) {
      const inv = buildAffineMatrix(layer).clone().invert();
      const pt = new THREE.Vector3(0, 0, currentZ).applyMatrix4(inv);
      const zIndex = Math.max(0, Math.min(shapeZ - 1, Math.round(pt.z / scaleZ)));
      zSelection = { start: zIndex, step: 1, length: 1 };
    }

    const totalX = shapeX * scaleX;
    const totalY = shapeY * scaleY;
    const totalZ = shapeZ * scaleZ;

    const width = xSelection.length * xSelection.step * scaleX;
    const height = ySelection.length * ySelection.step * scaleY;
    const depth = zSelection.length * zSelection.step * scaleZ;
    if (width <= 0 || height <= 0 || depth <= 0) return null;

    return {
      xSelection,
      ySelection,
      zSelection,
      volumePosition: [
        xSelection.start * scaleX + width / 2 - totalX / 2,
        -(ySelection.start * scaleY + height / 2 - totalY / 2),
        zSelection.start * scaleZ + depth / 2 - totalZ / 2,
      ],
      volumeSize: [width, height, depth],
    };
  }, [planTargetLevel, currentZ, layer, pool]);

  const updateProbe = useCallback(
    (
      points: { local: THREE.Vector3; world: THREE.Vector3 } | null,
      save: boolean,
    ) => {
      const currentProbe = viewerStoreApi.getState().probedCoordinate;

      if (!points || !layer || !pool) {
        if (currentProbe?.layerId === layer?.id) {
          viewerStoreApi.getState().setProbedCoordinate(null);
        }
        return;
      }

      const probeContext = resolveProbeGeometryContext();
      if (!probeContext) return;

      // QUAD-PARITY mapping (createPlaneNodeMaterial): the rendered plane is
      // a CENTERED totalX×totalY quad showing the FULL base array,
      // `baseVoxel = (u·shapeX, (1−v)·shapeY)` — NOT a slice-anchored box.
      // The previous math normalized against `volumePosition` (the quad's
      // CENTER, not a corner), which rejected everything left of / below the
      // center — only the upper-right quadrant ever probed — and compressed
      // the voxel mapping 2× inside it.
      const base = pool.geometry.levels[0];
      const totalX = base.spatialShape[0] * base.scale[0];
      const totalY = base.spatialShape[1] * base.scale[1];
      const u = points.local.x / totalX + 0.5;
      const v = points.local.y / totalY + 0.5;

      if (u < 0 || u > 1 || v < 0 || v > 1) {
        if (currentProbe?.layerId === layer.id) {
          viewerStoreApi.getState().setProbedCoordinate(null);
        }
        return;
      }

      const clampedU = THREE.MathUtils.clamp(u, 0, 0.999999);
      const clampedV = THREE.MathUtils.clamp(v, 0, 0.999999);

      // Report BASE (level-0) voxels like the volume probe, so the readout
      // and downstream consumers address one coordinate system regardless of
      // the displayed LOD. The z slab still resolves through the slice /
      // currentZ selection at the displayed level.
      const levelIndex = Math.min(
        planTargetLevel ?? pool.geometry.levels.length - 1,
        pool.geometry.levels.length - 1,
      );
      const level = pool.geometry.levels[levelIndex];
      const baseShape = base.spatialShape;
      const baseZ = Math.round(
        resolveVoxelIndex(0.5, probeContext.zSelection) * level.scale[2],
      );
      const voxelIndex: [number, number, number] = [
        Math.min(baseShape[0] - 1, Math.floor(clampedU * baseShape[0])),
        Math.min(baseShape[1] - 1, Math.floor((1 - clampedV) * baseShape[1])),
        Math.max(0, Math.min(baseShape[2] - 1, baseZ)),
      ];

      const resident = brickSystem?.sampleResidentEx(layer.id, voxelIndex, levelIndex) ?? null;
      const channelCount = Math.max(1, pool.geometry.channelSlabCount);
      const nextProbe: ProbeResult = {
        layerId: layer.id,
        // Quad-centered normalized offset — the same ±0.5 frame the rendered
        // quad and the volume probe use (markers use `worldPos` anyway).
        localPos: [clampedU - 0.5, clampedV - 0.5, 0],
        voxelIndex,
        worldPos: [points.world.x, points.world.y, points.world.z],
        strategy: "plane",
        values: resident
          ? resident.values.map((value, channel) => ({ channel, value }))
          : Array.from({ length: channelCount }, (_, channel) => ({ channel, value: null })),
        provenance: resident
          ? { source: "resident", level: resident.level }
          : { source: "pending", level: levelIndex },
        dtype: pool.geometry.levels[0].dtype,
        sliceSignature: pool.sliceSignature,
      };

      if (
        !save &&
        currentProbe?.layerId === nextProbe.layerId &&
        currentProbe.voxelIndex.every((v, i) => v === nextProbe.voxelIndex[i])
      ) {
        return;
      }

      viewerStoreApi.getState().setProbedCoordinate(nextProbe);
      if (save) viewerStoreApi.getState().addSavedProbe(nextProbe);
    },
    [layer, pool, brickSystem, planTargetLevel, resolveProbeGeometryContext, viewerStoreApi],
  );

  // Pointermove storms coalesce to ≤1 probe per frame (see BrickVolumeLayer):
  // event-time thunks close over fresh props; only the newest runs per frame.
  const probeCoalescer = useMemo(() => createRafCoalescer<() => void>((run) => run()), []);
  useEffect(() => () => probeCoalescer.cancel(), [probeCoalescer]);

  if (layer?.visible === false) return null;
  if (!planHasNodes || !pool || !bundle) return null;

  const base = pool.geometry.levels[0];
  const totalX = base.spatialShape[0] * base.scale[0];
  const totalY = base.spatialShape[1] * base.scale[1];

  return (
    <group
      matrix={affineMatrix}
      matrixAutoUpdate={false}
      ref={groupRef}
      onPointerMove={(event) => {
        if (interactionMode !== "AUTO_PROBE" || event.buttons !== 0) return;
        const group = groupRef.current;
        if (!group) return;
        event.stopPropagation();
        const world = event.point.clone();
        const local = group.worldToLocal(world.clone());
        probeCoalescer.schedule(() => updateProbe({ local, world }, false));
      }}
      onPointerOut={() => {
        if (interactionMode !== "AUTO_PROBE") return;
        probeCoalescer.cancel();
        updateProbe(null, false);
      }}
      onPointerDown={(event) => {
        if (interactionMode !== "PROBE" && interactionMode !== "AUTO_PROBE") return;
        const group = groupRef.current;
        if (!group) return;
        event.stopPropagation();
        const world = event.point.clone();
        updateProbe({ local: group.worldToLocal(world.clone()), world }, event.shiftKey);
      }}
    >
      <mesh key={pool.structureSignature} scale={[totalX, totalY, 1]} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
        {/* TSL node material — see brickNodeMaterials.ts (WGSL + GLSL). */}
        <primitive object={bundle.material} attach="material" />
      </mesh>
    </group>
  );
};
