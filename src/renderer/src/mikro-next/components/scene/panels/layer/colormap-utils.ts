import { ColorMap } from "@/mikro-next/api/graphql";
import type { LayerState } from "../../core/layerModel";
import {
  colormapGradientCSS as sceneColormapGradientCSS,
  sampleColorMapCSS as sceneSampleColorMapCSS,
} from "../../zarr/colormaps";

export const COLORMAP_OPTIONS = Object.values(ColorMap);

export const sampleColormapCSS = (
  colormap: ColorMap | null | undefined,
  t: number,
  baseColor?: number[] | null,
): string => {
  return sceneSampleColorMapCSS(colormap, t, baseColor);
};

export const colormapGradientCSS = (
  colormap: ColorMap | null | undefined,
  stops = 32,
  baseColor?: number[] | null,
): string => {
  return sceneColormapGradientCSS(colormap, stops, baseColor);
};

/**
 * Whether a layer's dimension mapping differs from its persisted state — the
 * "Save changes" signal for the flyout's Advanced (dims) section. Contrast /
 * colormap / color now live in the render graph, whose unsaved state is tracked
 * separately by the render-graph editor (`RenderGraphSection`). The spatial
 * axes are server-derived from axis types now, so only the intensity mapping
 * is still user-editable.
 */
export const isLayerDirty = (
  current: Pick<LayerState, "intensityDim">,
  original: Pick<LayerState, "intensityDim"> | undefined,
): boolean => {
  if (!original) return true;
  return current.intensityDim !== original.intensityDim;
};
