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

/** True when x, y and z axes were all resolved (the usual "bail if -1" guard). */
export const hasValidSpatialAxes = (axes: Pick<AxisIndices, "xPos" | "yPos" | "zPos">): boolean =>
  axes.xPos !== -1 && axes.yPos !== -1 && axes.zPos !== -1;
