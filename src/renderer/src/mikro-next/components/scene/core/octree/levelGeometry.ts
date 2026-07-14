import { resolveAxisIndices, type AxisIndices, type LayerAxisDims } from "../dims";
import type { TransformLike } from "../transformGraph";

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
 * Absolute per-axis scale (array dim order) declared by a level's `toParent`
 * edge: a bare `ScaleTransformation`, or the Scale child of a Sequence
 * (Sequence[Scale, Translation] is the canonical pyramid-level edge; the
 * translation is the half-voxel downsampling offset, not yet consumed).
 * Identity / pure-translation edges scale nothing (all-1s). Null when the
 * edge is absent or not expressible as per-axis factors — callers fall back
 * to the shape-ratio chain in `resolveAxisScale`.
 */
export const absoluteLevelScale = (
  toParent: TransformLike | undefined,
  dimCount: number,
): number[] | null => {
  if (!toParent) return null;
  const nodes = toParent.transformations?.length ? toParent.transformations : [toParent];
  let scale: number[] | null = null;
  for (const node of nodes) {
    if (!node) continue;
    if (node.scale?.length) {
      if (scale) return null;
      scale = [...node.scale];
    } else if (
      node.__typename !== "IdentityTransformation" &&
      node.__typename !== "TranslationTransformation"
    ) {
      return null;
    }
  }
  if (scale) return scale.length === dimCount ? scale : null;
  return Array<number>(dimCount).fill(1);
};

/**
 * Per-level factors relative to level 0 (array dim order) — the exact
 * semantics the removed server-side `DataArray.scaleFactors` field had —
 * derived from the levels' absolute `toParent` scales. The absolute scales
 * obey `scale·shape == const` per axis, so these agree with the shape-ratio
 * fallback by construction; declaring them here just short-circuits it.
 */
// Memoized on the `dataArrays` ARRAY IDENTITY: fragments are normalized, so
// the array reference is stable across replans (nodePlanTracker calls
// `buildLevelSources` per layer every ~200 ms during interaction) and a new
// scene fetch mints a new array. Without this, every replan re-parses the
// levels' `toParent` edges for factors that cannot have changed.
const factorsCache = new WeakMap<
  object,
  { dimCount: number; factors: (number[] | null)[] }
>();

export const relativeLevelScaleFactors = (
  dataArrays: readonly { level: number; toParent?: TransformLike }[],
  dimCount: number,
): (number[] | null)[] => {
  if (dataArrays.length === 0) return [];
  const cached = factorsCache.get(dataArrays);
  if (cached && cached.dimCount === dimCount) return cached.factors;
  const abs = dataArrays.map((dataArray) => absoluteLevelScale(dataArray.toParent, dimCount));
  const baseIndex = dataArrays.reduce(
    (best, dataArray, i) => (dataArray.level < dataArrays[best].level ? i : best),
    0,
  );
  const base = abs[baseIndex];
  const factors = base
    ? abs.map((a) => (a ? a.map((v, k) => (base[k] ? v / base[k] : 1)) : null))
    : dataArrays.map(() => null);
  factorsCache.set(dataArrays, { dimCount, factors });
  return factors;
};

/** Structural subset of a `DataArray` fragment that `buildLevelSources` needs. */
export type DataArraySource = {
  level: number;
  toParent?: TransformLike;
  store: { id: string };
};

/**
 * The one shared `LevelSource[]` builder (plan tracker, residency manager and
 * pool-viability probe previously each hand-rolled this): opened-array shapes
 * per store plus the relative scale factors derived from the transform graph.
 * Throws (like `getArrayForStoreId`) when a store's array isn't opened yet.
 */
export function buildLevelSources(
  dataArrays: readonly DataArraySource[],
  dimCount: number,
  getArrayForStoreId: (storeId: string) => {
    shape: readonly number[];
    chunks: readonly number[];
    dtype: unknown;
  },
): LevelSource[] {
  const factors = relativeLevelScaleFactors(dataArrays, dimCount);
  return dataArrays.map((dataArray, i) => {
    const arr = getArrayForStoreId(dataArray.store.id);
    return {
      shape: arr.shape,
      chunks: arr.chunks,
      dtype: String(arr.dtype),
      storeId: dataArray.store.id,
      scaleFactors: factors[i] ?? undefined,
    };
  });
}

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
  allLevels: readonly LevelSource[],
): LayerLevelGeometry | null {
  const axes = resolveAxisIndices([...dims], layer);
  const { xPos, yPos, zPos, intensityPos } = axes;
  if (allLevels.length === 0 || xPos === -1 || yPos === -1) return null;

  // Some pyramids carry duplicate resolutions (e.g. two level-0 dataArrays,
  // one without scaleFactors and one with [1,1,1,1], in different stores).
  // Keeping both would plan and FETCH the same resolution twice — and the
  // ancestor-chain logic would treat the duplicate as a distinct LOD. Keep
  // the first entry per unique spatial shape.
  const seenShapes = new Set<string>();
  const levels = allLevels.filter((level) => {
    const shapeKey = `${axisExtent(level.shape, xPos)}:${axisExtent(level.shape, yPos)}:${axisExtent(level.shape, zPos)}`;
    if (seenShapes.has(shapeKey)) return false;
    seenShapes.add(shapeKey);
    return true;
  });
  if (levels.length === 0) return null;

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
