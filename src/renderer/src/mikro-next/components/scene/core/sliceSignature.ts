import type { LayerState } from "./layerModel";

/**
 * Identity of a layer's non-spatial selection (extra dim slices, axis
 * mapping). A signature change means every cached brick shows different
 * data — the residency manager flushes the layer wholesale on mismatch.
 *
 * currentZ is deliberately NOT part of the signature: z is a spatial axis of
 * the brick address (page tables hold every slab), so bricks of other slabs
 * stay valid across z-scrubs — flushing on z change would refetch the whole
 * working set on every slider step (legacy ChunkPlane semantics, where
 * textures had no z identity).
 */
export function buildSliceSignature(layer: LayerState): string {
  return JSON.stringify({
    xDim: layer.xDim ?? null,
    yDim: layer.yDim ?? null,
    zDim: layer.zDim ?? null,
    intensityDim: layer.intensityDim ?? null,
    slices: layer.lens.slices.map((slice) => ({
      dim: slice.dim,
      start: slice.start ?? null,
      stop: slice.stop ?? null,
      step: slice.step ?? null,
    })),
  });
}
