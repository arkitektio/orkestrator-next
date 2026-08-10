/**
 * Telling apart several maps between the same two spaces.
 *
 * When transformations were nodes, two maps between the same pair of systems
 * were two visibly separate boxes. As edges they share both endpoints, so they
 * route along the same path and their labels land on top of each other — one
 * map hiding another is worse than a crowded canvas. So each edge learns its
 * place among its siblings and fans out from the shared centre line.
 *
 * The pair is UNDIRECTED: a calibration pointing into a space and a
 * registration pointing out of it overlap just as completely as two edges in
 * the same direction do.
 */

/** Vertical separation between two maps joining the same pair of spaces. */
export const PARALLEL_EDGE_SPACING = 34;

export type Endpoints = { source: string; target: string };

const pairKey = ({ source, target }: Endpoints): string =>
  [source, target].sort().join("::");

/**
 * For each edge, its index among the edges sharing its pair and how many that
 * is — in input order, so the fan is stable across re-renders.
 */
export const parallelIndices = (
  edges: readonly Endpoints[],
): { index: number; count: number }[] => {
  const counts = new Map<string, number>();
  for (const edge of edges) {
    const key = pairKey(edge);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const seen = new Map<string, number>();
  return edges.map((edge) => {
    const key = pairKey(edge);
    const index = seen.get(key) ?? 0;
    seen.set(key, index + 1);
    return { index, count: counts.get(key) ?? 1 };
  });
};

/**
 * How far off the centre line this edge routes. A lone edge gets zero — the
 * common case must look exactly as it did — and siblings spread symmetrically
 * around it.
 */
export const parallelOffset = (index: number, count: number): number =>
  count <= 1 ? 0 : (index - (count - 1) / 2) * PARALLEL_EDGE_SPACING;
