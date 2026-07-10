// @vitest-environment jsdom
// (colormaps.tsx transitively reaches app modules that touch `window`)
import { describe, expect, it } from "vitest";
import { ColorMap } from "@/mikro-next/api/graphql";
import { buildColormapAtlas, sampleColorMapRgb } from "./colormaps";

/**
 * The brick compositor multiplies each channel's atlas-row sample by the
 * channel's normalized intensity — so tint rows (INTENSITY / colorless) must
 * hold the CONSTANT channel color, not a ramp. A ramp double-counts intensity
 * (renders intensity²); identical white rows across channels composite to
 * gray. This pins the exact server payload of the "debug · astronaut rgb"
 * scene: three channels, colormap INTENSITY, colors pure R/G/B.
 */

const rowTexel = (atlas: ReturnType<typeof buildColormapAtlas>, row: number, x: number) => {
  const data = atlas.image.data as Uint8Array;
  const idx = (row * 256 + x) * 4;
  return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
};

describe("buildColormapAtlas", () => {
  it("bakes INTENSITY-with-color channels as constant tint rows", () => {
    const atlas = buildColormapAtlas([
      { colormap: ColorMap.Intensity, color: [255, 0, 0] },
      { colormap: ColorMap.Intensity, color: [0, 255, 0] },
      { colormap: ColorMap.Intensity, color: [0, 0, 255] },
    ]);
    const expected = [
      [255, 0, 0, 255],
      [0, 255, 0, 255],
      [0, 0, 255, 255],
    ];
    for (let row = 0; row < 3; row++) {
      // Constant across the whole row — start, middle, end.
      expect(rowTexel(atlas, row, 0)).toEqual(expected[row]);
      expect(rowTexel(atlas, row, 128)).toEqual(expected[row]);
      expect(rowTexel(atlas, row, 255)).toEqual(expected[row]);
    }
    atlas.dispose();
  });

  it("bakes INTENSITY-without-color as a constant white row", () => {
    const atlas = buildColormapAtlas([{ colormap: ColorMap.Intensity, color: null }]);
    expect(rowTexel(atlas, 0, 0)).toEqual([255, 255, 255, 255]);
    expect(rowTexel(atlas, 0, 255)).toEqual([255, 255, 255, 255]);
    atlas.dispose();
  });

  it("keeps colorless channels as constant tints and named colormaps as LUTs", () => {
    const atlas = buildColormapAtlas([
      { colormap: null, color: [0, 128, 255] },
      { colormap: ColorMap.Viridis, color: null },
    ]);
    expect(rowTexel(atlas, 0, 10)).toEqual(rowTexel(atlas, 0, 200)); // constant tint
    expect(rowTexel(atlas, 1, 10)).not.toEqual(rowTexel(atlas, 1, 200)); // real LUT
    atlas.dispose();
  });

  it("leaves sampleColorMapRgb's Intensity ramp for self-contained LUT consumers", () => {
    // getColorMapTexture / CSS swatches bake intensity INTO their LUTs.
    expect(sampleColorMapRgb(ColorMap.Intensity, 0, [255, 0, 0])).toEqual([0, 0, 0]);
    expect(sampleColorMapRgb(ColorMap.Intensity, 1, [255, 0, 0])).toEqual([1, 0, 0]);
  });
});
