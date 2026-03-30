import { useViewerStore } from '../store/viewerStore';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { open } from 'zarrita';
import type { ChunkData } from '../stores/types';
import { createColormapTexture } from '../zarr/colormaps';

// --- Helper: Memory-Efficient Texture Configuration ---
// --- Helper: Strict WebGL2 Memory Configuration ---
function getTextureConfig(rawData: any) {
  if (rawData instanceof Uint8Array || rawData instanceof Uint8ClampedArray) {
    // 8-bit integers are natively supported in WebGL2 as R8
    return { data: rawData, type: THREE.UnsignedByteType, internalFormat: 'R8', dataScale: 255.0 };
  }
  if (rawData instanceof Float32Array) {
    // 32-bit floats are natively supported in WebGL2 as R32F
    return { data: rawData, type: THREE.FloatType, internalFormat: 'R32F', dataScale: 1.0 };
  }

  // FIX: Safely promote 16-bit integers to 32-bit floats.
  // This avoids the 'Invalid enum RED' crash caused by missing R16 support.
  console.warn("Promoting TypedArray to Float32Array for strict WebGL2 compatibility.");
  const floatData = new Float32Array(rawData);
  return { data: floatData, type: THREE.FloatType, internalFormat: 'R32F', dataScale: 1.0 };
}

