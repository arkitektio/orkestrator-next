import { InhabitedLike, isReferenceFrame, visibleResidents } from "./residents";

/**
 * How big a coordinate system node renders.
 *
 * ELK places boxes, so it needs the height the node will ACTUALLY render at —
 * and the node grows with its content: a list of residents on top, a wrapping
 * row of axis chips below. A stale constant here does not look like a bug in
 * the numbers, it looks like overlapping cards.
 *
 * Kept in its own module, free of React and @xyflow/react, so the geometry the
 * layout depends on can be unit-tested without mounting a flow.
 */

/** Wide enough for a dataset name next to its icon without truncating. */
export const SYSTEM_WIDTH = 250;

/** Header, vertical padding, one axis row and the hairline above it. */
export const SYSTEM_BASE_HEIGHT = 58;

/** One full-width resident chip (or the reference frame pill). */
export const RESIDENT_ROW_HEIGHT = 20;

/** One wrapped row of axis chips beyond the first. */
export const AXIS_ROW_HEIGHT = 16;

/** Axis chips are short; four fit across the node's width. */
export const AXES_PER_ROW = 4;

/**
 * Residents past this are collapsed into a single "+N more" row. A stage frame
 * can hold a hundred tiles and a node is not a list view — but three names plus
 * a count still says far more than "100 residents" alone.
 */
export const MAX_VISIBLE_RESIDENTS = 3;

/**
 * How many resident rows the node draws. A reference frame draws exactly one —
 * the pill that says nothing lives here — because an empty band would read as a
 * missing answer rather than as the answer.
 */
export const residentRowCount = (system: InhabitedLike): number => {
  if (isReferenceFrame(system)) return 1;
  const { shown, hidden } = visibleResidents(system, MAX_VISIBLE_RESIDENTS);
  return shown.length + (hidden.length > 0 ? 1 : 0);
};

export const systemNodeSize = (
  system: InhabitedLike & { axes: readonly unknown[] },
): { width: number; height: number } => {
  const axisRows = Math.ceil(system.axes.length / AXES_PER_ROW);
  return {
    width: SYSTEM_WIDTH,
    height:
      SYSTEM_BASE_HEIGHT +
      residentRowCount(system) * RESIDENT_ROW_HEIGHT +
      Math.max(0, axisRows - 1) * AXIS_ROW_HEIGHT,
  };
};
