import { describe, expect, it } from "vitest";
import {
  AXIS_ROW_HEIGHT,
  MAX_VISIBLE_RESIDENTS,
  RESIDENT_ROW_HEIGHT,
  residentRowCount,
  SYSTEM_BASE_HEIGHT,
  systemNodeSize,
} from "./nodeSize";

/**
 * ELK places boxes off these numbers, so a node that renders taller than it
 * measures shows up as overlapping cards — not as a wrong number. These tests
 * pin the two things that grow a coordinate system node: who lives in it, and
 * how many axes it has.
 */

const dataset = (name: string) => ({ __typename: "ADataset", name });
const axes = (n: number) => Array.from({ length: n }, (_, i) => i);

describe("residentRowCount", () => {
  it("gives a reference frame one row — the pill saying nothing lives here", () => {
    expect(residentRowCount({ residents: [] })).toBe(1);
  });

  it("draws one row per resident while they fit", () => {
    expect(residentRowCount({ residents: [dataset("a"), dataset("b")] })).toBe(
      2,
    );
  });

  it("spends one extra row on the overflow count, never more", () => {
    const many = {
      residents: Array.from({ length: 40 }, (_, i) => dataset(`tile-${i}`)),
    };
    expect(residentRowCount(many)).toBe(MAX_VISIBLE_RESIDENTS + 1);
  });

  it("does not spend an overflow row when the residents exactly fit", () => {
    const exact = {
      residents: Array.from({ length: MAX_VISIBLE_RESIDENTS }, (_, i) =>
        dataset(`tile-${i}`),
      ),
    };
    expect(residentRowCount(exact)).toBe(MAX_VISIBLE_RESIDENTS);
  });
});

describe("systemNodeSize", () => {
  it("measures a frame with a single axis row as the bare base", () => {
    expect(
      systemNodeSize({ residents: [], axes: axes(3) }).height,
      // one resident row (the frame pill) on top of the base
    ).toBe(SYSTEM_BASE_HEIGHT + RESIDENT_ROW_HEIGHT);
  });

  it("grows with residents", () => {
    const one = systemNodeSize({ residents: [dataset("a")], axes: axes(3) });
    const two = systemNodeSize({
      residents: [dataset("a"), dataset("b")],
      axes: axes(3),
    });
    expect(two.height - one.height).toBe(RESIDENT_ROW_HEIGHT);
  });

  it("grows with wrapped axis rows, and only past the first", () => {
    const four = systemNodeSize({ residents: [], axes: axes(4) });
    const five = systemNodeSize({ residents: [], axes: axes(5) });
    expect(five.height - four.height).toBe(AXIS_ROW_HEIGHT);
  });

  it("is taller for a crowded space than for an empty frame", () => {
    const crowded = systemNodeSize({
      residents: [dataset("a"), dataset("b"), dataset("c"), dataset("d")],
      axes: axes(8),
    });
    expect(crowded.height).toBeGreaterThan(
      systemNodeSize({ residents: [], axes: axes(3) }).height,
    );
  });
});
