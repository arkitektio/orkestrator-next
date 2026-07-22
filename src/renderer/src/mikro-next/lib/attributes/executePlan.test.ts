import { describe, expect, it } from "vitest";
import type { AttributePlanLike } from "./attributeTypes";
import { executePlanAt, type ExecutePlanDeps } from "./executePlan";
import type { AttributeLookupEngine } from "./lookupEngine";
import type { HeldValue } from "./planExec";

const plan = (over: Partial<AttributePlanLike> = {}): AttributePlanLike => ({
  edge: { id: "e1", version: 1 },
  table: { id: "t1", name: "morphology" },
  path: [],
  sample: {
    system: {
      id: "sys",
      axes: [
        { name: "t", order: 0 },
        { name: "y", order: 1 },
        { name: "x", order: 2 },
      ],
    },
    store: { id: "z1", bucket: "b", key: "k", shape: [4, 8, 8] },
    consumes: ["y", "x"],
    produces: ["i"],
    passthrough: ["t"],
  },
  lookup: {
    store: { id: "pq1", bucket: "b", key: "t.parquet" },
    keyColumns: [
      { axis: "t", column: { name: "t", dtype: "BIGINT" } },
      { axis: "i", column: { name: "i", dtype: "BIGINT" } },
    ],
    attributes: [{ name: "area", dtype: "DOUBLE" }],
    sql: 'SELECT "area" FROM read_parquet(?) WHERE "t" = ? AND "i" = ?',
  },
  ...over,
});

type FakeEngine = {
  lookups: { held: Record<string, HeldValue> }[];
  engine: AttributeLookupEngine;
};

const fakeEngine = (rows: readonly Record<string, unknown>[] = [{ area: 1 }]): FakeEngine => {
  const lookups: { held: Record<string, HeldValue> }[] = [];
  const engine = {
    lookup: async (
      _plan: AttributePlanLike,
      held: Record<string, HeldValue>,
      isStale: () => boolean,
    ) => {
      lookups.push({ held });
      return isStale() ? null : rows;
    },
  } as unknown as AttributeLookupEngine;
  return { lookups, engine };
};

const deps = (
  engine: AttributeLookupEngine,
  exact: (index: readonly number[]) => Promise<HeldValue | null>,
): ExecutePlanDeps => ({
  engine,
  sampleExact: (_plan, index) => exact(index),
});

describe("executePlanAt", () => {
  it("samples exactly and looks up rows for a plain coordinate ask", async () => {
    const { engine, lookups } = fakeEngine([{ area: 42 }]);
    const exactIndices: (readonly number[])[] = [];
    const state = await executePlanAt(
      deps(engine, async (index) => {
        exactIndices.push(index);
        return 7;
      }),
      plan(),
      { t: 1, y: 3, x: 5 },
    );
    expect(state).toEqual({
      status: "rows",
      rows: [{ area: 42 }],
      sampledValue: 7,
      sampleSource: "exact",
    });
    // Full array index in the sample system's axis order (t, y, x).
    expect(exactIndices).toEqual([[1, 3, 5]]);
    // Held = passthrough axes + the produced value under the plan's name.
    expect(lookups[0].held).toEqual({ t: 1, i: 7 });
  });

  it("prefers the resident sync sample and tags provenance", async () => {
    const { engine } = fakeEngine();
    let exactCalls = 0;
    const state = await executePlanAt(
      deps(engine, async () => {
        exactCalls++;
        return 9;
      }),
      plan(),
      { t: 0, y: 0, x: 1 },
      { sampleSync: () => 5 },
    );
    expect(state?.sampleSource).toBe("resident");
    expect(state?.sampledValue).toBe(5);
    expect(exactCalls).toBe(0);
  });

  it("returns background for a zero sample without looking up", async () => {
    const { engine, lookups } = fakeEngine();
    const state = await executePlanAt(
      deps(engine, async () => 0),
      plan(),
      { t: 0, y: 0, x: 0 },
    );
    expect(state?.status).toBe("background");
    expect(lookups).toHaveLength(0);
  });

  it("is unreachable (with the reason surfaced) when the point exits the array", async () => {
    const { engine } = fakeEngine();
    const reasons: string[] = [];
    const state = await executePlanAt(
      deps(engine, async () => 1),
      plan(),
      { t: 99, y: 0, x: 0 }, // t exceeds shape[0]=4
      { onUnreachable: (_planKey, reason) => reasons.push(reason) },
    );
    expect(state?.status).toBe("unreachable");
    expect(reasons).toEqual(["mapped point does not index the field array"]);
  });

  it("resolves null when the request goes stale after the exact read", async () => {
    const { engine } = fakeEngine();
    let stale = false;
    const state = await executePlanAt(
      deps(engine, async () => {
        stale = true; // superseded while the chunk read was in flight
        return 3;
      }),
      plan(),
      { t: 0, y: 0, x: 0 },
      { isStale: () => stale },
    );
    expect(state).toBeNull();
  });

  it("errors when sampling fails outright", async () => {
    const { engine } = fakeEngine();
    const state = await executePlanAt(
      deps(engine, async () => null),
      plan(),
      { t: 0, y: 0, x: 0 },
    );
    expect(state?.status).toBe("error");
  });
});
