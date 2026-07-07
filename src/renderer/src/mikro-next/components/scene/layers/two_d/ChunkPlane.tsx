import { useViewerStore } from '../../store/viewerStore';
import { useEffect, useMemo, useState, useRef } from 'react'; // FIXED: Added useRef
import * as THREE from 'three';
import { getChunkWorker } from '../../../../../lib/zarr/runner';
import { workerPool } from '../../../../workers/pool';
import type { ChunkData } from '../../stores/types';
import { useSceneStore } from '../../store/sceneStore';
import { buildColormapAtlas } from '../../zarr/colormaps';
import { Blending } from '@/mikro-next/api/graphql';
import { buildDimRemapMatrix, computeAxisMemoryOrder } from '../../core/dimRemap';
import { extractAxisSlab } from '../../core/slab';

// Max channels a single layer's render graph can composite in one shader pass.
const MAX_CHANNELS = 16;

const blendModeToInt = (blend: Blending | undefined): number => {
  if (blend === Blending.Multiplicative) return 1;
  if (blend === Blending.Normal) return 2;
  return 0; // ADDITIVE
};


// --- Helper: Strict WebGL2 Memory Configuration ---
function getTextureConfig(rawData: any) {
  if (rawData instanceof Uint8Array || rawData instanceof Uint8ClampedArray) {
    return { data: rawData, type: THREE.UnsignedByteType, internalFormat: 'R8', dataScale: 255.0 };
  }
  if (rawData instanceof Float32Array) {
    return { data: rawData, type: THREE.FloatType, internalFormat: 'R32F', dataScale: 1.0 };
  }

  throw new Error(`Unexpected chunk data type: ${rawData?.constructor?.name ?? typeof rawData}`);
}

