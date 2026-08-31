import { decodeMorton3 } from "@/mikro-next/components/scene/platform/parquet/mortonCell";
import type { KonnektionGrid } from "./konnektionManifest";

/**
 * The cell → box arithmetic, and the octree descent.
 *
 * The same arithmetic `fabriksGrid.ts` does, restated over `KonnektionGrid`
 * because konnektion's `octree.py` restates it over fabriks's for the same
 * reason: addressing is the one part of a level-of-detail format that has
 * nothing to do with what is being addressed, and neither package depends on
 * the other. The Morton primitives themselves ARE shared, in
 * `platform/parquet/mortonCell.ts`.
 *
 * Level 0 is the finest. A level-L cell spans `cellSize · 2^L` voxels per
 * component, so each level has one cell for every eight below it, and a node
 * lands in the cell whose index triple is `floor(p / (cellSize · 2^L))`.
 *
 * The GRID box (address box) is what makes per-cell quantization invertible
 * from the row alone: a decoder holding `level`, `cell` and `cellSize` has the
 * box and needs nothing else. **This is also the box a GHOST is inverted
 * against — its OWNER's box, not the box of the cell that stores it.** See
 * `konnektionDecode.ts`.
 *
 * It is NOT the box to cull against: the cell catalog carries the exact
 * geometry bounds, much tighter for a cell holding one twig in a corner.
 */

export type VoxelBox = { min: [number, number, number]; max: [number, number, number] };

/** How many voxels a cell spans per component at `level`. */
export const cellExtent = (
  grid: KonnektionGrid,
  level: number,
): [number, number, number] => {
  const scale = 2 ** level;
  return [grid.cellSize[0] * scale, grid.cellSize[1] * scale, grid.cellSize[2] * scale];
};

/**
 * The GRID box of a cell — the dequantization frame, half-open.
 *
 * Components are slots 0/1/2 in the node-position order, not named axes (see
 * `KonnektionGrid.cellSize`).
 */
export function cellGridBox(grid: KonnektionGrid, level: number, cell: number): VoxelBox {
  const coords = decodeMorton3(cell);
  const extent = cellExtent(grid, level);
  const min: [number, number, number] = [
    coords[0] * extent[0],
    coords[1] * extent[1],
    coords[2] * extent[2],
  ];
  return { min, max: [min[0] + extent[0], min[1] + extent[1], min[2] + extent[2]] };
}

/**
 * The Morton children of a cell, one level finer.
 *
 * With component 0 in the least-significant bit, the eight children of code
 * `c` are exactly `8c … 8c+7`, and the octant index is `dx | dy<<1 | dz<<2`.
 */
export const mortonChildren = (cell: number): number[] =>
  Array.from({ length: 8 }, (_, octant) => cell * 8 + octant);

/** The Morton parent of a cell, one level coarser. */
export const mortonParent = (cell: number): number => Math.floor(cell / 8);

/**
 * The children a cell's `child_mask` actually names.
 *
 * Bit `k` set means the child at octant `k` carries geometry. An empty mask
 * means this cell is a leaf of the sparse pyramid and covers its own region —
 * NOT that the region is empty.
 */
export function maskedChildren(cell: number, childMask: number): number[] {
  if (childMask === 0) return [];
  const children: number[] = [];
  for (let octant = 0; octant < 8; octant++) {
    if (childMask & (1 << octant)) children.push(cell * 8 + octant);
  }
  return children;
}
