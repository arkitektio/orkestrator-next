/**
 * Extract a single-index slab along one axis of a C-order (row-major) typed
 * array. Used by ChunkPlane to cut the selected z slice out of a fetched
 * chunk whose zarr chunking spans multiple z slices — uploading the whole
 * chunk would always display its first slab.
 */

type SlabArray = Uint8Array | Uint8ClampedArray | Uint16Array | Int16Array | Float32Array | Float64Array;

/**
 * Returns a new array containing the elements with `shape[axis] === index`
 * (clamped), preserving C-order of the remaining dims. The result has
 * `product(shape) / shape[axis]` elements — i.e. the shape with the axis
 * extent reduced to 1.
 */
export function extractAxisSlab<T extends SlabArray>(
  data: T,
  shape: readonly number[],
  axis: number,
  index: number,
): T {
  const axisExtent = shape[axis] ?? 1;
  if (axisExtent <= 1) return data;

  const clamped = Math.max(0, Math.min(axisExtent - 1, index));

  // C-order: elements with a fixed index along `axis` form `outerCount`
  // contiguous runs of `innerLength` elements, spaced `innerLength * extent`.
  const innerLength = shape.slice(axis + 1).reduce((total, extent) => total * extent, 1);
  const outerCount = shape.slice(0, axis).reduce((total, extent) => total * extent, 1);
  const outerStride = innerLength * axisExtent;

  const Ctor = data.constructor as new (length: number) => T;
  const out = new Ctor(innerLength * outerCount);
  for (let outer = 0; outer < outerCount; outer++) {
    const sourceOffset = outer * outerStride + clamped * innerLength;
    out.set(data.subarray(sourceOffset, sourceOffset + innerLength) as never, outer * innerLength);
  }
  return out;
}
