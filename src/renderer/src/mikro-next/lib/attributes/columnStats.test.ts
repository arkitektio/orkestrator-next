import { describe, expect, it } from "vitest";

import type { AttributeLookupEngine } from "./lookupEngine";
import {
  DISTINCT_LIMIT,
  readColumnDistinct,
  readColumnDomain,
  readDefaultFilterRule,
} from "./columnStats";

const target = {
  table: { store: { id: "store-a", bucket: "b", key: "k" } },
  column: { name: "area" },
};

/** An engine stand-in that answers with canned rows and records the SQL. */
const fakeEngine = (rows: Record<string, unknown>[]) => {
  const sqls: string[] = [];
  const engine = {
    readAcross: async (
      _stores: readonly unknown[],
      buildSql: (urlOf: (id: string) => string) => string,
    ) => {
      sqls.push(buildSql(() => "s3://b/k"));
      return rows;
    },
  } as unknown as AttributeLookupEngine;
  return { engine, sqls };
};

describe("readColumnDomain", () => {
  it("reads the bounds and quotes the column as an identifier", async () => {
    const { engine, sqls } = fakeEngine([{ lo: 2, hi: 9 }]);
    expect(await readColumnDomain(engine, target)).toEqual({ min: 2, max: 9 });
    expect(sqls[0]).toContain('"area"');
    // The URL comes from the grant, never from the declared bucket/key.
    expect(sqls[0]).toContain("'s3://b/k'");
  });

  it("is null for an empty or non-numeric column", async () => {
    expect(await readColumnDomain(fakeEngine([{ lo: null, hi: null }]).engine, target)).toBeNull();
    expect(await readColumnDomain(fakeEngine([]).engine, target)).toBeNull();
  });
});

describe("readColumnDistinct", () => {
  it("reads one row past the cap so a full list is distinguishable from a cut one", async () => {
    const under = await readColumnDistinct(
      fakeEngine([{ value: "a" }, { value: "b" }]).engine,
      target,
      4,
    );
    expect(under).toEqual({ values: ["a", "b"], truncated: false });

    const over = await readColumnDistinct(
      fakeEngine([1, 2, 3, 4, 5].map((n) => ({ value: `v${n}` }))).engine,
      target,
      4,
    );
    expect(over.truncated).toBe(true);
    expect(over.values).toHaveLength(4);
  });

  it("asks for exactly one more than the cap", async () => {
    const { engine, sqls } = fakeEngine([]);
    await readColumnDistinct(engine, target, 8);
    expect(sqls[0]).toContain("LIMIT 9");
  });
});

// The regression this file mostly exists for: `updateMeshLayer` refuses a rule
// that names neither a bound nor any values, so a seeded rule must always carry
// one of the two — and must be the WIDEST legal one, so adding a filter does
// not hide anything on its own.
describe("readDefaultFilterRule", () => {
  it("seeds a measure with the column's whole range", async () => {
    const seed = await readDefaultFilterRule(fakeEngine([{ lo: -3, hi: 12 }]).engine, target, "MEASURE");
    expect(seed).toEqual({ rule: { min: -3, max: 12 }, truncated: false });
  });

  it("seeds a categorical with every distinct value", async () => {
    const seed = await readDefaultFilterRule(
      fakeEngine([{ value: "a" }, { value: "b" }]).engine,
      target,
      "CATEGORICAL",
    );
    expect(seed).toEqual({ rule: { values: ["a", "b"] }, truncated: false });
  });

  it("flags a categorical seed that could not name every value", async () => {
    const rows = Array.from({ length: DISTINCT_LIMIT + 1 }, (_, index) => ({
      value: `v${index}`,
    }));
    const seed = await readDefaultFilterRule(fakeEngine(rows).engine, target, "CATEGORICAL");
    expect(seed?.truncated).toBe(true);
  });

  it("refuses to invent a bound when the column cannot answer", async () => {
    expect(await readDefaultFilterRule(fakeEngine([]).engine, target, "MEASURE")).toBeNull();
    expect(await readDefaultFilterRule(fakeEngine([]).engine, target, "CATEGORICAL")).toBeNull();
  });
});