// --- 1. Individual Chunk Renderer with Volumetric Shader ---
export const ChunkPlane = ({ chunk }: { chunk: ChunkData }) => {
  const [texture, setTexture] = useState<THREE.Data3DTexture | null>(null);
  const [dataScale, setDataScale] = useState<number>(1.0);
  const isDebug = useViewerStore((s) => s.debug);

  // Global viewer settings
  const tStart = useViewerStore((s) => s.tStart);
  const tEnd = useViewerStore((s) => s.tEnd);

  const [xIdx, yIdx, zIdx] = chunk.dimensionOrder;

  const gridX = chunk.chunk_shape[xIdx];
  const gridY = chunk.chunk_shape[yIdx];
  const gridZ = chunk.chunk_shape[zIdx];

  const [actualSizes, setActualSizes] = useState([gridX, gridY, gridZ]);
  const [chunkWidth, chunkHeight, chunkZSize] = actualSizes;

  const firstSpatial = Math.min(xIdx, yIdx, zIdx);
  const lastSpatial = Math.max(xIdx, yIdx, zIdx);
  const middleSpatial = [xIdx, yIdx, zIdx].find(i => i !== lastSpatial && i !== firstSpatial) as number;

  const dimRemapMat = useMemo(() => {
    const mat = new THREE.Matrix3();

    const uX = lastSpatial === xIdx ? 1 : 0;
    const uY = lastSpatial === yIdx ? 1 : 0;
    const uZ = lastSpatial === zIdx ? 1 : 0;

    const vX = middleSpatial === xIdx ? 1 : 0;
    const vY = middleSpatial === yIdx ? 1 : 0;
    const vZ = middleSpatial === zIdx ? 1 : 0;

    const wX = firstSpatial === xIdx ? 1 : 0;
    const wY = firstSpatial === yIdx ? 1 : 0;
    const wZ = firstSpatial === zIdx ? 1 : 0;

    mat.set(
      uX, uY, uZ,
      vX, vY, vZ,
      wX, wY, wZ
    );

    return mat;
  }, [xIdx, yIdx, zIdx, firstSpatial, middleSpatial, lastSpatial]);

  // 1. Temporal Culling Logic
  const isVisible = useMemo(() => {
    const tVisible = true;
    return tVisible;
  }, [chunk, tStart, tEnd]);

  // 2. Data Fetching & 3D Texture Mapping
  useEffect(() => {
    if (!isVisible && !texture) return;
    if (texture) return;

    let isMounted = true;
    const loadData = async () => {
      try {
        const arr = await open.v3(chunk.store, { kind: "array" });
        const chunkData = await arr.getChunk(chunk.chunkCoords);

        if (!isMounted || !chunkData) return;

        const rawShape = chunkData.shape;
        setActualSizes([rawShape[xIdx], rawShape[yIdx], rawShape[zIdx]]);

        const texWidth = rawShape[lastSpatial];
        const texHeight = rawShape[middleSpatial];
        const texDepth = rawShape[firstSpatial];

        const { data, type, internalFormat, dataScale } = getTextureConfig(chunkData.data);

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
        setTexture(tex);
      } catch (error) {
        console.error(`Failed to load chunk: ${chunk.chunkKey}`, error);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [chunk, isVisible, xIdx, yIdx, zIdx, firstSpatial, middleSpatial, lastSpatial, texture]);

  // 3. Cleanup
  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  if (!isVisible) return null;

  // 4. Physical 3D Placement (centered so array origin is at 0,0,0)
  const totalX = chunk.arrayShape[xIdx];
  const totalY = chunk.arrayShape[yIdx];
  const totalZ = chunk.arrayShape[zIdx];

  const xPos = chunk.chunkCoords[xIdx] * gridX + chunkWidth / 2 - totalX / 2;
  const yPos = -(chunk.chunkCoords[yIdx] * gridY + chunkHeight / 2 - totalY / 2);
  const zPos = chunk.chunkCoords[zIdx] * gridZ + chunkZSize / 2 - totalZ / 2;

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
          glslVersion={THREE.GLSL3}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={true}
          uniforms={{
            colorTexture: { value: texture },
            colormapTexture: { value: chunk.colormapTexture },
            minValue: { value: chunk.cLimMin },
            maxValue: { value: chunk.cLimMax },
            opacity: { value: 1.0 },
            gamma: { value: 1.0 },
            useDiscrete: { value: 0.0 },
            dataScale: { value: dataScale },
            dimRemap: { value: dimRemapMat }, // Now passing a Matrix3
          }}
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
            uniform float opacity;
            uniform float gamma;
            uniform float useDiscrete;
            uniform float dataScale;
            uniform mat3 dimRemap;

            out vec4 FragColor;

            // Pseudo-random generator for jittering
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

            void main() {
              vec3 rayDir = normalize(vDirection);
              vec2 bounds = hitBox(vOrigin, rayDir);

              if (bounds.x > bounds.y) discard;

              bounds.x = max(bounds.x, 0.0);

              float steps = 150.0;
              float delta = 1.732 / steps;
              vec3 step = rayDir * delta;

              float t = bounds.x;
              float jitter = rand(gl_FragCoord.xy);
              t += delta * jitter;

              vec3 p = vOrigin + t * rayDir;
              float maxVal = 0.0;

              // OPTIMIZATION: Early exit threshold based on your max contrast limit
              float earlyExitThreshold = (maxValue / dataScale) * 0.99;

              for (int i = 0; i < int(steps); i++) {
                if (t > bounds.y) break;

                vec3 uvw = p + 0.5;
                uvw.y = 1.0 - uvw.y;

                // FAST MATRIX MULTIPLICATION
                vec3 texCoord = dimRemap * uvw;

                float val = texture(colorTexture, texCoord).r;
                maxVal = max(maxVal, val);

                // OPTIMIZATION: Early Ray Termination (ERT)
                if (maxVal >= earlyExitThreshold) break;

                p += step;
                t += delta;
              }

              float rawValue = maxVal * dataScale;

              float normalized;
              if (useDiscrete > 0.5) {
                normalized = mod(rawValue, 256.0) / 255.0;
              } else {
                normalized = clamp((rawValue - minValue) / (maxValue - minValue), 0.0, 0.999);
                normalized = pow(normalized, gamma);
              }

              vec4 color = texture(colormapTexture, vec2(normalized, 0.5));

              if (color.a * normalized < 0.01) discard;

              FragColor = vec4(color.rgb, color.a * opacity * normalized);
            }
          `}
        />
      </mesh>

      {/* Debug Wireframe Overlay */}
      {isDebug && <mesh scale={[chunkWidth, chunkHeight, chunkZSize]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="cyan" wireframe={true} opacity={0.3} transparent={true} />
      </mesh>}
    </group>
  );
};
