import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '../store/sceneStore';
import { useViewerStore } from '../store/viewerStore';

type VolumeTextureMeshProps = {
  texture: THREE.Data3DTexture;
  colorMapTexture: THREE.Texture | null;
  layerId: string;
  dimensionOrder: [number, number, number];
  volumePosition: [number, number, number];
  volumeSize: [number, number, number];
  minValue: number;
  maxValue: number;
  dataScale: number;
};

export const VolumeTextureMesh = ({
  texture,
  colorMapTexture,
  layerId,
  dimensionOrder,
  volumePosition,
  volumeSize,
  minValue,
  maxValue,
  dataScale,
}: VolumeTextureMeshProps) => {
  const [xIdx, yIdx, zIdx] = dimensionOrder;
  const isDebug = useViewerStore((s) => s.debug);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const layer = useSceneStore((s) => s.layers.find((candidate) => candidate.id === layerId));
  const invalidate = useThree((state) => state.invalidate);
  const boundsScale = useMemo(
    () => volumeSize.map((axis) => axis * 1.002) as [number, number, number],
    [volumeSize],
  );

  const validSpatialIndices = useMemo(
    () => [xIdx, yIdx, zIdx].filter((index) => index !== -1),
    [xIdx, yIdx, zIdx],
  );
  const sortedIndices = useMemo(
    () => [...validSpatialIndices].sort((a, b) => a - b),
    [validSpatialIndices],
  );

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
      wX, wY, wZ,
    );

    return mat;
  }, [fastestIdx, middleIdx, slowestIdx, xIdx, yIdx, zIdx]);

  useEffect(() => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.colorTexture.value = texture;
    materialRef.current.uniforms.dataScale.value = dataScale;
    materialRef.current.uniformsNeedUpdate = true;
    invalidate();
  }, [dataScale, invalidate, texture]);

  useEffect(() => {
    if (!materialRef.current) return;

    if (layer?.climMin !== undefined) {
      materialRef.current.uniforms.climMin.value = layer.climMin;
    }
    if (layer?.climMax !== undefined) {
      materialRef.current.uniforms.climMax.value = layer.climMax;
    }
    if (colorMapTexture) {
      materialRef.current.uniforms.colormapTexture.value = colorMapTexture;
    }
    materialRef.current.uniformsNeedUpdate = true;
    invalidate();
  }, [colorMapTexture, invalidate, layer?.climMax, layer?.climMin]);

  const initialUniforms = useMemo(
    () => ({
      colorTexture: { value: texture },
      colormapTexture: { value: colorMapTexture },
      minValue: { value: minValue },
      maxValue: { value: maxValue },
      climMin: { value: layer?.climMin ?? 0.0 },
      climMax: { value: layer?.climMax ?? 1.0 },
      opacity: { value: 1.0 },
      gamma: { value: 1.0 },
      useDiscrete: { value: 0.0 },
      dataScale: { value: dataScale },
      dimRemap: { value: dimRemapMat },
    }),
    [colorMapTexture, dataScale, dimRemapMat, layer?.climMax, layer?.climMin, maxValue, minValue, texture],
  );

  return (
    <group position={volumePosition}>
      <mesh scale={volumeSize} renderOrder={1} >
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

            in vec3 vOrigin;
            in vec3 vDirection;

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

            float rand(vec2 co) {
              return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
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

              float steps = 32.0;
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

                vec3 texCoord = dimRemap * uvw;
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
                float baseNorm = clamp((rawValue - minValue) / max(maxValue - minValue, 0.00001), 0.0, 1.0);
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

      {isDebug && (
        <mesh scale={volumeSize} renderOrder={2}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#155e75" opacity={0.06} transparent={true} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
};
