import { Edges, Text, useSelect } from "@react-three/drei";

import { ColorMap, RgbViewFragment } from "@/mikro-next/api/graphql";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import type { Chunk, DataType } from "zarrita";
import { ScaledView } from "../FInalRender";
import { useViewerState } from "../ViewerStateProvider";
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
import { a, useSpring } from "@react-spring/three";

const VIEW_RADIUS = 20000; // Render radius around camera center

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

export const useShouldRender = ({
  availableScales,
  selfScale,
  chunkCoords,
  affineScaleX,
  affineScaleY,
  chunkShape,
}: {
  availableScales: ScaledView[];
  selfScale: ScaledView;
  chunkCoords?: number[];
  chunkShape?: number[];
  affineScaleX: number;
  affineScaleY: number;
}) => {
  if (!availableScales?.length) {
    throw new Error("useTileLOD: provide at least one level in opts.levels");
  }

  const { camera, size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  const [shouldRender, setShouldRender] = useState(false);
  const [inView, setInView] = useState(false);
  const frame = useRef(0);

  const step = 5; // measure every N frames

  // Configuration for view culling and LOD
  const viewRadius = VIEW_RADIUS / affineScaleX; // Base render radius around camera center
  const minPixelSize = 200 * affineScaleX; // Minimum pixel size to render (increased from 0.5)
  const maxPixelSize = 400 * affineScaleY; // Maximum pixel size to render (increased from 100)

  // Simple function to find optimal scale for given pixel size
  const findOptimalScale = useMemo(() => {
    return (basePixelUnit: number): ScaledView => {
      if (!availableScales?.length) return availableScales[0];

      const sortedScales = [...availableScales].sort(
        (a, b) => (a.scaleX || 1) - (b.scaleX || 1),
      );
      const idealPixelSize = 50;

      let optimalScale = sortedScales[0];
      let bestScore = Infinity;

      for (const scale of sortedScales) {
        const s = scale.scaleX || 1;
        const scalePixelSize = basePixelUnit * s;

        let score;
        if (basePixelUnit > idealPixelSize) {
          // Zoomed IN: prefer HIGH resolution (lower scale numbers like 1x)
          score = s + Math.abs(scalePixelSize - idealPixelSize);
        } else {
          // Zoomed OUT: prefer LOW resolution (higher scale numbers like 32x)
          score = (1 / s) * 100 + Math.abs(scalePixelSize - idealPixelSize);
        }

        // Penalty for going below minimum threshold
        if (scalePixelSize < minPixelSize) {
          score += 1000;
        }

        // Moderate penalty for going above maximum threshold
        if (scalePixelSize > maxPixelSize) {
          score += (scalePixelSize - maxPixelSize) * 0.1;
        }

        if (score < bestScore) {
          bestScore = score;
          optimalScale = scale;
        }
      }

      return optimalScale;
    };
  }, [availableScales, minPixelSize, maxPixelSize]);

  useFrame(() => {
    frame.current++;
    if (frame.current % step !== 0) return;

    const obj = meshRef.current;
    if (!obj || !chunkCoords || !chunkShape) {
      setShouldRender(false);
      return;
    }

    // Check if the object is in the viewport and assess the current pixel size of a world pixel
    if (!camera) return;

    // Get chunk world position and size
    const chunkWorldPos = new THREE.Vector3();
    obj.getWorldPosition(chunkWorldPos);

    // Calculate chunk size in world units first
    const chunkSize3D = chunkShape.slice(3, 5); // Get x, y dimensions
    const scaleX = selfScale.scaleX || 1;
    const scaleY = selfScale.scaleY || 1;
    const chunkWorldWidth = chunkSize3D[1] * scaleX;
    const chunkWorldHeight = chunkSize3D[0] * scaleY;
    const halfW = chunkWorldWidth / 2;
    const halfH = chunkWorldHeight / 2;

    // Make culling radius react to zoom for Orthographic cameras, keep base for Perspective
    const effectiveRadius =
      camera instanceof THREE.OrthographicCamera
        ? viewRadius / Math.max(1e-6, camera.zoom)
        : viewRadius;

    // Check if any part of the chunk rectangle intersects with the camera's circular view radius
    const cameraX = camera.position?.x ?? 0;
    const cameraY = camera.position?.y ?? 0;
    const chunkCenterX = chunkWorldPos.x;
    const chunkCenterY = chunkWorldPos.y;

    // Rectangle-circle intersection test
    // Find the closest point on the rectangle to the camera center
    const closestX = Math.max(
      chunkCenterX - halfW,
      Math.min(cameraX, chunkCenterX + halfW),
    );
    const closestY = Math.max(
      chunkCenterY - halfH,
      Math.min(cameraY, chunkCenterY + halfH),
    );

    // Calculate distance from camera to closest point on rectangle
    const dx = cameraX - closestX;
    const dy = cameraY - closestY;
    const distanceToClosestPoint = Math.hypot(dx, dy);

    // Chunk is visible if closest point is within the effective radius
    const withinViewRadius = distanceToClosestPoint <= effectiveRadius;

    setInView(withinViewRadius);

    if (!withinViewRadius) {
      setShouldRender(false);
      return;
    }

    // Calculate the apparent size in screen space
    // For orthographic camera, use zoom factor
    // For perspective camera, use distance and FOV
    let basePixelUnit = 0; // pixel size for scale 1x (using the unscaled chunk size)

    if (camera instanceof THREE.OrthographicCamera) {
      // For orthographic camera, pixel size is based on zoom
      const zoom = camera.zoom;
      const worldUnitsPerPixel =
        (camera.right - camera.left) / (size.width * zoom);
      basePixelUnit =
        Math.min(chunkSize3D[1], chunkSize3D[0]) / worldUnitsPerPixel;
    } else if (camera instanceof THREE.PerspectiveCamera) {
      // For perspective camera, calculate based on distance and FOV
      const fov = (camera.fov * Math.PI) / 180; // Convert to radians
      // Use planar (XY) distance for on-plane approximation
      const planarDistance = Math.max(
        1e-3,
        Math.hypot(
          camera.position.x - chunkWorldPos.x,
          camera.position.y - chunkWorldPos.y,
        ),
      );
      const worldHeight = 2 * Math.tan(fov / 2) * planarDistance;
      const worldUnitsPerPixel = worldHeight / size.height;
      basePixelUnit =
        Math.min(chunkSize3D[1], chunkSize3D[0]) / worldUnitsPerPixel;
    }

    // Enhanced LOD logic: Calculate optimal scale and check if this chunk is within threshold
    let isBestLOD = true;
    if (availableScales.length > 1) {
      const currentScaleX = selfScale.scaleX || 1;

      // Find the optimal scale for the current pixel size
      const optimalScale = findOptimalScale(basePixelUnit);
      const optimalScaleX = optimalScale.scaleX || 1;

      // Calculate this chunk's scaled pixel size
      const thisChunkScaledPixelSize = basePixelUnit * currentScaleX;
      const optimalScaledPixelSize = basePixelUnit * optimalScaleX;

      // Define threshold for acceptable pixel size difference (e.g., 20% tolerance)
      const threshold = 0.2;
      const pixelSizeDifference = Math.abs(
        thisChunkScaledPixelSize - optimalScaledPixelSize,
      );
      const relativeThreshold = optimalScaledPixelSize * threshold;

      // Render if this chunk's scaled pixel size is within threshold of optimal
      isBestLOD = pixelSizeDifference <= relativeThreshold;

      // Debug logging (only occasionally to avoid spam)
      if (frame.current % 30 === 0) {
        // console.log( --- IGNORE ---
      }
    }

    // Final render decision: render if within view radius and this is the best LOD
    const shouldRenderChunk = withinViewRadius && isBestLOD;
    setShouldRender(shouldRenderChunk);
  });

  return {
    meshRef,
    shouldRender,
    inView,
  };
};

// Debug component to visualize camera field of view
export const CameraFieldOfViewDebug = () => {
  const { camera } = useThree();
  const circleRef = useRef<THREE.Mesh>(null);
  const centerRef = useRef<THREE.Mesh>(null);
  const innerCircleRef = useRef<THREE.Mesh>(null);
  const { showDebugText } = useViewerState();

  useFrame(() => {
    if (
      !circleRef.current ||
      !centerRef.current ||
      !innerCircleRef.current ||
      !camera
    )
      return;

    // Position the circles and center marker at the camera position (projected to z=0 plane)
    const cameraX = camera.position.x;
    const cameraY = camera.position.y;

    // Calculate the effective view radius based on camera zoom and type
    let effectiveViewRadius = VIEW_RADIUS;

    if (camera instanceof THREE.OrthographicCamera) {
      // For orthographic camera, scale the radius based on zoom
      // Higher zoom = smaller effective radius in world units
      effectiveViewRadius = VIEW_RADIUS / camera.zoom;
    } else if (camera instanceof THREE.PerspectiveCamera) {
      // For perspective camera, the view radius should be based on distance from target
      // This is more complex but we can use a simplified approach
      const distanceToTarget = camera.position.length();
      effectiveViewRadius = VIEW_RADIUS * (distanceToTarget / 1000); // Normalize distance
    }

    // Update circle geometries with the new radius
    const outerRadius = effectiveViewRadius;
    const innerRadius =
      effectiveViewRadius - Math.max(2, effectiveViewRadius * 0.02);
    const halfRadius = effectiveViewRadius * 0.5;
    const halfInnerRadius = halfRadius - Math.max(1, halfRadius * 0.02);

    // Update main circle
    circleRef.current.geometry.dispose();
    circleRef.current.geometry = new THREE.RingGeometry(
      innerRadius,
      outerRadius,
      64,
    );
    circleRef.current.position.set(cameraX, cameraY, 0.1);

    // Update center marker (scale with zoom)
    const markerSize = Math.max(2, effectiveViewRadius * 0.01);
    centerRef.current.geometry.dispose();
    centerRef.current.geometry = new THREE.CircleGeometry(markerSize, 16);
    centerRef.current.position.set(cameraX, cameraY, 0.2);

    // Update inner reference circle
    innerCircleRef.current.geometry.dispose();
    innerCircleRef.current.geometry = new THREE.RingGeometry(
      halfInnerRadius,
      halfRadius,
      32,
    );
    innerCircleRef.current.position.set(cameraX, cameraY, 0.05);
  });

  if (!showDebugText) return null;

  return (
    <group>
      {/* Field of view circle */}
      <mesh ref={circleRef} position={[0, 0, 0.1]}>
        <ringGeometry args={[VIEW_RADIUS - 2, VIEW_RADIUS, 64]} />
        <meshBasicMaterial
          color="#00ff00"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Camera center marker */}
      <mesh ref={centerRef} position={[0, 0, 0.2]}>
        <circleGeometry args={[5, 16]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.8} />
      </mesh>

      {/* Inner radius reference circle at 50% */}
      <mesh ref={innerCircleRef} position={[0, 0, 0.05]}>
        <ringGeometry args={[VIEW_RADIUS * 0.5 - 1, VIEW_RADIUS * 0.5, 32]} />
        <meshBasicMaterial
          color="#ffff00"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export const ChunkBitmapTexture = ({
  renderFunc,
  chunk_coords,
  chunk_shape,
  affineScaleX,
  affineScaleY,
  view,
  cLimMin,
  z,
  t,
  cLimMax,
  imageWidth,
  imageHeight,
  scaleX,
  derivedScaleView,
  availableScales,
  scaleY,
  enableCulling = true,
}: {
  renderFunc: (
    signal: AbortSignal,
    chunk_coords: number[],
    chunk_shape: number[],
    c: number,
    t: number,
    z: number,
  ) => Promise<{ chunk: Chunk<DataType>; dtype: DataType }>;
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
  affineScaleX: number;
  affineScaleY: number;
  showEdges?: boolean;
  showDebugText?: boolean;
  derivedScaleView: ScaledView;
  availableScales: ScaledView[];
}) => {
  const { meshRef, shouldRender } = useShouldRender({
    availableScales: availableScales,
    selfScale: derivedScaleView,
    chunkCoords: chunk_coords,
    chunkShape: chunk_shape,
    affineScaleX: affineScaleX,
    affineScaleY: affineScaleY,
  });

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
    shouldRender, // Pass shouldRender to control texture loading
  });

  const { showLayerEdges, showDebugText } = useViewerState();

  const colormapTexture = getColormapForView(view);

  const selected = useSelect().map((sel) => sel.userData.viewId);

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

  const isSelected =
    selected.find((id: string) => id === view.id) !== undefined;

  // Get edge color and thickness based on scale
  const edgeProperties = getEdgePropertiesForScale(scaleX);

  cLimMax = view.contrastLimitMax || texture?.max;
  cLimMin = view.contrastLimitMin || texture?.min;
  const gamma = view.gamma || 1;

  // Calculate z-position based on scale: higher resolution (lower scaleX) should be on top
  // Use negative values so 1x is at z=0, 2x at z=-0.001, 4x at z=-0.002, etc.
  const zPosition = (scaleX - 1) * 0.001;

  const { opacity } = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 8000 },
  });

  return (
    <a.mesh
      renderOrder={1}
      ref={meshRef}
      position={[xPosition, yPosition, zPosition]}
      userData={{ viewId: view.id }}
      visible={shouldRender}
    >
      <planeGeometry args={[box_shape[1], box_shape[0]]} />

      {shouldRender && texture?.texture ? (
        <shaderMaterial
          transparent={false}
          blending={THREE.AdditiveBlending}
          depthWrite={true}
          depthTest={true}
          uniforms={{
            colorTexture: { value: texture.texture },
            colormapTexture: { value: colormapTexture },
            minValue: { value: cLimMin },
            maxValue: { value: cLimMax },
            opacity: { value: opacity },
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
        <meshBasicMaterial
          color={shouldRender ? "white" : edgeProperties.color}
          transparent={true}
          opacity={shouldRender ? 0.1 : 0.3}
        />
      )}
      <Edges
        visible={showLayerEdges}
        lineWidth={edgeProperties.thickness * 200}
        renderOrder={1000}
        color={edgeProperties.color}
      >
        <meshBasicMaterial transparent />
      </Edges>

      {/* Debug text showing scale level and pixel size */}
      {showDebugText && shouldRender && (
        <Text
          position={[0, 0, 0.1]}
          fontSize={Math.min(box_shape[1], box_shape[0]) * 0.08}
          color={edgeProperties.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {`${derivedScaleView.scaleX}x\n${shouldRender ? "RENDER" : "SKIP"}`}
        </Text>
      )}
    </a.mesh>
  );
};
