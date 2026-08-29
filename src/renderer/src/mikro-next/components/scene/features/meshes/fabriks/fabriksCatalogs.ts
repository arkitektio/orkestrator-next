import * as THREE from "three";
import type { FabriksManifest } from "./fabriksManifest";
import { rootLevel } from "./fabriksManifest";
import { toNumber, toNumberOrNull, toTriple } from "./rowValues";

/**
 * The two catalogs, and the world-space index the planner works from.
 *
 * They answer opposite questions and cannot be one file, because their rows
 * count different things and a Parquet file has one schema:
 *
 *  - `catalog/cells.parquet` — the SPATIAL index, one row per (level, cell).
 *    Read once at mount; from it alone the planner decides which cells to
 *    fetch at which level, without opening a single geometry file.
 *  - `catalog/objects.parquet` — the IDENTITY index, inverted, one row per
 *    object. It answers "where is segment 4711?" with a set of cell keys,
 *    making isolation a lookup rather than a scan. Loaded LAZILY: nothing on
 *    the first-render path needs it, and it carries the format's only
 *    `list<struct<>>` column.
 */

export const fabriksCellKey = (level: number, cell: number): string => `${level}:${cell}`;

/** One row of the cell catalog, in the collection's own voxel space. */
export type FabriksCellRow = {
  level: number;
  cell: number;
  vertexCount: number;
  indexCount: number;
  bboxMin: [number, number, number];
  bboxMax: [number, number, number];
  lodError: number;
  objectCount: number;
  /** Bit k set ⟺ the Morton child at octant k carries geometry. */
  childMask: number;
  /** Locator into the level's parts. Null means "fetch the part whole". */
  part: number | null;
  rowGroup: number | null;
  blobBytes: number | null;
};

/** A catalog row with the world-space quantities the planner actually uses. */
export type FabriksCellEntry = FabriksCellRow & {
  key: string;
  worldMin: [number, number, number];
  worldMax: [number, number, number];
  /** `lodError` scaled into world units; see `maxAxisScale`. */
  worldLodError: number;
};

export type FabriksCellIndex = {
  cells: readonly FabriksCellEntry[];
  byKey: ReadonlyMap<string, FabriksCellEntry>;
  /** The cells the descent starts from, coarsest level present. */
  roots: readonly FabriksCellEntry[];
  /** Levels carrying geometry, ascending. */
  levels: readonly number[];
};

export type FabriksObjectEntry = {
  objectId: number;
  /** Dense 0-based rank — the LUT index, and what the vertices carry. */
  ordinal: number;
  bboxMin: [number, number, number];
  bboxMax: [number, number, number];
  vertexCount: number;
  indexCount: number;
  /** Every cell holding a piece of this object. */
  cells: { level: number; cell: number }[];
};

/**
 * The largest length among the matrix's basis vectors.
 *
 * An LOD error is a scalar, but the voxel→world map is anisotropic, so there
 * is no single "the" scale. The max is the conservative choice: it can only
 * over-refine, never under-refine, and under-refining is the visible failure.
 */
export function maxAxisScale(matrix: THREE.Matrix4): number {
  const e = matrix.elements;
  const x = Math.hypot(e[0], e[1], e[2]);
  const y = Math.hypot(e[4], e[5], e[6]);
  const z = Math.hypot(e[8], e[9], e[10]);
  return Math.max(x, y, z);
}

const scratchBox = new THREE.Box3();

/**
 * Precompute world AABBs and world-space errors once per (collection, matrix).
 *
 * This is the slot where a voxel-space planner would have precomputed address
 * boxes. Doing the transform here rather than per plan is what lets the
 * planner use the real camera and the real frustum, and it costs one pass over
 * the catalog — repeated only when the layer matrix changes, which is a
 * registration edit, not a frame event.
 */
