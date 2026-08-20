import { describe, expect, it } from "vitest";
import { resolveLayerDataRange } from "./dataRange";
import type { ImageLayerFragment } from "./layerGuards";

const layerWith = (histogram: { min: number; max: number } | null) =>
  ({
    lens: {
      activeAnchors: histogram
        ? [{ valueHistogram: { min: histogram.min, max: histogram.max } }]
        : [{ valueHistogram: null }],
    },
  }) as unknown as ImageLayerFragment;

describe("resolveLayerDataRange", () => {
  it("uses the value histogram range for float data (dtype range is a poor proxy)", () => {
    expect(resolveLayerDataRange(layerWith({ min: 0, max: 255 }), "float32")).toEqual([0, 255]);
    expect(resolveLayerDataRange(layerWith({ min: -2, max: 6 }), "float64")).toEqual([-2, 6]);
  });

  it("falls back to the dtype range for float data without a usable histogram", () => {
    expect(resolveLayerDataRange(layerWith(null), "float32")).toEqual([0, 1]);
    // Degenerate (min === max) histograms are ignored.
    expect(resolveLayerDataRange(layerWith({ min: 5, max: 5 }), "float32")).toEqual([0, 1]);
  });

  it("keeps the dtype range for integer data even when a histogram exists", () => {
    expect(resolveLayerDataRange(layerWith({ min: 10, max: 200 }), "uint8")).toEqual([0, 255]);
    expect(resolveLayerDataRange(layerWith({ min: 0, max: 4095 }), "uint16")).toEqual([0, 65535]);
  });

  it("tolerates a missing lens/anchors and falls back to the dtype range", () => {
    expect(resolveLayerDataRange({} as ImageLayerFragment, "float32")).toEqual([0, 1]);
  });
});
