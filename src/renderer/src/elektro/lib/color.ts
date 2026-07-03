import { RGBAColor } from "../api/scalars";

// Helpers around the elektro `RGBAColor` wire scalar — a 4-element list
// `[r, g, b, a]` with r/g/b in 0–255 and a in 0–1 (react-colorful's native
// ranges). Used to tint biophysics compartments.

/** The object shape react-colorful's `RgbaColorPicker` consumes/emits. */
export interface RgbaObject {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Neutral grey, used when a compartment declares no color. */
export const DEFAULT_RGBA: RgbaObject = { r: 136, g: 136, b: 136, a: 1 };

/** Wire list → picker object, tolerating null / short lists. */
export const rgbaToObject = (color?: RGBAColor | null): RgbaObject => ({
  r: Math.round(color?.[0] ?? DEFAULT_RGBA.r),
  g: Math.round(color?.[1] ?? DEFAULT_RGBA.g),
  b: Math.round(color?.[2] ?? DEFAULT_RGBA.b),
  a: color?.[3] ?? DEFAULT_RGBA.a,
});

/** Picker object → wire list (`[r, g, b, a]`, r/g/b rounded to ints). */
export const objectToRgba = (c: RgbaObject): RGBAColor => [
  Math.round(c.r),
  Math.round(c.g),
  Math.round(c.b),
  c.a,
];

/**
 * Wire list → a CSS `rgba(...)` string for swatches and THREE materials
 * (`THREE.Color` parses `rgba()` and ignores the alpha). Returns `null` when no
 * usable color is set, so callers can fall back to a default.
 */
export const rgbaToCss = (color?: RGBAColor | null): string | null =>
  color && color.length >= 3
    ? `rgba(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(
        color[2],
      )}, ${color[3] ?? 1})`
    : null;