export function buildFabriksCellIndex(
  rows: readonly FabriksCellRow[],
  manifest: FabriksManifest,
  voxelToWorld: THREE.Matrix4,
): FabriksCellIndex {
  const errorScale = maxAxisScale(voxelToWorld);
  const cells = rows.map((row): FabriksCellEntry => {
    scratchBox.min.set(row.bboxMin[0], row.bboxMin[1], row.bboxMin[2]);
    scratchBox.max.set(row.bboxMax[0], row.bboxMax[1], row.bboxMax[2]);
    // applyMatrix4 on a Box3 transforms all eight corners and re-bounds them,
    // which is what a rotated or sheared placement needs.
    scratchBox.applyMatrix4(voxelToWorld);
    return {
      ...row,
      key: fabriksCellKey(row.level, row.cell),
      worldMin: [scratchBox.min.x, scratchBox.min.y, scratchBox.min.z],
      worldMax: [scratchBox.max.x, scratchBox.max.y, scratchBox.max.z],
      worldLodError: row.lodError * errorScale,
    };
  });

  const byKey = new Map(cells.map((entry) => [entry.key, entry]));
  const levels = [...new Set(cells.map((entry) => entry.level))].sort((a, b) => a - b);
  const root = rootLevel(manifest);
  let roots = cells.filter((entry) => entry.level === root);
  if (roots.length === 0 && cells.length > 0) {
    const coarsest = levels[levels.length - 1];
    console.warn(
      `[fabriks] no cells at root level ${root}; descending from level ${coarsest} instead.`,
    );
    roots = cells.filter((entry) => entry.level === coarsest);
  }

  return { cells, byKey, roots, levels };
}

/** Cells holding a piece of one object, for isolation and picking. */
export const cellsForObject = (
  object: FabriksObjectEntry,
  level?: number,
): { level: number; cell: number }[] =>
  level === undefined ? object.cells : object.cells.filter((ref) => ref.level === level);

/** The cell-catalog columns this reader needs. */
export const CELL_CATALOG_COLUMNS = [
  "level", "cell", "vertex_count", "index_count",
  "bbox_min_x", "bbox_min_y", "bbox_min_z",
  "bbox_max_x", "bbox_max_y", "bbox_max_z",
  "lod_error", "object_count", "child_mask",
  "part", "row_group", "blob_bytes",
];

/** The object-catalog columns this reader needs. */
export const OBJECT_CATALOG_COLUMNS = [
  "object_id", "ordinal",
  "bbox_min_x", "bbox_min_y", "bbox_min_z",
  "bbox_max_x", "bbox_max_y", "bbox_max_z",
  "vertex_count", "index_count", "cells",
];

/** One raw cell-catalog row → the typed voxel-space shape. */
export function parseCellRow(row: Record<string, unknown>): FabriksCellRow {
  return {
    level: toNumber(row.level, "level"),
    cell: toNumber(row.cell, "cell"),
    vertexCount: toNumber(row.vertex_count, "vertex_count"),
    indexCount: toNumber(row.index_count, "index_count"),
    bboxMin: toTriple(row, "bbox_min"),
    bboxMax: toTriple(row, "bbox_max"),
    lodError: toNumber(row.lod_error, "lod_error"),
    objectCount: toNumber(row.object_count, "object_count"),
    childMask: toNumber(row.child_mask, "child_mask"),
    // Nullable by schema: a built-but-unwritten collection has no locator, and
    // a hand-written manifest may omit it. Null means "read the part whole".
    part: toNumberOrNull(row.part),
    rowGroup: toNumberOrNull(row.row_group),
    blobBytes: toNumberOrNull(row.blob_bytes),
  };
}

/**
 * One raw object-catalog row → the typed shape.
 *
 * `cells` is the format's only `list<struct<>>`, and the struct's `cell` is an
 * INT64, so both the list and its members need unwrapping.
 */
export function parseObjectRow(row: Record<string, unknown>): FabriksObjectEntry {
  const raw = Array.isArray(row.cells) ? row.cells : [];
  return {
    objectId: toNumber(row.object_id, "object_id"),
    ordinal: toNumber(row.ordinal, "ordinal"),
    bboxMin: toTriple(row, "bbox_min"),
    bboxMax: toTriple(row, "bbox_max"),
    vertexCount: toNumber(row.vertex_count, "vertex_count"),
    indexCount: toNumber(row.index_count, "index_count"),
    cells: raw.map((entry) => {
      const ref = entry as Record<string, unknown>;
      return { level: toNumber(ref.level, "cells[].level"), cell: toNumber(ref.cell, "cells[].cell") };
    }),
  };
}
