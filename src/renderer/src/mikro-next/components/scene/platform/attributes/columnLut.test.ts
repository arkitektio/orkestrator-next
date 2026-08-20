// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { ColorMap } from "@/mikro-next/api/graphql";
import {
  allocateColumnLut,
  classColorFor,
  columnLutTexels,
  isDirectEntry,
  looksNumeric,
  LUT_WIDTH,
  paintColumnLut,
  ruleKeeps,
} from "./columnLut";

/**
 * The semantics MESH and LABEL colourings share. These are the rules that must
 * not drift between the two features — which is the whole reason this module was
 * extracted out of `fabriksColorLut.ts` — so they are pinned here rather than in
 * either caller's tests.
 */

const at = (data: Uint8Array, slot: number) =>
  [data[slot * 4], data[slot * 4 + 1], data[slot * 4 + 2], data[slot * 4 + 3]] as const;

describe("isDirectEntry", () => {
  it("is true with no hops and false with any", () => {
    expect(isDirectEntry({ joinPath: [] })).toBe(true);
    expect(isDirectEntry({})).toBe(true);
    expect(isDirectEntry({ joinPath: null })).toBe(true);
    expect(isDirectEntry({ joinPath: [{ table: "t", column: "c" }] })).toBe(false);
  });
});

describe("looksNumeric", () => {
  it("decides from the first non-null value", () => {
    expect(looksNumeric([1, 2, 3])).toBe(true);
    expect(looksNumeric(["12", "13"])).toBe(true);
    expect(looksNumeric(["cell", "nucleus"])).toBe(false);
    // Nulls are skipped, not answered.
    expect(looksNumeric([null, undefined, 5])).toBe(true);
    expect(looksNumeric([null, "cell"])).toBe(false);
    // Nothing to go on: not numeric, so it takes the categorical path, which
    // needs no range.
    expect(looksNumeric([])).toBe(false);
  });
});

describe("ruleKeeps", () => {
  const rule = (over: Record<string, unknown>) =>
    ({ table: "t", column: "c", exclude: false, ...over }) as never;

  it("keeps everything when the rule states nothing", () => {
    // Reading an unconfigured rule as "keep nothing" would blank the layer the
    // moment one is switched on.
    expect(ruleKeeps(rule({}), 5)).toBe(true);
    expect(ruleKeeps(rule({ values: [] }), "x")).toBe(true);
  });

  it("bounds a measure inclusively at both ends", () => {
    const r = rule({ min: 10, max: 20 });
    expect(ruleKeeps(r, 10)).toBe(true);
    expect(ruleKeeps(r, 20)).toBe(true);
    expect(ruleKeeps(r, 9.9)).toBe(false);
    expect(ruleKeeps(r, 20.1)).toBe(false);
  });

  it("honours a one-sided bound", () => {
    expect(ruleKeeps(rule({ min: 10 }), 100)).toBe(true);
    expect(ruleKeeps(rule({ max: 10 }), 100)).toBe(false);
  });

  it("drops a non-numeric value under a bound", () => {
    expect(ruleKeeps(rule({ min: 0, max: 10 }), "cell")).toBe(false);
    expect(ruleKeeps(rule({ min: 0, max: 10 }), undefined)).toBe(false);
  });

  it("treats a NULL value under a bound as 0 — a pre-existing quirk, pinned", () => {
    // `Number(null)` is 0, so a null lands inside any range that contains 0 and
    // outside every range that does not. Inherited unchanged from the mesh
    // implementation this was extracted from: it is asserted here so the
    // behaviour is visible and so a deliberate change to it shows up as a test
    // change rather than as a silent rendering difference on mesh layers.
    expect(ruleKeeps(rule({ min: 0, max: 10 }), null)).toBe(true);
    expect(ruleKeeps(rule({ min: 5, max: 10 }), null)).toBe(false);
  });

  it("matches a value set by string, so a numeric 3 matches '3'", () => {
    expect(ruleKeeps(rule({ values: ["3"] }), 3)).toBe(true);
    expect(ruleKeeps(rule({ values: ["cell"] }), "cell")).toBe(true);
    expect(ruleKeeps(rule({ values: ["cell"] }), "nucleus")).toBe(false);
    expect(ruleKeeps(rule({ values: ["cell"] }), null)).toBe(false);
  });

  it("inverts the ANSWER, not the test", () => {
    // `exclude` on an unconfigured rule still keeps everything — there is no
    // match to invert.
    expect(ruleKeeps(rule({ min: 10, max: 20, exclude: true }), 15)).toBe(false);
    expect(ruleKeeps(rule({ min: 10, max: 20, exclude: true }), 5)).toBe(true);
    expect(ruleKeeps(rule({ exclude: true }), 5)).toBe(true);
  });

  it("prefers a value set over bounds when both are set", () => {
    expect(ruleKeeps(rule({ values: ["5"], min: 100, max: 200 }), 5)).toBe(true);
  });
});

