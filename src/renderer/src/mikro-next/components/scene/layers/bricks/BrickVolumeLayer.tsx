import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import { ProjectionMode } from "@/mikro-next/api/graphql";
import {
  BRICK_TRAVERSAL_GLSL,
  makeBrickTraversalUniforms,
} from "../../glsl/brickTraversal";
import { GLSL_RAND } from "../../glsl/common";
import { marchResidentBricks } from "../../core/octree/brickSampling";
import { intersectLocalVolumeBox } from "../../core/probeMath";
import { buildAffineMatrix } from "../../core/worldTransform";
import { useModeStore } from "../../store/modeStore";
import { useSceneStore } from "../../store/sceneStore";
import { useSelectionStore } from "../../store/selectionStore";
import { useViewerStore, useViewerStoreApi } from "../../store/viewerStore";
import { useViewStore } from "../../store/viewStore";
import { CHANNEL_UNIFORMS_GLSL, buildChannelUniformData } from "./channelUniforms";

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

const MAX_RAY_STEPS = 256;

export const BrickVolumeLayer = ({ layerId }: { layerId: string }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const skipSelectionClickRef = useRef(false);
  const invalidate = useThree((state) => state.invalidate);
  const viewerStoreApi = useViewerStoreApi();

  const register = useViewerStore((s) => s.register);
  const unregister = useViewerStore((s) => s.unregister);
  const lodBias = useViewerStore((s) => s.lodBias);
  const isDebug = useViewerStore((s) => s.debug);
  const plan = useViewerStore((s) => s.nodePlans[layerId]);
  useViewerStore((s) => s.residencyVersion); // pool appears/rebuilds → re-render
  const brickSystem = useViewerStore((s) => s.brickSystem);

  const cameraPose = useViewStore((s) => s.cameraPose);
  const viewportSize = useViewStore((s) => s.viewportSize);

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
    () => buildChannelUniformData(layer, Math.max(0, (pool?.spec.channelCount ?? 1) - 1)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layer?.channels, layer?.blend, layer?.colormap, layer?.color, pool?.spec.channelCount],
  );

  useEffect(() => {
    const atlas = channelData.atlas;
    return () => atlas.dispose();
  }, [channelData]);

  /** Perspective LOD footprint scale (0 disables the per-sample path). */
  const pxPerVoxelAtUnitDistance =
    cameraPose?.isPerspective && cameraPose.fovY > 0
      ? viewportSize.height / (2 * Math.tan(cameraPose.fovY / 2))
      : 0;

  // Step sizing from the plan's finest requested level.
  const marchParams = useMemo(() => {
    if (!pool || !plan) return { minDelta: 1, steps: 128 };
    const level = pool.geometry.levels[Math.min(plan.targetLevel, pool.geometry.levels.length - 1)];
    const diag = Math.sqrt(
      (level.spatialShape[0] * level.scale[0]) ** 2 +
        (level.spatialShape[1] * level.scale[1]) ** 2 +
        (level.spatialShape[2] * level.scale[2]) ** 2,
    );
    // Sample at ~1 voxel of the finest requested level; the step cap bounds
    // fragment cost on large volumes (coarser sampling far out is what the
    // per-sample LOD is for).
    const minDelta = Math.max(level.scale[0], diag / MAX_RAY_STEPS);
    return { minDelta, steps: MAX_RAY_STEPS };
  }, [pool, plan]);

  // Dynamic uniform pushes (no material rebuild).
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
    u.uLodBias.value = lodBias;
    u.uPxPerVoxelAtUnitDist.value = pxPerVoxelAtUnitDistance;
    u.uMinDelta.value = marchParams.minDelta;
    u.projectionMode.value = projectionModeToInt(layer?.projection);
    invalidate();
  }, [channelData, plan, lodBias, pxPerVoxelAtUnitDistance, marchParams, layer?.projection, invalidate]);

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
      uLodBias: { value: lodBias },
      uPxPerVoxelAtUnitDist: { value: pxPerVoxelAtUnitDistance },
      uMinDelta: { value: marchParams.minDelta },
      uBaseShape: {
        value: new THREE.Vector3(
          pool.geometry.levels[0].spatialShape[0],
          pool.geometry.levels[0].spatialShape[1],
          pool.geometry.levels[0].spatialShape[2],
        ),
      },
      projectionMode: { value: projectionModeToInt(layer?.projection) },
      isoThreshold: { value: 0.5 },
      uPickingPass: { value: false },
    };
    // Recreated only when the pool is rebuilt (mesh remounts on that key).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, pool?.structureSignature]);

  // --- Probing: CPU march over the resident bricks (shader lockstep) -------
  const probeCoordinateFromRay = (ray: THREE.Ray): [number, number, number] | null => {
    const mesh = meshRef.current;
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
      climMin: layer?.climMin ?? 0,
      climMax: layer?.climMax ?? 1,
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
  if (!plan || plan.mode !== "3D" || !pool || !initialUniforms) return null;

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
        <shaderMaterial
          ref={materialRef}
          glslVersion={THREE.GLSL3}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={true}
          uniforms={initialUniforms}
          vertexShader={`
            out vec3 vOrigin;
            out vec3 vDirection;

            void main() {
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vOrigin = vec3(inverse(modelMatrix) * vec4(cameraPosition, 1.0));
              vDirection = position - vOrigin;
              gl_Position = projectionMatrix * viewMatrix * worldPosition;
            }
          `}
          fragmentShader={`
            precision highp float;
            precision highp sampler3D;
            precision highp usampler3D;

            in vec3 vOrigin;
            in vec3 vDirection;

            ${BRICK_TRAVERSAL_GLSL}
            ${CHANNEL_UNIFORMS_GLSL}
            ${GLSL_RAND}

            uniform int uDesiredLevel;      // ortho / fallback LOD
            uniform float uLodBias;
            uniform float uPxPerVoxelAtUnitDist; // 0 → orthographic footprint
            uniform float uMinDelta;        // base voxels per step at target LOD
            uniform vec3 uBaseShape;
            uniform int projectionMode;     // 0 MIP, 1 ATTENUATED_MIP, 2 VOLUME, 3 ISO
            uniform float isoThreshold;
            uniform bool uPickingPass;

            out vec4 FragColor;

            #define MAX_STEPS ${MAX_RAY_STEPS}

            // Unit-box local ([-0.5,0.5], y up) → base voxel (y down).
            vec3 toBaseVoxel(vec3 p) {
              return vec3(p.x + 0.5, 0.5 - p.y, p.z + 0.5) * uBaseShape;
            }
            vec3 toLocal(vec3 baseVoxel) {
              vec3 n = baseVoxel / uBaseShape;
              return vec3(n.x - 0.5, 0.5 - n.y, n.z - 0.5);
            }

            int desiredLevelAt(vec3 baseVoxel, vec3 cameraBase) {
              if (uPxPerVoxelAtUnitDist <= 0.0) return uDesiredLevel;
              float dist = max(distance(baseVoxel, cameraBase), 1.0);
              float pxPerBaseVoxel = uPxPerVoxelAtUnitDist / dist;
              for (int lvl = 0; lvl < MAX_BRICK_LEVELS; lvl++) {
                if (lvl >= uNumLevels - 1) break;
                if (pxPerBaseVoxel * uLevelScale[lvl].x * uLodBias >= 1.0) return max(lvl, uDesiredLevel);
              }
              return uNumLevels - 1;
            }

            // Exit distance (along the ray, from pB) of the level's brick cell.
            float brickExitRel(vec3 pB, vec3 invD, int lvl) {
              vec3 cell = vec3(uBrickPayload) * uLevelScale[lvl];
              vec3 lo = floor(pB / cell) * cell;
              vec3 t1 = (lo - pB) * invD;
              vec3 t2 = (lo + cell - pB) * invD;
              vec3 tf = max(t1, t2);
              return max(min(tf.x, min(tf.y, tf.z)), 0.0);
            }

            void main() {
              vec3 originB = toBaseVoxel(vOrigin);
              vec3 exitLocal = vOrigin + normalize(vDirection);
              vec3 dirB = normalize(toBaseVoxel(exitLocal) - originB);
              vec3 safeDir = sign(dirB) * max(abs(dirB), vec3(1e-6));
              vec3 invD = 1.0 / safeDir;

              // Ray ∩ [0, baseShape] slab test.
              vec3 t0 = (vec3(0.0) - originB) * invD;
              vec3 t1v = (uBaseShape - originB) * invD;
              vec3 tminv = min(t0, t1v);
              vec3 tmaxv = max(t0, t1v);
              vec2 bounds = vec2(
                max(max(tminv.x, tminv.y), tminv.z),
                min(min(tmaxv.x, tmaxv.y), tmaxv.z)
              );
              if (bounds.x > bounds.y) discard;
              bounds.x = max(bounds.x, 0.0);

              float rayLen = max(bounds.y - bounds.x, 0.00001);
              float delta = max(rayLen / float(MAX_STEPS), uMinDelta);

              float t = bounds.x + delta * rand(gl_FragCoord.xy);

              float bestNorm = 0.0;          // MIP accumulator (composited)
              vec3 bestColor = vec3(0.0);
              float attenuatedMax = 0.0;     // ATTENUATED_MIP
              vec3 attenuatedColor = vec3(0.0);
              vec3 volColor = vec3(0.0);     // VOLUME front-to-back
              float volAlpha = 0.0;
              bool isoHit = false;           // ISOSURFACE
              vec3 isoColor = vec3(0.0);
              bool hit = false;
              vec3 hitPosition = vec3(0.0);

              for (int i = 0; i < MAX_STEPS; i++) {
                if (t > bounds.y) break;
                vec3 pB = originB + t * dirB;
                int lvl = desiredLevelAt(pB, originB);

                // Per-sample channel composite (ChunkPlane semantics).
                vec3 sampleColor = (blendMode == 1) ? vec3(1.0) : vec3(0.0);
                float sampleNorm = 0.0;
                int bestStatus = 0;
                bool anyResident = false;

                for (int c = 0; c < MAX_CHANNELS; c++) {
                  if (c >= numChannels) break;
                  if (chVisible[c] < 0.5) continue;

                  float rawValue;
                  int status = sampleBrickEx(pB, lvl, int(chChannel[c]), rawValue);
                  bestStatus = max(bestStatus, status);
                  if (status == 0) continue;
                  if (status == 1) anyResident = true;

                  float normalized = channelNormalize(c, rawValue);
                  vec3 color = texture(colormapAtlas, vec2(normalized, chRow[c])).rgb;
                  float weight = chOpacity[c] * normalized;
                  sampleNorm = max(sampleNorm, normalized);

                  if (blendMode == 1) {
                    sampleColor *= mix(vec3(1.0), color, weight);
                  } else if (blendMode == 2) {
                    sampleColor = sampleColor * (1.0 - weight) + color * weight;
                  } else {
                    sampleColor += color * weight;
                  }
                }

                // Empty-space skipping: nothing resident anywhere, or a
                // known-uniform brick contributing nothing — jump to the
                // desired-level brick's exit instead of stepping through it.
                if (bestStatus == 0 || (!anyResident && sampleNorm <= 0.001)) {
                  t += max(delta, brickExitRel(pB, invD, lvl) + 0.01);
                  continue;
                }

                if (uPickingPass) {
                  if (sampleNorm > 0.01) {
                    hit = true;
                    hitPosition = clamp(toLocal(pB), vec3(-0.5), vec3(0.5));
                    break;
                  }
                } else if (projectionMode == 1) {
                  float depthFrac = (t - bounds.x) / rayLen;
                  float a = sampleNorm * exp(-1.5 * depthFrac);
                  if (a > attenuatedMax) {
                    attenuatedMax = a;
                    attenuatedColor = sampleColor;
                  }
                } else if (projectionMode == 2) {
                  float a = sampleNorm;
                  volColor += (1.0 - volAlpha) * a * sampleColor;
                  volAlpha += (1.0 - volAlpha) * a;
                  if (volAlpha >= 0.98) break;
                } else if (projectionMode == 3) {
                  if (sampleNorm >= isoThreshold) {
                    isoHit = true;
                    isoColor = sampleColor;
                    break;
                  }
                } else {
                  if (sampleNorm > bestNorm) {
                    bestNorm = sampleNorm;
                    bestColor = sampleColor;
                  }
                }

                t += delta;
              }

              if (uPickingPass) {
                if (!hit) discard;
                FragColor = vec4(hitPosition, 1.0);
                return;
              }

              if (projectionMode == 2) {
                if (volAlpha < 0.01) discard;
                FragColor = vec4(volColor, 1.0);
                return;
              }

              if (projectionMode == 3) {
                if (!isoHit) discard;
                FragColor = vec4(isoColor, 1.0);
                return;
              }

              // MIP / ATTENUATED_MIP: premultiplied additive output.
              float outNorm = (projectionMode == 1) ? attenuatedMax : bestNorm;
              vec3 outColor = (projectionMode == 1) ? attenuatedColor : bestColor;
              if (outNorm < 0.01) discard;
              FragColor = vec4(outColor, 1.0);
            }
          `}
        />
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
