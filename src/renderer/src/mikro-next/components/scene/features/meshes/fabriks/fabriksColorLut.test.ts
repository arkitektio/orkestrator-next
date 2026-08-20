// @vitest-environment jsdom
// (`fabriksColorLut.ts` reaches the generated `graphql.ts` for the ColorMap
// enum, whose Apollo hooks barrel touches `window` on load.)
import { describe, expect, it } from "vitest";

import { ColorMap } from "@/mikro-next/api/graphql";
import type { AttributePlanLike } from "@/mikro-next/lib/attributes/attributeTypes";
import type { AttributeLookupEngine } from "@/mikro-next/lib/attributes/lookupEngine";
import { accessForTable, buildColorLut, isDirectEntry } from "./fabriksColorLut";
import type { FabriksObjectEntry } from "./fabriksCatalogs";

const object = (objectId: number, ordinal: number): FabriksObjectEntry => ({
  objectId,
  ordinal,
  bboxMin: [0, 0, 0],
  bboxMax: [1, 1, 1],
  vertexCount: 3,
  indexCount: 3,
  cells: [],
});

const OBJECTS = [object(10, 0), object(20, 1), object(30, 2)];

const store = { id: "store-a", bucket: "b", key: "k" };

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
      store,
      keyColumns: [{ axis: "object_id", column: { id: "c", name: keyColumn } }],
      attributes: [],
      sql: "",
    },
  }) as unknown as AttributePlanLike;

/** An engine stand-in: one canned (object_id, value) result per read. */
const fakeEngine = (byColumn: Record<string, Record<number, unknown>>) => {
  const reads: string[] = [];
  const engine = {
    readAcross: async (
      _stores: readonly unknown[],
      buildSql: (urlOf: (id: string) => string) => string,
    ) => {
      const sql = buildSql(() => "s3://b/k");
      reads.push(sql);
      const column = Object.keys(byColumn).find((name) => sql.includes(`"${name}"`));
      if (!column) return [];
      return Object.entries(byColumn[column]).map(([id, value]) => ({
        object_id: Number(id),
        value,
      }));
    },
  } as unknown as AttributeLookupEngine;
  return { engine, reads };
};

const alphaAt = (data: Uint8Array, ordinal: number) => data[ordinal * 4 + 3];
const rgbAt = (data: Uint8Array, ordinal: number) =>
  [data[ordinal * 4], data[ordinal * 4 + 1], data[ordinal * 4 + 2]] as const;

describe("accessForTable", () => {
  it("takes the store and key column off the MESH-sampled plan for that table", () => {
    const access = accessForTable([meshPlan("t1", "label_id")], "t1");
    expect(access).toEqual({ store, keyColumn: "label_id" });
  });

  it("is null for a table no plan reaches", () => {
    expect(accessForTable([meshPlan("t1", "label_id")], "t2")).toBeNull();
  });

  it("ignores an array-sampled plan — a mesh id cannot execute one", () => {
    const arrayPlan = {
      ...meshPlan("t1", "label_id"),
      sample: { ...meshPlan("t1", "label_id").sample, __typename: "ArraySample" },
    } as unknown as AttributePlanLike;
    expect(accessForTable([arrayPlan], "t1")).toBeNull();
  });
});

describe("isDirectEntry", () => {
  it("separates a direct reach from a joined one", () => {
    expect(isDirectEntry({ joinPath: [] })).toBe(true);
    expect(isDirectEntry({})).toBe(true);
    expect(isDirectEntry({ joinPath: [{ table: "t", column: "c" }] })).toBe(false);
  });
});

