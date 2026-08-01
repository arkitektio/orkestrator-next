import { ColorMap } from "@/mikro-next/api/graphql";
import {
  colormapGradientCSS as sceneColormapGradientCSS,
  sampleColorMapCSS as sceneSampleColorMapCSS,
} from "../../render/colormaps";

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
