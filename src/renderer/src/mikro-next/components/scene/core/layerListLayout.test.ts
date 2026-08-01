import { describe, expect, it } from "vitest";
import {
  columnsAt,
  fitsExpanded,
  EXPANDED_CARD_PX,
  THREE_COLUMN_PX,
  TWO_COLUMN_PX,
} from "./layerListLayout";

describe("columnsAt", () => {
  it("adds a column at each grid breakpoint, and not before", () => {
    expect(columnsAt(TWO_COLUMN_PX - 1)).toBe(1);
    expect(columnsAt(TWO_COLUMN_PX)).toBe(2);
    expect(columnsAt(THREE_COLUMN_PX - 1)).toBe(2);
    expect(columnsAt(THREE_COLUMN_PX)).toBe(3);
  });

  it("is 1 for the narrow in-viewport column (w-72)", () => {
    expect(columnsAt(288)).toBe(1);
  });
});

describe("fitsExpanded", () => {
  const tall = { width: 320, height: EXPANDED_CARD_PX * 3 };

  it("treats an unmeasured box as no space, so the first paint stays collapsed", () => {
    expect(fitsExpanded({ width: 0, height: 0 }, 1)).toBe(false);
    expect(fitsExpanded({ width: 320, height: 0 }, 1)).toBe(false);
  });

  it("opens when the column's worth of cards fits, closes when one too many", () => {
    expect(fitsExpanded(tall, 3)).toBe(true);
    expect(fitsExpanded(tall, 4)).toBe(false);
  });

  // The whole point of the column split: the same layers in a wider rail are
  // spread over more columns, so the height they need drops.
  it("counts per column, so a wider panel seats more layers at the same height", () => {
    const layers = 4;
    expect(fitsExpanded({ width: 320, height: EXPANDED_CARD_PX * 2 }, layers)).toBe(
      false,
    );
    expect(
      fitsExpanded({ width: TWO_COLUMN_PX, height: EXPANDED_CARD_PX * 2 }, layers),
    ).toBe(true);
  });

  it("has nothing to refuse with no layers", () => {
    expect(fitsExpanded({ width: 320, height: 10 }, 0)).toBe(true);
  });
});
