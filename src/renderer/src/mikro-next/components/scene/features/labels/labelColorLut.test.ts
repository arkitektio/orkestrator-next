// @vitest-environment jsdom
// (the ColorMap enum comes from the generated `graphql.ts`, whose Apollo hooks
// barrel touches `window` on load.)
import { describe, expect, it } from "vitest";

import { ColorMap } from "@/mikro-next/api/graphql";
import type { AttributePlanLike } from "@/mikro-next/lib/attributes/attributeTypes";
import type { AttributeLookupEngine } from "@/mikro-next/lib/attributes/lookupEngine";
import { accessForTable } from "../../platform/attributes/columnLut";
import { buildLabelColorLut, LABEL_LUT_MAX_TEXELS } from "./labelColorLut";
import { CODE_HIDDEN, CODE_NO_VALUE } from "../../platform/attributes/valueLut";

/**
 * The label LUT differs from the mesh one in exactly one thing — the slot mapping
 * — and inherits the rest from `attributes/columnLut.ts`. These cover the
 * difference: sparse ids offset into slots, the size cap, the identity for an id
 * the table never mentioned, and picking the right ARRAY plan for the right mask.
 */

const MASK_STORE = "zarr-mask-a";
const OTHER_MASK_STORE = "zarr-mask-b";
const lookupStore = { id: "parquet-a", bucket: "b", key: "k" };

const arrayPlan = (
  tableId: string,
  keyColumn: string,
  sampleStoreId: string,
): AttributePlanLike =>
  ({
    edge: { id: "edge", version: 1 },
    table: { id: tableId, name: tableId },
    path: [],
    sample: {
      __typename: "ArraySample",
      system: { id: "sys", name: "sys", axes: [] },
      consumes: [],
      produces: ["object_id"],
      passthrough: false,
      store: { id: sampleStoreId, key: "k", bucket: "b", path: "p" },
    },
    lookup: {
      store: lookupStore,
      keyColumns: [{ axis: "object_id", column: { id: "c", name: keyColumn } }],
      attributes: [],
      sql: "",
    },
  }) as unknown as AttributePlanLike;

const meshPlan = (tableId: string, keyColumn: string): AttributePlanLike =>
  ({
    edge: { id: "edge", version: 1 },
    table: { id: tableId, name: tableId },
    path: [],
    sample: {
      __typename: "MeshSample",
      system: { id: "sys", name: "sys", axes: [] },
      consumes: [],
      produces: ["object_id"],
      passthrough: false,
      store: { id: "fabriks", key: "k", bucket: "b", path: "p" },
    },
    lookup: {
      store: lookupStore,
      keyColumns: [{ axis: "object_id", column: { id: "c", name: keyColumn } }],
      attributes: [],
      sql: "",
    },
  }) as unknown as AttributePlanLike;

/** An engine stand-in: one canned (object_id, value) result per column. */
const fakeEngine = (byColumn: Record<string, Record<number, unknown>>) => {
  const engine = {
    readAcross: async (
      _stores: readonly unknown[],
      buildSql: (urlOf: (id: string) => string) => string,
    ) => {
      const sql = buildSql(() => "s3://b/k");
      const column = Object.keys(byColumn).find((name) => sql.includes(`"${name}"`));
      if (!column) return [];
      return Object.entries(byColumn[column]).map(([id, value]) => ({
        object_id: Number(id),
        value,
      }));
    },
  } as unknown as AttributeLookupEngine;
  return engine;
};

const PLANS = [arrayPlan("t1", "label_id", MASK_STORE)];

// The table holds a 16-bit code per slot now, not an RGBA colour — see
// `valueLut.ts`. `code = G * 256 + R`, little-endian over the two RG8 bytes.
const codeAt = (data: Uint8Array, slot: number) => data[slot * 2 + 1] * 256 + data[slot * 2];
const visibleAt = (data: Uint8Array, slot: number) => (codeAt(data, slot) === CODE_HIDDEN ? 0 : 255);
const dataOf = (texture: { image: { data: Uint8Array } } | null) =>
  (texture as unknown as { image: { data: Uint8Array } }).image.data;

describe("accessForTable for an ARRAY-sampled mask", () => {
  it("finds the plan for THIS mask's store", () => {
    const access = accessForTable(PLANS, "t1", { kind: "array", storeId: MASK_STORE });
    expect(access).toEqual({ store: lookupStore, keyColumn: "label_id" });
  });

  it("refuses another mask's plan over the same table", () => {
    // A scene can key several masks into one table; reading the wrong mask's plan
    // resolves these ids against the wrong column, silently.
    expect(
      accessForTable(PLANS, "t1", { kind: "array", storeId: OTHER_MASK_STORE }),
    ).toBeNull();
  });

  it("refuses a MESH plan for the same table", () => {
    // A mesh plan keys the table by a geometry row's id, which a pixel value is
    // not.
    expect(
      accessForTable([meshPlan("t1", "label_id")], "t1", {
        kind: "array",
        storeId: MASK_STORE,
      }),
    ).toBeNull();
  });

  it("still refuses an array plan when asked for a mesh one", () => {
    expect(accessForTable(PLANS, "t1", { kind: "mesh" })).toBeNull();
  });
});

