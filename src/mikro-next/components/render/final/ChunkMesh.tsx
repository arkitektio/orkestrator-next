import { Edges, useSelect } from "@react-three/drei";

import { ColorMap, RgbViewFragment } from "@/mikro-next/api/graphql";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import {
  blueColormap,
  createColormapTexture,
  greenColormap,
  redColormap,
  viridisColormap,
} from "./colormaps";
import { useAsyncChunk } from "./useChunkTexture";


const getColormapForView = (view: RgbViewFragment) => {
  switch (view.colorMap) {
    case ColorMap.Blue: {
      return blueColormap;
    }
    case ColorMap.Green: {
      return greenColormap;
    }
    case ColorMap.Red: {
      return redColormap;
    }
    case ColorMap.Intensity: {
      const base = view.baseColor ?? [1, 1, 1];

      return createColormapTexture(
        Array.from({ length: 256 }, (_, i) => {
          const v = i / 255; // intensity [0,1]
          return [v * base[0] / 255, v * base[1] / 255, v * base[2] / 255];
        })
      );
    }

    default: {
      return viridisColormap;
    }
  }
};

export const ChunkBitmapTexture = ({
  renderFunc,
  chunk_coords,
  chunk_shape,
  view,
  z,
  t,
  cLimMin,
  cLimMax,
  imageWidth,
  imageHeight,
  scaleX,
  scaleY,
}: {
  renderFunc: any;
  chunk_coords: number[];
  chunk_shape: number[];
  view: RgbViewFragment;
  z: number;
  t: number;
  cLimMin?: number | undefined | null;
  cLimMax?: number | undefined | null;
  imageWidth: number;
  imageHeight: number;
  scaleX: number;
  scaleY: number;
}) => {
  const texture = useAsyncChunk({
    renderFunc,
    chunk_coords,
    chunk_shape,
    viewId: view.id,
    c: view.cMin || 0,
    z: z,
    t: t,
    scaleX,
    scaleY,
    imageHeight,
    imageWidth,
  });

  const colormapTexture = getColormapForView(view);

  const selected = useSelect().map((sel) => sel.userData.viewId)

  // Get the dimensions from the shape
  const meshRef = useRef<THREE.Mesh>();
  const box_shape_3d = chunk_shape?.slice(3, 5);
  const box_shape = [box_shape_3d[0] * scaleX, box_shape_3d[1] * scaleY, 1];

  // Get the position from coordinates
  const box_position_3d = chunk_coords.slice(3, 5);

  const xPosition =
    box_position_3d[1] * box_shape[1] + box_shape[1] / 2 - imageWidth / 2;
  const yPosition =
    box_position_3d[0] * box_shape[0] + box_shape[0] / 2 - imageHeight / 2;

  const gl = useThree((state) => state.gl);

  const congruentView = view.congruentViews?.at(0);

  const isSelected = selected.find((id: string) => id === view.id) !== undefined;
  console.log("Is selected:", isSelected);

  cLimMax = view.contrastLimitMax || texture?.max;
  cLimMin = view.contrastLimitMin || texture?.min;

  console.log("cLimMax", cLimMax, "cLimMin", cLimMin, "texture", texture);

  return (
    <mesh ref={meshRef} position={[xPosition, yPosition, 0]} scale={[1, 1, 1]} userData={{ viewId: view.id}}>
      <planeGeometry args={[box_shape[1], box_shape[0]]} />

      {texture && colormapTexture ? (
        <shaderMaterial
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={{
            colorTexture: { value: texture.texture },
            colormapTexture: { value: colormapTexture },
            minValue: { value: cLimMin },
            maxValue: { value: cLimMax },
            opacity: { value: 1 },
          }}
          onBeforeCompile={(shader) => {
            // Animate opacity from 0 to 1
            let startTime = Date.now();
            const animate = () => {
              const elapsedTime = (Date.now() - startTime) / 1000;
              shader.uniforms.opacity.value = Math.min(elapsedTime, 1);
              if (elapsedTime < 1) requestAnimationFrame(animate);
            };
            animate();
          }}
          vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `}
          fragmentShader={`
        uniform sampler2D colorTexture;
        uniform sampler2D colormapTexture;
        uniform float minValue;
        uniform float maxValue;
        uniform float opacity;
        varying vec2 vUv;

        void main() {
          float value = texture2D(colorTexture, vUv).r;
          float normalized = clamp((value - minValue) / (maxValue - minValue), 0.0, 0.999);
          vec4 color = texture2D(colormapTexture, vec2(normalized, 0.5)).rgba;
          gl_FragColor = vec4(color.rgb, color.a); // should render grayscale 0-1
        }
        `}
        />
      ) : (
        <meshBasicMaterial color={"black"} />
      )}
      <Edges visible={isSelected} scale={1} renderOrder={1000}>
        <meshBasicMaterial transparent color="#333" depthTest={true} />
      </Edges>
    </mesh>
  );
};
