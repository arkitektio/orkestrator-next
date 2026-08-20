import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { createPlaneNodeMaterial, updateChannelNodes } from "../gpu/brickNodeMaterials";
import { buildChannelUniformData } from "../gpu/channelUniforms";
import { buildAffineMatrix } from "../../../platform/coords/worldTransform";
import { useViewerStore } from "../../../platform/stores/viewerStore";
import { perfMonitor } from "../../../platform/perf/perfMonitor";
import { getBackendTexture, type SceneRenderer } from "../../../platform/gpu/sceneRenderer";
import { slabBaseZOf, useBrickLayer, useBrickPlaneProbe } from "./useBrickPlaneProbe";
import {
  useBrickMaterialBundle,
  usePlaneTraversalUniforms,
} from "./useBrickMaterialBundle";

/**
 * Brick-pool replacement for `PlaneLayer` + per-chunk `ChunkPlane` meshes:
 * ONE full-layer quad whose fragment shader samples the layer's brick atlas
 * through the page table (`sampleBrick`), falling back to coarser resident
 * bricks per pixel — which is what retires the whole cover/backdrop
 * machinery. The multi-channel compositor (colormap atlas, clim/gamma/
 * opacity/invert, blend modes) is lifted from ChunkPlane verbatim.
 *
 * The probe — the group registration, the pointer gating and the voxel
 * resolution — lives in `useBrickPlaneProbe`, because it is the half a LABEL
 * plane needs unchanged: mapping a hit to a base voxel and reading the resident
 * value is the same question whether that value is an intensity or an object id.
 */

export const BrickPlaneLayer = ({ layerId }: { layerId: string }) => {
  perfMonitor.countRender("BrickPlaneLayer"); // no-op unless a perf recording is armed

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

  const layer = useBrickLayer(layerId);

  const affineMatrix = useMemo(
    () => (layer ? buildAffineMatrix(layer) : new THREE.Matrix4().identity()),
    [layer],
  );

  const pool = brickSystem?.getLayerPool(layerId) ?? null;

  // Owns the group ref, the viewer registration and the pointer handlers —
  // shared with the label plane, which probes the same way over the same pool.
  const { groupRef, handlers } = useBrickPlaneProbe({ layerId, layer, pool });

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

  const slabBaseZ = slabBaseZOf(planSlabZ, pool);

  // TSL node material. Recreated only when
  // the pool is rebuilt (mesh remounts on that key); everything dynamic flows
  // through the uniform NODES below.
  const bundle = useBrickMaterialBundle(
    pool,
    (p) => createPlaneNodeMaterial(p, p, channelData),
    (b) => {
      // Whatever textures are bound at teardown (adoption keeps them long-lived).
      b.nodes.colormapAtlas.value?.dispose();
      b.nodes.sourceParams.value?.dispose();
      b.nodes.cursorParams.value?.dispose();
    },
  );


  // Push dynamic values straight to the uniform nodes (no material rebuild).
  useEffect(() => {
    if (!bundle || planTargetLevel === undefined) return;
    updateChannelNodes(bundle.nodes, channelData);
    bundle.nodes.minValue.value = pool?.minValue ?? 0;
    bundle.nodes.maxValue.value = pool?.maxValue ?? 1;
    // EMPTY page entries are re-encoded against the pool range whenever it
    // moves (auto-contrast float pools) — the decode uniforms must follow or
    // uniform-fill bricks render at increasingly wrong intensities. The 3D
    // path does the same in BrickVolumeLayer's decode-uniform effect; this
    // effect re-runs on range moves via the channelData memo + the
    // poolsVersion subscription above.
    bundle.nodes.uEmptyDecodeMin.value = pool?.minValue ?? 0;
    bundle.nodes.uEmptyDecodeRange.value = (pool?.maxValue ?? 1) - (pool?.minValue ?? 0);

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

  // The traversal contract, shared with the other plane material.
  usePlaneTraversalUniforms(bundle?.nodes, {
    desiredLevel: planTargetLevel,
    slabBaseZ,
  });

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
      // The probe handlers come from `useBrickPlaneProbe` — spread rather than
      // written out, because `undefined` vs a function is the raycast gate (P20)
      // and the hook is what decides it.
      {...handlers}
    >
      {/* Corner-anchored: the unit quad is offset by half its size so group-
          local spans [0..shape] and voxel v renders at exactly affine(v) —
          COORDINATE_SYSTEMS.md "Coordinate conventions". */}
      <mesh
        key={pool.structureSignature}
        scale={[totalX, totalY, 1]}
        position={[totalX / 2, totalY / 2, 0]}
        renderOrder={1}
      >
        <planeGeometry args={[1, 1]} />
        {/* TSL node material — see brickNodeMaterials.ts (WGSL + GLSL). */}
        <primitive object={bundle.material} attach="material" />
      </mesh>
    </group>
  );
};
