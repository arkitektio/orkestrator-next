import { open } from 'zarrita';
import type { Slice } from 'zarrita';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { ChunkData } from '../stores/types';
import { mapDTypeToMinMax } from '../stores/utils';
import { getColorMapTexture } from '../zarr/colormaps';
import { useSelectionStore } from '../store/layerStore';
import { useViewerStore } from '../store/viewerStore';
import {
  DimSliceFragment,
  RequestZarrAccessDocument,
  RequestZarrAccessMutation,
  RequestZarrAccessMutationVariables,
  SceneLayerFragment
} from '@/mikro-next/api/graphql';
import { useDatalayerEndpoint, useMikro } from '@/app/Arkitekt';
import { calculateChunkGrid } from '../zarr/utils';

// --- Helper: Strict WebGL2 Memory Configuration ---
function getTextureConfig(rawData: any) {
  if (rawData instanceof Uint8Array || rawData instanceof Uint8ClampedArray) {
    return { data: rawData, type: THREE.UnsignedByteType, internalFormat: 'R8', dataScale: 255.0 };
  }
  if (rawData instanceof Float32Array) {
    return { data: rawData, type: THREE.FloatType, internalFormat: 'R32F', dataScale: 1.0 };
  }

  console.warn("Promoting TypedArray to Float32Array for strict WebGL2 compatibility.");
  const floatData = new Float32Array(rawData);
  return { data: floatData, type: THREE.FloatType, internalFormat: 'R32F', dataScale: 1.0 };
}

