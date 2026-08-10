import { InhabitedLike, isReferenceFrame } from "./residents";

/**
 * How big the graph's nodes render.
 *
 * ELK places boxes, so it needs the height each node will ACTUALLY render at.
 * A stale constant here does not look like a bug in the numbers, it looks like
 * overlapping cards.
 *
 * Kept in its own module, free of React and @xyflow/react, so the geometry the
 * layout depends on can be unit-tested without mounting a flow.
 */

/** Wide enough for a coordinate system's name and its axis chips. */
export const SYSTEM_WIDTH = 250;

/** Header, vertical padding, one axis row and the hairline above it. */
export const SYSTEM_BASE_HEIGHT = 58;

/** The "reference frame — nothing lives here" pill an empty space carries. */
export const FRAME_PILL_HEIGHT = 20;

/** One wrapped row of axis chips beyond the first. */
export const AXIS_ROW_HEIGHT = 16;

/** Axis chips are short; four fit across the node's width. */
export const AXES_PER_ROW = 4;

/** A resident node is a single-line pill. */
export const RESIDENT_NODE_HEIGHT = 28;

export const systemNodeSize = (
  system: InhabitedLike & { axes: readonly unknown[] },
): { width: number; height: number } => {
  const axisRows = Math.ceil(system.axes.length / AXES_PER_ROW);
  return {
    width: SYSTEM_WIDTH,
    height:
      SYSTEM_BASE_HEIGHT +
      // Residents hang off the node now; only a frame carries a pill, because
      // it has nothing to hang.
      (isReferenceFrame(system) ? FRAME_PILL_HEIGHT : 0) +
      Math.max(0, axisRows - 1) * AXIS_ROW_HEIGHT,
  };
};
