/**
 * Canonical mapping from a layer's named dimensions (xDim/yDim/zDim/intensityDim)
 * to their positional indices within an array's dim list. Replaces the
 * hand-rolled `dims.indexOf(layer.xDim ?? "")` blocks that were duplicated
 * across the plane, volume, probe and visibility code paths.
 */
export type LayerAxisDims = {
  xDim?: string | null;
  yDim?: string | null;
  zDim?: string | null;
  intensityDim?: string | null;
};

export type AxisIndices = {
  xPos: number;
  yPos: number;
  /** -1 when the layer has no z dimension. */
  zPos: number;
  intensityPos: number;
};

export function resolveAxisIndices(dims: string[], layer: LayerAxisDims): AxisIndices {
  const xPos = dims.indexOf(layer.xDim ?? "");
  const yPos = dims.indexOf(layer.yDim ?? "");
  const zPos = layer.zDim ? dims.indexOf(layer.zDim) : -1;
  let intensityPos = dims.indexOf(layer.intensityDim ?? "");
  // A dim cannot be both spatial and the channel axis. Misconfigured layers
  // (seen live: intensityDim === zDim === "z" on a single-channel 256³ stack)
  // otherwise explode into phantom channels — min(extent, 16) of them — which
  // multiply every brick slot, fetch and atlas 16×. Degrade to "no channel
  // dim" instead.
  if (
    intensityPos !== -1 &&
    (intensityPos === xPos || intensityPos === yPos || intensityPos === zPos)
  ) {
    intensityPos = -1;
  }
  return { xPos, yPos, zPos, intensityPos };
}

/**
 * The intensity (channel) dim actually used for rendering. The render
 * graph's `ChannelSourceNode.intensityDim` wins ONLY when it does not name a
 * spatial or time render axis — live data has shipped `intensityDim: "t"`
 * on a time-lapse, which would stack every timepoint as a channel slab
 * (min(16, extent) phantom channels, the P16 failure shape) AND hide the
 * t-slider (t would count as "rendered"). Axis TYPES are authoritative
 * (`renderAxes` is derived from them); an intensity mapping that contradicts
 * them is a data bug we degrade around, like the collision guard above.
 */
export const resolveIntensityDim = (
  graphIntensityDim: string | null | undefined,
  renderAxes:
    | { x?: string | null; y?: string | null; z?: string | null; t?: string | null; intensity?: string | null }
    | null
    | undefined,
): string | null => {
  if (
    graphIntensityDim &&
    graphIntensityDim !== renderAxes?.x &&
    graphIntensityDim !== renderAxes?.y &&
    graphIntensityDim !== renderAxes?.z &&
    graphIntensityDim !== renderAxes?.t
  ) {
    return graphIntensityDim;
  }
  return renderAxes?.intensity ?? null;
};

/** True when x, y and z axes were all resolved (the usual "bail if -1" guard). */
export const hasValidSpatialAxes = (axes: Pick<AxisIndices, "xPos" | "yPos" | "zPos">): boolean =>
  axes.xPos !== -1 && axes.yPos !== -1 && axes.zPos !== -1;
