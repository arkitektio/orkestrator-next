import * as THREE from "three";
import { computeAxisMemoryOrder } from "./dimRemap";
import type { AxisSelection } from "./selection";

/**
 * CPU-side volume raymarching + chunk-load prioritization used for probing.
 * (Moved out of `layers/three_d/volume-math.ts`.)
 *
 * NOTE: `marchVolumeTexture`'s normalize block (baseNorm / climRange / clamp)
 * MUST stay in lockstep with the GLSL `computeNormalized` used by the volume
 * shader, otherwise CPU probing and GPU rendering disagree. See the volume
 * fragment shader.
 */

export function intersectLocalVolumeBox(
  origin: THREE.Vector3,
  direction: THREE.Vector3,
): { start: number; end: number } | null {
  const min = new THREE.Vector3(-0.5, -0.5, -0.5);
  const max = new THREE.Vector3(0.5, 0.5, 0.5);
  let start = -Infinity;
  let end = Infinity;

  for (const axis of ["x", "y", "z"] as const) {
    const axisDirection = direction[axis];
    const axisOrigin = origin[axis];

    if (Math.abs(axisDirection) < Number.EPSILON) {
      if (axisOrigin < min[axis] || axisOrigin > max[axis]) return null;
      continue;
    }

    const invDirection = 1 / axisDirection;
    const t1 = (min[axis] - axisOrigin) * invDirection;
    const t2 = (max[axis] - axisOrigin) * invDirection;
    start = Math.max(start, Math.min(t1, t2));
    end = Math.min(end, Math.max(t1, t2));
  }

  if (start > end) return null;
  return { start: Math.max(start, 0), end };
}

export function prioritizeChunkLoaders<T extends { chunk_coords: number[] }>(
  items: T[],
  dimensionPositions: [number, number, number],
  spatialSelections: [AxisSelection, AxisSelection, AxisSelection],
  chunkShape: readonly number[],
): T[] {
  const [xPos, yPos, zPos] = dimensionPositions;
  const [xSelection, ySelection, zSelection] = spatialSelections;

  const getChunkCenter = (sel: AxisSelection, cSize: number) =>
    (sel.start + (Math.max(0, sel.length - 1) * sel.step) / 2) / Math.max(1, cSize);

  const centerChunkCoords = [
    getChunkCenter(xSelection, chunkShape[xPos] ?? 1),
    getChunkCenter(ySelection, chunkShape[yPos] ?? 1),
    getChunkCenter(zSelection, chunkShape[zPos] ?? 1),
  ] as const;

  return [...items].sort((left, right) => {
    const dLeft =
      Math.pow((left.chunk_coords[xPos] ?? 0) - centerChunkCoords[0], 2) +
      Math.pow((left.chunk_coords[yPos] ?? 0) - centerChunkCoords[1], 2) +
      Math.pow((left.chunk_coords[zPos] ?? 0) - centerChunkCoords[2], 2);
    const dRight =
      Math.pow((right.chunk_coords[xPos] ?? 0) - centerChunkCoords[0], 2) +
      Math.pow((right.chunk_coords[yPos] ?? 0) - centerChunkCoords[1], 2) +
      Math.pow((right.chunk_coords[zPos] ?? 0) - centerChunkCoords[2], 2);
    return dLeft - dRight;
  });
}

export async function runChunkLoaderQueue<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let nextIndex = 0;
  const runnerCount = Math.max(1, Math.min(concurrency, items.length));

  const runners = Array.from({ length: runnerCount }, async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex++];
      if (item) await worker(item);
    }
  });

  await Promise.all(runners);
}

/**
 * ⚠️ LEGACY / DEAD CODE — not used by the brick-pool (octree) renderer, which
 * probes via `marchResidentBricks` + `BrickResidencyManager.sampleResident`.
 *
 * This walks a single monolithic 3D texture and, critically, assumes the texture
 * is HARDWARE-NORMALIZED (see the `sampleValue / 65535` and `/ 255` below). The
 * octree brick atlas stores RAW values in an R32F texture (`dataScale = 1`), so
 * this normalization is WRONG for it — do NOT rewire this into brick sampling.
 * Kept only until the old volume-probe UI is removed.
 */
