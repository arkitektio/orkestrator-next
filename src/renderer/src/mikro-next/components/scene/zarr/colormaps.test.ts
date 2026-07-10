// @vitest-environment jsdom
// (colormaps.tsx transitively reaches app modules that touch `window`)
import { describe, expect, it } from "vitest";
import { ColorMap } from "@/mikro-next/api/graphql";
import { buildColormapAtlas, sampleColorMapRgb } from "./colormaps";

/**
 * Response-curve convention for the brick compositor's atlas (deliberate,
 * user-validated — see buildColormapAtlas): NAMED colormap rows (INTENSITY
 * with base color, the monochrome family, multi-color LUTs) bake their
 * self-contained ramps; the compositor's extra × intensity multiply gives
 * them the ORIGINAL intensity² look ("true to life" on the additive output
 * path). A linear constant-row factoring was tried and rejected (washed-out
 * midtones). The invariant that MUST hold: INTENSITY+color and its named
 * monochrome twin produce IDENTICAL rows — same hue, same curve.
 */

const rowTexel = (atlas: ReturnType<typeof buildColormapAtlas>, row: number, x: number) => {
  const data = atlas.image.data as Uint8Array;
  const idx = (row * 256 + x) * 4;
  return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
};

describe("buildColormapAtlas", () => {
  it("INTENSITY+color bakes the SAME ramp as its named monochrome twin", () => {
    const atlas = buildColormapAtlas([
      { colormap: ColorMap.Intensity, color: [0, 255, 255] },
      { colormap: ColorMap.Cyan, color: null },
      { colormap: ColorMap.Intensity, color: [255, 0, 0] },
      { colormap: ColorMap.Red, color: null },
    ]);
    for (const x of [0, 64, 128, 255]) {
      expect(rowTexel(atlas, 0, x)).toEqual(rowTexel(atlas, 1, x)); // cyan twins
      expect(rowTexel(atlas, 2, x)).toEqual(rowTexel(atlas, 3, x)); // red twins
    }
    // And they ARE ramps (self-contained), not constants: black at 0, full at 255.
    expect(rowTexel(atlas, 0, 0)).toEqual([0, 0, 0, 255]);
    expect(rowTexel(atlas, 0, 255)).toEqual([0, 255, 255, 255]);
    atlas.dispose();
  });

  it("INTENSITY without color ramps to white", () => {
    const atlas = buildColormapAtlas([{ colormap: ColorMap.Intensity, color: null }]);
    expect(rowTexel(atlas, 0, 0)).toEqual([0, 0, 0, 255]);
    expect(rowTexel(atlas, 0, 255)).toEqual([255, 255, 255, 255]);
    atlas.dispose();
  });

  it("keeps colorless-colormap tints constant and multi-color LUTs as LUTs", () => {
    const atlas = buildColormapAtlas([
      { colormap: null, color: [0, 128, 255] }, // legacy tint: constant (linear)
      { colormap: ColorMap.Viridis, color: null },
    ]);
    expect(rowTexel(atlas, 0, 10)).toEqual(rowTexel(atlas, 0, 200)); // constant tint
    expect(rowTexel(atlas, 0, 10).slice(0, 3)).toEqual([0, 128, 255]);
    expect(rowTexel(atlas, 1, 10)).not.toEqual(rowTexel(atlas, 1, 200)); // real LUT
    atlas.dispose();
  });

  it("sampleColorMapRgb keeps self-contained ramp semantics (swatches etc.)", () => {
    expect(sampleColorMapRgb(ColorMap.Intensity, 0, [255, 0, 0])).toEqual([0, 0, 0]);
    expect(sampleColorMapRgb(ColorMap.Intensity, 1, [255, 0, 0])).toEqual([1, 0, 0]);
  });
});
