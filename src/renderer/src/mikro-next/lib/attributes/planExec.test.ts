import { describe, expect, it } from "vitest";
import type { AttributePlanLike } from "./attributeTypes";
import {
  buildHeld,
  buildParams,
  isBackground,
  narrowHeld,
  probeCoordsFor,
  resolveSampleIndex,
} from "./planExec";

const plan = (over: {
  consumes?: string[];
  produces?: string[];
  passthrough?: string[];
  keyAxes?: string[];
  shape?: number[];
  axes?: { name: string; order: number }[];
} = {}): AttributePlanLike => ({
  edge: { id: "e", version: 1 },
  table: { id: "t", name: "morphology" },
  path: [],
  sample: {
    system: {
      id: "sys",
      axes: over.axes ?? [
        { name: "t", order: 0 },
        { name: "y", order: 1 },
        { name: "x", order: 2 },
      ],
    },
    store: { id: "z", bucket: "b", key: "k", shape: over.shape },
    consumes: over.consumes ?? ["y", "x"],
    produces: over.produces ?? ["i"],
    passthrough: over.passthrough ?? ["t"],
  },
  lookup: {
    store: { id: "p", bucket: "b", key: "t.parquet" },
    keyColumns: (over.keyAxes ?? ["t", "i"]).map((axis) => ({
      axis,
      column: { name: axis, dtype: "BIGINT" },
    })),
    attributes: [{ name: "area", dtype: "DOUBLE" }],
    sql: 'SELECT "area" FROM read_parquet(?) WHERE "t" = ? AND "i" = ?',
  },
});

describe("buildHeld", () => {
  it("holds passthrough axes plus the value under the plan's produced name", () => {
    expect(buildHeld(plan(), { t: 5, y: 1, x: 2 }, 7)).toEqual({ t: 5, i: 7 });
  });

  it("zips against THIS plan's produced name — sibling plans differ", () => {
    expect(buildHeld(plan({ produces: ["label_id"] }), { t: 5 }, 7)).toEqual({
      t: 5,
      label_id: 7,
    });
  });

  it("rounds fractional passthrough coordinates to integers", () => {
    expect(buildHeld(plan(), { t: 4.6, y: 0, x: 0 }, 1)).toEqual({ t: 5, i: 1 });
  });

  it("null when a passthrough axis is missing from the point", () => {
    expect(buildHeld(plan(), { y: 1, x: 2 }, 7)).toBeNull();
  });

  it("null when the plan produces anything but one scalar axis", () => {
    expect(buildHeld(plan({ produces: [] }), { t: 1 }, 7)).toBeNull();
    expect(buildHeld(plan({ produces: ["a", "b"] }), { t: 1 }, 7)).toBeNull();
  });

  it("keeps unsafe bigints as bigint and narrows safe ones", () => {
    const held = buildHeld(plan(), { t: 0 }, 2n ** 60n);
    expect(held).toEqual({ t: 0, i: 2n ** 60n });
    expect(buildHeld(plan(), { t: 0 }, 42n)).toEqual({ t: 0, i: 42 });
  });
});

describe("buildParams", () => {
  it("binds the parquet URL first, then key values in keyColumns order", () => {
    expect(
      buildParams(plan(), "s3://b/t.parquet", { t: 5, i: 7 }),
    ).toEqual(["s3://b/t.parquet", 5, 7]);
  });

  it("never borrows a missing key axis", () => {
    expect(buildParams(plan(), "s3://b/t.parquet", { i: 7 })).toBeNull();
  });
});

describe("isBackground / narrowHeld", () => {
  it("treats 0 and 0n as background", () => {
    expect(isBackground(0)).toBe(true);
    expect(isBackground(0n)).toBe(true);
    expect(isBackground(7)).toBe(false);
    expect(isBackground(7n)).toBe(false);
  });

  it("narrows only safely-representable bigints", () => {
    expect(narrowHeld(42n)).toBe(42);
    expect(narrowHeld(2n ** 60n)).toBe(2n ** 60n);
  });
});

describe("resolveSampleIndex", () => {
  it("indexes every axis of the sample system in order", () => {
    expect(resolveSampleIndex(plan(), { t: 2, y: 10, x: 20 })).toEqual([2, 10, 20]);
  });

  it("rounds fractional path-mapped coordinates", () => {
    expect(resolveSampleIndex(plan(), { t: 2, y: 10.4, x: 19.6 })).toEqual([2, 10, 20]);
  });

  it("null out of bounds when the store declares a shape", () => {
    expect(resolveSampleIndex(plan({ shape: [3, 100, 100] }), { t: 5, y: 1, x: 1 })).toBeNull();
    expect(resolveSampleIndex(plan({ shape: [3, 100, 100] }), { t: 2, y: 1, x: 1 })).toEqual([
      2, 1, 1,
    ]);
  });

  it("null for negative or missing coordinates", () => {
    expect(resolveSampleIndex(plan(), { t: -1, y: 1, x: 1 })).toBeNull();
    expect(resolveSampleIndex(plan(), { y: 1, x: 1 })).toBeNull();
  });
});

describe("probeCoordsFor", () => {
  it("names spatial axes from the voxel and fills the rest from dim selections", () => {
    expect(
      probeCoordsFor({
        axisNames: ["t", "c", "y", "x"],
        renderAxes: { x: "x", y: "y", z: null },
        voxelIndex: [20, 10, 0],
        dimSelections: { t: 3, c: 1 },
      }),
    ).toEqual({ t: 3, c: 1, x: 20, y: 10 });
  });

  it("defaults untouched dims to 0 and includes z when rendered", () => {
    expect(
      probeCoordsFor({
        axisNames: ["t", "z", "y", "x"],
        renderAxes: { x: "x", y: "y", z: "z" },
        voxelIndex: [5, 6, 7],
        dimSelections: {},
      }),
    ).toEqual({ t: 0, x: 5, y: 6, z: 7 });
  });
});
