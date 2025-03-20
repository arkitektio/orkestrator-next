import { Wireframe } from "@react-three/drei";

import { ColorMap, RgbViewFragment } from "@/mikro-next/api/graphql";
import * as THREE from "three";
import { useAsyncChunk } from "./useChunkTexture";
import {
  blueColormap,
  createColormapTexture,
  greenColormap,
  redColormap,
  viridisColormap,
} from "./colormaps";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

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
      return createColormapTexture(
        Array.from({ length: 256 }, (_, i) => [
          (view.baseColor?.at(0) || 0) * i,
          (view.baseColor?.at(1) || 0) * i,
          (view.baseColor?.at(2) || 0) * i,
        ]),
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
    c: view.cMin || 0,
    z: z,
    t: t,
    scaleX,
    scaleY,
    imageHeight,
    imageWidth,
  });

  const colormapTexture = getColormapForView(view);

  // Get the dimensions from the shape
  const meshRef = useRef();
  const box_shape_3d = chunk_shape?.slice(3, 5);
  const box_shape = [box_shape_3d[0] * scaleX, box_shape_3d[1] * scaleY, 1];

  // Get the position from coordinates
  const box_position_3d = chunk_coords.slice(3, 5);

  const xPosition =
    box_position_3d[1] * box_shape[1] + box_shape[1] / 2 - imageWidth / 2;
  const yPosition =
    box_position_3d[0] * box_shape[0] + box_shape[0] / 2 - imageHeight / 2;

  const gl = useThree((state) => state.gl);

  return (
    <mesh ref={meshRef} position={[xPosition, yPosition, 0]} scale={[1, 1, 1]}>
      <planeGeometry args={[box_shape[1], box_shape[0]]} />
      {texture && colormapTexture ? (
        <shaderMaterial
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={{
            colorTexture: { value: texture.texture },
            colormapTexture: { value: colormapTexture },
            minValue: { value: cLimMin ? cLimMin : texture.min },
            maxValue: { value: cLimMax ? cLimMax : texture.max },
            opacity: { value: 0 },
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
          float normalized = (value - minValue) / (maxValue - minValue);
          vec4 color = texture2D(colormapTexture, vec2(clamp(normalized, 0.0, 1.0), 0.5)).rgba;
          gl_FragColor = vec4(color.rgb, color.a * opacity);
        }
        `}
        />
      ) : (
        <meshBasicMaterial color={"black"} />
      )}
    </mesh>
  );
};
