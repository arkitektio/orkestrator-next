import { describe, expect, it } from "vitest";
import { parallelIndices, parallelOffset } from "./edgeLayout";

/**
 * Two maps between the same two spaces must not hide each other — that is the
 * one thing drawing transformations as edges rather than nodes could lose.
 */

describe("parallelIndices", () => {
  it("leaves an edge with no siblings alone", () => {
    expect(parallelIndices([{ source: "a", target: "b" }])).toEqual([
      { index: 0, count: 1 },
    ]);
  });

  it("numbers siblings in input order", () => {
    expect(
      parallelIndices([
        { source: "a", target: "b" },
        { source: "a", target: "b" },
        { source: "a", target: "b" },
      ]),
    ).toEqual([
      { index: 0, count: 3 },
      { index: 1, count: 3 },
      { index: 2, count: 3 },
    ]);
  });

  it("treats the pair as undirected — an edge back overlaps just as much", () => {
    expect(
      parallelIndices([
        { source: "a", target: "b" },
        { source: "b", target: "a" },
      ]),
    ).toEqual([
      { index: 0, count: 2 },
      { index: 1, count: 2 },
    ]);
  });

  it("counts each pair separately", () => {
    expect(
      parallelIndices([
        { source: "a", target: "b" },
        { source: "b", target: "c" },
        { source: "a", target: "b" },
      ]),
    ).toEqual([
      { index: 0, count: 2 },
      { index: 0, count: 1 },
      { index: 1, count: 2 },
    ]);
  });
});

describe("parallelOffset", () => {
  it("does not move an edge that has the pair to itself", () => {
    expect(parallelOffset(0, 1)).toBe(0);
  });

  it("spreads siblings symmetrically about the centre line", () => {
    expect(parallelOffset(0, 2)).toBe(-parallelOffset(1, 2));
    expect(parallelOffset(1, 3)).toBe(0);
    expect(parallelOffset(0, 3)).toBeLessThan(0);
    expect(parallelOffset(2, 3)).toBeGreaterThan(0);
  });

  it("keeps siblings a full label apart", () => {
    expect(parallelOffset(1, 3) - parallelOffset(0, 3)).toBeGreaterThanOrEqual(
      30,
    );
  });
});