describe("classColorFor", () => {
  it("uses an explicit classColors entry when there is one", () => {
    expect(classColorFor("cell", { cell: [10, 20, 30] }, 0)).toEqual([10, 20, 30]);
  });

  it("derives a stable hue from the VALUE's rank otherwise", () => {
    // Keyed by the value's rank, not the object's, so every object sharing a
    // value shares its colour — the whole point of a categorical colouring.
    const a = classColorFor("cell", null, 3);
    const b = classColorFor("cell", null, 3);
    expect(a).toEqual(b);
    expect(classColorFor("cell", null, 4)).not.toEqual(a);
  });

  it("ignores a malformed classColors entry", () => {
    expect(classColorFor("cell", { cell: [1, 2] }, 0)).toEqual(classColorFor("cell", null, 0));
    expect(classColorFor("cell", "nonsense", 0)).toEqual(classColorFor("cell", null, 0));
  });
});

describe("allocateColumnLut", () => {
  it("fills white and opaque — the IDENTITY", () => {
    // The materials multiply the colour and discard on zero alpha, so a slot no
    // read covered renders exactly as it would with no LUT at all.
    const { data } = allocateColumnLut(3);
    expect(at(data, 0)).toEqual([255, 255, 255, 255]);
    expect(at(data, 2)).toEqual([255, 255, 255, 255]);
  });

  it("wraps into rows past the texture width", () => {
    const { width, height } = allocateColumnLut(LUT_WIDTH + 1);
    expect(width).toBe(LUT_WIDTH);
    expect(height).toBe(2);
  });

  it("never allocates zero", () => {
    expect(allocateColumnLut(0).data.length).toBe(4);
  });

  it("columnLutTexels agrees with what it would allocate", () => {
    for (const count of [1, 5, LUT_WIDTH, LUT_WIDTH + 1, LUT_WIDTH * 3 - 7]) {
      const { width, height } = allocateColumnLut(count);
      expect(columnLutTexels(count)).toBe(width * height);
    }
  });
});

