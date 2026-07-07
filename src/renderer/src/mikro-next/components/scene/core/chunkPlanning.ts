import * as THREE from "three";
import type { Slice } from "zarrita";
import type { DataType } from "zarrita";

import type { ChunkData } from "../stores/types";
import { mapDTypeToMinMax, mapDTypeToTextureBytes } from "../stores/utils";
import { calculateChunkGrid } from "../zarr/utils";
import { buildAffineMatrix } from "./worldTransform";
import { resolveAxisIndices } from "./dims";
import { buildSliceMap } from "./selection";
import type { LayerState } from "./layerModel";
import type { LayerViewRange } from "./visibility";
import {
  PREFETCH_MARGIN,
  chooseLodForScale,
  expandVoxelRange,
  viewRangeToLevelSlice,
} from "./viewportPlanning";

/**
 * Pure chunk-render planner for the 2D plane path. Given the camera-derived
 * view range, the layer's pyramid geometry, and the set of chunks that are
 * already rendered, it decides — per area — whether a chunk should be loading
 * (target), kept as an interim cover (previous-LOD or coarsest backdrop), or
 * retired. The output is a declarative plan held in the viewer store;
 * `PlaneLayer` merely executes it and `ChunkPlane`'s rendered-status reports
 * feed the next planning round (load → cover → retire refinement, in the
 * spirit of tile-pyramid viewers).
 */

export type PlannedChunk = ChunkData & { role: "target" | "cover" | "substitute" };

export type LayerChunkPlan = {
  targetLod: number;
  /** Covers are only retained across replans with an identical signature. */
  sliceSignature: string;
  chunks: PlannedChunk[];
};

export type PlanLevel = {
  shape: readonly number[];
  chunks: readonly number[];
  dtype: string;
  storeId: string;
  scaleFactors?: readonly number[] | null;
};

export type PlanLayerChunksInput = {
  layer: LayerState;
  levels: readonly PlanLevel[];
  viewRange: LayerViewRange | undefined;
  lodBias: number;
  currentZ: number | undefined;
  renderedChunkKeys: ReadonlySet<string>;
  prevPlan: LayerChunkPlan | null;
  /**
   * Byte ceiling for the plan's resident textures. Bounds the substitution
   * rule (keeping already-rendered finer chunks instead of fetching coarser
   * targets) so a zoomed-out viewport can't pin unbounded fine textures.
   */
  maxPlanBytes?: number;
};

/** Base-scaled voxel rect of a chunk (or viewport area). */
type Rect = { x0: number; x1: number; y0: number; y1: number };

const overlaps = (a: Rect, b: Rect): boolean =>
  a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

const contains = (outer: Rect, inner: Rect): boolean =>
  outer.x0 <= inner.x0 && outer.x1 >= inner.x1 && outer.y0 <= inner.y0 && outer.y1 >= inner.y1;

/** Rect of a chunk in base-scaled voxel space, derivable from ChunkData alone. */
const chunkRect = (chunk: ChunkData): Rect => {
  const [xPos, yPos] = chunk.dimensionOrder;
  const scaleX = chunk.scaleFactors?.[xPos] ?? 1;
  const scaleY = chunk.scaleFactors?.[yPos] ?? 1;
  const chunkW = (xPos !== -1 ? chunk.chunk_shape[xPos] : 1) * scaleX;
  const chunkH = (yPos !== -1 ? chunk.chunk_shape[yPos] : 1) * scaleY;
  const x0 = (xPos !== -1 ? chunk.chunkCoords[xPos] : 0) * chunkW;
  const y0 = (yPos !== -1 ? chunk.chunkCoords[yPos] : 0) * chunkH;
  const maxX = (xPos !== -1 ? chunk.arrayShape[xPos] : 1) * scaleX;
  const maxY = (yPos !== -1 ? chunk.arrayShape[yPos] : 1) * scaleY;
  return {
    x0,
    y0,
    x1: Math.min(x0 + chunkW, maxX),
    y1: Math.min(y0 + chunkH, maxY),
  };
};

export function buildSliceSignature(layer: LayerState, currentZ: number | undefined): string {
  return JSON.stringify({
    // Only z-sliced layers see a different slice when currentZ moves.
    currentZ: layer.zDim ? currentZ ?? null : null,
    xDim: layer.xDim ?? null,
    yDim: layer.yDim ?? null,
    zDim: layer.zDim ?? null,
    intensityDim: layer.intensityDim ?? null,
    slices: layer.lens.slices.map((slice) => ({
      dim: slice.dim,
      start: slice.start ?? null,
      stop: slice.stop ?? null,
      step: slice.step ?? null,
    })),
  });
}

