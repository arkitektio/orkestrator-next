import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  BRICK_TRAVERSAL_GLSL,
  makeBrickTraversalUniforms,
} from "../../glsl/brickTraversal";
import { CHANNEL_UNIFORMS_GLSL, buildChannelUniformData } from "./channelUniforms";
import { buildAffineMatrix } from "../../core/worldTransform";
import {
  buildSliceMap,
  resolveSpatialSelection,
  resolveVoxelIndex,
  type AxisSelection,
} from "../../core/selection";
import { useModeStore } from "../../store/modeStore";
import { useSceneStore } from "../../store/sceneStore";
import { useViewerStore, useViewerStoreApi } from "../../store/viewerStore";

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
  const groupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const register = useViewerStore((s) => s.register);
  const unregister = useViewerStore((s) => s.unregister);
  const currentZ = useViewerStore((s) => s.currentZ);
  const plan = useViewerStore((s) => s.nodePlans[layerId]);
  // Re-render when residency changes so the pool handle appears/rebuilds.
  useViewerStore((s) => s.residencyVersion);
  const brickSystem = useViewerStore((s) => s.brickSystem);
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
    () => buildChannelUniformData(layer, Math.max(0, (pool?.spec.channelCount ?? 1) - 1)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layer?.channels, layer?.blend, layer?.colormap, layer?.color, pool?.spec.channelCount],
  );

  useEffect(() => {
    const atlas = channelData.atlas;
    return () => atlas.dispose();
  }, [channelData]);

  /** Continuous base-voxel z of the displayed slab's center. */
  const slabBaseZ = plan?.slabZ !== null && plan?.slabZ !== undefined ? plan.slabZ + 0.5 : 0.5;

  // Push dynamic values straight to the GPU without re-creating the material.
  useEffect(() => {
    const u = materialRef.current?.uniforms;
    if (!u || !plan) return;
    u.colormapAtlas.value = channelData.atlas;
    u.numChannels.value = channelData.numChannels;
    u.blendMode.value = channelData.blendMode;
    u.chChannel.value = channelData.channelIndex;
    u.chClimMin.value = channelData.climMin;
    u.chClimMax.value = channelData.climMax;
    u.chGamma.value = channelData.gamma;
    u.chOpacity.value = channelData.opacity;
    u.chVisible.value = channelData.visible;
    u.chInvert.value = channelData.invert;
    u.chRow.value = channelData.row;
    u.uDesiredLevel.value = plan.targetLevel;
    u.uSlabBaseZ.value = slabBaseZ;
  }, [channelData, plan, slabBaseZ]);

  const initialUniforms = useMemo(() => {
    if (!pool) return null;
    return {
      ...makeBrickTraversalUniforms(pool, pool),
      colormapAtlas: { value: channelData.atlas },
      minValue: { value: pool.minValue },
      maxValue: { value: pool.maxValue },
      numChannels: { value: channelData.numChannels },
      blendMode: { value: channelData.blendMode },
      chChannel: { value: channelData.channelIndex },
      chClimMin: { value: channelData.climMin },
      chClimMax: { value: channelData.climMax },
      chGamma: { value: channelData.gamma },
      chOpacity: { value: channelData.opacity },
      chVisible: { value: channelData.visible },
      chInvert: { value: channelData.invert },
      chRow: { value: channelData.row },
      uDesiredLevel: { value: plan?.targetLevel ?? 0 },
      uSlabBaseZ: { value: slabBaseZ },
      uBaseShape: {
        value: new THREE.Vector3(
          pool.geometry.levels[0].spatialShape[0],
          pool.geometry.levels[0].spatialShape[1],
          pool.geometry.levels[0].spatialShape[2],
        ),
      },
    };
    // Recreated only when the pool is rebuilt (mesh remounts on that key).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, pool?.structureSignature]);

  // --- Probing (PlaneLayer parity, targetLod → plan.targetLevel) ------------
  // Reads shapes/scales from the pool's (deduplicated) level geometry — the
  // raw dataArrays list may contain duplicate resolutions, so its indices do
  // not align with plan levels.
  const resolveProbeGeometryContext = useCallback((): ProbeGeometryContext | null => {
    if (!layer || !pool) return null;

    const levelIndex = Math.min(
      plan?.targetLevel ?? pool.geometry.levels.length - 1,
      pool.geometry.levels.length - 1,
    );
    const level = pool.geometry.levels[levelIndex];
    const [shapeX, shapeY, shapeZ] = level.spatialShape;
    const [scaleX, scaleY, scaleZ] = level.scale;

    const sliceMap = buildSliceMap(layer.lens.slices);
    const xSelection = resolveSpatialSelection(sliceMap[layer.xDim ?? ""], shapeX);
    const ySelection = resolveSpatialSelection(sliceMap[layer.yDim ?? ""], shapeY);

    let zSelection = resolveSpatialSelection(
      layer.zDim ? sliceMap[layer.zDim] : undefined,
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
  }, [plan?.targetLevel, currentZ, layer, pool]);

  const updateProbe = useCallback(
    (localPoint: THREE.Vector3 | null, save: boolean) => {
      const currentProbe = viewerStoreApi.getState().probedCoordinate;

      if (!localPoint || !layer) {
        if (currentProbe?.layerId === layer?.id) {
          viewerStoreApi.getState().setProbedCoordinate(null);
        }
        return;
      }

      const probeContext = resolveProbeGeometryContext();
      if (!probeContext) return;

      const [volumeX, volumeY] = probeContext.volumePosition;
      const [width, height] = probeContext.volumeSize;
      const normalizedX = (localPoint.x - volumeX) / width;
      const normalizedY = (localPoint.y - volumeY) / height;

      if (normalizedX < 0 || normalizedX > 1 || normalizedY < 0 || normalizedY > 1) {
        if (currentProbe?.layerId === layer.id) {
          viewerStoreApi.getState().setProbedCoordinate(null);
        }
        return;
      }

      const clampedX = THREE.MathUtils.clamp(normalizedX, 0, 1);
      const clampedY = THREE.MathUtils.clamp(normalizedY, 0, 1);

      const nextProbe = {
        layerId: layer.id,
        localPos: [clampedX - 0.5, clampedY - 0.5, 0] as [number, number, number],
        voxelIndex: [
          resolveVoxelIndex(clampedX, probeContext.xSelection),
          resolveVoxelIndex(1 - clampedY, probeContext.ySelection),
          resolveVoxelIndex(0.5, probeContext.zSelection),
        ] as [number, number, number],
      };

      if (
        currentProbe?.layerId === nextProbe.layerId &&
        currentProbe.voxelIndex.every((v, i) => v === nextProbe.voxelIndex[i])
      ) {
        return;
      }

      viewerStoreApi.getState().setProbedCoordinate(nextProbe);
      if (save) viewerStoreApi.getState().addSavedProbe(nextProbe);
    },
    [layer, resolveProbeGeometryContext, viewerStoreApi],
  );

  if (layer?.visible === false) return null;
  if (!plan || plan.nodes.length === 0 || !pool || !initialUniforms) return null;

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
        updateProbe(group.worldToLocal(event.point.clone()), false);
        event.stopPropagation();
      }}
      onPointerOut={() => {
        if (interactionMode !== "AUTO_PROBE") return;
        updateProbe(null, false);
      }}
      onPointerDown={(event) => {
        if (interactionMode !== "PROBE" && interactionMode !== "AUTO_PROBE") return;
        const group = groupRef.current;
        if (!group) return;
        event.stopPropagation();
        updateProbe(group.worldToLocal(event.point.clone()), event.shiftKey);
      }}
    >
      <mesh key={pool.structureSignature} scale={[totalX, totalY, 1]} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={materialRef}
          glslVersion={THREE.GLSL3}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          uniforms={initialUniforms}
          vertexShader={`
            out vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            precision highp float;
            precision highp sampler3D;
            precision highp usampler3D;

            in vec2 vUv;

            ${BRICK_TRAVERSAL_GLSL}
            ${CHANNEL_UNIFORMS_GLSL}

            uniform int uDesiredLevel;
            uniform float uSlabBaseZ;
            uniform vec3 uBaseShape;

            out vec4 FragColor;

            void main() {
              // Quad uv → base voxel space (voxel y grows downward).
              vec3 baseVoxel = vec3(
                vUv.x * uBaseShape.x,
                (1.0 - vUv.y) * uBaseShape.y,
                uSlabBaseZ
              );

              vec3 accum = (blendMode == 1) ? vec3(1.0) : vec3(0.0);

              for (int i = 0; i < MAX_CHANNELS; i++) {
                if (i >= numChannels) break;
                if (chVisible[i] < 0.5) continue;

                float rawValue;
                if (!sampleBrick(baseVoxel, uDesiredLevel, int(chChannel[i]), rawValue)) {
                  continue; // nothing resident yet: transparent
                }

                float normalized = channelNormalize(i, rawValue);
                vec3 color = texture(colormapAtlas, vec2(normalized, chRow[i])).rgb;
                float weight = chOpacity[i] * normalized;

                if (blendMode == 1) {
                  accum *= mix(vec3(1.0), color, weight);
                } else if (blendMode == 2) {
                  accum = accum * (1.0 - weight) + color * weight;
                } else {
                  accum += color * weight;
                }
              }

              FragColor = vec4(accum, 1.0);
            }
          `}
        />
      </mesh>
    </group>
  );
};