describe("paintColumnLut", () => {
  const targets = [
    { objectId: 10, slot: 0 },
    { objectId: 20, slot: 1 },
    { objectId: 30, slot: 2 },
  ];

  const paint = (over: Partial<Parameters<typeof paintColumnLut>[0]> = {}) => {
    const { data } = allocateColumnLut(3);
    paintColumnLut({
      data,
      targets,
      colorBy: null,
      filterBys: [],
      colorValues: null,
      ruleValues: [],
      ...over,
    });
    return data;
  };

  it("ramps a measure over the range found IN THE DATA", () => {
    // A colour-by entry carries a colormap and no bounds, so the range has to
    // come from the values; otherwise every object lands at one end of the ramp.
    const data = paint({
      colorBy: { table: "t", column: "area", colormap: ColorMap.Viridis },
      colorValues: new Map([
        [10, 0],
        [20, 50],
        [30, 100],
      ]),
    });
    const [lo, mid, hi] = [at(data, 0), at(data, 1), at(data, 2)];
    expect(lo).not.toEqual(mid);
    expect(mid).not.toEqual(hi);
    // Still opaque — a colouring is not a filter.
    expect(lo[3]).toBe(255);
  });

  it("puts a CONSTANT column mid-ramp instead of dividing by a zero span", () => {
    const data = paint({
      colorBy: { table: "t", column: "area", colormap: ColorMap.Viridis },
      colorValues: new Map([
        [10, 7],
        [20, 7],
      ]),
    });
    expect(at(data, 0)).toEqual(at(data, 1));
    // And not the identity — it WAS coloured, just uniformly.
    expect(at(data, 0).slice(0, 3)).not.toEqual([255, 255, 255]);
  });

  it("gives every object sharing a categorical value the same colour", () => {
    const data = paint({
      colorBy: { table: "t", column: "kind" },
      colorValues: new Map<number, unknown>([
        [10, "cell"],
        [20, "nucleus"],
        [30, "cell"],
      ]),
    });
    expect(at(data, 0)).toEqual(at(data, 2));
    expect(at(data, 0)).not.toEqual(at(data, 1));
  });

  it("is stable across builds — the palette must not reshuffle", () => {
    const values = new Map<number, unknown>([
      [10, "b"],
      [20, "a"],
      [30, "c"],
    ]);
    const colorBy = { table: "t", column: "kind" };
    expect(paint({ colorBy, colorValues: values })).toEqual(
      paint({ colorBy, colorValues: values }),
    );
  });

  it("leaves an object with no row at the identity", () => {
    const data = paint({
      colorBy: { table: "t", column: "area", colormap: ColorMap.Viridis },
      colorValues: new Map([[10, 5]]),
    });
    expect(at(data, 1)).toEqual([255, 255, 255, 255]);
  });

  it("zeroes alpha for what a rule drops and leaves the rest opaque", () => {
    const data = paint({
      filterBys: [{ table: "t", column: "area", min: 15, max: 100, exclude: false }],
      ruleValues: [
        new Map([
          [10, 5],
          [20, 50],
          [30, 500],
        ]),
      ],
    });
    expect(at(data, 0)[3]).toBe(0);
    expect(at(data, 1)[3]).toBe(255);
    expect(at(data, 2)[3]).toBe(0);
  });

  it("combines rules with AND", () => {
    const data = paint({
      filterBys: [
        { table: "t", column: "a", min: 0, max: 100, exclude: false },
        { table: "t", column: "b", values: ["yes"], exclude: false },
      ],
      ruleValues: [
        new Map([
          [10, 50],
          [20, 50],
          [30, 500],
        ]),
        new Map<number, unknown>([
          [10, "yes"],
          [20, "no"],
          [30, "yes"],
        ]),
      ],
    });
    expect(at(data, 0)[3]).toBe(255); // passes both
    expect(at(data, 1)[3]).toBe(0); // fails b
    expect(at(data, 2)[3]).toBe(0); // fails a
  });

  it("applies a rule whose column could not be read to NOTHING", () => {
    // Silently hiding every object because a read failed is the worst possible
    // reading of "filter".
    const data = paint({
      filterBys: [{ table: "t", column: "area", min: 0, max: 1, exclude: false }],
      ruleValues: [null],
    });
    expect(at(data, 0)[3]).toBe(255);
    expect(at(data, 1)[3]).toBe(255);
  });

  it("drops an object a rule has no row for", () => {
    // A bound rule against a missing value is not a match, so the object goes.
    const data = paint({
      filterBys: [{ table: "t", column: "area", min: 0, max: 100, exclude: false }],
      ruleValues: [new Map([[10, 50]])],
    });
    expect(at(data, 0)[3]).toBe(255);
    expect(at(data, 1)[3]).toBe(0);
  });
});
