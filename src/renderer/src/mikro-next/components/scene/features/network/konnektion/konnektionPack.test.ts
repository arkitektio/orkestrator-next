import { describe, expect, it } from "vitest";

import type { KonnektionCellEntry, KonnektionCellIndex } from "./konnektionCatalogs";
import type { DecodedNetworkCell } from "./konnektionDecode";
import { networkCapacityFor, packNetworkCells, type PackTarget } from "./konnektionPack";

/**
 * The CPU half of the storage-buffer renderer, tested the way
 * `pointsCompute.test.ts` tests its passes: the contracts that fail SILENTLY —
 * offsets, rebases, the ghost flag — live in a pure module and are pinned
 * here. The TSL graphs themselves need a GPU to say anything.
 */

/** A decoded cell with only the fields the packer reads, plus sane rest. */
const cellOf = (options: {
  nodeCount: number;
  ghostCount: number;
  edges: number[];
  radii?: number[] | null;
  ordinals?: number[];
  attributes?: Record<string, number[]>;
}): DecodedNetworkCell => {
  const total = options.nodeCount + options.ghostCount;
  const positions = new Float32Array(total * 3);
  for (let i = 0; i < positions.length; i++) positions[i] = i + 1; // distinct, nonzero
  return {
    level: 0,
    cell: 0,
    positions,
    edges: new Uint32Array(options.edges),
    nodeIds: new Float64Array(total),
    radii: options.radii ? new Float32Array(options.radii) : null,
    attributes: Object.fromEntries(
      Object.entries(options.attributes ?? {}).map(([name, values]) => [
        name,
        new Float32Array(values),
      ]),
    ),
    nodeOrdinals: new Float32Array(options.ordinals ?? new Array<number>(total).fill(0)),
    nodeCount: options.nodeCount,
    ghostCount: options.ghostCount,
    edgeCount: options.edges.length / 2,
    bytes: 0,
  };
};

const targetFor = (nodes: number, edges: number): PackTarget => ({
  positions: new Float32Array(nodes * 3),
  aux: new Float32Array(nodes * 4),
  values: new Float32Array(nodes),
  edges: new Uint32Array(edges * 2),
});

/** The identity trailer every unstyled pack result carries. */
const unstyled = { attributesMissing: [], valueMin: null, valueMax: null };

/** An index with only what the capacity math reads. */
const indexOf = (
  levels: Record<number, { nodeCount: number; ghostCount: number; edgeCount: number }[]>,
): KonnektionCellIndex => {
  const byLevel = new Map<number, KonnektionCellEntry[]>();
  for (const [level, rows] of Object.entries(levels)) {
    byLevel.set(
      Number(level),
      rows.map((row) => row as KonnektionCellEntry),
    );
  }
  const cells = [...byLevel.values()].flat();
  return {
    cells,
    byKey: new Map(),
    byLevel,
    levels: [...byLevel.keys()].sort((a, b) => a - b),
    root: 0,
  };
};

