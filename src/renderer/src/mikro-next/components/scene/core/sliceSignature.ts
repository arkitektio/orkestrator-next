import type { LayerState } from "./layerModel";

/**
 * Identity of a layer's non-spatial selection (extra dim slices, axis
 * mapping, scene-wide dim-slider selections). A signature change means every
 * cached brick shows different data — the residency manager flushes the
 * layer wholesale on mismatch.
 *
 * currentZ is deliberately NOT part of the signature: z is a spatial axis of
 * the brick address (page tables hold every slab), so bricks of other slabs
 * stay valid across z-scrubs — flushing on z change would refetch the whole
 * working set on every slider step (legacy ChunkPlane semantics, where
 * textures had no z identity).
 */

/**
 * The dims of this layer that collapse to ONE index at pool creation:
 * everything except the render axes (x/y/z spatial, intensity channel-slab)
 * with more than one sample. These are the dims the scene-wide sliders
 * (`viewerStore.dimSelections`) can scrub. Shared with `DimSliderPanel`.
 */
export function collapsibleDims(layer: LayerState): string[] {
  const rendered = new Set(
    [layer.xDim, layer.yDim, layer.zDim, layer.intensityDim].filter(Boolean),
  );
  return layer.lens.dims.filter((dim, position) => {
    if (rendered.has(dim)) return false;
    return (layer.lens.shape[position] ?? 1) > 1;
  });
}

export function buildSliceSignature(
  layer: LayerState,
  dimSelections: Record<string, number> = {},
): string {
  // Only the layer's OWN collapsible dims enter the signature: a tau-slider
  // change must not flush a layer without tau, and x/y/z/intensity selections
  // can never leak in (z scrubbing stays flush-free).
  const selections: Record<string, number> = {};
  for (const dim of collapsibleDims(layer)) {
    const selected = dimSelections[dim];
    if (selected !== undefined) selections[dim] = selected;
  }
  return JSON.stringify({
    xDim: layer.xDim ?? null,
    yDim: layer.yDim ?? null,
    zDim: layer.zDim ?? null,
    intensityDim: layer.intensityDim ?? null,
    selections,
    slices: layer.lens.slices.map((slice) => ({
      dim: slice.dim,
      start: slice.start ?? null,
      stop: slice.stop ?? null,
      step: slice.step ?? null,
    })),
  });
}