export function marchVolumeTexture({
  colorMapTexture,
  dataScale,
  direction,
  dimensionOrder,
  maxValue,
  minValue,
  origin,
  texture,
  bounds,
  climMax,
  climMin,
  threshold,
}: {
  colorMapTexture: THREE.Texture | null;
  dataScale: number;
  direction: THREE.Vector3;
  dimensionOrder: [number, number, number];
  maxValue: number;
  minValue: number;
  origin: THREE.Vector3;
  texture: THREE.Data3DTexture;
  bounds: { start: number; end: number };
  climMax: number;
  climMin: number;
  threshold: number;
}): [number, number, number] | null {
  const image = texture.image as {
    data?: Uint8Array | Uint16Array | Float32Array;
    width?: number;
    height?: number;
    depth?: number;
  };
  const { data: textureData, width = 1, height = 1, depth = 1 } = image;

  if (!textureData || width <= 0 || height <= 0 || depth <= 0) return null;

  // Mirror of the GLSL `dimRemap` (see buildDimRemapMatrix): texture x samples
  // the box component whose memory axis is the fastest-varying one, i.e. the
  // *position* of fastestIdx within dimensionOrder — not its value.
  const { fastestIdx, middleIdx, slowestIdx } = computeAxisMemoryOrder(dimensionOrder);
  const widthComponent = dimensionOrder.indexOf(fastestIdx);
  const heightComponent = dimensionOrder.indexOf(middleIdx);
  const depthComponent = dimensionOrder.indexOf(slowestIdx);

  const VOLUME_PROBE_STEPS = 32;
  const delta = Math.sqrt(3) / VOLUME_PROBE_STEPS;
  const step = direction.clone().multiplyScalar(delta);
  let distance = bounds.start + delta * 0.5;
  const position = origin.clone().addScaledVector(direction, distance);

  while (distance <= bounds.end) {
    const uvw = position.clone().addScalar(0.5);
    uvw.y = 1.0 - uvw.y; // Y is inverted in Three.js coordinates

    if (uvw.x >= 0 && uvw.x <= 1 && uvw.y >= 0 && uvw.y <= 1 && uvw.z >= 0 && uvw.z <= 1) {
      const components = [uvw.x, uvw.y, uvw.z];
      const texCoord = new THREE.Vector3(
        components[widthComponent] ?? 0,
        components[heightComponent] ?? 0,
        components[depthComponent] ?? 0,
      );

      const texX = Math.min(width - 1, Math.max(0, Math.floor(texCoord.x * width)));
      const texY = Math.min(height - 1, Math.max(0, Math.floor(texCoord.y * height)));
      const texZ = Math.min(depth - 1, Math.max(0, Math.floor(texCoord.z * depth)));
      const voxelIndex = (texZ * height + texY) * width + texX;

      const sampleValue = textureData[voxelIndex] ?? 0;

      // Map hardware sample back to true data space
      let normalizedSample = sampleValue;
      if (textureData instanceof Uint16Array) normalizedSample = sampleValue / 65535;
      else if (textureData instanceof Uint8Array) normalizedSample = sampleValue / 255;

      const rawValue =
        textureData instanceof Float32Array
          ? sampleValue * dataScale
          : THREE.MathUtils.lerp(minValue, maxValue, normalizedSample);

      const baseNorm = THREE.MathUtils.clamp(
        (rawValue - minValue) / Math.max(maxValue - minValue, 0.00001),
        0,
        1,
      );
      const climRange = Math.max(climMax - climMin, 0.00001);
      const normalized = THREE.MathUtils.clamp((baseNorm - climMin) / climRange, 0, 0.999);

      // Sample colormap alpha
      const cmImage = colorMapTexture?.image as { data?: Uint8Array; width?: number } | undefined;
      const cmData = cmImage?.data;
      let alpha = 1;

      if (cmData && (cmImage?.width ?? 0) > 0) {
        const cmWidth = cmImage!.width!;
        const scaledIndex = normalized * (cmWidth - 1);
        const leftIdx = Math.floor(scaledIndex);
        const rightIdx = Math.min(cmWidth - 1, leftIdx + 1);
        const mix = scaledIndex - leftIdx;
        const leftAlpha = (cmData[leftIdx * 4 + 3] ?? 255) / 255;
        const rightAlpha = (cmData[rightIdx * 4 + 3] ?? 255) / 255;
        alpha = THREE.MathUtils.lerp(leftAlpha, rightAlpha, mix);
      }

      if (alpha * normalized > threshold) {
        return [position.x, position.y, position.z];
      }
    }

    position.add(step);
    distance += delta;
  }

  return null;
}
