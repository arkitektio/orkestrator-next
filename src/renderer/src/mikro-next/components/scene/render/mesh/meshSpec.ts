import { decodeMorton3 } from "./mortonCell";

/**
 * Parsing of the MeshCollection's `grid` / `encoding` JSON payloads and the
 * cell → voxel-space math derived from them.
 *
 * The spatial contract of a collection is exactly two things:
 *  - `coordinateSystem`: the label array's voxel index space the vertices
 *    live in (the transform graph does the rest, by reference), and
 *  - `grid`: the octree over that voxel space. `cellSize` is IN VOXELS
 *    ([x, y, z]), level 0 is the finest level, and a level-L cell spans
 *    `cellSize · 2^L` voxels. Vertices are quantized PER CELL, so the
 *    dequantization box of any fragment is derivable from its cell address
 *    alone — no per-row origin/scale columns are required.
 */

export type MeshGridSpec = {
  /** Cell extents in voxels of the collection's coordinate system, [x, y, z]. */
  cellSize: [number, number, number];
  /** Number of octree levels; 0 = finest. */
  levels: number;
  sortKey: "MORTON";
};

export type MeshEncodingSpec = {
  positions: string;
  normals: string | null;
  indices: string;
  /** Per-buffer codec: "MESHOPT" or "NONE" (raw little-endian arrays). */
  codec: string;
  /**
   * Container compression. "ZSTD" refers to the Parquet page compression,
   * which DuckDB decompresses transparently — the client never sees it.
   */
  compression: string | null;
};

const isNumberTriple = (value: unknown): value is [number, number, number] =>
  Array.isArray(value) && value.length === 3 && value.every((v) => typeof v === "number" && v > 0);

export function parseMeshGrid(json: unknown): MeshGridSpec | null {
  if (!json || typeof json !== "object") return null;
  const raw = json as { cellSize?: unknown; levels?: unknown; sortKey?: unknown };
  if (!isNumberTriple(raw.cellSize)) return null;
  const levels = typeof raw.levels === "number" && raw.levels >= 1 ? Math.floor(raw.levels) : 1;
  if (raw.sortKey !== undefined && raw.sortKey !== "MORTON") return null;
  return { cellSize: raw.cellSize, levels, sortKey: "MORTON" };
}

export function parseMeshEncoding(json: unknown): MeshEncodingSpec {
  const raw = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;
  return {
    positions: typeof raw.positions === "string" ? raw.positions : "UINT16_QUANTIZED_PER_CELL",
    normals: typeof raw.normals === "string" ? raw.normals : null,
    indices: typeof raw.indices === "string" ? raw.indices : "UINT16",
    codec: typeof raw.codec === "string" ? raw.codec : "NONE",
    compression: typeof raw.compression === "string" ? raw.compression : null,
  };
}

export type VoxelBox = { min: [number, number, number]; max: [number, number, number] };

/** Voxel-space box of one octree cell (half-open, [x, y, z]). */
export function cellVoxelBox(grid: MeshGridSpec, level: number, cell: number): VoxelBox {
  const coords = decodeMorton3(cell);
  const factor = 2 ** level;
  const min: [number, number, number] = [0, 0, 0];
  const max: [number, number, number] = [0, 0, 0];
  for (const axis of [0, 1, 2] as const) {
    const extent = grid.cellSize[axis] * factor;
    min[axis] = coords[axis] * extent;
    max[axis] = min[axis] + extent;
  }
  return { min, max };
}
