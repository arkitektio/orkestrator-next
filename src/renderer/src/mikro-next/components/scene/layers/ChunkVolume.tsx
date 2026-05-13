import { useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { open } from 'zarrita';
import { useSceneStore } from '../store/sceneStore'; // Added to fetch layer properties
import { useViewerStore } from '../store/viewerStore';
import type { ChunkData } from '../stores/types';

// --- Helper: Strict WebGL2 Memory Configuration ---
function getTextureConfig(rawData: Uint16Array) {
  return { data: rawData, type: THREE.UnsignedShortType, internalFormat: null, dataScale: 1.0 };
}

function computeChunkLocalBounds(rawData: ArrayLike<number>): { localMin: number; localMax: number } {
  let localMin = Number.POSITIVE_INFINITY;
  let localMax = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < rawData.length; index++) {
    const numericValue = Number(rawData[index]);
    if (!Number.isFinite(numericValue)) {
      continue;
    }

    localMin = Math.min(localMin, numericValue);
    localMax = Math.max(localMax, numericValue);
  }

  if (!Number.isFinite(localMin) || !Number.isFinite(localMax)) {
    return { localMin: 0, localMax: 0 };
  }

  return { localMin, localMax };
}

function normalizeChunkToUint16(
  rawData: ArrayLike<number>,
  bounds: { localMin: number; localMax: number },
): Uint16Array {
  const normalized = new Uint16Array(rawData.length);
  const range = bounds.localMax - bounds.localMin;

  for (let index = 0; index < rawData.length; index++) {
    const numericValue = Number(rawData[index]);
    if (!Number.isFinite(numericValue) || range <= 0) {
      normalized[index] = 0;
      continue;
    }

    const fraction = THREE.MathUtils.clamp((numericValue - bounds.localMin) / range, 0, 1);
    normalized[index] = Math.round(fraction * 65535);
  }

  return normalized;
}

