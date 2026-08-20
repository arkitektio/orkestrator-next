import { ColorMap } from "@/mikro-next/api/graphql";
import {
  colormapGradientCSS as sceneColormapGradientCSS,
  sampleColorMapCSS as sceneSampleColorMapCSS,
} from "../gpu/colormaps";
import {
  INSTANCE_COLORMAPS,
  INSTANCE_COLORMAP_SPECS,
  instanceHue,
  type FabriksInstanceColormap,
} from "../gpu/instanceColormaps";

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

// --------------------------------------------------------- instance palettes
//
// The CATEGORICAL side of the colormap story. One set of palettes serves every
// categorical colouring — the default instance-id mode AND a categorical
// column entry — so which choices a control offers follows from the COLUMN
// (measure → the continuous `ColorMap` ramps above, categorical → these) and
// never from which control happens to host it.

/** Whether this HSL triple mirrors the shader exactly is what `paletteCSS`
 * in the mesh card used to guarantee; the math moved here verbatim so the
 * swatches, the derived `classColors` and the surface stay on the same hue. */
export const instancePaletteColor = (
  name: FabriksInstanceColormap,
  ordinal: number,
): [number, number, number] => {
  const spec = INSTANCE_COLORMAP_SPECS[name];
  const s = spec.saturation * (spec.tiered ? 0.7 + (ordinal % 3) * 0.15 : 1);
  const l = Math.min(0.55 * spec.value * (spec.tiered ? 0.78 + (ordinal % 2) * 0.22 : 1), 0.85);
  return hslToRgb255(instanceHue(ordinal), s, l);
};

/** A palette's preview: the first six instance hues under its spec. */
export const instancePaletteCSS = (name: FabriksInstanceColormap): string => {
  const colors = Array.from({ length: 6 }, (_, ordinal) => {
    const [r, g, b] = instancePaletteColor(name, ordinal);
    return `rgb(${r}, ${g}, ${b})`;
  });
  return `linear-gradient(to right, ${colors.join(", ")})`;
};

/**
 * The reserved key a palette-derived `classColors` map is stamped with, so the
 * editor can answer "which palette is this?" without reverse-engineering the
 * colours. Safe in-band: `classColorFor` looks values up by name and a string
 * under this key is not a colour triple, so the renderer ignores it.
 */
export const PALETTE_STAMP = "__palette";

/**
 * A palette made PERSISTENT: an explicit `value → [r, g, b]` map over the
 * column's distinct values, in their sorted rank order — the same rank the LUT
 * painter assigns, so the stored colours land where the derived ones would.
 * This is how a categorical column entry carries one of the instance palettes
 * through a `classColors` field that predates them.
 */
export const classColorsForPalette = (
  name: FabriksInstanceColormap,
  values: readonly string[],
): Record<string, unknown> => {
  const map: Record<string, unknown> = { [PALETTE_STAMP]: name };
  values.forEach((value, rank) => {
    map[value] = instancePaletteColor(name, rank);
  });
  return map;
};

/** The stamped palette of a `classColors` map, or null for a hand-made map. */
export const paletteOfClassColors = (
  classColors: unknown,
): FabriksInstanceColormap | null => {
  if (!classColors || typeof classColors !== "object") return null;
  const stamp = (classColors as Record<string, unknown>)[PALETTE_STAMP];
  return typeof stamp === "string" &&
    (INSTANCE_COLORMAPS as readonly string[]).includes(stamp)
    ? (stamp as FabriksInstanceColormap)
    : null;
};

/** HSL → 0-255 RGB, h/s/l all in 0..1. */
const hslToRgb255 = (h: number, s: number, l: number): [number, number, number] => {
  const channel = (n: number): number => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [
    Math.round(channel(0) * 255),
    Math.round(channel(8) * 255),
    Math.round(channel(4) * 255),
  ];
};
