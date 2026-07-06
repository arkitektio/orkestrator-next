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
  return {
    xPos: dims.indexOf(layer.xDim ?? ""),
    yPos: dims.indexOf(layer.yDim ?? ""),
    zPos: layer.zDim ? dims.indexOf(layer.zDim) : -1,
    intensityPos: dims.indexOf(layer.intensityDim ?? ""),
  };
}

/** True when x, y and z axes were all resolved (the usual "bail if -1" guard). */
export const hasValidSpatialAxes = (axes: Pick<AxisIndices, "xPos" | "yPos" | "zPos">): boolean =>
  axes.xPos !== -1 && axes.yPos !== -1 && axes.zPos !== -1;
