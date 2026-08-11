/**
 * Every node in the coordinate graph occupies the same square footprint, and
 * draws a circle inside it.
 *
 * The FOOTPRINT is uniform because the layout is a tension simulation and
 * nothing else: a stress layout places nodes so that drawn distance matches
 * graph distance, and it does not consider node sizes at all — boxes of
 * different sizes overlap, measurably. One footprint means one radius, so one
 * `desiredEdgeLength` comfortably larger than it keeps every node clear of every
 * other, and the centre of anything is its position plus half a footprint.
 *
 * The DRAWN circle is what the eye reads, and it is not uniform: a coordinate
 * system fills the footprint, a resident is a small disc in the middle of one.
 * That is the whole visual hierarchy of the graph — spaces are places, and the
 * data living in them is smaller than the place it lives in. Because the circle
 * is centred in a footprint that never changes, the layout and the edge geometry
 * are untouched by it.
 *
 * Circles because there is no direction here either. A box has a left edge and
 * a right edge and implies a flow across them; a circle attaches equally well
 * on any side, which is what a graph with no orientation actually needs.
 */
export const NODE_DIAMETER = 112;

/**
 * A resident's disc — half the footprint, so it reads as a different class of
 * thing from the space around it at any zoom, before colour or icon is legible.
 * Too small for a name inside, which is why `CircleNode` puts a compact node's
 * name on a plate under it instead.
 */
export const RESIDENT_DIAMETER = 56;

export const NODE_SIZE = {
  width: NODE_DIAMETER,
  height: NODE_DIAMETER,
} as const;

/**
 * The rest length of every spring. Comfortably more than a footprint, so nodes
 * settle clear of each other rather than being pushed apart afterwards.
 */
export const DESIRED_EDGE_LENGTH = 200;
