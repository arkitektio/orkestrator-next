// @vitest-environment jsdom
// (`columnValueCache.ts` imports `columnLut.ts`, which reaches the generated
// `graphql.ts` for the ColorMap enum, whose Apollo hooks barrel touches
// `window` on load — the same reason `fabriksColorLut.test.ts` runs in jsdom.)
import { describe, expect, it } from "vitest";

import type { AttributeLookupEngine } from "@/mikro-next/lib/attributes/lookupEngine";
import { readColumnByObjectIdCached } from "./columnValueCache";

const access = (storeId = "store-a", keyColumn = "object_id") => ({
  store: { id: storeId, bucket: "b", key: "k" },
  keyColumn,
});

/** An engine stand-in that counts scans and can fail the first one. */
const countingEngine = (opts?: { failFirst?: boolean }) => {
  let calls = 0;
  const engine = {
    readAcross: async () => {
      calls += 1;
      if (opts?.failFirst && calls === 1) throw new Error("transient");
      return [{ object_id: 1, value: calls }];
    },
  } as unknown as AttributeLookupEngine;
  return { engine, calls: () => calls };
};

describe("readColumnByObjectIdCached", () => {
  it("scans once per (store, key column, column) per engine", async () => {
    const { engine, calls } = countingEngine();
    const first = await readColumnByObjectIdCached(engine, access(), "area");
    const second = await readColumnByObjectIdCached(engine, access(), "area");
    expect(calls()).toBe(1);
    expect(second).toBe(first); // the same resolved map, not a re-read

    await readColumnByObjectIdCached(engine, access(), "volume");
    expect(calls()).toBe(2); // a different column is a different scan
    await readColumnByObjectIdCached(engine, access("store-b"), "area");
    expect(calls()).toBe(3); // a different store likewise
  });

  it("shares one in-flight scan between concurrent readers", async () => {
    const { engine, calls } = countingEngine();
    const [a, b] = await Promise.all([
      readColumnByObjectIdCached(engine, access(), "area"),
      readColumnByObjectIdCached(engine, access(), "area"),
    ]);
    expect(calls()).toBe(1);
    expect(b).toBe(a);
  });

  it("does not let a failed scan poison the key — the next call retries", async () => {
    const { engine, calls } = countingEngine({ failFirst: true });
    await expect(readColumnByObjectIdCached(engine, access(), "area")).rejects.toThrow(
      "transient",
    );
    const map = await readColumnByObjectIdCached(engine, access(), "area");
    expect(calls()).toBe(2);
    expect(map.get(1)).toBe(2);
  });

  it("keeps caches apart per engine", async () => {
    const first = countingEngine();
    const second = countingEngine();
    await readColumnByObjectIdCached(first.engine, access(), "area");
    await readColumnByObjectIdCached(second.engine, access(), "area");
    expect(first.calls()).toBe(1);
    expect(second.calls()).toBe(1);
  });
});
