import type { DataType } from "zarrita";
import { mapDTypeToMinMax } from "@/lib/zarr/indexing/dtype";
/**
 * The shape both functions here read: a brick-backed layer's lens, whether that
 * layer arrived as a fragment or already normalized into `LayerState`.
 */
type ValueRangeLayer = {
  __typename?: string;
  lens?: {
    activeAnchors?: readonly {
      valueHistogram?: { min?: number | null; max?: number | null } | null;
    }[] | null;
  } | null;
};

/**
 * The largest integer a label id may take and still survive the brick atlas.
 *
 * An `r32f` atlas stores float32, which represents integers EXACTLY up to 2^24 —
 * the same ceiling fabriks uses for its object ordinals — and the 24-bit EMPTY
 * page-table encoding is exact over precisely this range. Above it an id would
 * quantize, and a quantized id is a different object.
 */
export const LABEL_ID_CEILING = 2 ** 24 - 1;

/**
 * The value range a layer's samples are interpreted against.
 *
 * For an IMAGE this is the intensity range used to normalize samples to [0,1]
 * before the render graph's (normalized) contrast limits are applied.
 * `mapDTypeToMinMax` returns [0,1] for float dtypes, which is a poor proxy when
 * the data isn't normalized (e.g. float32 valued 0..255 would clamp to the top
 * of the colormap everywhere). For float layers we instead use the real range
 * from the value histogram when it is available. Integer dtypes keep their
 * dtype range so existing scenes render unchanged.
 *
 * For a LABEL mask it is `[0, LABEL_ID_CEILING]` regardless of dtype, and
 * nothing normalizes against it. It is here because the range is ALSO what the
 * EMPTY-brick encoding quantizes against, and over this range the 24-bit encode
 * is exact — an id in a uniform brick survives the page table unchanged. A
 * dtype range would not do: uint16's [0, 65535] through an 8-bit encode loses
 * ~257 raw units per code, so every uniform brick of a mask would decode to a
 * wrong id, and a mask is MOSTLY uniform bricks.
 *
 * This function is the SINGLE place that decision is made, and it has to be:
 * `brickResidency.derivePool` and `nodePlanTracker` call it independently, and
 * if the planner's byte accounting and the pool's allocation ever disagree the
 * plan requests slots that do not exist (the same failure `atlasFormat.ts`
 * documents for `atlasKindForGeometry`).
 */
export function resolveLayerDataRange(
  layer: ValueRangeLayer,
  dtype: string,
): [number, number] {
  if (layer.__typename === "LabelLayer") return [0, LABEL_ID_CEILING];
  if (dtype === "float32" || dtype === "float64") {
    const range = serverHistogramRange(layer);
    if (range) return range;
  }
  return mapDTypeToMinMax(dtype as DataType);
}

/**
 * The `[min, max]` from the layer's server-provided value histogram (the first
 * anchor that carries one), or `null` when absent/unusable. `null` for a float
 * layer means the dtype fallback `[0,1]` would be used — the case that
 * saturates non-normalized data to white and that client auto-contrast covers.
 */
export function serverHistogramRange(
  layer: ValueRangeLayer,
): [number, number] | null {
  const vh = layer.lens?.activeAnchors?.find((a) => a.valueHistogram)
    ?.valueHistogram;
  const min = vh?.min;
  const max = vh?.max;
  if (
    min != null &&
    max != null &&
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    max > min
  ) {
    return [min, max];
  }
  return null;
}

/**
 * Normalize an absolute contrast value into the `[0,1]` range the raymarch math
 * (GLSL `channelNormalize` and its CPU mirrors) applies clim in. `clim` is stored
 * in absolute base-native value units; `min`/`max` are the layer's base-native
 * range (`resolveLayerDataRange` / `pool.minValue`/`maxValue`). `null` means
 * "full range" — `0` for the low bound, `1` for the high bound.
 */
export function climToUnit(
  clim: number | null | undefined,
  min: number,
  max: number,
  fallback: 0 | 1,
): number {
  if (clim == null) return fallback;
  const span = max - min;
  if (span <= 0) return fallback;
  return Math.min(Math.max((clim - min) / span, 0), 1);
}
