import * as THREE from "three";
import { cellVoxelBox, type MeshGridSpec } from "./meshSpec";

/**
 * Pure cell selection for a mesh collection — the mesh analog of
 * `planLayerNodes`, deliberately simpler for v1:
 *
 *  - ONE level is chosen per plan from the camera's screen-space voxel
 *    footprint (like the image planner's `desiredLevel`, without per-node
 *    refinement). Distant collections render coarse, zoomed-in ones fine.
 *  - The chosen level's cells are frustum-culled in the collection's OWN
 *    voxel space (the world frustum is pulled through the inverse layer
 *    matrix by the caller, mirroring `nodePlanning`'s culling frame).
 *  - Survivors are ordered closest-first and capped by a triangle budget, so
 *    budget exhaustion degrades distant regions first.
 *
 * Per-cell octree refinement (mixed levels in one plan) is a follow-up; it
 * slots in here without touching the data plane or the renderer.
 */

export type MeshCellRecord = {
  level: number;
  cell: number;
  vertexCount: number;
  indexCount: number;
};

export type MeshPlanInput = {
  cells: readonly MeshCellRecord[];
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
};

export type MeshCellPlan = {
  level: number;
  cells: MeshCellRecord[];
  totalIndices: number;
  /** Frustum-visible cells of the chosen level dropped by the budget. */
  droppedCells: number;
};

const EMPTY_PLAN: MeshCellPlan = { level: 0, cells: [], totalIndices: 0, droppedCells: 0 };

const scratchBox = new THREE.Box3();

const boxDistanceSq = (
  box: { min: readonly number[]; max: readonly number[] },
  point: readonly [number, number, number],
): number => {
  let d = 0;
  for (const axis of [0, 1, 2] as const) {
    const v = Math.max(box.min[axis] - point[axis], 0, point[axis] - box.max[axis]);
    d += v * v;
  }
  return d;
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

export function planMeshCells(input: MeshPlanInput): MeshCellPlan {
  const { cells, grid } = input;
  if (cells.length === 0) return EMPTY_PLAN;

  // Levels that actually have geometry (sparse collections may skip levels).
  const availableLevels = [...new Set(cells.map((cell) => cell.level))].sort((a, b) => a - b);

  // Footprint at the camera's distance to the collection's cell hull.
  let pxPerVoxel = input.pxPerVoxelAtUnitDistance;
  if (input.cameraVoxelPos) {
    let minDistSq = Number.POSITIVE_INFINITY;
    for (const cell of cells) {
      minDistSq = Math.min(
        minDistSq,
        boxDistanceSq(cellVoxelBox(grid, cell.level, cell.cell), input.cameraVoxelPos),
      );
      if (minDistSq === 0) break;
    }
    pxPerVoxel = input.pxPerVoxelAtUnitDistance / Math.max(1, Math.sqrt(minDistSq));
  }

  const desired = desiredMeshLevel(pxPerVoxel, input.lodBias, grid.levels);
  // Nearest available level, preferring coarser on a tie (cheaper).
  const level = availableLevels.reduce((best, candidate) => {
    const bestDist = Math.abs(best - desired);
    const candidateDist = Math.abs(candidate - desired);
    if (candidateDist < bestDist) return candidate;
    if (candidateDist === bestDist) return Math.max(best, candidate);
    return best;
  });

  const visible = cells.filter((cell) => {
    if (cell.level !== level) return false;
    if (!input.voxelFrustum) return true;
    const box = cellVoxelBox(grid, cell.level, cell.cell);
    scratchBox.min.set(box.min[0], box.min[1], box.min[2]);
    scratchBox.max.set(box.max[0], box.max[1], box.max[2]);
    return input.voxelFrustum.intersectsBox(scratchBox);
  });

  const focus = input.cameraVoxelPos;
  const ordered = focus
    ? visible
        .map((cell) => ({
          cell,
          dist: boxDistanceSq(cellVoxelBox(grid, cell.level, cell.cell), focus),
        }))
        .sort((a, b) => a.dist - b.dist)
        .map((entry) => entry.cell)
    : visible;

  const planned: MeshCellRecord[] = [];
  let totalIndices = 0;
  for (const cell of ordered) {
    if (planned.length >= input.maxCells) break;
    if (totalIndices + cell.indexCount > input.maxIndices && planned.length > 0) break;
    planned.push(cell);
    totalIndices += cell.indexCount;
  }

  return { level, cells: planned, totalIndices, droppedCells: ordered.length - planned.length };
}
