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
  phasorDim?: string | null;
  /**
   * The layer's phasor sources (tree order). Only what the DATA layer needs of
   * them: the harmonic the reduction runs at, and the channel whose photons it
   * counts. Everything else about a phasor node (colormap, mode, cursors) is a
   * shader uniform and never reaches the bricks.
   */
  phasors?: readonly { harmonic: number; intensityIndex: number }[];
};

export type AxisIndices = {
  xPos: number;
  yPos: number;
  /** -1 when the layer has no z dimension. */
  zPos: number;
  intensityPos: number;
  /**
   * -1 unless the layer's render graph has a phasor node. Unlike every other
   * non-spatial axis, this one is neither rendered nor collapsed to a single
   * index: the repack REDUCES it (all bins → g/s/intensity slabs), so it must
   * be fetched whole.
   */
  phasorPos: number;
};

export function resolveAxisIndices(dims: string[], layer: LayerAxisDims): AxisIndices {
  const xPos = dims.indexOf(layer.xDim ?? "");
  const yPos = dims.indexOf(layer.yDim ?? "");
  const zPos = layer.zDim ? dims.indexOf(layer.zDim) : -1;
  let intensityPos = dims.indexOf(layer.intensityDim ?? "");
  let phasorPos = layer.phasorDim ? dims.indexOf(layer.phasorDim) : -1;
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
  // Same guard for the phasor axis: reducing a SPATIAL axis would consume the
  // geometry the brick is addressed by. It also may not double as the channel
  // axis — the phasor is taken over one channel's photons, not across channels.
  if (
    phasorPos !== -1 &&
    (phasorPos === xPos ||
      phasorPos === yPos ||
      phasorPos === zPos ||
      phasorPos === intensityPos)
  ) {
    phasorPos = -1;
  }
  return { xPos, yPos, zPos, intensityPos, phasorPos };
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

/**
 * The axis a phasor node actually reduces. The node's `phasorDim` wins only
 * when it does not name a spatial, time or channel render axis — the same
 * degradation as `resolveIntensityDim`, for the same reason: axis TYPES are
 * authoritative (`renderAxes.phasor` is derived from them, and is null unless
 * the lens HAS a MICROTIME/SPECTRUM axis), and a node that contradicts them is
 * a data bug we render around rather than exploding on.
 *
 * Returns null when there is no phasor node (`nodePhasorDim` undefined) — the
 * layer then has no reduced axis at all, and nothing downstream changes.
 */
export const resolvePhasorDim = (
  nodePhasorDim: string | null | undefined,
  renderAxes:
    | {
        x?: string | null;
        y?: string | null;
        z?: string | null;
        t?: string | null;
        intensity?: string | null;
        phasor?: string | null;
      }
    | null
    | undefined,
): string | null => {
  if (!nodePhasorDim) return null;
  if (
    nodePhasorDim !== renderAxes?.x &&
    nodePhasorDim !== renderAxes?.y &&
    nodePhasorDim !== renderAxes?.z &&
    nodePhasorDim !== renderAxes?.t &&
    nodePhasorDim !== renderAxes?.intensity
  ) {
    return nodePhasorDim;
  }
  return renderAxes?.phasor ?? null;
};

/** True when x, y and z axes were all resolved (the usual "bail if -1" guard). */
export const hasValidSpatialAxes = (axes: Pick<AxisIndices, "xPos" | "yPos" | "zPos">): boolean =>
  axes.xPos !== -1 && axes.yPos !== -1 && axes.zPos !== -1;
