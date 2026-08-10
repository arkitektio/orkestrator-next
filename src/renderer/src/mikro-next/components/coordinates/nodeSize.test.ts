import { describe, expect, it } from "vitest";
import {
  AXIS_ROW_HEIGHT,
  FRAME_PILL_HEIGHT,
  SYSTEM_BASE_HEIGHT,
  systemNodeSize,
} from "./nodeSize";

/**
 * ELK places boxes off these numbers, so a node that renders taller than it
 * measures shows up as overlapping cards — not as a wrong number.
 */

const dataset = (name: string) => ({ __typename: "ADataset", name });
const axes = (n: number) => Array.from({ length: n }, (_, i) => i);

describe("systemNodeSize", () => {
  it("measures an inhabited space with one axis row as the bare base", () => {
    // Its residents are their own nodes, so they add nothing to this box.
    expect(systemNodeSize({ residents: [dataset("a")], axes: axes(3) })).toEqual(
      { width: 250, height: SYSTEM_BASE_HEIGHT },
    );
  });

  it("does not grow with residents — they hang off the node", () => {
    const one = systemNodeSize({ residents: [dataset("a")], axes: axes(3) });
    const many = systemNodeSize({
      residents: Array.from({ length: 40 }, (_, i) => dataset(`tile-${i}`)),
      axes: axes(3),
    });
    expect(many.height).toBe(one.height);
  });

  it("gives a reference frame room for the pill that says so", () => {
    expect(systemNodeSize({ residents: [], axes: axes(3) }).height).toBe(
      SYSTEM_BASE_HEIGHT + FRAME_PILL_HEIGHT,
    );
  });

  it("grows with wrapped axis rows, and only past the first", () => {
    const four = systemNodeSize({ residents: [], axes: axes(4) });
    const five = systemNodeSize({ residents: [], axes: axes(5) });
    expect(five.height - four.height).toBe(AXIS_ROW_HEIGHT);
  });
});
