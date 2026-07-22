import { describe, expect, it } from "vitest";
import type {
  AttributeFetchKey,
  AttributePlanLike,
  PlanRowsState,
} from "./attributeTypes";
import { planIdentity } from "./attributeTypes";
import { createAttributeResolver } from "./attributeResolver";

const key = (voxel: [number, number, number]): AttributeFetchKey => ({
  systemId: "sys-1",
  pointId: `layer-a:${voxel.join(",")}:sig`,
});

const makePlan = (edgeId: string): AttributePlanLike => ({
  edge: { id: edgeId, version: 1 },
  table: { id: `table-${edgeId}`, name: edgeId },
  path: [],
  sample: {
    system: { id: "sys-1", axes: [{ name: "y", order: 0 }, { name: "x", order: 1 }] },
    store: { id: "z", bucket: "b", key: "k" },
    consumes: ["y", "x"],
    produces: ["i"],
    passthrough: [],
  },
  lookup: {
    store: { id: "p", bucket: "b", key: "k" },
    keyColumns: [{ axis: "i", column: { name: "i", dtype: "BIGINT" } }],
    attributes: [],
    sql: "SELECT 1 FROM read_parquet(?) WHERE i = ?",
  },
});

const tick = () => new Promise<void>((r) => setTimeout(r, 0));

describe("createAttributeResolver", () => {
  it("begins with the discovered plans and delivers per plan as each settles", async () => {
    const plans = [makePlan("a"), makePlan("b")];
    const settles: ((s: PlanRowsState | null) => void)[] = [];
    const delivered: [string, PlanRowsState][] = [];
    let began: readonly AttributePlanLike[] = [];

    const resolver = createAttributeResolver({
      resolvePlans: async () => plans,
      executePlan: () => new Promise((resolve) => settles.push(resolve)),
      begin: (_k, p) => {
        began = p;
      },
      deliver: (_k, planKey, state) => delivered.push([planKey, state]),
    });

    resolver.request(key([1, 1, 0]));
    await tick();
    expect(began).toEqual(plans);
    expect(settles).toHaveLength(2);

    settles[1]({ status: "rows", rows: [{ n: 2 }] });
    await tick();
    expect(delivered).toEqual([[planIdentity(plans[1]), { status: "rows", rows: [{ n: 2 }] }]]);

    settles[0]({ status: "background", rows: [] });
    await tick();
    expect(delivered).toHaveLength(2);
  });

  it("drops stale settlements: only the newest request delivers", async () => {
    const plans = [makePlan("a")];
    const settles: ((s: PlanRowsState | null) => void)[] = [];
    const delivered: [AttributeFetchKey, PlanRowsState][] = [];

    const resolver = createAttributeResolver({
      resolvePlans: async () => plans,
      executePlan: () => new Promise((resolve) => settles.push(resolve)),
      begin: () => {},
      deliver: (k, _p, state) => delivered.push([k, state]),
    });

    resolver.request(key([1, 0, 0]));
    await tick();
    resolver.request(key([2, 0, 0]));
    await tick();
    expect(settles).toHaveLength(2);

    // The first (stale) settlement must not deliver.
    settles[0]({ status: "rows", rows: [{ old: true }] });
    await tick();
    expect(delivered).toHaveLength(0);

    settles[1]({ status: "rows", rows: [{ fresh: true }] });
    await tick();
    expect(delivered).toHaveLength(1);
    expect(delivered[0][0].pointId).toBe(key([2, 0, 0]).pointId);
  });

  it("never starts execution for a request superseded during discovery", async () => {
    const plans = [makePlan("a")];
    const executedFor: string[] = [];

    const resolver = createAttributeResolver({
      resolvePlans: async () => plans,
      executePlan: async (k, _p, isStale) => {
        executedFor.push(k.pointId);
        expect(isStale()).toBe(false);
        return null;
      },
      begin: () => {},
      deliver: () => {},
    });

    resolver.request(key([1, 0, 0]));
    resolver.request(key([2, 0, 0])); // supersedes before discovery settles
    await tick();
    await tick();
    // Only the newest request reaches execution at all.
    expect(executedFor).toEqual([key([2, 0, 0]).pointId]);
  });

  it("begins with an empty plan set so stale attributes clear", async () => {
    const began: (readonly AttributePlanLike[])[] = [];
    const resolver = createAttributeResolver({
      resolvePlans: async () => [],
      executePlan: async () => null,
      begin: (_k, plans) => began.push(plans),
      deliver: () => {},
    });
    resolver.request(key([1, 0, 0]));
    await tick();
    expect(began).toEqual([[]]);
  });

  it("dedupes repeated requests for the same point", async () => {
    let discoveries = 0;
    const resolver = createAttributeResolver({
      resolvePlans: async () => {
        discoveries++;
        return [];
      },
      executePlan: async () => null,
      begin: () => {},
      deliver: () => {},
    });
    resolver.request(key([1, 0, 0]));
    resolver.request(key([1, 0, 0]));
    await tick();
    expect(discoveries).toBe(1);
  });

  it("delivers an error state when a plan execution rejects", async () => {
    const plans = [makePlan("a")];
    const delivered: PlanRowsState[] = [];
    const resolver = createAttributeResolver({
      resolvePlans: async () => plans,
      executePlan: async () => {
        throw new Error("boom");
      },
      begin: () => {},
      deliver: (_k, _p, state) => delivered.push(state),
    });
    resolver.request(key([1, 0, 0]));
    await tick();
    await tick();
    expect(delivered).toEqual([{ status: "error", rows: [], error: "lookup failed" }]);
  });

  it("delivers nothing after dispose", async () => {
    const plans = [makePlan("a")];
    let settle: ((s: PlanRowsState | null) => void) | null = null;
    const delivered: PlanRowsState[] = [];
    const resolver = createAttributeResolver({
      resolvePlans: async () => plans,
      executePlan: () => new Promise((resolve) => (settle = resolve)),
      begin: () => {},
      deliver: (_k, _p, state) => delivered.push(state),
    });
    resolver.request(key([1, 0, 0]));
    await tick();
    resolver.dispose();
    settle!({ status: "rows", rows: [] });
    await tick();
    expect(delivered).toHaveLength(0);
  });
});
