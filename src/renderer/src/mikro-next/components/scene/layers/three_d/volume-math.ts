import * as THREE from 'three';
import type { Slice } from 'zarrita';
import { DimSliceFragment } from '@/mikro-next/api/graphql';

export type AxisSelection = {
  start: number;
  step: number;
  length: number;
};

export type TextureBufferConfig = {
  data: Uint8Array | Uint16Array | Float32Array;
  dataScale: number;
  type: THREE.TextureDataType;
  internalFormat: 'R8' | 'R16' | 'R32F' | null;
};

// --- Buffer Generation ---

export function createVolumeTextureBuffer(dtype: string, elementCount: number): TextureBufferConfig {
  if (dtype.includes('u1') || dtype.includes('i1') || dtype.includes('8')) {
    return {
      data: new Uint8Array(elementCount),
      dataScale: 1.0,
      type: THREE.UnsignedByteType,
      internalFormat: 'R8',
    };
  }

  if (dtype.includes('u2') || dtype.includes('i2') || dtype.includes('16')) {
    return {
      data: new Uint16Array(elementCount),
      dataScale: 1.0,
      type: THREE.UnsignedShortType,
      internalFormat: null, // Let WebGL default to native hardware normalization
    };
  }

  return {
    data: new Float32Array(elementCount),
    dataScale: 1.0,
    type: THREE.FloatType,
    internalFormat: 'R32F',
  };
}

export function getTextureDimensions(
  shape: [number, number, number],
  dimensionOrder: [number, number, number],
): { width: number; height: number; depth: number } {
  const sorted = [...dimensionOrder].sort((a, b) => a - b);
  const fastestIdx = sorted[sorted.length - 1] ?? 0;
  const middleIdx = sorted[sorted.length - 2] ?? 0;
  const slowestIdx = sorted[sorted.length - 3] ?? 0;

  return {
    width: shape[fastestIdx] ?? 1,
    height: shape[middleIdx] ?? 1,
    depth: shape[slowestIdx] ?? 1,
  };
}

// --- Selection & Indexing ---

export function resolveSpatialSelection(
  selection: null | Slice | number,
  axisLength: number,
): AxisSelection {
  if (typeof selection === 'number') {
    const index = Math.max(0, Math.min(axisLength - 1, selection));
    return { start: index, step: 1, length: 1 };
  }

  const step = Math.max(1, selection?.step ?? 1);
  const start = Math.max(0, Math.min(axisLength, selection?.start ?? 0));
  const stop = Math.max(start, Math.min(axisLength, selection?.stop ?? axisLength));
  const length = stop <= start ? 0 : Math.max(1, Math.ceil((stop - start) / step));

  return { start, step, length };
}

export function resolveCollapsedSelection(
  slice: DimSliceFragment | undefined,
  axisLength: number,
): number {
  if (axisLength <= 1) return 0;

  const step = Math.max(1, slice?.step ?? 1);
  const start = Math.max(0, Math.min(axisLength - 1, slice?.start ?? 0));
  const exclusiveStop = Math.max(start + 1, Math.min(axisLength, slice?.stop ?? start + 1));
  const span = Math.max(1, Math.ceil((exclusiveStop - start) / step));
  const centeredIndex = start + Math.floor((span - 1) / 2) * step;

  return Math.max(0, Math.min(axisLength - 1, centeredIndex));
}

export function resolveVoxelIndex(normalizedPosition: number, selection: AxisSelection): number {
  const clampedPosition = THREE.MathUtils.clamp(normalizedPosition, 0, 0.999999);
  const relativeIndex = Math.min(
    selection.length - 1,
    Math.max(0, Math.floor(clampedPosition * selection.length)),
  );
  return selection.start + relativeIndex * selection.step;
}

// --- Chunk Load Prioritization ---

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

// --- CPU Raymarching (Probing) ---

export function intersectLocalVolumeBox(
  origin: THREE.Vector3,
  direction: THREE.Vector3,
): { start: number; end: number } | null {
  const min = new THREE.Vector3(-0.5, -0.5, -0.5);
  const max = new THREE.Vector3(0.5, 0.5, 0.5);
  let start = -Infinity;
  let end = Infinity;

  for (const axis of ['x', 'y', 'z'] as const) {
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
  const image = texture.image as { data?: Uint8Array | Uint16Array | Float32Array; width?: number; height?: number; depth?: number; };
  const { data: textureData, width = 1, height = 1, depth = 1 } = image;

  if (!textureData || width <= 0 || height <= 0 || depth <= 0) return null;

  const sorted = [...dimensionOrder].sort((a, b) => a - b);
  const axisOrder = {
    depthAxis: sorted[sorted.length - 3] ?? 0,
    heightAxis: sorted[sorted.length - 2] ?? 0,
    widthAxis: sorted[sorted.length - 1] ?? 0,
  };

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
        components[axisOrder.widthAxis] ?? 0,
        components[axisOrder.heightAxis] ?? 0,
        components[axisOrder.depthAxis] ?? 0,
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

      const rawValue = textureData instanceof Float32Array
        ? sampleValue * dataScale
        : THREE.MathUtils.lerp(minValue, maxValue, normalizedSample);

      const baseNorm = THREE.MathUtils.clamp((rawValue - minValue) / Math.max(maxValue - minValue, 0.00001), 0, 1);
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
