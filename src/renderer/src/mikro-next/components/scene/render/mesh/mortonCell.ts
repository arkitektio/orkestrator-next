/**
 * Morton (Z-order) cell addressing for mesh-collection octrees.
 *
 * CONTRACT (client side of the MeshCollection spec): a cell's `cell` column is
 * the Morton interleave of its (x, y, z) cell-grid coordinates ON ITS OWN
 * LEVEL's grid, with x in the least-significant bit position:
 * bit 0 = x₀, bit 1 = y₀, bit 2 = z₀, bit 3 = x₁, …
 *
 * Implemented with arithmetic (not 32-bit bitwise ops) so codes stay exact up
 * to 17 bits per axis — 2^17 cells/axis ≈ 8.6M voxels/axis at cellSize 64,
 * far beyond any real label grid, while 3×17 = 51 bits still fits a double
 * exactly (DuckDB-wasm delivers BIGINT columns as doubles here).
 */

export const MAX_MORTON_BITS_PER_AXIS = 17;

export type CellCoords = readonly [number, number, number];

export function encodeMorton3(x: number, y: number, z: number): number {
  let code = 0;
  let shift = 1;
  let cx = x;
  let cy = y;
  let cz = z;
  for (let bit = 0; bit < MAX_MORTON_BITS_PER_AXIS; bit++) {
    code += (cx % 2) * shift;
    shift *= 2;
    code += (cy % 2) * shift;
    shift *= 2;
    code += (cz % 2) * shift;
    shift *= 2;
    cx = Math.floor(cx / 2);
    cy = Math.floor(cy / 2);
    cz = Math.floor(cz / 2);
  }
  return code;
}

export function decodeMorton3(code: number): [number, number, number] {
  let x = 0;
  let y = 0;
  let z = 0;
  let rest = code;
  let axisShift = 1;
  for (let bit = 0; bit < MAX_MORTON_BITS_PER_AXIS && rest > 0; bit++) {
    x += (rest % 2) * axisShift;
    rest = Math.floor(rest / 2);
    y += (rest % 2) * axisShift;
    rest = Math.floor(rest / 2);
    z += (rest % 2) * axisShift;
    rest = Math.floor(rest / 2);
    axisShift *= 2;
  }
  return [x, y, z];
}

/** Stable string key of one octree node: `level:morton`. */
export const meshCellKey = (level: number, cell: number): string => `${level}:${cell}`;
