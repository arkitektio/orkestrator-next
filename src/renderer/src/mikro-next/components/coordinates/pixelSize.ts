/**
 * Reading a calibration's pixel size off the edge that defines it.
 *
 * A PHYSICAL system is reached from its dataset's INTRINSIC grid by exactly one
 * edge, and that edge's parameters ARE the pixel size. Displaying them means
 * pairing three things that are each ordered differently, which is the same
 * trap the schema warns about for authoring:
 *
 *   - `scale[i]` is ordered by the edge's `inputAxes` (the INTRINSIC axis names)
 *   - `outputAxes[i]` is the PHYSICAL axis that entry lands on
 *   - the UNIT lives on the physical system's axis, i.e. on `outputAxes[i]`
 *
 * So the label comes from the output axis and the number from the input-ordered
 * array, paired by POSITION through the edge — never by looking an input axis
 * name up among the output system's axes, which silently finds nothing the
 * moment a calibration renames an axis (and finds the WRONG axis if a rename is
 * a swap).
 */

export type PixelSizeEdge = {
  inputAxes?: readonly string[] | null;
  outputAxes?: readonly string[] | null;
  scale?: readonly number[] | null;
  affine?: readonly (readonly number[])[] | null;
} | null;

export type UnitAxis = { name: string; unit?: string | null };

export type PixelSizeEntry = {
  /** The physical axis this size is expressed on. */
  axis: string;
  value: number;
  unit: string | null;
};

/**
 * The per-axis pixel size an edge encodes, or [] if it encodes none.
 *
 * Handles the two shapes a calibration actually takes: a SCALE (its `scale`
 * array) and an AFFINE (the diagonal of its M x (N+1) matrix — rows are output
 * axes, columns input axes, so entry i is `affine[i][i]`). Any other kind — a
 * displacement field, a rotation — has no per-axis "pixel size" to state, and
 * returning [] lets the caller say so rather than invent one.
 */
export const pixelSizeEntries = (
  edge: PixelSizeEdge,
  outputSystemAxes: readonly UnitAxis[],
): PixelSizeEntry[] => {
  if (!edge) return [];
  const inputAxes = edge.inputAxes ?? [];
  const outputAxes = edge.outputAxes ?? [];

  const unitOf = (axisName: string): string | null =>
    outputSystemAxes.find((axis) => axis.name === axisName)?.unit ?? null;

  const valueAt = (index: number): number | undefined => {
    if (edge.scale) return edge.scale[index];
    // Rows are output axes, columns input axes; index i is the same axis
    // pairing on both, so the scale factor is the diagonal entry.
    if (edge.affine) return edge.affine[index]?.[index];
    return undefined;
  };

  return inputAxes.flatMap((_, index) => {
    const value = valueAt(index);
    if (value === undefined) return [];
    // The physical axis the entry lands on. Fall back to the input name only
    // when the edge does not name its outputs (an older payload that predates
    // self-description) — never look the input name up among output axes.
    const axis = outputAxes[index] ?? inputAxes[index];
    if (axis === undefined) return [];
    return [{ axis, value, unit: unitOf(axis) }];
  });
};

/** "x 0.325 µm" — one entry, formatted. */
export const formatPixelSize = (entry: PixelSizeEntry): string =>
  `${entry.axis} ${entry.value}${entry.unit ? ` ${entry.unit}` : ""}`;