// --- 1. Individual Chunk Renderer with Volumetric Shader ---
export const ChunkVolume = ({ chunk }: { chunk: ChunkData }) => {
  const [texture, setTexture] = useState<THREE.Data3DTexture | null>(null);
  const [dataScale, setDataScale] = useState<number>(1.0);
  const isDebug = useViewerStore((s) => s.debug);

  const [xIdx, yIdx, zIdx] = chunk.dimensionOrder;

  // The nominal size of the chunks in the grid
  const gridX = chunk.chunk_shape[xIdx];
  const gridY = chunk.chunk_shape[yIdx];
  const gridZ = chunk.chunk_shape[zIdx];

  // We need to track the *actual* size for edge chunks (e.g., Z=31 means the last chunk is 7)
  const [actualSizes, setActualSizes] = useState([gridX, gridY, gridZ]);
  const [chunkWidth, chunkHeight, chunkZSize] = actualSizes;

  // C-Order mapping: identify which Zarr dimension changes fastest in memory
  const firstSpatial = Math.min(xIdx, yIdx, zIdx);
  const lastSpatial = Math.max(xIdx, yIdx, zIdx);
  const middleSpatial = [xIdx, yIdx, zIdx].find(i => i !== lastSpatial && i !== firstSpatial) as number;

  // Map physical UVW axes back to Texture UVW based on memory alignment
  const dimRemap = useMemo(() => {
    const getSpatialAxis = (rawIdx: number) => rawIdx === xIdx ? 0.0 : rawIdx === yIdx ? 1.0 : 2.0;
    return new THREE.Vector3(
      getSpatialAxis(lastSpatial),   // Maps to Texture U (Width)
      getSpatialAxis(middleSpatial), // Maps to Texture V (Height)
      getSpatialAxis(firstSpatial)   // Maps to Texture W (Depth)
    );
  }, [xIdx, yIdx, zIdx, firstSpatial, middleSpatial, lastSpatial]);

  useEffect(() => {
    if (texture) return;

    let isMounted = true;
    const loadData = async () => {
      try {
        const arr = await open.v3(chunk.store, { kind: "array" });
        const chunkData = await arr.getChunk(chunk.chunkCoords);

        if (!isMounted || !chunkData) return;

        // Extract actual shape of the data returned (crucial for edge chunks)
        const rawShape = chunkData.shape;

        // Update physical mesh geometry to match true data size
        setActualSizes([rawShape[xIdx], rawShape[yIdx], rawShape[zIdx]]);

        // Align Texture dimensions with C-Order memory strides
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
  }, [chunk, texture, xIdx, yIdx, zIdx, firstSpatial, middleSpatial, lastSpatial]);

  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  // Use the Nominal grid size for offset placement, but Actual size for local centering
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
            dimRemap: { value: dimRemap }, // Route memory mapping to shader
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
            uniform vec3 dimRemap;

            out vec4 FragColor;

            // Re-aligns spatial raymarching with the flattened memory layout
            vec3 remapUVW(vec3 spatial) {
              return vec3(
                dimRemap.x < 0.5 ? spatial.x : (dimRemap.x < 1.5 ? spatial.y : spatial.z),
                dimRemap.y < 0.5 ? spatial.x : (dimRemap.y < 1.5 ? spatial.y : spatial.z),
                dimRemap.z < 0.5 ? spatial.x : (dimRemap.z < 1.5 ? spatial.y : spatial.z)
              );
            }

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

              for (int i = 0; i < int(steps); i++) {
                if (t > bounds.y) break;

                vec3 uvw = p + 0.5;
                uvw.y = 1.0 - uvw.y;

                // Remap before sampling
                vec3 texCoord = remapUVW(uvw);

                float val = texture(colorTexture, texCoord).r;
                maxVal = max(maxVal, val);

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

      {isDebug && <mesh scale={[chunkWidth, chunkHeight, chunkZSize]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="cyan" wireframe={true} opacity={0.3} transparent={true} />
      </mesh>}
    </group>
  );
};

// --- 2. Outline Component ---
const InvertedHullOutline = ({
  children,
  color = '#10b981',
  thickness = 1.03,
  enabled = true,
}: {
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  enabled?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!enabled || !groupRef.current) return;

    const outlines: THREE.Mesh[] = [];

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && !child.userData.isOutline) {
        if (
          child.material instanceof THREE.Material &&
          'transparent' in child.material &&
          child.material.transparent &&
          'opacity' in child.material &&
          child.material.opacity < 0.5
        ) {
          return;
        }

        const outlineMesh = new THREE.Mesh(child.geometry);
        outlineMesh.material = new THREE.MeshBasicMaterial({
          color,
          side: THREE.BackSide,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
          depthTest: true,
          blending: THREE.NormalBlending,
        });

        outlineMesh.scale.copy(child.scale).multiplyScalar(thickness);
        outlineMesh.position.copy(child.position);
        outlineMesh.rotation.copy(child.rotation);
        outlineMesh.userData.isOutline = true;

        child.parent?.add(outlineMesh);
        outlines.push(outlineMesh);
      }
    });

    return () => {
      outlines.forEach((mesh) => {
        mesh.parent?.remove(mesh);
        (mesh.material as THREE.Material).dispose();
      });
    };
  }, [enabled, color, thickness]);

  return <group ref={groupRef}>{children}</group>;
};

