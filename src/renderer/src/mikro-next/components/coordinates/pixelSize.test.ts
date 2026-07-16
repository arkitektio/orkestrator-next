import { describe, expect, it } from "vitest";
import { formatPixelSize, pixelSizeEntries } from "./pixelSize";

/**
 * A calibration's pixel size is displayed by pairing three differently-ordered
 * things (input-ordered `scale`, output-ordered axis names, units on the output
 * system). These tests pin the pairing — the display-side twin of the authoring
 * trap in forms/registration/mapping.test.ts.
 */

// The physical (y, x) system in micrometres.
const PHYSICAL = [
  { name: "y", unit: "µm" },
  { name: "x", unit: "µm" },
];

describe("pixelSizeEntries", () => {
  it("reads a SCALE edge's per-axis factors with their units", () => {
    const entries = pixelSizeEntries(
      { inputAxes: ["y", "x"], outputAxes: ["y", "x"], scale: [0.5, 0.25] },
      PHYSICAL,
    );

    expect(entries).toEqual([
      { axis: "y", value: 0.5, unit: "µm" },
      { axis: "x", value: 0.25, unit: "µm" },
    ]);
  });

  it("takes the label from the OUTPUT axis when a calibration renames", () => {
    // The edge maps intrinsic (row, col) onto physical (y, x). The units live
    // on y and x; looking "row" up among the physical axes would find nothing
    // and silently drop the unit.
    const entries = pixelSizeEntries(
      { inputAxes: ["row", "col"], outputAxes: ["y", "x"], scale: [0.5, 0.25] },
      PHYSICAL,
    );

    expect(entries).toEqual([
      { axis: "y", value: 0.5, unit: "µm" },
      { axis: "x", value: 0.25, unit: "µm" },
    ]);
  });

  it("does not mis-pair when a calibration swaps axes", () => {
    // Intrinsic y lands on physical x and vice versa. Pairing by position
    // through the edge keeps each number on the axis it actually belongs to;
    // looking the INPUT name up among the output axes would put 0.5 on y —
    // confidently, and wrongly.
    const entries = pixelSizeEntries(
      { inputAxes: ["y", "x"], outputAxes: ["x", "y"], scale: [0.5, 0.25] },
      PHYSICAL,
    );

    expect(entries).toEqual([
      { axis: "x", value: 0.5, unit: "µm" },
      { axis: "y", value: 0.25, unit: "µm" },
    ]);
  });

  it("reads an AFFINE calibration off the matrix diagonal", () => {
    // M x (N+1): rows output, columns input, last column the translation. The
    // pixel size is the diagonal; the offset is not part of it.
    const entries = pixelSizeEntries(
      {
        inputAxes: ["y", "x"],
        outputAxes: ["y", "x"],
        affine: [
          [0.5, 0, 10],
          [0, 0.25, -4],
        ],
      },
      PHYSICAL,
    );

    expect(entries).toEqual([
      { axis: "y", value: 0.5, unit: "µm" },
      { axis: "x", value: 0.25, unit: "µm" },
    ]);
  });

  it("returns nothing for an edge that encodes no per-axis size", () => {
    // A displacement field has no pixel size to state. Better to say nothing
    // than to invent a 1.
    expect(
      pixelSizeEntries({ inputAxes: ["y", "x"], outputAxes: ["y", "x"] }, PHYSICAL),
    ).toEqual([]);
    expect(pixelSizeEntries(null, PHYSICAL)).toEqual([]);
  });

  it("reports a null unit rather than guessing one", () => {
    const entries = pixelSizeEntries(
      { inputAxes: ["y"], outputAxes: ["y"], scale: [2] },
      [{ name: "y", unit: null }],
    );

    expect(entries).toEqual([{ axis: "y", value: 2, unit: null }]);
  });

  it("falls back to the input name only when the edge names no outputs", () => {
    const entries = pixelSizeEntries(
      { inputAxes: ["y"], scale: [0.5] },
      PHYSICAL,
    );

    expect(entries).toEqual([{ axis: "y", value: 0.5, unit: "µm" }]);
  });
});

describe("formatPixelSize", () => {
  it("renders an axis, its size and its unit", () => {
    expect(formatPixelSize({ axis: "x", value: 0.325, unit: "µm" })).toBe(
      "x 0.325 µm",
    );
  });

  it("omits a missing unit rather than printing null", () => {
    expect(formatPixelSize({ axis: "c", value: 1, unit: null })).toBe("c 1");
  });
});