describe("buildLabelColorLut — sparse id slots", () => {
  const colorBy = { table: "t1", column: "area", colormap: ColorMap.Viridis, joinPath: [] };

  it("offsets by the smallest id, so the lowest one lands at slot 0", async () => {
    // The common segmentation case: ids 1..N → offset 1, slots 0..N-1. Exactly N
    // texels, not N+1.
    const result = await buildLabelColorLut({
      colorBy,
      filterBys: [],
      plans: PLANS,
      storeId: MASK_STORE,
      engine: fakeEngine({ area: { 1: 10, 2: 20, 3: 30 } }),
    });
    expect(result.idOffset).toBe(1);
    expect(result.width * result.height).toBe(3);
  });

  it("offsets ids that all sit above a floor", async () => {
    const result = await buildLabelColorLut({
      colorBy,
      filterBys: [],
      plans: PLANS,
      storeId: MASK_STORE,
      engine: fakeEngine({ area: { 1000: 10, 1001: 20, 1002: 30 } }),
    });
    expect(result.idOffset).toBe(1000);
    // Three slots, not a thousand-and-three.
    expect(result.width * result.height).toBeGreaterThanOrEqual(3);
    expect(result.width * result.height).toBeLessThan(10);

    const data = dataOf(result.texture);
    // The lowest id sits at slot 0 and takes the bottom of the ramp.
    expect(codeAt(data, 0)).not.toBe(CODE_NO_VALUE);
  });

  it("leaves an id the table never mentioned at the IDENTITY texel", async () => {
    // White and opaque: it keeps its hue hash and stays visible. A filter must
    // never hide something because a read did not cover it.
    const result = await buildLabelColorLut({
      colorBy,
      filterBys: [],
      plans: PLANS,
      storeId: MASK_STORE,
      engine: fakeEngine({ area: { 1: 10, 5: 50 } }),
    });
    const data = dataOf(result.texture);
    // Ids 1 and 5 at offset 1 → slots 0 and 4; slots 1..3 (ids 2..4) were never
    // mentioned and keep the identity.
    // "visible, no value": the slot keeps its hue hash and stays drawn.
    expect(codeAt(data, 2)).toBe(CODE_NO_VALUE);
  });

  it("REFUSES ids too sparse to index, and says so", async () => {
    const result = await buildLabelColorLut({
      colorBy,
      filterBys: [],
      plans: PLANS,
      storeId: MASK_STORE,
      engine: fakeEngine({ area: { 1: 10, [LABEL_LUT_MAX_TEXELS + 5000]: 20 } }),
    });
    expect(result.texture).toBeNull();
    expect(result.skipped.join(" ")).toMatch(/too sparse/);
  });

  it("builds nothing when no entry could be read", async () => {
    const result = await buildLabelColorLut({
      colorBy: { table: "nope", column: "area", joinPath: [] },
      filterBys: [],
      plans: PLANS,
      storeId: MASK_STORE,
      engine: fakeEngine({}),
    });
    expect(result.texture).toBeNull();
    expect(result.skipped.join(" ")).toMatch(/no attribute plan reaches/);
  });

  it("does not read a JOINED entry, and badges it instead", async () => {
    const result = await buildLabelColorLut({
      colorBy: {
        table: "t1",
        column: "area",
        joinPath: [{ table: "t0", column: "track_id" }],
      },
      filterBys: [],
      plans: PLANS,
      storeId: MASK_STORE,
      engine: fakeEngine({ area: { 1: 10 } }),
    });
    expect(result.texture).toBeNull();
    expect(result.skipped.join(" ")).toMatch(/reached through a join/);
  });
});

describe("buildLabelColorLut — filters over sparse ids", () => {
  it("drops the ids a bound excludes, at their offset slots", async () => {
    const result = await buildLabelColorLut({
      colorBy: null,
      filterBys: [{ table: "t1", column: "area", min: 15, max: 100, exclude: false, joinPath: [] }],
      plans: PLANS,
      storeId: MASK_STORE,
      engine: fakeEngine({ area: { 100: 10, 101: 20, 102: 30 } }),
    });
    const data = dataOf(result.texture);
    expect(result.idOffset).toBe(100);
    expect(visibleAt(data, 0)).toBe(0); // id 100, area 10 → out of bounds
    expect(visibleAt(data, 1)).toBe(255); // id 101, area 20 → kept
    expect(visibleAt(data, 2)).toBe(255); // id 102, area 30 → kept
  });

  it("combines two rules with AND", async () => {
    const result = await buildLabelColorLut({
      colorBy: null,
      filterBys: [
        { table: "t1", column: "area", min: 15, max: 100, exclude: false, joinPath: [] },
        { table: "t1", column: "kind", values: ["good"], exclude: false, joinPath: [] },
      ],
      plans: PLANS,
      storeId: MASK_STORE,
      engine: fakeEngine({
        area: { 1: 20, 2: 20, 3: 5 },
        kind: { 1: "good", 2: "bad", 3: "good" },
      }),
    });
    const data = dataOf(result.texture);
    // Ids 1,2,3 at offset 1 → slots 0,1,2.
    expect(result.idOffset).toBe(1);
    expect(visibleAt(data, 0)).toBe(255); // id 1: area 20, kind good → both pass
    expect(visibleAt(data, 1)).toBe(0); // id 2: kind bad
    expect(visibleAt(data, 2)).toBe(0); // id 3: area 5, out of bounds
  });

  it("keeps everything when a rule's column could not be read", async () => {
    // Silently hiding every object because a read failed is the worst possible
    // reading of "filter".
    const result = await buildLabelColorLut({
      colorBy: { table: "t1", column: "area", colormap: ColorMap.Viridis, joinPath: [] },
      filterBys: [{ table: "gone", column: "x", min: 0, max: 1, exclude: false, joinPath: [] }],
      plans: PLANS,
      storeId: MASK_STORE,
      engine: fakeEngine({ area: { 1: 10, 2: 20 } }),
    });
    const data = dataOf(result.texture);
    expect(visibleAt(data, 0)).toBe(255);
    expect(visibleAt(data, 1)).toBe(255);
  });
});
