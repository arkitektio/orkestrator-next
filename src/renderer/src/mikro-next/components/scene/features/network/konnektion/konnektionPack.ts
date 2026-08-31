import type { KonnektionCellIndex } from "./konnektionCatalogs";
import type { DecodedNetworkCell } from "./konnektionDecode";

/**
 * CPU packing for the storage-buffer renderer: decoded cells → the three flat
 * arrays the GPU pulls from. Pure, three-free, and the only place the buffer
 * layout is known — which is what makes it unit-testable the way
 * `pointsCompute.ts` is (the TSL graphs themselves need a GPU to say anything).
 *
 * ## The layout
 *
 *  - `positions`: one vec3 per node slot, each cell's OWNED nodes then its
 *    ghosts, cells concatenated in plan order. Stored ONCE — edges reference
 *    nodes by index, which is the whole point: the attribute path duplicated
 *    every shared endpoint into per-edge attributes.
 *  - `aux`: one vec4 per node slot — (radius, ordinal, glyphScale, 0).
 *    Radius 0 means "the collection carries none here": the shader falls back
 *    to the lineWidth uniform, which is what makes a width change a uniform
 *    write rather than a re-pack. `glyphScale` is 0 for a ghost, so its
 *    sphere degenerates to a point instead of double-drawing the node its
 *    owner already glyphs.
 *  - `edges`: uint32 pairs indexing into the packed node array. A cell's own
 *    edge indices are LOCAL to its concatenated (owned + ghost) span, and its
 *    ghosts sit at the tail of that same span, so one uniform `+ nodeOffset`
 *    rebase is correct for owned and ghost endpoints alike.
 */

export type NetworkCapacity = { nodes: number; edges: number };

/**
 * How large the storage buffers must be, from the catalog and the budgets in
 * force when the bundle is created.
 *
 * The planner draws ONE level, capped by `capToBudgets` — but that cap keeps
 * the first cell unconditionally even when it alone exceeds a budget (a cell
 * is the atom of the format). So capacity is the budget-clamped worst level,
 * raised to the largest single cell: with that, every plan the planner can
 * emit fits by construction.
 */
export function networkCapacityFor(
  index: KonnektionCellIndex,
  budgets: { maxNodes: number; maxEdges: number },
): NetworkCapacity {
  let worstLevelNodes = 0;
  let worstLevelEdges = 0;
  for (const cells of index.byLevel.values()) {
    let nodes = 0;
    let edges = 0;
    for (const cell of cells) {
      nodes += cell.nodeCount + cell.ghostCount;
      edges += cell.edgeCount;
    }
    worstLevelNodes = Math.max(worstLevelNodes, nodes);
    worstLevelEdges = Math.max(worstLevelEdges, edges);
  }

  let largestCellNodes = 0;
  let largestCellEdges = 0;
  for (const cell of index.cells) {
    largestCellNodes = Math.max(largestCellNodes, cell.nodeCount + cell.ghostCount);
    largestCellEdges = Math.max(largestCellEdges, cell.edgeCount);
  }

  return {
    nodes: Math.max(Math.min(budgets.maxNodes, worstLevelNodes), largestCellNodes),
    edges: Math.max(Math.min(budgets.maxEdges, worstLevelEdges), largestCellEdges),
  };
}

export type PackTarget = {
  /** `capacity.nodes * 3` floats. */
  positions: Float32Array;
  /** `capacity.nodes * 4` floats — (radius, ordinal, glyphScale, 0) per slot. */
  aux: Float32Array;
  /** `capacity.edges * 2` uint32 indices into the packed node slots. */
  edges: Uint32Array;
};

export type PackResult = {
  /** Packed node slots, ghosts included. */
  nodes: number;
  /** Packed edges. */
  edges: number;
  /** Cells packed before any clamp (equals the input length normally). */
  cells: number;
  /** True when a cell did not fit — unreachable when the target was sized by
   *  `networkCapacityFor` against the budgets the plan ran under. */
  clamped: boolean;
};

/**
 * Pack decoded cells into the target arrays. Whole-cell granularity, matching
 * the planner's own truncation semantics: a cell is packed entirely or not at
 * all, so an edge can never dangle into an unpacked span.
 */
export function packNetworkCells(
  cells: readonly DecodedNetworkCell[],
  target: PackTarget,
): PackResult {
  const capNodes = Math.floor(target.positions.length / 3);
  const capEdges = Math.floor(target.edges.length / 2);

  let nodeOffset = 0;
  let edgeOffset = 0;
  let packed = 0;
  let clamped = false;

  for (const cell of cells) {
    const total = cell.nodeCount + cell.ghostCount;
    if (nodeOffset + total > capNodes || edgeOffset + cell.edgeCount > capEdges) {
      clamped = true;
      break;
    }

    target.positions.set(cell.positions, nodeOffset * 3);

    for (let i = 0; i < total; i++) {
      const slot = (nodeOffset + i) * 4;
      target.aux[slot] = cell.radii ? cell.radii[i] : 0;
      target.aux[slot + 1] = cell.nodeOrdinals[i];
      target.aux[slot + 2] = i < cell.nodeCount ? 1 : 0;
      target.aux[slot + 3] = 0;
    }

    const edgeBase = edgeOffset * 2;
    for (let j = 0; j < cell.edgeCount * 2; j++) {
      target.edges[edgeBase + j] = cell.edges[j] + nodeOffset;
    }

    nodeOffset += total;
    edgeOffset += cell.edgeCount;
    packed++;
  }

  return { nodes: nodeOffset, edges: edgeOffset, cells: packed, clamped };
}