describe("buildColorLut", () => {
  const plans = [meshPlan("t1", "label_id")];

  it("ramps a numeric column across the colormap and leaves everything visible", async () => {
    const { engine } = fakeEngine({ area: { 10: 0, 20: 5, 30: 10 } });
    const lut = await buildColorLut({
      objects: OBJECTS,
      colorBy: { table: "t1", column: "area", colormap: ColorMap.Viridis, joinPath: [] },
      filterBys: [],
      plans,
      engine,
    });
    const data = lut.texture.image.data as Uint8Array;
    expect(lut.skipped).toEqual([]);
    // Ends of the ramp differ; every object stays opaque with no rule active.
    expect(rgbAt(data, 0)).not.toEqual(rgbAt(data, 2));
    expect([0, 1, 2].map((ordinal) => alphaAt(data, ordinal))).toEqual([255, 255, 255]);
  });

  it("gives every object sharing a categorical value the same colour", async () => {
    const { engine } = fakeEngine({ phenotype: { 10: "a", 20: "b", 30: "a" } });
    const lut = await buildColorLut({
      objects: OBJECTS,
      colorBy: { table: "t1", column: "phenotype", joinPath: [] },
      filterBys: [],
      plans,
      engine,
    });
    const data = lut.texture.image.data as Uint8Array;
    expect(rgbAt(data, 0)).toEqual(rgbAt(data, 2));
    expect(rgbAt(data, 0)).not.toEqual(rgbAt(data, 1));
  });

  it("drops objects outside a bound, and inverts them under exclude", async () => {
    const values = { area: { 10: 1, 20: 5, 30: 9 } };
    const keep = await buildColorLut({
      objects: OBJECTS,
      colorBy: null,
      filterBys: [{ table: "t1", column: "area", min: 4, max: 6, exclude: false, joinPath: [] }],
      plans,
      engine: fakeEngine(values).engine,
    });
    expect([0, 1, 2].map((o) => alphaAt(keep.texture.image.data as Uint8Array, o))).toEqual([
      0, 255, 0,
    ]);

    const drop = await buildColorLut({
      objects: OBJECTS,
      colorBy: null,
      filterBys: [{ table: "t1", column: "area", min: 4, max: 6, exclude: true, joinPath: [] }],
      plans,
      engine: fakeEngine(values).engine,
    });
    expect([0, 1, 2].map((o) => alphaAt(drop.texture.image.data as Uint8Array, o))).toEqual([
      255, 0, 255,
    ]);
  });

  it("combines rules with AND", async () => {
    const { engine } = fakeEngine({
      area: { 10: 1, 20: 5, 30: 9 },
      phenotype: { 10: "a", 20: "a", 30: "b" },
    });
    const lut = await buildColorLut({
      objects: OBJECTS,
      colorBy: null,
      filterBys: [
        { table: "t1", column: "area", min: 0, max: 6, exclude: false, joinPath: [] },
        { table: "t1", column: "phenotype", values: ["a"], exclude: false, joinPath: [] },
      ],
      plans,
      engine,
    });
    // Object 10 passes both, 20 passes both, 30 fails both — only 30 is dropped.
    expect([0, 1, 2].map((o) => alphaAt(lut.texture.image.data as Uint8Array, o))).toEqual([
      255, 255, 0,
    ]);
  });

  it("keeps everything for a rule that states nothing", async () => {
    const { engine } = fakeEngine({ area: { 10: 1, 20: 5, 30: 9 } });
    const lut = await buildColorLut({
      objects: OBJECTS,
      colorBy: null,
      filterBys: [{ table: "t1", column: "area", exclude: false, joinPath: [] }],
      plans,
      engine,
    });
    expect([0, 1, 2].map((o) => alphaAt(lut.texture.image.data as Uint8Array, o))).toEqual([
      255, 255, 255,
    ]);
  });

  it("re-reads nothing when only the colormap changes — the column values are cached", async () => {
    const { engine, reads } = fakeEngine({ area: { 10: 0, 20: 5, 30: 10 } });
    const request = (colormap: ColorMap) => ({
      objects: OBJECTS,
      colorBy: { table: "t1", column: "area", colormap, joinPath: [] },
      filterBys: [],
      plans,
      engine,
    });
    const first = await buildColorLut(request(ColorMap.Viridis));
    expect(reads).toHaveLength(1);
    // A knob change is a REPAINT, not a rescan: same engine, same column, no
    // second full-table SELECT.
    const second = await buildColorLut(request(ColorMap.Inferno));
    expect(reads).toHaveLength(1);
    expect(rgbAt(second.texture.image.data as Uint8Array, 0)).not.toEqual(
      rgbAt(first.texture.image.data as Uint8Array, 0),
    );
  });

  it("skips a joined entry rather than guessing its join, and reads nothing for it", async () => {
    const { engine, reads } = fakeEngine({ area: { 10: 1 } });
    const lut = await buildColorLut({
      objects: OBJECTS,
      colorBy: {
        table: "t2",
        column: "area",
        joinPath: [{ table: "t1", column: "track_id" }],
      },
      filterBys: [],
      plans,
      engine,
    });
    expect(reads).toEqual([]);
    expect(lut.skipped).toHaveLength(1);
    expect(lut.skipped[0]).toContain("join");
    // Untouched is white and opaque — exactly today's rendering.
    expect(rgbAt(lut.texture.image.data as Uint8Array, 0)).toEqual([255, 255, 255]);
  });

  it("skips an entry whose table no plan reaches", async () => {
    const { engine } = fakeEngine({ area: { 10: 1 } });
    const lut = await buildColorLut({
      objects: OBJECTS,
      colorBy: null,
      filterBys: [{ table: "nope", column: "area", min: 0, exclude: false, joinPath: [] }],
      plans,
      engine,
    });
    // An unreadable rule applies to NOTHING: blanking the layer because a read
    // failed is the worst possible reading of "filter".
    expect([0, 1, 2].map((o) => alphaAt(lut.texture.image.data as Uint8Array, o))).toEqual([
      255, 255, 255,
    ]);
    expect(lut.skipped[0]).toContain("no attribute plan");
  });

  it("sizes the texture by the ordinal ceiling, wrapping past the strip width", async () => {
    const { engine } = fakeEngine({});
    const lut = await buildColorLut({
      objects: [object(1, 0), object(2, 4095)],
      colorBy: null,
      filterBys: [],
      plans,
      engine,
    });
    expect(lut.width).toBe(2048);
    expect(lut.height).toBe(2);
  });
});