export function planLayerChunks({
  layer,
  levels,
  viewRange,
  lodBias,
  currentZ,
  renderedChunkKeys,
  prevPlan,
  maxPlanBytes = Number.POSITIVE_INFINITY,
}: PlanLayerChunksInput): LayerChunkPlan {
  const dims = layer.lens.dataset.dims;
  const { xPos, yPos, zPos, intensityPos } = resolveAxisIndices(dims, layer);
  const sliceSignature = buildSliceSignature(layer, currentZ);

  if (levels.length === 0 || xPos === -1 || yPos === -1) {
    return { targetLod: 0, sliceSignature, chunks: [] };
  }

  const numLevels = levels.length;
  const coarsestLod = numLevels - 1;
  const sliceMap = buildSliceMap(layer.lens.slices);

  // --- Target LOD ---------------------------------------------------------
  const lodFactors = levels.map((level, index) => {
    const fromScale = level.scaleFactors?.[xPos];
    if (typeof fromScale === "number" && fromScale > 0) return fromScale;
    const baseX = levels[0].shape[xPos] ?? 0;
    const levelX = level.shape[xPos] ?? 0;
    return baseX > 0 && levelX > 0 ? baseX / levelX : 2 ** index;
  });

  let targetLod = coarsestLod;
  if (
    typeof layer.fixedLOD === "number" &&
    layer.fixedLOD >= 0 &&
    layer.fixedLOD < numLevels
  ) {
    targetLod = layer.fixedLOD;
  } else if (viewRange) {
    targetLod = chooseLodForScale(viewRange.scale, lodFactors, lodBias);
  }

  // --- Selection builder (slices + z pick + optional viewport narrowing) ---
  const layerAffineInverse = buildAffineMatrix(layer).invert();

  /**
   * Level-voxel z index selected by the slider; null when the layer has no z
   * axis, "out-of-range" when the (scene-wide) slider position falls outside
   * THIS layer's stack — in that case the layer renders nothing rather than
   * clamping to its first/last slice.
   */
  const resolveLevelZ = (levelIndex: number): number | null | "out-of-range" => {
    if (zPos === -1 || currentZ === undefined) return null;
    const level = levels[levelIndex];
    const localZ = new THREE.Vector3(0, 0, currentZ).applyMatrix4(layerAffineInverse).z;
    const scaleZ = level.scaleFactors?.[zPos] ?? 1;
    const maxVoxelZ = (level.shape[zPos] ?? 1) - 1;
    const zIndex = Math.round(localZ / scaleZ); // half-voxel tolerance at the edges
    if (zIndex < 0 || zIndex > maxVoxelZ) return "out-of-range";
    return zIndex;
  };

  const buildSelection = (
    levelIndex: number,
    levelZ: number | null,
    viewRect: { x: [number, number]; y: [number, number] } | null,
  ): (null | number | Slice)[] | null => {
    const level = levels[levelIndex];
    const selection: (null | number | Slice)[] = dims.map((dim) => {
      const slice = sliceMap[dim];
      return slice
        ? ({ start: slice.start ?? 0, stop: slice.stop ?? undefined, step: slice.step ?? 1 } as Slice)
        : null;
    });

    if (levelZ !== null) {
      selection[zPos] = levelZ;
    }

    if (viewRect) {
      const scaleX = level.scaleFactors?.[xPos] ?? 1;
      const scaleY = level.scaleFactors?.[yPos] ?? 1;
      const xSlice = viewRangeToLevelSlice(viewRect.x, scaleX, level.shape[xPos] ?? 0, sliceMap[layer.xDim ?? ""]);
      const ySlice = viewRangeToLevelSlice(viewRect.y, scaleY, level.shape[yPos] ?? 0, sliceMap[layer.yDim ?? ""]);
      if (!xSlice || !ySlice) return null;
      selection[xPos] = { start: xSlice.start, stop: xSlice.stop, step: sliceMap[layer.xDim ?? ""]?.step ?? 1 } as Slice;
      selection[yPos] = { start: ySlice.start, stop: ySlice.stop, step: sliceMap[layer.yDim ?? ""]?.step ?? 1 } as Slice;
    }

    return selection;
  };

  const makeChunk = (
    levelIndex: number,
    levelZ: number | null,
    chunk_coords: number[],
    role: PlannedChunk["role"],
  ): PlannedChunk => {
    const level = levels[levelIndex];
    const [minValue, maxValue] = mapDTypeToMinMax(level.dtype as DataType);
    return {
      frame_id: layer.id,
      dimensionOrder: [xPos, yPos, intensityPos],
      storeId: level.storeId,
      chunkCoords: chunk_coords,
      // The z index is part of the identity: when a chunk spans multiple z
      // slices, moving the slider must remount/re-upload even though the
      // chunk coordinates are unchanged.
      chunkKey: `${levelIndex}-${chunk_coords.join("/")}${levelZ !== null ? `/z${levelZ}` : ""}`,
      chunk_shape: [...level.chunks],
      arrayShape: [...level.shape],
      min_value: minValue,
      max_value: maxValue,
      level: levelIndex,
      scaleFactors: level.scaleFactors ? [...level.scaleFactors] : undefined,
      // ChunkPlane extracts this slab from the fetched chunk before upload.
      zSelection: levelZ !== null ? { axisPosition: zPos, levelIndex: levelZ } : undefined,
      role,
    };
  };

  const enumerateChunks = (
    levelIndex: number,
    viewRect: { x: [number, number]; y: [number, number] } | null,
    role: PlannedChunk["role"],
  ): PlannedChunk[] => {
    const level = levels[levelIndex];
    const levelZ = resolveLevelZ(levelIndex);
    if (levelZ === "out-of-range") return [];
    const selection = buildSelection(levelIndex, levelZ, viewRect);
    if (!selection) return [];
    return calculateChunkGrid(selection, [...level.shape], [...level.chunks]).map(
      ({ chunk_coords }) => makeChunk(levelIndex, levelZ, chunk_coords, role),
    );
  };

  // --- Rule 1: target set, center-out --------------------------------------
  const viewRect = viewRange
    ? {
        x: expandVoxelRange(viewRange.xRange, PREFETCH_MARGIN),
        y: expandVoxelRange(viewRange.yRange, PREFETCH_MARGIN),
      }
    : null;

  const center = viewRect
    ? { x: (viewRect.x[0] + viewRect.x[1]) / 2, y: (viewRect.y[0] + viewRect.y[1]) / 2 }
    : { x: ((levels[0].shape[xPos] ?? 0)) / 2, y: ((levels[0].shape[yPos] ?? 0)) / 2 };

  const distanceToCenter = (chunk: PlannedChunk): number => {
    const rect = chunkRect(chunk);
    const cx = (rect.x0 + rect.x1) / 2;
    const cy = (rect.y0 + rect.y1) / 2;
    return (cx - center.x) ** 2 + (cy - center.y) ** 2;
  };

  let targets = enumerateChunks(targetLod, viewRect, "target").sort(
    (a, b) => distanceToCenter(a) - distanceToCenter(b),
  );

  // --- Rule 1b: substitution — prefer already-rendered FINER chunks over
  // fetching a coarser target, while the byte budget permits. A target whose
  // area is fully tiled by rendered finer-level chunks from the previous plan
  // is dropped (never fetched); the fine chunks persist as "substitute"s.
  // Re-derived every replan from prevPlan, so it is a stable fixed point; and
  // zooming back in is free — the substitutes simply become targets again.
  const textureBytesForLevel = (levelIndex: number): number => {
    const level = levels[levelIndex];
    const bytesPerVoxel = mapDTypeToTextureBytes(level.dtype as DataType);
    const chunkX = level.chunks[xPos] ?? 1;
    const chunkY = level.chunks[yPos] ?? 1;
    const chunkIntensity = intensityPos !== -1 ? Math.min(16, level.chunks[intensityPos] ?? 1) : 1;
    return chunkX * chunkY * chunkIntensity * bytesPerVoxel;
  };

  const substitutes: PlannedChunk[] = [];
  const substituteKeys = new Set<string>();
  if (targetLod > 0 && prevPlan && prevPlan.sliceSignature === sliceSignature) {
    // Rendered finer-level candidates, per level (finest first).
    const candidatePool = new Map<number, PlannedChunk[]>();
    for (const chunk of prevPlan.chunks) {
      if (chunk.level < targetLod && renderedChunkKeys.has(chunk.chunkKey)) {
        const bucket = candidatePool.get(chunk.level);
        if (bucket) bucket.push(chunk);
        else candidatePool.set(chunk.level, [chunk]);
      }
    }

    if (candidatePool.size > 0) {
      const poolLevels = [...candidatePool.keys()].sort((a, b) => a - b);
      let totalBytes = targets.reduce((sum, target) => sum + textureBytesForLevel(target.level), 0);
      const keptTargets: PlannedChunk[] = [];
      const EPSILON = 1e-6;

      for (const target of targets) {
        const rect = chunkRect(target);
        let substituted = false;

        for (const fineLevel of poolLevels) {
          const level = levels[fineLevel];
          const cellWidth = (level.chunks[xPos] ?? 1) * (level.scaleFactors?.[xPos] ?? 1);
          const cellHeight = (level.chunks[yPos] ?? 1) * (level.scaleFactors?.[yPos] ?? 1);
          // Grid cells of the finer level the target rect spans; the pool
          // chunks are exactly such cells, so full tiling ⟺ every cell is
          // present ⟺ overlap count equals the expected cell count.
          const expectedCells =
            Math.max(0, Math.ceil((rect.x1 - EPSILON) / cellWidth) - Math.floor((rect.x0 + EPSILON) / cellWidth)) *
            Math.max(0, Math.ceil((rect.y1 - EPSILON) / cellHeight) - Math.floor((rect.y0 + EPSILON) / cellHeight));
          if (expectedCells === 0) continue;

          const tiles = (candidatePool.get(fineLevel) ?? []).filter((candidate) =>
            overlaps(chunkRect(candidate), rect),
          );
          if (tiles.length !== expectedCells) continue;

          const newTiles = tiles.filter((tile) => !substituteKeys.has(tile.chunkKey));
          const swappedBytes =
            totalBytes - textureBytesForLevel(target.level) + newTiles.length * textureBytesForLevel(fineLevel);
          if (swappedBytes > maxPlanBytes) continue;

          totalBytes = swappedBytes;
          for (const tile of newTiles) {
            substituteKeys.add(tile.chunkKey);
            substitutes.push(tile.role === "substitute" ? tile : { ...tile, role: "substitute" as const });
          }
          substituted = true;
          break;
        }

        if (!substituted) keptTargets.push(target);
      }
      targets = keptTargets;
    }
  }

  // --- Rules 2 + 3: covers over unrendered targets, retire the rest --------
  const unrenderedTargetRects = targets
    .filter((target) => !renderedChunkKeys.has(target.chunkKey))
    .map(chunkRect);

  const covers: PlannedChunk[] = [];
  if (unrenderedTargetRects.length > 0) {
    // (a) previously planned chunks from other levels that are already
    // rendered and still cover an unrendered area — this is what keeps the
    // old LOD visible during a LOD switch.
    const retainable =
      prevPlan && prevPlan.sliceSignature === sliceSignature
        ? prevPlan.chunks.filter(
            (chunk) =>
              chunk.level !== targetLod &&
              !substituteKeys.has(chunk.chunkKey) &&
              renderedChunkKeys.has(chunk.chunkKey),
          )
        : [];
    const retained = retainable.filter((chunk) => {
      const rect = chunkRect(chunk);
      return unrenderedTargetRects.some((target) => overlaps(rect, target));
    });
    covers.push(
      ...retained.map((chunk) => (chunk.role === "cover" ? chunk : { ...chunk, role: "cover" as const })),
    );

    // (b) coarsest-level backdrop for unrendered areas no retained chunk
    // fully contains.
    const uncovered = unrenderedTargetRects.filter(
      (target) => !covers.some((cover) => contains(chunkRect(cover), target)),
    );
    if (uncovered.length > 0 && coarsestLod !== targetLod) {
      const coverKeys = new Set(covers.map((cover) => cover.chunkKey));
      // Bounding rect of the uncovered areas, in base voxel coords (the
      // enumerator converts to level coords itself).
      const boundsRect: { x: [number, number]; y: [number, number] } = {
        x: [
          Math.min(...uncovered.map((rect) => rect.x0)),
          Math.max(...uncovered.map((rect) => rect.x1)),
        ],
        y: [
          Math.min(...uncovered.map((rect) => rect.y0)),
          Math.max(...uncovered.map((rect) => rect.y1)),
        ],
      };
      const backdrop = enumerateChunks(coarsestLod, boundsRect, "cover").filter((chunk) => {
        if (coverKeys.has(chunk.chunkKey)) return false;
        const rect = chunkRect(chunk);
        return uncovered.some((target) => overlaps(rect, target));
      });
      covers.push(...backdrop);
    }
  }

  // --- Rule 5: covers, then substitutes, then remaining targets center-out --
  return { targetLod, sliceSignature, chunks: [...covers, ...substitutes, ...targets] };
}

/** Value equality between two plans (skip store writes / preserve identity). */
export function sameChunkPlan(a: LayerChunkPlan, b: LayerChunkPlan): boolean {
  return (
    a.targetLod === b.targetLod &&
    a.sliceSignature === b.sliceSignature &&
    a.chunks.length === b.chunks.length &&
    a.chunks.every((chunk, i) => chunk.chunkKey === b.chunks[i].chunkKey && chunk.role === b.chunks[i].role)
  );
}
