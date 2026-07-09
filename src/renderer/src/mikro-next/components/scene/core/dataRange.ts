import type { DataType } from "zarrita";
import { mapDTypeToMinMax } from "../stores/utils";
import type { ImageLayerFragment } from "./layerGuards";

/**
 * The intensity range used to normalize sampled values to [0,1] before the
 * render graph's (normalized) contrast limits are applied.
 *
 * `mapDTypeToMinMax` returns [0,1] for float dtypes, which is a poor proxy when
 * the data isn't normalized (e.g. float32 valued 0..255 would clamp to the top
 * of the colormap everywhere). For float layers we instead use the real range
 * from the value histogram when it is available. Integer dtypes keep their
 * dtype range so existing scenes render unchanged.
 */
export function resolveLayerDataRange(
  layer: ImageLayerFragment,
  dtype: string,
): [number, number] {
  if (dtype === "float32" || dtype === "float64") {
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
  }
  return mapDTypeToMinMax(dtype as DataType);
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
