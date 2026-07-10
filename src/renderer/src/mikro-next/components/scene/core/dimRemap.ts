import * as THREE from "three";

/**
 * A zarr array's spatial axes have an arbitrary memory order. The renderer needs
 * to know which of the (x, y, z) axes is the fastest/middle/slowest-varying in
 * memory so it can map a unit-box UVW coordinate onto the correct sampler3D
 * texture coordinate. These helpers are the single source of that mapping,
 * shared by the 2D plane and 3D volume render paths.
 */
export type AxisMemoryOrder = {
  fastestIdx: number;
  middleIdx: number;
  slowestIdx: number;
};

/**
 * Given a layer's [xIdx, yIdx, zIdx] axis indices (into the array's dim list;
 * -1 for an absent axis), return which index is fastest/middle/slowest-varying
 * in memory. A three.js `Data3DTexture` is laid out (width=fastest,
 * height=middle, depth=slowest).
 */
export function computeAxisMemoryOrder(
  dimensionOrder: [number, number, number],
): AxisMemoryOrder {
  const sorted = dimensionOrder.filter((idx) => idx !== -1).sort((a, b) => a - b);
  return {
    fastestIdx: sorted.length > 0 ? sorted[sorted.length - 1] : -1,
    middleIdx: sorted.length > 1 ? sorted[sorted.length - 2] : -1,
    slowestIdx: sorted.length > 2 ? sorted[sorted.length - 3] : -1,
  };
}

/**
 * Build the Matrix3 that permutes a unit-box UVW coordinate into the texture's
 * (fastest, middle, slowest) axis order. Row i selects the box axis that the
 * i-th memory axis corresponds to.
 */
export function buildDimRemapMatrix(
  dimensionOrder: [number, number, number],
): THREE.Matrix3 {
  const [xIdx, yIdx, zIdx] = dimensionOrder;
  const { fastestIdx, middleIdx, slowestIdx } = computeAxisMemoryOrder(dimensionOrder);

  const rowFor = (axisIdx: number): [number, number, number] => [
    axisIdx === xIdx ? 1 : 0,
    axisIdx === yIdx ? 1 : 0,
    axisIdx === zIdx ? 1 : 0,
  ];

  const [uX, uY, uZ] = rowFor(fastestIdx);
  const [vX, vY, vZ] = rowFor(middleIdx);
  const [wX, wY, wZ] = rowFor(slowestIdx);

  const mat = new THREE.Matrix3();
  mat.set(uX, uY, uZ, vX, vY, vZ, wX, wY, wZ);
  return mat;
}

/**
 * Texture (width, height, depth) for a shape given the axis memory order.
 * (Moved from `layers/three_d/volume-math.ts`.)
 */
export function getTextureDimensions(
  shape: [number, number, number],
  dimensionOrder: [number, number, number],
): { width: number; height: number; depth: number } {
  const { fastestIdx, middleIdx, slowestIdx } = computeAxisMemoryOrder(dimensionOrder);
  return {
    width: shape[fastestIdx] ?? 1,
    height: shape[middleIdx] ?? 1,
    depth: shape[slowestIdx] ?? 1,
  };
}
