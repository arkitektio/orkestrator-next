import * as THREE from "three";
import { meshCellKey } from "./mortonCell";
import { cellVoxelBox, type MeshGridSpec, type VoxelBox } from "./meshSpec";

/**
 * Pure cell selection for a mesh collection — the mesh analog of
 * `planLayerNodes`:
 *
 *  - PER-CELL LOD: each coarsest-level root region picks its own level from
 *    ITS OWN screen-space voxel footprint and descends to it via Morton
 *    arithmetic. A depth-spanning collection renders fine near the camera
 *    and coarse in the distance within one plan (mixed levels).
 *  - HYSTERESIS: a root sticks to its previous level until the footprint
 *    clears the level threshold by a margin, so a camera settling near a
 *    boundary doesn't flip the region between levels on consecutive plans.
 *  - Culling happens in the collection's OWN voxel space (the world frustum
 *    is pulled through the inverse layer matrix by the caller), against
 *    voxel boxes PRECOMPUTED once per index (`buildMeshCellIndex`) — no
 *    Morton decoding on the plan path.
 *  - Survivors are ordered closest-first and capped by a triangle budget, so
 *    budget exhaustion degrades distant regions first.
 */

export type MeshCellRecord = {
  level: number;
  cell: number;
  vertexCount: number;
  indexCount: number;
};

export type IndexedMeshCell = MeshCellRecord & {
  key: string;
  box: VoxelBox;
};

export type MeshCellIndex = {
  /** All cells, with cached keys/boxes. */
  cells: readonly IndexedMeshCell[];
  /** Fast lookup for Morton descent, keyed by `meshCellKey(level, cell)`. */
  byKey: ReadonlyMap<string, IndexedMeshCell>;
  /** Levels that actually carry geometry, ascending (sparse pyramids skip). */
  levels: readonly number[];
};

/** Precompute boxes/keys once per collection version (index load time). */
export function buildMeshCellIndex(
  cells: readonly MeshCellRecord[],
  grid: MeshGridSpec,
): MeshCellIndex {
  const indexed = cells.map((cell) => ({
    ...cell,
    key: meshCellKey(cell.level, cell.cell),
    box: cellVoxelBox(grid, cell.level, cell.cell),
  }));
  return {
    cells: indexed,
    byKey: new Map(indexed.map((cell) => [cell.key, cell])),
    levels: [...new Set(indexed.map((cell) => cell.level))].sort((a, b) => a - b),
  };
}

/**
 * Morton children of a cell one level finer. With x in the least-significant
 * bit (`mortonCell.ts`), the 8 children of code c are exactly 8c … 8c+7 —
 * no decode needed.
 */
export const mortonChildren = (code: number): number[] =>
  Array.from({ length: 8 }, (_, k) => code * 8 + k);

/** Morton parent of a cell one level coarser. */
export const mortonParent = (code: number): number => Math.floor(code / 8);

export type MeshPlanInput = {
  index: MeshCellIndex;
  grid: MeshGridSpec;
  /** Camera frustum in collection voxel space; null = no culling (plan all). */
  voxelFrustum: THREE.Frustum | null;
  /** Camera position in collection voxel space; null = orthographic-ish. */
  cameraVoxelPos: readonly [number, number, number] | null;
  /** viewportHeight / (2·tan(fovY/2)) / voxel — px per voxel at distance 1. */
  pxPerVoxelAtUnitDistance: number;
  lodBias: number;
  /** Triangle-index budget across the plan (≈ GPU + decode cost). */
  maxIndices: number;
  maxCells: number;
  /** Previous plan's per-root levels (hysteresis); keyed by root cell key. */
  previousRootLevels?: ReadonlyMap<string, number>;
};

export type MeshCellPlan = {
  /** Planned cells, possibly at MIXED levels, near-first. */
  cells: IndexedMeshCell[];
  totalIndices: number;
  /** Frustum-visible cells dropped by the budget. */
  droppedCells: number;
  /** Per-root chosen levels — feed back as `previousRootLevels` next plan. */
  rootLevels: Map<string, number>;
};

const EMPTY_PLAN: MeshCellPlan = {
  cells: [],
  totalIndices: 0,
  droppedCells: 0,
  rootLevels: new Map(),
};

/** Margin a footprint must clear before a root switches level (~15%). */
export const LOD_HYSTERESIS = 1.15;

const scratchBox = new THREE.Box3();

const boxDistanceSq = (box: VoxelBox, point: readonly [number, number, number]): number => {
  let d = 0;
  for (const axis of [0, 1, 2] as const) {
    const v = Math.max(box.min[axis] - point[axis], 0, point[axis] - box.max[axis]);
    d += v * v;
  }
  return d;
};

const boxInFrustum = (box: VoxelBox, frustum: THREE.Frustum | null): boolean => {
  if (!frustum) return true;
  scratchBox.min.set(box.min[0], box.min[1], box.min[2]);
  scratchBox.max.set(box.max[0], box.max[1], box.max[2]);
  return frustum.intersectsBox(scratchBox);
};

