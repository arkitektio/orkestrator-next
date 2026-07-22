import { describe, expect, it } from "vitest";
import type { AttributeFetchKey, AttributePlanLike, ProbedAttributes } from "./attributeTypes";
import { applyAttributeRows, planIdentity } from "./attributeTypes";

const plan = (over: Partial<AttributePlanLike> = {}): AttributePlanLike => ({
  edge: { id: "edge-1", version: 3 },
  table: { id: "table-1", name: "nuclei morphology" },
  path: [],
  sample: {
    system: { id: "sys-1", axes: [{ name: "y", order: 0 }, { name: "x", order: 1 }] },
    store: { id: "zarr-1", bucket: "b", key: "k" },
    consumes: ["y", "x"],
    produces: ["i"],
    passthrough: [],
  },
  lookup: {
    store: { id: "pq-1", bucket: "b", key: "t.parquet" },
    keyColumns: [{ axis: "i", column: { name: "i", dtype: "BIGINT" } }],
    attributes: [{ name: "area", dtype: "DOUBLE" }],
    sql: 'SELECT "area" FROM read_parquet(?) WHERE "i" = ?',
  },
  ...over,
});

const key = (voxel: [number, number, number] = [1, 2, 0]): AttributeFetchKey => ({
  systemId: "sys-1",
  pointId: `layer-a:${voxel.join(",")}:sig`,
});

describe("planIdentity", () => {
  it("is stable and covers the edge (id, version)", () => {
    expect(planIdentity(plan())).toBe("table-1:edge-1@3");
    expect(planIdentity(plan())).toBe(planIdentity(plan()));
  });

  it("changes when the edge version bumps", () => {
    expect(planIdentity(plan({ edge: { id: "edge-1", version: 4 } }))).not.toBe(
      planIdentity(plan()),
    );
  });

  it("covers every path step's (id, version) and inversion flag", () => {
    const withPath = plan({
      path: [
        {
          transformation: { __typename: "ScaleTransformation", id: "t-9", version: 2 },
          inverted: true,
        },
      ],
    });
    expect(planIdentity(withPath)).toBe("table-1:edge-1@3|~t-9@2");
    const versionBumped = plan({
      path: [
        {
          transformation: { __typename: "ScaleTransformation", id: "t-9", version: 3 },
          inverted: true,
        },
      ],
    });
    expect(planIdentity(versionBumped)).not.toBe(planIdentity(withPath));
  });
});

describe("applyAttributeRows", () => {
  const planKey = planIdentity(plan());
  const current: ProbedAttributes = {
    key: key(),
    byPlan: { [planKey]: { status: "pending", rows: [] } },
    planMeta: {
      [planKey]: { tableName: "nuclei morphology", tableId: "table-1", attributes: [] },
    },
  };

  it("merges a settled plan state for the active key", () => {
    const next = applyAttributeRows(current, key(), planKey, {
      status: "rows",
      rows: [{ area: 12 }],
    });
    expect(next).not.toBeNull();
    expect(next!.byPlan[planKey].status).toBe("rows");
    expect(next!.byPlan[planKey].rows).toEqual([{ area: 12 }]);
  });

  it("returns null (no-op) when the key is stale", () => {
    expect(
      applyAttributeRows(current, key([9, 9, 9]), planKey, {
        status: "rows",
        rows: [],
      }),
    ).toBeNull();
  });

  it("returns null when there is no active entry", () => {
    expect(applyAttributeRows(null, key(), planKey, { status: "rows", rows: [] })).toBeNull();
  });

  it("returns null for a plan the entry never began", () => {
    expect(
      applyAttributeRows(current, key(), "someone-else", { status: "rows", rows: [] }),
    ).toBeNull();
  });
});
