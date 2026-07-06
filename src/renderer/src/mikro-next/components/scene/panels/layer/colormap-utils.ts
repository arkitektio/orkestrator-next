import { ColorMap } from "@/mikro-next/api/graphql";
import { ImageLayerFragment } from "../../layers/layerGuards";
import {
  colormapGradientCSS as sceneColormapGradientCSS,
  resolveBaseColorRgb,
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

export const isLayerDirty = (
  current: ImageLayerFragment,
  original: ImageLayerFragment | undefined,
): boolean => {
  if (!original) return true;
  const currentColor = resolveBaseColorRgb(current.color);
  const originalColor = resolveBaseColorRgb(original.color);
  const sameColor = currentColor.every((value, index) => value === originalColor[index]);

  return (
    current.climMin !== original.climMin ||
    current.climMax !== original.climMax ||
    !sameColor ||
    current.colormap !== original.colormap ||
    current.xDim !== original.xDim ||
    current.yDim !== original.yDim ||
    current.zDim !== original.zDim ||
    current.intensityDim !== original.intensityDim
  );
};