/**
 * Finest level whose voxels are still ≥ 1 px on screen at the given distance:
 * a level-L cell renders `cellSize·2^L` voxels, so detail beyond
 * `px/voxel · 2^L ≥ 1` is invisible.
 */
export const desiredMeshLevel = (
  pxPerVoxel: number,
  lodBias: number,
  levels: number,
): number => {
  if (!(pxPerVoxel > 0)) return levels - 1;
  const level = Math.floor(Math.log2(1 / (pxPerVoxel * lodBias)));
  return Math.min(levels - 1, Math.max(0, level));
};

/** Nearest available level to `desired`, preferring coarser on a tie. */
const snapToAvailable = (desired: number, available: readonly number[]): number =>
  available.reduce((best, candidate) => {
    const bestDist = Math.abs(best - desired);
    const candidateDist = Math.abs(candidate - desired);
    if (candidateDist < bestDist) return candidate;
    if (candidateDist === bestDist) return Math.max(best, candidate);
    return best;
  });

export function planMeshCells(input: MeshPlanInput): MeshCellPlan {
  const { index, grid } = input;
  if (index.cells.length === 0) return EMPTY_PLAN;

  const availableLevels = index.levels;
  const rootLevel = availableLevels[availableLevels.length - 1];
  const focus = input.cameraVoxelPos;

  const desireAt = (pxPerVoxel: number, bias: number): number =>
    snapToAvailable(desiredMeshLevel(pxPerVoxel, bias, grid.levels), availableLevels);

  // --- Per-root level choice (footprint + hysteresis) -----------------------
  const rootLevels = new Map<string, number>();
  const emitted: IndexedMeshCell[] = [];

  /** Collect the cells covering `code`'s region at `target`, descending only
   * where finer geometry exists — a region with no finer rows stays covered
   * by its coarser cell (sparse collections). */
  const collect = (level: number, code: number, target: number): void => {
    const cell = index.byKey.get(meshCellKey(level, code));
    if (level <= target) {
      if (cell && boxInFrustum(cell.box, input.voxelFrustum)) emitted.push(cell);
      return;
    }
    // Which finer level do we step to? The next available one down.
    const nextLevel = [...availableLevels].reverse().find((l) => l < level);
    if (nextLevel === undefined) {
      if (cell && boxInFrustum(cell.box, input.voxelFrustum)) emitted.push(cell);
      return;
    }
    // Morton codes step ONE level at a time; expand across the level gap.
    let codes = [code];
    for (let l = level; l > nextLevel; l--) codes = codes.flatMap(mortonChildren);
    let anyChild = false;
    for (const childCode of codes) {
      if (index.byKey.has(meshCellKey(nextLevel, childCode))) {
        anyChild = true;
        collect(nextLevel, childCode, target);
      }
    }
    if (!anyChild && cell && boxInFrustum(cell.box, input.voxelFrustum)) {
      // No finer geometry anywhere under this cell: it covers the region.
      // (A region where SOME siblings exist but a code doesn't simply has no
      // geometry there — nothing to cover.)
      emitted.push(cell);
    }
  };

  for (const root of index.cells) {
    if (root.level !== rootLevel) continue;
    if (!boxInFrustum(root.box, input.voxelFrustum)) {
      rootLevels.delete(root.key);
      continue;
    }

    let level: number;
    if (focus) {
      const dist = Math.max(1, Math.sqrt(boxDistanceSq(root.box, focus)));
      const pxPerVoxel = input.pxPerVoxelAtUnitDistance / dist;
      level = desireAt(pxPerVoxel, input.lodBias);
      const previous = input.previousRootLevels?.get(root.key);
      if (previous !== undefined && previous !== level) {
        // Sticky levels: to switch, the footprint must clear the threshold
        // with a margin. Re-evaluate with the bias nudged AGAINST the switch
        // (finer needs a smaller effective bias to still win; coarser a
        // larger one); the result either falls back to `previous` (inside
        // the band — no flip) or confirms a genuine switch.
        level = desireAt(
          pxPerVoxel,
          level < previous
            ? input.lodBias / LOD_HYSTERESIS
            : input.lodBias * LOD_HYSTERESIS,
        );
      }
    } else {
      level = desireAt(input.pxPerVoxelAtUnitDistance, input.lodBias);
    }

    rootLevels.set(root.key, level);
    collect(rootLevel, root.cell, level);
  }

  // --- Near-first ordering + budget -----------------------------------------
  const ordered = focus
    ? emitted
        .map((cell) => ({ cell, dist: boxDistanceSq(cell.box, focus) }))
        .sort((a, b) => a.dist - b.dist)
        .map((entry) => entry.cell)
    : emitted;

  const planned: IndexedMeshCell[] = [];
  let totalIndices = 0;
  for (const cell of ordered) {
    if (planned.length >= input.maxCells) break;
    if (totalIndices + cell.indexCount > input.maxIndices && planned.length > 0) break;
    planned.push(cell);
    totalIndices += cell.indexCount;
  }

  return {
    cells: planned,
    totalIndices,
    droppedCells: ordered.length - planned.length,
    rootLevels,
  };
}
