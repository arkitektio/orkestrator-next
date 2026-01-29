import { useThree } from "@react-three/fiber";
import { useCallback, useMemo } from "react";
import * as THREE from "three";

export interface ChunkBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ViewportInfo {
  left: number;
  right: number;
  top: number;
  bottom: number;
  zoom: number;
}

/**
 * Hook to calculate the current viewport bounds in world coordinates
 */
export const useViewportBounds = (): ViewportInfo => {
  const { camera, size } = useThree();

  return useMemo(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      // For orthographic cameras, we can directly get the viewport bounds
      const left = camera.left;
      const right = camera.right;
      const top = camera.top;
      const bottom = camera.bottom;

      // Calculate zoom level based on frustum size
      const zoom = size.width / (right - left);

      // Transform bounds to world coordinates considering camera position
      return {
        left: left + camera.position.x,
        right: right + camera.position.x,
        top: top + camera.position.y,
        bottom: bottom + camera.position.y,
        zoom,
      };
    } else if (camera instanceof THREE.PerspectiveCamera) {
      // For perspective cameras, calculate based on FOV and distance
      const distance = camera.position.z;
      const fov = (camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(fov / 2) * distance;
      const width = height * camera.aspect;

      const halfWidth = width / 2;
      const halfHeight = height / 2;

      const zoom = size.width / width;

      return {
        left: camera.position.x - halfWidth,
        right: camera.position.x + halfWidth,
        top: camera.position.y + halfHeight,
        bottom: camera.position.y - halfHeight,
        zoom,
      };
    }

    // Fallback
    return {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      zoom: 1,
    };
  }, [camera, size]);
};

/**
 * Hook to check if a chunk intersects with the current viewport
 */
export const useChunkVisibility = () => {
  const viewport = useViewportBounds();

  const isChunkVisible = useCallback(
    (chunkBounds: ChunkBounds): boolean => {
      // Add a small buffer to include chunks that are partially visible
      const buffer = Math.max(chunkBounds.width, chunkBounds.height) * 0.1;

      const chunkLeft = chunkBounds.x - chunkBounds.width / 2 - buffer;
      const chunkRight = chunkBounds.x + chunkBounds.width / 2 + buffer;
      const chunkTop = chunkBounds.y + chunkBounds.height / 2 + buffer;
      const chunkBottom = chunkBounds.y - chunkBounds.height / 2 - buffer;

      // Check if chunk bounds intersect with viewport bounds
      const intersects = !(
        chunkRight < viewport.left ||
        chunkLeft > viewport.right ||
        chunkBottom > viewport.top ||
        chunkTop < viewport.bottom
      );

      return intersects;
    },
    [viewport],
  );

  return { isChunkVisible, viewport };
};

/**
 * Hook to determine if a chunk should be rendered based on viewport visibility and scale appropriateness
 */
export const useScaleLevelSelection = (
  viewport: ViewportInfo,
  imageWidth: number,
  imageHeight: number,
  chunkScale: number,
) => {
  return useMemo(() => {
    // Calculate how much of the original image is visible in the viewport
    const viewportWidth = viewport.right - viewport.left;
    const viewportHeight = viewport.top - viewport.bottom;

    // Calculate the ratio of viewport size to image size
    const viewportToImageRatioX = viewportWidth / imageWidth;
    const viewportToImageRatioY = viewportHeight / imageHeight;

    // Use the smaller ratio to determine the appropriate scale level
    const viewportToImageRatio = Math.min(
      viewportToImageRatioX,
      viewportToImageRatioY,
    );

    // Determine the optimal scale level based on how much of the image we can see
    // If we can see the entire image (ratio >= 1), we might not need full resolution
    // If we're zoomed in (ratio < 1), we need higher resolution

    let optimalScale: number;

    if (viewportToImageRatio >= 1.0) {
      // We can see the entire image or more - lower resolution is fine
      optimalScale = Math.max(2, Math.ceil(viewportToImageRatio));
    } else if (viewportToImageRatio >= 0.5) {
      // We see about half the image - use 2x downsampling
      optimalScale = 2;
    } else if (viewportToImageRatio >= 0.25) {
      // We see about a quarter - use full resolution
      optimalScale = 1;
    } else {
      // We're very zoomed in - definitely use full resolution
      optimalScale = 1;
    }

    // Determine if the current chunk scale is appropriate
    // Allow some tolerance for scale matching
    const scaleTolerance = 0.5;
    const isAppropriateScale =
      Math.abs(Math.log2(chunkScale / optimalScale)) <= scaleTolerance;

    return {
      optimalScale,
      isAppropriateScale,
      viewportToImageRatio,
      currentZoom: viewport.zoom,
    };
  }, [viewport, imageWidth, imageHeight, chunkScale]);
};

/**
 * Hook that combines viewport culling and scale selection
 */
export const useChunkCulling = (
  chunkBounds: ChunkBounds,
  scaleX: number,
  imageWidth: number,
  imageHeight: number,
) => {
  const { isChunkVisible, viewport } = useChunkVisibility();
  const scaleSelection = useScaleLevelSelection(
    viewport,
    imageWidth,
    imageHeight,
    scaleX,
  );

  const shouldRender = useMemo(() => {
    const inViewport = isChunkVisible(chunkBounds);
    return inViewport && scaleSelection.isAppropriateScale;
  }, [isChunkVisible, chunkBounds, scaleSelection.isAppropriateScale]);

  return {
    shouldRender,
    isInViewport: isChunkVisible(chunkBounds),
    isAppropriateScale: scaleSelection.isAppropriateScale,
    optimalScale: scaleSelection.optimalScale,
    viewportToImageRatio: scaleSelection.viewportToImageRatio,
    currentZoom: scaleSelection.currentZoom,
    viewport,
  };
};