// --- 1. Individual Chunk Renderer with Single Texture Lookup ---
export const ChunkPlane = ({ chunk }: { chunk: ChunkData }) => {
  const [texture, setTexture] = useState<THREE.Data3DTexture | null>(null);
  const [dataScale, setDataScale] = useState<number>(1.0);
  const isDebug = useViewerStore((s) => s.debug);
  const getArrayForStoreId = useViewerStore((s) => s.getArrayForStoreId);

  // FIXED: Create a ref to directly mutate the shader uniforms
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Grab the [0, 1] contrast limits from the store
  const layer = useSceneStore((s) => {
    const layer = s.layers.find((l) => l.id === chunk.frame_id);
    return layer
  });

  // Report rendering state to store automatically
  const setChunkStatus = useViewerStore((s) => s.setChunkStatus);
  useEffect(() => {
    setChunkStatus(chunk.chunkKey, {
      layerId: chunk.frame_id,
      chunkKey: chunk.chunkKey,
      level: chunk.level || 0,
      status: texture ? 'rendered' : 'loading'
    });
  }, [chunk.chunkKey, chunk.frame_id, chunk.level, texture, setChunkStatus]);

  // Deregister only on unmount (a texture arriving must not clear the entry).
  useEffect(() => {
    return () => setChunkStatus(chunk.chunkKey, null);
  }, [chunk.chunkKey, setChunkStatus]);


  const [xIdx, yIdx, zIdx] = chunk.dimensionOrder;

  const gridX = xIdx !== -1 ? chunk.chunk_shape[xIdx] : 1;
  const gridY = yIdx !== -1 ? chunk.chunk_shape[yIdx] : 1;
  const gridZ = zIdx !== -1 ? chunk.chunk_shape[zIdx] : 1;

  const [actualSizes, setActualSizes] = useState([gridX, gridY, gridZ]);
  const [chunkWidth, chunkHeight, chunkZSize] = actualSizes;

  const { fastestIdx, middleIdx, slowestIdx } = useMemo(
    () => computeAxisMemoryOrder([xIdx, yIdx, zIdx]),
    [xIdx, yIdx, zIdx],
  );

  const dimRemapMat = useMemo(
    () => buildDimRemapMatrix([xIdx, yIdx, zIdx]),
    [xIdx, yIdx, zIdx],
  );

  useEffect(() => {
    if (texture) return;

    const abortController = new AbortController();
    const loadData = async () => {
      const chunkLoadStartedAt = performance.now();
      try {
        const openStartedAt = performance.now();
        const arr = getArrayForStoreId(chunk.storeId);
        const openMs = performance.now() - openStartedAt;
        if (abortController.signal.aborted) return;

        const chunkReadStartedAt = performance.now();
        const chunkData = await getChunkWorker(arr, chunk.chunkCoords, {
          pool: workerPool,
          priority: chunk.level,
          signal: abortController.signal,
          useSharedArrayBuffer: true,
        });
        const chunkReadMs = performance.now() - chunkReadStartedAt;


        if (abortController.signal.aborted || !chunkData) return;

        // When the zarr chunking spans multiple z slices, the fetched chunk
        // holds ALL of them — cut out the slice the plan selected, otherwise
        // the texture always shows the chunk's first slab and the z slider
        // appears dead.
        let textureSource = chunkData.data as Uint8Array | Float32Array;
        const rawShape = [...chunkData.shape];
        const zSelection = chunk.zSelection;
        if (zSelection && (rawShape[zSelection.axisPosition] ?? 1) > 1) {
          const chunkExtent = chunk.chunk_shape[zSelection.axisPosition] ?? 1;
          const localIndex =
            zSelection.levelIndex - (chunk.chunkCoords[zSelection.axisPosition] ?? 0) * chunkExtent;
          textureSource = extractAxisSlab(textureSource, rawShape, zSelection.axisPosition, localIndex);
          rawShape[zSelection.axisPosition] = 1;
        }

        const actualX = xIdx !== -1 ? rawShape[xIdx] : 1;
        const actualY = yIdx !== -1 ? rawShape[yIdx] : 1;
        const actualZ = zIdx !== -1 ? rawShape[zIdx] : 1;
        setActualSizes([actualX, actualY, actualZ]);

        const texWidth = fastestIdx !== -1 ? rawShape[fastestIdx] : 1;
        const texHeight = middleIdx !== -1 ? rawShape[middleIdx] : 1;
        const texDepth = slowestIdx !== -1 ? rawShape[slowestIdx] : 1;

        const texturePrepStartedAt = performance.now();
        const { data, type, dataScale } = getTextureConfig(textureSource);
        const textureConfigMs = performance.now() - texturePrepStartedAt;

        const textureCreateStartedAt = performance.now();
        const tex = new THREE.Data3DTexture(data, texWidth, texHeight, texDepth);
        tex.format = THREE.RedFormat;
        tex.type = type;
        tex.minFilter = THREE.NearestFilter;
        tex.magFilter = THREE.NearestFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.wrapR = THREE.ClampToEdgeWrapping;
        tex.flipY = false;
        tex.needsUpdate = true;
        const textureCreateMs = performance.now() - textureCreateStartedAt;

        if (isDebug) {
          console.log('[chunk plane timing]', {
            chunkKey: chunk.chunkKey,
            chunkCoords: [...chunk.chunkCoords],
            openArrayMs: Number(openMs.toFixed(2)),
            getChunkWorkerMs: Number(chunkReadMs.toFixed(2)),
            textureConfigMs: Number(textureConfigMs.toFixed(2)),
            textureCreateMs: Number(textureCreateMs.toFixed(2)),
            totalMs: Number((performance.now() - chunkLoadStartedAt).toFixed(2)),
            dataType: chunkData.data?.constructor?.name ?? typeof chunkData.data,
            shape: [...rawShape],
          });
        }

        setDataScale(dataScale);
        setTexture(tex);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error(`Failed to load chunk: ${chunk.chunkKey}`, error);
      }
    };

    loadData();

    return () => {
      abortController.abort();
    };
    // Key on chunkKey, not the chunk object: updateChunks rebuilds chunk
    // objects on every pan tick and identity-keyed deps would abort and
    // restart every in-flight load. Same key ⇒ same coords/store/level.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunk.chunkKey, getArrayForStoreId]);

  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);


  // zIdx is really the intensity/channel axis (dimensionOrder = [x, y, intensity]).
  // Its position among the sorted memory axes decides which sampler3D coordinate
  // component (x/y/z) selects the intensity slice.
  const intensityComponent = zIdx === fastestIdx ? 0 : zIdx === middleIdx ? 1 : 2;
  const intensitySize = Math.max(1, actualSizes[2]);

  // --- Multi-channel derivation from the layer's render graph ---
  const channelData = useMemo(() => {
    const channels = (layer?.channels ?? []).slice(0, MAX_CHANNELS);
    const numChannels = channels.length;

    const atlas = buildColormapAtlas(
      numChannels > 0
        ? channels.map((c) => ({ colormap: c.transfer.colormap, color: c.transfer.color }))
        : [{ colormap: layer?.colormap, color: layer?.color }],
    );

    const intensityCoord = new Array<number>(MAX_CHANNELS).fill(0);
    const climMin = new Array<number>(MAX_CHANNELS).fill(0);
    const climMax = new Array<number>(MAX_CHANNELS).fill(1);
    const gamma = new Array<number>(MAX_CHANNELS).fill(1);
    const opacity = new Array<number>(MAX_CHANNELS).fill(1);
    const visible = new Array<number>(MAX_CHANNELS).fill(0);
    const invert = new Array<number>(MAX_CHANNELS).fill(0);
    const row = new Array<number>(MAX_CHANNELS).fill(0);

    const rows = Math.max(1, numChannels);
    channels.forEach((c, i) => {
      const idx = c.intensityIndex ?? 0;
      intensityCoord[i] = Math.min(0.999, Math.max(0, (idx + 0.5) / intensitySize));
      climMin[i] = c.transfer.climMin ?? 0;
      climMax[i] = c.transfer.climMax ?? 1;
      gamma[i] = c.transfer.gamma ?? 1;
      opacity[i] = c.transfer.opacity ?? 1;
      visible[i] = c.visible ? 1 : 0;
      invert[i] = c.transfer.invert ? 1 : 0;
      row[i] = (i + 0.5) / rows;
    });

    return {
      atlas,
      numChannels,
      blendMode: blendModeToInt(layer?.blend),
      intensityCoord,
      climMin,
      climMax,
      gamma,
      opacity,
      visible,
      invert,
      row,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer?.channels, layer?.blend, layer?.colormap, layer?.color, intensitySize]);

  // Dispose the atlas when it is replaced or the component unmounts.
  useEffect(() => {
    const atlas = channelData.atlas;
    return () => atlas.dispose();
  }, [channelData]);

  // High-performance update loop: push new channel/transfer values straight to
  // the GPU without re-rendering the component structure.
  useEffect(() => {
    const u = materialRef.current?.uniforms;
    if (!u) return;
    u.colormapAtlas.value = channelData.atlas;
    u.numChannels.value = channelData.numChannels;
    u.blendMode.value = channelData.blendMode;
    u.intensityAxis.value = intensityComponent;
    u.chIntensityCoord.value = channelData.intensityCoord;
    u.chClimMin.value = channelData.climMin;
    u.chClimMax.value = channelData.climMax;
    u.chGamma.value = channelData.gamma;
    u.chOpacity.value = channelData.opacity;
    u.chVisible.value = channelData.visible;
    u.chInvert.value = channelData.invert;
    u.chRow.value = channelData.row;
  }, [channelData, intensityComponent]);

  // Define the initial uniforms ONCE using useMemo so they aren't recreated every render
  const initialUniforms = useMemo(() => ({
    colorTexture: { value: texture },
    colormapAtlas: { value: channelData.atlas },
    minValue: { value: chunk.min_value },
    maxValue: { value: chunk.max_value },
    numChannels: { value: channelData.numChannels },
    blendMode: { value: channelData.blendMode },
    intensityAxis: { value: intensityComponent },
    chIntensityCoord: { value: channelData.intensityCoord },
    chClimMin: { value: channelData.climMin },
    chClimMax: { value: channelData.climMax },
    chGamma: { value: channelData.gamma },
    chOpacity: { value: channelData.opacity },
    chVisible: { value: channelData.visible },
    chInvert: { value: channelData.invert },
    chRow: { value: channelData.row },
    useDiscrete: { value: 0.0 },
    dataScale: { value: dataScale },
    dimRemap: { value: dimRemapMat },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [texture, chunk.min_value, chunk.max_value, dataScale, dimRemapMat]);


  const getDimArraySize = (idx: number) => idx !== -1 ? chunk.arrayShape[idx] : 1;
  const scaleX = chunk.scaleFactors && xIdx !== -1 ? chunk.scaleFactors[xIdx] : 1;
  const scaleY = chunk.scaleFactors && yIdx !== -1 ? chunk.scaleFactors[yIdx] : 1;
  const scaleZ = chunk.scaleFactors && zIdx !== -1 ? chunk.scaleFactors[zIdx] : 1;

  const totalX = getDimArraySize(xIdx) * scaleX;
  const totalY = getDimArraySize(yIdx) * scaleY;
  const totalZ = getDimArraySize(zIdx) * scaleZ;

  const widthScaled = chunkWidth * scaleX;
  const heightScaled = chunkHeight * scaleY;
  const zSizeScaled = chunkZSize * scaleZ;

  const baseGridX = gridX * scaleX;
  const baseGridY = gridY * scaleY;
  const baseGridZ = gridZ * scaleZ;

  const getChunkCoord = (idx: number) => idx !== -1 ? chunk.chunkCoords[idx] : 0;

  const xPos = getChunkCoord(xIdx) * baseGridX + widthScaled / 2 - totalX / 2;
  const yPos = -(getChunkCoord(yIdx) * baseGridY + heightScaled / 2 - totalY / 2);
  const zPos = getChunkCoord(zIdx) * baseGridZ + zSizeScaled / 2 - totalZ / 2;


  if (!texture) {
    return (
      <mesh position={[xPos, yPos, zPos - (chunk.level || 0) * 0.01]}>
        <boxGeometry args={[widthScaled, heightScaled, zSizeScaled]} />
        <meshBasicMaterial color="gray" wireframe={true} />
      </mesh>
    );
  }

  return (
    <group position={[xPos, yPos, zPos - (chunk.level || 0) * 0.01]}>
      <mesh scale={[widthScaled, heightScaled, zSizeScaled]} renderOrder={1}>
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial
          ref={materialRef} // FIXED: Attach the ref
          glslVersion={THREE.GLSL3}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          uniforms={initialUniforms} // FIXED: Pass the memoized initial state
          vertexShader={`
            out vec3 vUv;
            void main() {
              vUv = position + 0.5;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            precision highp float;
            precision highp sampler3D;

            #define MAX_CHANNELS ${MAX_CHANNELS}

            in vec3 vUv;

            uniform sampler3D colorTexture;
            uniform sampler2D colormapAtlas;
            uniform float minValue;
            uniform float maxValue;
            uniform int numChannels;
            uniform int blendMode;      // 0 additive, 1 multiplicative, 2 normal
            uniform int intensityAxis;  // which texCoord component selects a channel slice
            uniform float chIntensityCoord[MAX_CHANNELS];
            uniform float chClimMin[MAX_CHANNELS];
            uniform float chClimMax[MAX_CHANNELS];
            uniform float chGamma[MAX_CHANNELS];
            uniform float chOpacity[MAX_CHANNELS];
            uniform float chVisible[MAX_CHANNELS];
            uniform float chInvert[MAX_CHANNELS];
            uniform float chRow[MAX_CHANNELS];
            uniform float useDiscrete;
            uniform float dataScale;
            uniform mat3 dimRemap;

            out vec4 FragColor;

            void main() {
              vec3 uvw = vUv;
              uvw.y = 1.0 - uvw.y;

              // Spatial (x,y) texture coordinate; the intensity component is
              // overridden per channel below to pick that channel's slice.
              vec3 baseCoord = dimRemap * uvw;

              // Multiplicative starts from white; additive/normal from black.
              vec3 accum = (blendMode == 1) ? vec3(1.0) : vec3(0.0);

              for (int i = 0; i < MAX_CHANNELS; i++) {
                if (i >= numChannels) break;
                if (chVisible[i] < 0.5) continue;

                vec3 texCoord = baseCoord;
                if (intensityAxis == 0) texCoord.x = chIntensityCoord[i];
                else if (intensityAxis == 1) texCoord.y = chIntensityCoord[i];
                else texCoord.z = chIntensityCoord[i];

                float rawValue = texture(colorTexture, texCoord).r * dataScale;

                float normalized;
                if (useDiscrete > 0.5) {
                  normalized = mod(rawValue, 256.0) / 255.0;
                } else {
                  float baseNorm = clamp((rawValue - minValue) / (maxValue - minValue), 0.0, 1.0);
                  float climRange = max(chClimMax[i] - chClimMin[i], 0.00001);
                  normalized = clamp((baseNorm - chClimMin[i]) / climRange, 0.0, 0.999);
                  normalized = pow(normalized, max(chGamma[i], 0.0001));
                }
                if (chInvert[i] > 0.5) normalized = 1.0 - normalized;

                vec3 color = texture(colormapAtlas, vec2(normalized, chRow[i])).rgb;
                float weight = chOpacity[i] * normalized;

                if (blendMode == 1) {
                  // Multiplicative: darken by each channel's contribution.
                  accum *= mix(vec3(1.0), color, weight);
                } else if (blendMode == 2) {
                  // Normal: alpha-over compositing within the layer.
                  accum = accum * (1.0 - weight) + color * weight;
                } else {
                  // Additive: premultiplied sum (matches the legacy single-channel path).
                  accum += color * weight;
                }
              }

              // Output premultiplied color; the mesh uses AdditiveBlending
              // (src.rgb * src.a + dst) so alpha = 1.0 adds 'accum' as-is,
              // reproducing the original single-channel result.
              FragColor = vec4(accum, 1.0);
            }
          `}
        />
      </mesh>
      {isDebug && <mesh scale={[widthScaled, heightScaled, zSizeScaled]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="cyan" wireframe={true} opacity={0.3} transparent={true} depthWrite={false} />
      </mesh>}
    </group>
  );
};