describe("packNetworkCells", () => {
  it("concatenates cells at running offsets and rebases their edges", () => {
    // First cell: 2 owned nodes, one edge 0-1. Second: 2 owned + 1 ghost, one
    // edge reaching the ghost (index 2 >= nodeCount) — the case whose rebase
    // must still be the plain node offset, ghosts being the tail of their own
    // cell's span.
    const first = cellOf({ nodeCount: 2, ghostCount: 0, edges: [0, 1] });
    const second = cellOf({ nodeCount: 2, ghostCount: 1, edges: [0, 2] });
    const target = targetFor(8, 8);

    const result = packNetworkCells([first, second], target);
    expect(result).toEqual({ nodes: 5, edges: 2, cells: 2, clamped: false, ...unstyled });

    // Positions memcpy'd at the right slots.
    expect([...target.positions.subarray(0, 6)]).toEqual([...first.positions]);
    expect([...target.positions.subarray(6, 15)]).toEqual([...second.positions]);

    // Edges rebased by each cell's node offset — the ghost endpoint included.
    expect([...target.edges.subarray(0, 4)]).toEqual([0, 1, 2, 4]);
  });

  it("writes radius, ordinal and the ghost glyph flag into aux", () => {
    const cell = cellOf({
      nodeCount: 2,
      ghostCount: 1,
      edges: [],
      radii: [1.5, 2.5, 3.5],
      ordinals: [7, 8, 9],
    });
    const target = targetFor(4, 4);
    packNetworkCells([cell], target);

    // (radius, ordinal, glyphScale, visible) per slot; the ghost's glyphScale
    // is 0 so its sphere degenerates instead of double-drawing its owner's
    // node, and an unstyled slot is fully visible — both bits, 3.
    expect([...target.aux.subarray(0, 12)]).toEqual([
      1.5, 7, 1, 3,
      2.5, 8, 1, 3,
      3.5, 9, 0, 3,
    ]);
  });

  it("marks radius 0 where the collection carries none, for the uniform fallback", () => {
    const cell = cellOf({ nodeCount: 2, ghostCount: 0, edges: [], radii: null });
    const target = targetFor(2, 1);
    packNetworkCells([cell], target);
    expect(target.aux[0]).toBe(0);
    expect(target.aux[4]).toBe(0);
  });

  it("clamps at whole-cell granularity rather than writing out of bounds", () => {
    const first = cellOf({ nodeCount: 2, ghostCount: 0, edges: [0, 1] });
    const second = cellOf({ nodeCount: 3, ghostCount: 0, edges: [0, 1, 1, 2] });
    // Room for the first cell only.
    const target = targetFor(3, 2);

    const result = packNetworkCells([first, second], target);
    expect(result).toEqual({ nodes: 2, edges: 1, cells: 1, clamped: true, ...unstyled });
    // Nothing of the second cell landed anywhere.
    expect([...target.positions.subarray(6)]).toEqual([0, 0, 0]);
  });

  it("packs nothing for an empty plan", () => {
    const target = targetFor(2, 2);
    expect(packNetworkCells([], target)).toEqual({
      nodes: 0,
      edges: 0,
      cells: 0,
      clamped: false,
      ...unstyled,
    });
  });

  it("scatters the active attribute into values and reports its finite range", () => {
    const cell = cellOf({
      nodeCount: 2,
      ghostCount: 1,
      edges: [],
      attributes: { strahler: [2, 5, Number.NaN] },
    });
    const target = targetFor(4, 1);
    const result = packNetworkCells([cell], target, {
      valueAttribute: "strahler",
      ordinalValues: null,
      rules: [],
      hiddenOrdinals: null,
    });
    expect([...target.values.subarray(0, 2)]).toEqual([2, 5]);
    expect(Number.isNaN(target.values[2])).toBe(true);
    // NaN — a rootless object's strahler — is excluded from the stretch range.
    expect(result.valueMin).toBe(2);
    expect(result.valueMax).toBe(5);
    expect(result.attributesMissing).toEqual([]);
  });

  it("reads `radius` off the radii the format already decodes", () => {
    const cell = cellOf({ nodeCount: 2, ghostCount: 0, edges: [], radii: [1.5, 2.5] });
    const target = targetFor(2, 1);
    packNetworkCells([cell], target, {
      valueAttribute: "radius",
      ordinalValues: null,
      rules: [],
      hiddenOrdinals: null,
    });
    expect([...target.values.subarray(0, 2)]).toEqual([1.5, 2.5]);
  });

  it("folds the rules into the two visibility bits, NaN kept in both polarities", () => {
    const cell = cellOf({
      nodeCount: 4,
      ghostCount: 0,
      edges: [],
      attributes: { degree: [1, 3, Number.NaN, 3] },
    });
    const target = targetFor(4, 1);
    packNetworkCells([cell], target, {
      valueAttribute: null,
      ordinalValues: null,
      rules: [
        // A NODE rule clears both bits where it fails; an EDGE rule only the
        // edge bit. Node 3 fails the EDGE rule (exclude inverts the TEST).
        { attribute: "degree", min: 2, max: null, exclude: false, target: "NODE" },
        { attribute: "degree", min: 3, max: null, exclude: true, target: "EDGE" },
      ],
      hiddenOrdinals: null,
    });
    const visibility = [target.aux[3], target.aux[7], target.aux[11], target.aux[15]];
    // degree 1: NODE rule fails → hidden entirely. degree 3: NODE keeps, EDGE
    // rule (exclude ≥3) fails → glyph only. NaN: a filter must never hide
    // something it never saw — fully visible under BOTH rules.
    expect(visibility).toEqual([0, 1, 3, 1]);
  });

  it("scatters object-level values and hides hidden ordinals wholesale", () => {
    const cell = cellOf({ nodeCount: 3, ghostCount: 0, edges: [], ordinals: [0, 1, 1] });
    const target = targetFor(3, 1);
    const ordinalValues = new Float32Array([10, 20]);
    packNetworkCells([cell], target, {
      valueAttribute: null,
      ordinalValues,
      rules: [],
      hiddenOrdinals: new Set([1]),
    });
    expect([...target.values.subarray(0, 3)]).toEqual([10, 20, 20]);
    expect([target.aux[3], target.aux[7], target.aux[11]]).toEqual([3, 0, 0]);
  });

  it("skips and surfaces a rule over an attribute the cells do not carry", () => {
    const cell = cellOf({ nodeCount: 2, ghostCount: 0, edges: [] });
    const target = targetFor(2, 1);
    const result = packNetworkCells([cell], target, {
      valueAttribute: "strahler",
      ordinalValues: null,
      rules: [{ attribute: "tortuosity", min: 1, max: null, exclude: false, target: "NODE" }],
      hiddenOrdinals: null,
    });
    // The rule applied to NOTHING — a filter quietly applying looks exactly
    // like one that works, so absence keeps everything and gets surfaced.
    expect([target.aux[3], target.aux[7]]).toEqual([3, 3]);
    expect(result.attributesMissing).toEqual(["strahler", "tortuosity"]);
  });
});

describe("networkCapacityFor", () => {
  it("uses the worst level's totals when they fit the budgets", () => {
    const index = indexOf({
      0: [
        { nodeCount: 10, ghostCount: 2, edgeCount: 9 },
        { nodeCount: 5, ghostCount: 0, edgeCount: 4 },
      ],
      1: [{ nodeCount: 6, ghostCount: 1, edgeCount: 5 }],
    });
    expect(networkCapacityFor(index, { maxNodes: 1000, maxEdges: 1000 })).toEqual({
      nodes: 17,
      edges: 13,
    });
  });

  it("clamps to the budgets, but never below the largest single cell", () => {
    // The planner's capToBudgets keeps the first cell unconditionally, so a
    // single cell over budget must still fit the buffers.
    const index = indexOf({
      0: [
        { nodeCount: 100, ghostCount: 0, edgeCount: 99 },
        { nodeCount: 100, ghostCount: 0, edgeCount: 99 },
      ],
    });
    expect(networkCapacityFor(index, { maxNodes: 150, maxEdges: 120 })).toEqual({
      nodes: 150,
      edges: 120,
    });
    expect(networkCapacityFor(index, { maxNodes: 50, maxEdges: 40 })).toEqual({
      nodes: 100,
      edges: 99,
    });
  });

  it("is zero for an empty index", () => {
    expect(networkCapacityFor(indexOf({}), { maxNodes: 100, maxEdges: 100 })).toEqual({
      nodes: 0,
      edges: 0,
    });
  });
});
