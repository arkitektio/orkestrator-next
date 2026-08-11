/**
 * Every node in the coordinate graph is the same circle.
 *
 * Uniform because the layout is a tension simulation and nothing else: a
 * stress layout places nodes so that drawn distance matches graph distance, and
 * it does not consider node sizes at all — boxes of different sizes overlap,
 * measurably. Equal circles have one radius, so one `desiredEdgeLength`
 * comfortably larger than it keeps every node clear of every other.
 *
 * Circles because there is no direction here either. A box has a left edge and
 * a right edge and implies a flow across them; a circle attaches equally well
 * on any side, which is what a graph with no orientation actually needs.
 */
export const NODE_DIAMETER = 112;

export const NODE_SIZE = {
  width: NODE_DIAMETER,
  height: NODE_DIAMETER,
} as const;

/**
 * The rest length of every spring. Comfortably more than a diameter, so nodes
 * settle clear of each other rather than being pushed apart afterwards.
 */
export const DESIRED_EDGE_LENGTH = 200;