// --- 3. The Main Frame Plane ---
export const VolumeLayer = ({ layer }: { layer: SceneLayerFragment }) => {
  const [chunks, setChunks] = useState<ChunkData[] | null>(null);

  const client = useMikro();
  const datalayer = useDatalayerEndpoint();

  const storeBuilder = useViewerStore((s) => s.storeBuilder);

  const isSelected = useSelectionStore((s) => s.selectedLayerId === layer.id);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);

  useEffect(() => {
    let isMounted = true;

    const initializeZarr = async () => {
      try {
        const zarrArray = layer.lens.dataset.dataArrays.at(0);
        const dims = layer.lens.dataset.dims;
        if (!zarrArray) {
          console.warn(`No data arrays found for Frame ${layer.id}`);
          return;
        }

        const access = await client.mutate<RequestZarrAccessMutation, RequestZarrAccessMutationVariables>({
          mutation: RequestZarrAccessDocument,
          variables: { input: { storeId: zarrArray.store.id } },
        });

        const credentials = access.data?.requestZarrAccess;
        if (!credentials) {
          console.error(`Failed to obtain Zarr access for Frame ${layer.id}`);
          return;
        }

        if (!datalayer) {
          console.error(`Datalayer endpoint is not defined`);
          return;
        }

        const store = await storeBuilder(credentials, datalayer);
        const arr = await open.v3(store, { kind: "array" });

        const sliceMap = layer.lens.slices.reduce((acc, slice) => {
          acc[slice.dim] = slice;
          return acc;
        }, {} as Record<string, DimSliceFragment>);

        const selection: (null | Slice | number)[] = dims.map(dim => {
          const slice = sliceMap[dim];
          if (slice) {
            return {
              start: slice.start ?? 0,
              stop: slice.stop ?? undefined,
              step: slice.step ?? 1
            } as Slice;
          } else {
            return null;
          }
        });

        if (!isMounted) return;

        const xDim = layer.xDim;
        const yDim = layer.yDim;
        const zDim = layer.zDim;

        if (xDim === undefined || yDim === undefined || zDim === undefined) {
          console.error(`Missing dimension information for Frame ${layer.id}`);
          return;
        }

        const XPos = dims.indexOf(xDim);
        const YPos = dims.indexOf(yDim);
        const ZPos = dims.indexOf(zDim);

        if (XPos === -1 || YPos === -1 || ZPos === -1) {
          console.error(`Invalid spatial dimension names for Frame ${layer.id}`);
          return;
        }

        const shape = arr.shape;
        const dtype = arr.dtype;
        const chunk_shape = arr.chunks;

        const [min_val, max_val] = mapDTypeToMinMax(dtype);

        const cMinAbsolute = Math.ceil(min_val * (layer.climMin || 0));
        const cMaxAbsolute = Math.floor(max_val * (layer.climMax || 1));

        const generatedChunks: ChunkData[] = [];
        const colormapTexture = getColorMapTexture(layer);

        const chunks = calculateChunkGrid(selection, shape, chunk_shape);

        for (const { chunk_coords, mapping } of chunks) {
            generatedChunks.push({
              frame_id: layer.id,
              dimensionOrder: [XPos, YPos, ZPos],
              store: store,
              chunkCoords: chunk_coords,
              chunkKey: chunk_coords.join("/"),
              indexer: mapping,
              chunk_shape: chunk_shape,
              arrayShape: shape,
              min_value: min_val,
              max_value: max_val,
              cLimMin: cMinAbsolute,
              cLimMax: cMaxAbsolute,
              colormapTexture: colormapTexture
            });
        }

        setChunks(generatedChunks);
      } catch (error) {
        console.error(`Failed to initialize Frame: ${layer.id}`, error);
      }
    };

    initializeZarr();

    return () => {
      isMounted = false;
    };
  }, [layer, storeBuilder, client]);

  const affineMatrix = useMemo(() => {
    const mat = new THREE.Matrix4().identity();
    if (!layer.affineMatrix) return mat;

    const rawMat = layer.affineMatrix;
    if (rawMat.length === 3) {
      mat.set(
        rawMat[0][0], rawMat[0][1], 0, rawMat[0][2],
        rawMat[1][0], rawMat[1][1], 0, rawMat[1][2],
        0, 0, 1, 0,
        rawMat[2][0], rawMat[2][1], 0, rawMat[2][2]
      );
    } else if (rawMat.length === 4) {
      mat.set(
        rawMat[0][0], rawMat[0][1], rawMat[0][2], rawMat[0][3],
        rawMat[1][0], rawMat[1][1], rawMat[1][2], rawMat[1][3],
        rawMat[2][0], rawMat[2][1], rawMat[2][2], rawMat[2][3],
        rawMat[3][0], rawMat[3][1], rawMat[3][2], rawMat[3][3]
      );
    }
    return mat;
  }, [layer]);

  if (!chunks) {
    return null;
  }

  return (
    <group matrix={affineMatrix} matrixAutoUpdate={false} onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  setSelectedLayerId(null);
                } else {
                  setSelectedLayerId(layer.id);
                }
              }}>
      <InvertedHullOutline enabled={isSelected}>
        {chunks.map((chunk) => (
          <ChunkVolume key={chunk.chunkKey} chunk={chunk} />
        ))}
      </InvertedHullOutline>
    </group>
  );
};
