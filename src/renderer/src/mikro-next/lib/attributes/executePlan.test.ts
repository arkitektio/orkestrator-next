import { describe, expect, it } from "vitest";
import type { AttributePlanLike } from "./attributeTypes";
import { executePlanAt, executePlanWithValue, type ExecutePlanDeps } from "./executePlan";
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

describe("executePlanWithValue", () => {
  it("yields the SAME rows and held values as sampling that value at a voxel", async () => {
    // The mesh-probe contract: a pick that already knows its instance id must
    // be indistinguishable, lookup-wise, from sampling the mask there.
    const sampled = fakeEngine([{ area: 42 }]);
    const known = fakeEngine([{ area: 42 }]);
    const viaSample = await executePlanAt(
      deps(sampled.engine, async () => 7),
      plan(),
      { t: 1, y: 3, x: 5 },
    );
    const viaValue = await executePlanWithValue(
      { engine: known.engine },
      plan(),
      { t: 1, y: 3, x: 5 },
      7,
    );
    expect(viaValue).toEqual(viaSample); // rows, sampledValue, sampleSource
    expect(known.lookups[0].held).toEqual(sampled.lookups[0].held); // {t:1, i:7}
  });

  it("short-circuits a background value without a lookup", async () => {
    const { engine, lookups } = fakeEngine();
    const state = await executePlanWithValue({ engine }, plan(), { t: 0, y: 0, x: 0 }, 0);
    expect(state?.status).toBe("background");
    expect(lookups).toHaveLength(0);
  });

  it("never touches the field array — no sampler is even provided", async () => {
    const { engine, lookups } = fakeEngine([{ area: 1 }]);
    // Out-of-bounds coordinates for the ARRAY are irrelevant here: the value
    // is known, only path mapping and held-building matter.
    const state = await executePlanWithValue({ engine }, plan(), { t: 99, y: 0, x: 0 }, 3);
    expect(state?.status).toBe("rows");
    expect(lookups[0].held).toEqual({ t: 99, i: 3 });
  });
});

describe("mesh-sampled plans", () => {
  const meshPlan = () =>
    plan({
      sample: {
        __typename: "MeshSample",
        system: {
          id: "sys",
          axes: [
            { name: "t", order: 0 },
            { name: "y", order: 1 },
            { name: "x", order: 2 },
          ],
        },
        store: { id: "fab1" }, // a FabriksStore — no shape, nothing to index
        consumes: ["y", "x"],
        produces: ["i"],
        passthrough: ["t"],
      },
    });

  it("cannot be executed by a coordinate ask — only a pick holds the id", async () => {
    const { engine, lookups } = fakeEngine();
    const reasons: string[] = [];
    const state = await executePlanAt(
      deps(engine, async () => 1),
      meshPlan(),
      { t: 0, y: 0, x: 0 },
      { onUnreachable: (_planKey, reason) => reasons.push(reason) },
    );
    expect(state?.status).toBe("unreachable");
    expect(reasons).toEqual(["a geometry-sampled plan needs a picked instance id"]);
    expect(lookups).toHaveLength(0);
  });

  it("executes through the value-known path — the DESIGNED route for picks", async () => {
    const { engine, lookups } = fakeEngine([{ area: 42 }]);
    const state = await executePlanWithValue({ engine }, meshPlan(), { t: 1, y: 0, x: 0 }, 7);
    expect(state?.status).toBe("rows");
    expect(lookups[0].held).toEqual({ t: 1, i: 7 });
  });
});
