import { resolveAxisIndices, type AxisIndices, type LayerAxisDims } from "../dims";

/**
 * Canonical per-layer pyramid geometry for the octree renderer. Everything in
 * `core/octree/` works in **spatial [x, y, z] order**, independent of the
 * zarr array's dim order — the axis positions recorded here are the only
 * bridge back to zarr-space (selections, chunk coords).
 */

export type Vec3 = readonly [number, number, number];

/** Per-level source data, structurally identical to `chunkPlanning.PlanLevel`. */
export type LevelSource = {
  shape: readonly number[];
  chunks: readonly number[];
  dtype: string;
  storeId: string;
  scaleFactors?: readonly number[] | null;
};

export type LevelGeometry = {
  index: number;
  storeId: string;
  dtype: string;
  /** Full zarr shape / chunk shape, in the array's own dim order. */
  shape: readonly number[];
  chunks: readonly number[];
  /** Level extents in [x, y, z] voxels (z = 1 when the layer has no z axis). */
  spatialShape: Vec3;
  /** Zarr chunk extents along [x, y, z] (1 where there is no such axis). */
  spatialChunks: Vec3;
  /** Base voxels per level voxel along [x, y, z]. */
  scale: Vec3;
};

export type LayerLevelGeometry = {
  dims: readonly string[];
  axes: AxisIndices;
  /** Channels co-resident in a brick slot (capped at 16 like the 2D shader). */
  channelCount: number;
  /** Finest first (index 0 = level 0), matching `dataArrays` ordering. */
  levels: readonly LevelGeometry[];
};

export const MAX_BRICK_CHANNELS = 16;

/**
 * Per-axis level scale with the same fallback chain `planLayerChunks` uses for
 * x: explicit scaleFactors, else the shape ratio vs level 0, else 2^index
 * (assumed untouched for z, whose pyramids typically don't downsample).
 */
const resolveAxisScale = (
  levels: readonly LevelSource[],
  levelIndex: number,
  axisPos: number,
  isZ: boolean,
): number => {
  if (axisPos === -1) return 1;
  const fromScale = levels[levelIndex].scaleFactors?.[axisPos];
  if (typeof fromScale === "number" && fromScale > 0) return fromScale;
  const base = levels[0].shape[axisPos] ?? 0;
  const cur = levels[levelIndex].shape[axisPos] ?? 0;
  if (base > 0 && cur > 0) return base / cur;
  return isZ ? 1 : 2 ** levelIndex;
};

const axisExtent = (values: readonly number[], pos: number): number =>
  pos !== -1 ? Math.max(1, values[pos] ?? 1) : 1;

export function buildLayerLevelGeometry(
  dims: readonly string[],
  layer: LayerAxisDims,
  levels: readonly LevelSource[],
): LayerLevelGeometry | null {
  const axes = resolveAxisIndices([...dims], layer);
  const { xPos, yPos, zPos, intensityPos } = axes;
  if (levels.length === 0 || xPos === -1 || yPos === -1) return null;

  const channelCount =
    intensityPos !== -1
      ? Math.min(MAX_BRICK_CHANNELS, Math.max(1, levels[0].shape[intensityPos] ?? 1))
      : 1;

  return {
    dims,
    axes,
    channelCount,
    levels: levels.map((level, index) => ({
      index,
      storeId: level.storeId,
      dtype: level.dtype,
      shape: level.shape,
      chunks: level.chunks,
      spatialShape: [
        axisExtent(level.shape, xPos),
        axisExtent(level.shape, yPos),
        axisExtent(level.shape, zPos),
      ],
      spatialChunks: [
        axisExtent(level.chunks, xPos),
        axisExtent(level.chunks, yPos),
        axisExtent(level.chunks, zPos),
      ],
      scale: [
        resolveAxisScale(levels, index, xPos, false),
        resolveAxisScale(levels, index, yPos, false),
        resolveAxisScale(levels, index, zPos, true),
      ],
    })),
  };
}
