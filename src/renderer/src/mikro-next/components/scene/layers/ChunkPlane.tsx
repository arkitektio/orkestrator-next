import { useViewerStore } from '../store/viewerStore';
import { useEffect, useMemo, useState, useRef } from 'react'; // FIXED: Added useRef
import * as THREE from 'three';
import { open } from 'zarrita';
import type { ChunkData } from '../stores/types';
import { useSceneStore } from '../store/sceneStore';
import { useShallow } from 'zustand/shallow';

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

// --- 1. Individual Chunk Renderer with Single Texture Lookup ---
export const ChunkPlane = ({ chunk, colorMapTexture }: { chunk: ChunkData, colorMapTexture: THREE.Texture | null }) => {
  const [texture, setTexture] = useState<THREE.Data3DTexture | null>(null);
  const [dataScale, setDataScale] = useState<number>(1.0);
  const isDebug = useViewerStore((s) => s.debug);

  // FIXED: Create a ref to directly mutate the shader uniforms
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Grab the [0, 1] contrast limits from the store
  const layer = useSceneStore((s) => {
    const layer = s.layers.find((l) => l.id === chunk.frame_id);
    return layer
  });

  const tStart = useViewerStore((s) => s.tStart);
  const tEnd = useViewerStore((s) => s.tEnd);

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

  const isVisible = useMemo(() => {
    return true;
  }, [chunk, tStart, tEnd]);

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
        const actualX = xIdx !== -1 ? rawShape[xIdx] : 1;
        const actualY = yIdx !== -1 ? rawShape[yIdx] : 1;
        const actualZ = zIdx !== -1 ? rawShape[zIdx] : 1;
        setActualSizes([actualX, actualY, actualZ]);

        const texWidth = fastestIdx !== -1 ? rawShape[fastestIdx] : 1;
        const texHeight = middleIdx !== -1 ? rawShape[middleIdx] : 1;
        const texDepth = slowestIdx !== -1 ? rawShape[slowestIdx] : 1;

        const { data, type, dataScale } = getTextureConfig(chunkData.data);

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
  }, [chunk]);

  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  // FIXED: The high-performance update loop.
  // Pushes new values straight to the GPU without re-rendering the component structure.
  useEffect(() => {
    if (materialRef.current) {
      if (layer?.climMin !== undefined) {
        materialRef.current.uniforms.climMin.value = layer.climMin;
      }
      if (layer?.climMax !== undefined) {
        materialRef.current.uniforms.climMax.value = layer.climMax;
      }
      if (colorMapTexture) {
        materialRef.current.uniforms.colormapTexture.value = colorMapTexture;
      }
    }
  }, [layer?.climMin, layer?.climMax, colorMapTexture]);



  // Define the initial uniforms ONCE using useMemo so they aren't recreated every render
  const initialUniforms = useMemo(() => ({
    colorTexture: { value: texture },
    colormapTexture: { value: colorMapTexture },
    minValue: { value: chunk.min_value },
    maxValue: { value: chunk.max_value },
    climMin: { value: layer?.climMin ?? 0.0 },
    climMax: { value: layer?.climMax ?? 1.0 },
    opacity: { value: 1.0 },
    gamma: { value: 1.0 },
    useDiscrete: { value: 0.0 },
    dataScale: { value: dataScale },
    dimRemap: { value: dimRemapMat },
  }), [texture, chunk.min_value, chunk.max_value, dataScale, dimRemapMat]);


  const getDimArraySize = (idx: number) => idx !== -1 ? chunk.arrayShape[idx] : 1;
  const totalX = getDimArraySize(xIdx);
  const totalY = getDimArraySize(yIdx);
  const totalZ = getDimArraySize(zIdx);

  const getChunkCoord = (idx: number) => idx !== -1 ? chunk.chunkCoords[idx] : 0;
  const xPos = getChunkCoord(xIdx) * gridX + chunkWidth / 2 - totalX / 2;
  const yPos = -(getChunkCoord(yIdx) * gridY + chunkHeight / 2 - totalY / 2);
  const zPos = getChunkCoord(zIdx) * gridZ + chunkZSize / 2 - totalZ / 2;


  if (!isVisible) return null;

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

            in vec3 vUv;

            uniform sampler3D colorTexture;
            uniform sampler2D colormapTexture;
            uniform float minValue;
            uniform float maxValue;
            uniform float climMin;
            uniform float climMax;
            uniform float opacity;
            uniform float gamma;
            uniform float useDiscrete;
            uniform float dataScale;
            uniform mat3 dimRemap;

            out vec4 FragColor;

            void main() {
              vec3 uvw = vUv;
              uvw.y = 1.0 - uvw.y;

              vec3 texCoord = dimRemap * uvw;
              float val = texture(colorTexture, texCoord).r;
              float rawValue = val * dataScale;

              float normalized;
              if (useDiscrete > 0.5) {
                normalized = mod(rawValue, 256.0) / 255.0;
              } else {
                float baseNorm = clamp((rawValue - minValue) / (maxValue - minValue), 0.0, 1.0);
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
        <meshBasicMaterial color="cyan" wireframe={true} opacity={0.3} transparent={true} depthWrite={false} />
      </mesh>}
    </group>
  );
};
