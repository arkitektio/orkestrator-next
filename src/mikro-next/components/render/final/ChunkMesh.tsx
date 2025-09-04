import { Edges, Text, useSelect } from "@react-three/drei";

import { ColorMap, RgbViewFragment } from "@/mikro-next/api/graphql";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import {
  blueColormap,
  createColormapTexture,
  greenColormap,
  infernoColormap,
  magmaColormap,
  plasmaColormap,
  rainbowColormap,
  redColormap,
  viridisColormap,
} from "./colormaps";
import { useAsyncChunk } from "./useChunkTexture";
import { useViewerState } from "../ViewerStateProvider";

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
    case ColorMap.Plasma: {
      return plasmaColormap;
    }
    case ColorMap.Magma: {
      return magmaColormap;
    }
    case ColorMap.Inferno: {
      return infernoColormap;
    }
    case ColorMap.Rainbow: {
      return rainbowColormap;
    }
    case ColorMap.Intensity: {
      const base = view.baseColor ?? [1, 1, 1];

      return createColormapTexture(
        Array.from({ length: 256 }, (_, i) => {
          const v = i / 255; // intensity [0,1]
          return [
            (v * base[0]) / 255,
            (v * base[1]) / 255,
            (v * base[2]) / 255,
          ];
        }),
      );
    }

    default: {
      return viridisColormap;
    }
  }
};

// Function to get edge color and thickness based on scale level
const getEdgePropertiesForScale = (
  scaleX: number,
): { color: string; thickness: number } => {
  // Define color scheme and thickness for different scale levels
  const scaleProperties: {
    [key: number]: { color: string; thickness: number };
  } = {
    1: { color: "#ff0000", thickness: 0.008 }, // Red, thinnest for full resolution (1x)
    2: { color: "#ff4400", thickness: 0.012 }, // Red-orange for 2x downsampled
    4: { color: "#ffaa00", thickness: 0.016 }, // Orange for 4x downsampled
    8: { color: "#aaff00", thickness: 0.02 }, // Yellow-green for 8x downsampled
    16: { color: "#00ff00", thickness: 0.024 }, // Green for 16x downsampled
    32: { color: "#00aaff", thickness: 0.028 }, // Cyan for 32x downsampled
    64: { color: "#0044ff", thickness: 0.032 }, // Blue, thickest for 64x downsampled
  };

  // Return exact match if available, otherwise find closest or use default
  if (scaleProperties[scaleX]) {
    return scaleProperties[scaleX];
  }

  // Find the closest scale level
  const availableScales = Object.keys(scaleProperties)
    .map(Number)
    .sort((a, b) => a - b);
  let closestScale = availableScales[0];
  let minDiff = Math.abs(scaleX - closestScale);

  for (const scale of availableScales) {
    const diff = Math.abs(scaleX - scale);
    if (diff < minDiff) {
      minDiff = diff;
      closestScale = scale;
    }
  }

  return scaleProperties[closestScale] || { color: "#666666", thickness: 0.01 }; // Default gray
};

export const ChunkBitmapTexture = ({
  renderFunc,
  chunk_coords,
  chunk_shape,
  view,
  cLimMin,
  z,
  t,
  cLimMax,
  imageWidth,
  imageHeight,
  scaleX,
  scaleY,
  enableCulling = true,
  showEdges = false,
  showDebugText = false,
}: {
  renderFunc: any;
  z: number;
  t: number;
  chunk_coords: number[];
  chunk_shape: number[];
  view: RgbViewFragment;
  cLimMin?: number | undefined | null;
  cLimMax?: number | undefined | null;
  imageWidth: number;
  imageHeight: number;
  scaleX: number;
  scaleY: number;
  enableCulling?: boolean;
  showEdges?: boolean;
  showDebugText?: boolean;
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
    enableCulling,
  });

  const colormapTexture = getColormapForView(view);

  const selected = useSelect().map((sel) => sel.userData.viewId);

  // Get the dimensions from the shape - scale the geometry based on the scale factor
  const meshRef = useRef<THREE.Mesh>();
  const box_shape_3d = chunk_shape?.slice(3, 5);
  // The geometry should be scaled by the scale factor to maintain proper alignment
  const box_shape = [box_shape_3d[0] * scaleX, box_shape_3d[1] * scaleY, 1];

  // Get the position from coordinates - positions should also account for scale
  const box_position_3d = chunk_coords.slice(3, 5);

  // Position calculation should use the base chunk size (before scaling) for proper alignment
  const baseChunkWidth = box_shape_3d[1];
  const baseChunkHeight = box_shape_3d[0];

  const xPosition =
    box_position_3d[1] * baseChunkWidth * scaleX +
    (baseChunkWidth * scaleX) / 2 -
    imageWidth / 2;
  const yPosition =
    imageHeight / 2 -
    box_position_3d[0] * baseChunkHeight * scaleY -
    (baseChunkHeight * scaleY) / 2;

  const gl = useThree((state) => state.gl);

  const congruentView = view.congruentViews?.at(0);

  const isSelected =
    selected.find((id: string) => id === view.id) !== undefined;
  console.log("Is selected:", isSelected);

  // Get edge color and thickness based on scale
  const edgeProperties = getEdgePropertiesForScale(scaleX);

  cLimMax = view.contrastLimitMax || texture?.max;
  cLimMin = view.contrastLimitMin || texture?.min;
  const gamma = view.gamma || 1;

  console.log("cLimMax", cLimMax, "cLimMin", cLimMin, "texture", texture);

  return (
    <mesh
      ref={meshRef}
      position={[xPosition, yPosition, 0]}
      userData={{ viewId: view.id }}
    >
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
            gamma: { value: gamma },
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
        uniform float gamma;
        varying vec2 vUv;

        void main() {
          vec2 flippedUv = vec2(vUv.x, 1.0 - vUv.y);
          float value = texture2D(colorTexture, flippedUv).r;
          float normalized = clamp((value - minValue) / (maxValue - minValue), 0.0, 0.999);
          normalized = pow(normalized, gamma);
          vec4 color = texture2D(colormapTexture, vec2(normalized, 0.5)).rgba;
          gl_FragColor = vec4(color.rgb, color.a); // should render grayscale 0-1
        }
        `}
        />
      ) : (
        <meshBasicMaterial color={"black"} />
      )}
      <Edges
        visible={showEdges}
        lineWidth={edgeProperties.thickness * 400}
        renderOrder={1000}
        color={edgeProperties.color}
      >
        <meshBasicMaterial transparent />
      </Edges>

      {/* Debug text showing scale level */}
      {showDebugText && (
        <Text
          position={[0, 0, 0.1]}
          fontSize={Math.min(box_shape[1], box_shape[0]) * 0.1}
          color={edgeProperties.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {`${scaleX}x`}
        </Text>
      )}
    </mesh>
  );
};