// --- 1. Individual Chunk Renderer with Volumetric Shader ---
export const ChunkVolume = ({ chunk, colorMapTexture }: { chunk: ChunkData, colorMapTexture: THREE.Texture | null }) => {
  const [texture, setTexture] = useState<THREE.Data3DTexture | null>(null);
  const [dataScale, setDataScale] = useState<number>(1.0);
  const [localBounds, setLocalBounds] = useState<{ localMin: number; localMax: number } | null>(null);
  const isDebug = useViewerStore((s) => s.debug);

  // Reference for direct GPU uniform updates
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const invalidate = useThree((state) => state.invalidate);

  // Grab live layer state for contrast limits
  const layer = useSceneStore((s) => s.layers.find((l) => l.id === chunk.frame_id));

  const [xIdx, yIdx, zIdx] = chunk.dimensionOrder;

  const gridX = xIdx !== -1 ? chunk.chunk_shape[xIdx] : 1;
  const gridY = yIdx !== -1 ? chunk.chunk_shape[yIdx] : 1;
  const gridZ = zIdx !== -1 ? chunk.chunk_shape[zIdx] : 1;

  const [actualSizes, setActualSizes] = useState([gridX, gridY, gridZ]);
  const [chunkWidth, chunkHeight, chunkZSize] = actualSizes;

  const validSpatialIndices = useMemo(() => [xIdx, yIdx, zIdx].filter(i => i !== -1), [xIdx, yIdx, zIdx]);
  const sortedIndices = useMemo(() => [...validSpatialIndices].sort((a, b) => a - b), [validSpatialIndices]);

  const fastestIdx = sortedIndices.length > 0 ? sortedIndices[sortedIndices.length - 1] : -1;
  const middleIdx = sortedIndices.length > 1 ? sortedIndices[sortedIndices.length - 2] : -1;
  const slowestIdx = sortedIndices.length > 2 ? sortedIndices[sortedIndices.length - 3] : -1;

  // OPTIMIZATION: Hardware-accelerated Matrix Permutation
  const dimRemapMat = useMemo(() => {
    const mat = new THREE.Matrix3();

    const uX = fastestIdx === xIdx ? 1 : 0;
    const uY = fastestIdx === yIdx ? 1 : 0;
    const uZ = fastestIdx === zIdx ? 1 : 0;

    const vX = middleIdx === xIdx ? 1 : 0;
    const vY = middleIdx === yIdx ? 1 : 0;
    const vZ = middleIdx === zIdx ? 1 : 0;

    const wX = slowestIdx === xIdx ? 1 : 0;
    const wY = slowestIdx === yIdx ? 1 : 0;
    const wZ = slowestIdx === zIdx ? 1 : 0;

    mat.set(
      uX, uY, uZ,
      vX, vY, vZ,
      wX, wY, wZ
    );

    return mat;
  }, [xIdx, yIdx, zIdx, fastestIdx, middleIdx, slowestIdx]);

  useEffect(() => {
    if (texture) return;

    let isMounted = true;
    const loadData = async () => {
      try {
        const arr = await open.v3(chunk.store, { kind: "array" });
        const chunkData = await arr.getChunk(chunk.chunkCoords);

        if (!isMounted || !chunkData) return;

        const rawShape = chunkData.shape;
        const actualX = xIdx !== -1 ? rawShape[xIdx] : 1;
        const actualY = yIdx !== -1 ? rawShape[yIdx] : 1;
        const actualZ = zIdx !== -1 ? rawShape[zIdx] : 1;
        setActualSizes([actualX, actualY, actualZ]);

        const texWidth = fastestIdx !== -1 ? rawShape[fastestIdx] : 1;
        const texHeight = middleIdx !== -1 ? rawShape[middleIdx] : 1;
        const texDepth = slowestIdx !== -1 ? rawShape[slowestIdx] : 1;

        const nextLocalBounds = computeChunkLocalBounds(chunkData.data as ArrayLike<number>);
        const normalizedData = normalizeChunkToUint16(chunkData.data as ArrayLike<number>, nextLocalBounds);
        const { data, type, internalFormat, dataScale } = getTextureConfig(normalizedData);

        const tex = new THREE.Data3DTexture(
          data,
          texWidth,
          texHeight,
          texDepth
        );

        tex.format = THREE.RedFormat;
        tex.type = type;
        tex.internalFormat = internalFormat;
        tex.unpackAlignment = 1;

        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.wrapR = THREE.ClampToEdgeWrapping;
        tex.flipY = false;
        tex.needsUpdate = true;

        setDataScale(dataScale);
    setLocalBounds(nextLocalBounds);
        setTexture(tex);
      } catch (error) {
        console.error(`Failed to load chunk: ${chunk.chunkKey}`, error);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [chunk, texture, xIdx, yIdx, zIdx, fastestIdx, middleIdx, slowestIdx]);

  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  // HIGH-PERFORMANCE UPDATE LOOP
  // Pipes dynamic values directly to the shader without rebuilding the component
  useEffect(() => {
    if (materialRef.current) {
      if (layer?.climMin !== undefined) {
        materialRef.current.uniforms.climMin.value = layer.climMin;
      }
      if (layer?.climMax !== undefined) {
        materialRef.current.uniforms.climMax.value = layer.climMax;
      }
      if (localBounds) {
        materialRef.current.uniforms.localMin.value = localBounds.localMin;
        materialRef.current.uniforms.localMax.value = localBounds.localMax;
      }
      if (colorMapTexture) {
        materialRef.current.uniforms.colormapTexture.value = colorMapTexture;
      }
      materialRef.current.uniformsNeedUpdate = true;
      invalidate();
    }
  }, [colorMapTexture, invalidate, layer?.climMin, layer?.climMax, localBounds]);

  // Memoize static or heavily-dependent initial uniforms
  const initialUniforms = useMemo(() => ({
    colorTexture: { value: texture },
    colormapTexture: { value: colorMapTexture },
    minValue: { value: chunk.min_value ?? 0.0 },
    maxValue: { value: chunk.max_value ?? 1.0 },
    localMin: { value: localBounds?.localMin ?? chunk.min_value ?? 0.0 },
    localMax: { value: localBounds?.localMax ?? chunk.max_value ?? 1.0 },
    climMin: { value: layer?.climMin ?? 0.0 },
    climMax: { value: layer?.climMax ?? 1.0 },
    opacity: { value: 1.0 },
    gamma: { value: 1.0 },
    useDiscrete: { value: 0.0 },
    dataScale: { value: dataScale },
    dimRemap: { value: dimRemapMat },
  }), [
    chunk.max_value,
    chunk.min_value,
    colorMapTexture,
    dataScale,
    dimRemapMat,
    layer?.climMax,
    layer?.climMin,
    localBounds,
    texture,
  ]);

  const getDimArraySize = (idx: number) => idx !== -1 ? chunk.arrayShape[idx] : 1;
  const totalX = getDimArraySize(xIdx);
  const totalY = getDimArraySize(yIdx);
  const totalZ = getDimArraySize(zIdx);

  const getChunkCoord = (idx: number) => idx !== -1 ? chunk.chunkCoords[idx] : 0;
  const xPos = getChunkCoord(xIdx) * gridX + chunkWidth / 2 - totalX / 2;
  const yPos = -(getChunkCoord(yIdx) * gridY + chunkHeight / 2 - totalY / 2);
  const zPos = getChunkCoord(zIdx) * gridZ + chunkZSize / 2 - totalZ / 2;

  if (!texture) {
    return (
      <mesh position={[xPos, yPos, zPos]}>
        <boxGeometry args={[chunkWidth, chunkHeight, chunkZSize]} />
        <meshBasicMaterial color="gray" wireframe={true} />
      </mesh>
    );
  }

  return (
    <group position={[xPos, yPos, zPos]}>
      <mesh scale={[chunkWidth, chunkHeight, chunkZSize]} renderOrder={1}>
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial
          ref={materialRef} // Attached ref for dynamic updates
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

            in vec3 vOrigin;
            in vec3 vDirection;

            uniform sampler3D colorTexture;
            uniform sampler2D colormapTexture;
            uniform float minValue;
            uniform float maxValue;
            uniform float localMin;
            uniform float localMax;
            uniform float climMin;
            uniform float climMax;
            uniform float opacity;
            uniform float gamma;
            uniform float useDiscrete;
            uniform float dataScale;
            uniform mat3 dimRemap; // Received as mat3

            out vec4 FragColor;

            float rand(vec2 co) {
              return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }

            vec2 hitBox(vec3 orig, vec3 dir) {
              vec3 box_min = vec3(-0.5);
              vec3 box_max = vec3(0.5);
              vec3 inv_dir = 1.0 / dir;
              vec3 tmin_tmp = (box_min - orig) * inv_dir;
              vec3 tmax_tmp = (box_max - orig) * inv_dir;
              vec3 tmin = min(tmin_tmp, tmax_tmp);
              vec3 tmax = max(tmin_tmp, tmax_tmp);
              float t0 = max(tmin.x, max(tmin.y, tmin.z));
              float t1 = min(tmax.x, min(tmax.y, tmax.z));
              return vec2(t0, t1);
            }

            float reconstructRawValue(float encodedValue) {
              float encoded = clamp(encodedValue * dataScale, 0.0, 1.0);
              if (abs(localMax - localMin) < 0.00001) {
                return localMin;
              }

              return mix(localMin, localMax, encoded);
            }

            void main() {
              vec3 rayDir = normalize(vDirection);
              vec2 bounds = hitBox(vOrigin, rayDir);

              if (bounds.x > bounds.y) discard;

              bounds.x = max(bounds.x, 0.0);

              float steps = 10.0;
              float delta = 1.732 / steps;
              vec3 step = rayDir * delta;

              float t = bounds.x;
              float jitter = rand(gl_FragCoord.xy);
              t += delta * jitter;

              vec3 p = vOrigin + t * rayDir;
              float maxVal = 0.0;

              for (int i = 0; i < int(steps); i++) {
                if (t > bounds.y) break;

                vec3 uvw = p + 0.5;
                uvw.y = 1.0 - uvw.y;

                // FAST MATRIX MULTIPLICATION
                vec3 texCoord = dimRemap * uvw;

                float encodedValue = texture(colorTexture, texCoord).r;
                float rawValue = reconstructRawValue(encodedValue);
                maxVal = max(maxVal, rawValue);

                p += step;
                t += delta;
              }

              float normalized;

              if (useDiscrete > 0.5) {
                normalized = mod(maxVal, 256.0) / 255.0;
              } else {
                // Incorporate dynamic climMin and climMax into volumetric rendering
                float baseNorm = clamp((maxVal - minValue) / (maxValue - minValue), 0.0, 1.0);
                float climRange = max(climMax - climMin, 0.00001);

                normalized = clamp((baseNorm - climMin) / climRange, 0.0, 0.999);
                normalized = pow(normalized, gamma);
              }

              vec4 color = texture(colormapTexture, vec2(normalized, 0.5));

              if (color.a * normalized < 0.01) discard;

              FragColor = vec4(color.rgb, color.a * opacity * normalized);
            }
          `}
        />
      </mesh>

      {isDebug && <mesh scale={[chunkWidth, chunkHeight, chunkZSize]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="cyan" wireframe={true} opacity={0.3} transparent={true} />
      </mesh>}
    </group>
  );
};
