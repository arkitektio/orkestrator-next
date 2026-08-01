/**
 * How the layer list lays itself out for the box it was given. The panel is
 * hosted both in the narrow in-viewport column and in a page rail the user can
 * drag between 10% and 80% of the window, so "how many columns" and "can the
 * cards afford to start unfolded" are answers to the container, not to the
 * viewport — see `LayerControlPanel`.
 *
 * Pure and colocated with its test because it is a judgement call with edges
 * (no layers, unmeasured box) that are easier to pin down here than in a card.
 */

/** Where the grid gains a column. Mirrors the `@2xl/layers` variant. */
export const TWO_COLUMN_PX = 672;
/** Mirrors the `@5xl/layers` variant. */
export const THREE_COLUMN_PX = 1024;
/**
 * Rough height of one card with its render-graph editor unfolded. An estimate
 * on purpose: a card that needs more simply scrolls, and the alternative —
 * measuring every card to decide whether to open it — would have the panel
 * relayout itself in a loop.
 */
export const EXPANDED_CARD_PX = 260;

export type PanelBox = { width: number; height: number };

/** Column count the CSS grid produces at this panel width. */
export const columnsAt = (width: number): number =>
  width >= THREE_COLUMN_PX ? 3 : width >= TWO_COLUMN_PX ? 2 : 1;

/**
 * Whether every card can start unfolded: the tallest column's worth of expanded
 * cards has to fit the panel's height. A wide rail showing three layers has no
 * reason to make you click each one open; a short one stacked with layers does.
 *
 * An unmeasured box (`{0, 0}`, before the first ResizeObserver tick) is treated
 * as no space, so the first paint is collapsed rather than briefly unfolding
 * everything and snapping shut.
 */
export const fitsExpanded = (box: PanelBox, layerCount: number): boolean => {
  if (box.height <= 0 || box.width <= 0) return false;
  if (layerCount === 0) return true;
  const rowsPerColumn = Math.ceil(layerCount / columnsAt(box.width));
  return rowsPerColumn * EXPANDED_CARD_PX <= box.height;
};
