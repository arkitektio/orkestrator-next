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
