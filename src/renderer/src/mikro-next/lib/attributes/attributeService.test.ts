import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AttributePlanLike } from "./attributeTypes";
import {
  acquireAttributeService,
  createAttributeService,
  type AttributeServiceClient,
} from "./attributeService";

/**
 * The engine and the exact sampler are mocked at the module seam
 * (`createLookupEngine` / `createExactSampler`) so the service is tested pure:
 * no DuckDB WASM, no zarr worker.
 */
const mocks = vi.hoisted(() => ({
  engine: {
    lookup: vi.fn(async () => [{ area: 12.5 }]),
    peek: vi.fn(() => null as readonly Record<string, unknown>[] | null),
    warm: vi.fn(),
    followReference: vi.fn(async () => [{ duration: 4.2 }]),
    peekReference: vi.fn(() => null),
    dispose: vi.fn(),
  },
  sampler: {
    readExact: vi.fn(async () => 7 as number | bigint | null),
    registerArrayProvider: vi.fn(),
    dispose: vi.fn(),
  },
}));

vi.mock("./createLookupEngine", () => ({
  createLookupEngine: () => mocks.engine,
}));
vi.mock("./exactSampleSource", () => ({
  createExactSampler: () => mocks.sampler,
}));
// The generated GraphQL module drags in browser-only app wiring; the plan
// cache only needs the query document's identity.
vi.mock("@/mikro-next/api/graphql", () => ({
  AttributePlansDocument: {},
}));

const planFragment = (edgeId = "e1"): AttributePlanLike => ({
  edge: { id: edgeId, version: 1 },
  table: { id: "t1", name: "morphology" },
  path: [],
  sample: {
    system: {
      id: "sys-1",
      axes: [
        { name: "t", order: 0 },
        { name: "y", order: 1 },
        { name: "x", order: 2 },
      ],
    },
    store: { id: "z1", bucket: "b", key: "k" },
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
});

const fakeClient = (plans: readonly AttributePlanLike[] = [planFragment()]) => {
  const query = vi.fn(async () => ({ data: { attributePlans: plans } }));
  const mutate = vi.fn(async () => ({ data: {} }));
  return {
    client: { query, mutate } as unknown as AttributeServiceClient,
    query,
  };
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "debug").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("createAttributeService", () => {
  it("answers attributesAt from coordinates alone and caches the point", async () => {
    const { client, query } = fakeClient();
    const service = createAttributeService({ client, datalayer: "http://dl" });

    const results = await service.attributesAt({
      systemId: "sys-1",
      coords: { t: 1, y: 3, x: 5 },
    });
    expect(results).toHaveLength(1);
    expect(results[0].table.name).toBe("morphology");
    expect(results[0].state).toMatchObject({
      status: "rows",
      rows: [{ area: 12.5 }],
      sampledValue: 7,
      sampleSource: "exact",
    });

    // Second ask for the same point: no discovery, no sampling, no lookup.
    await service.attributesAt({ systemId: "sys-1", coords: { t: 1, y: 3, x: 5 } });
    expect(query).toHaveBeenCalledTimes(1);
    expect(mocks.sampler.readExact).toHaveBeenCalledTimes(1);
    expect(mocks.engine.lookup).toHaveBeenCalledTimes(1);

    expect(
      service.peekAttributesAt({ systemId: "sys-1", coords: { t: 1, y: 3, x: 5 } }),
    ).toEqual(results);
    expect(
      service.peekAttributesAt({ systemId: "sys-1", coords: { t: 2, y: 3, x: 5 } }),
    ).toBeNull();
  });

  it("does not cache a point whose execution was aborted", async () => {
    const { client } = fakeClient();
    const service = createAttributeService({ client, datalayer: "http://dl" });
    const controller = new AbortController();
    controller.abort();
    const aborted = await service.attributesAt({
      systemId: "sys-1",
      coords: { t: 0, y: 0, x: 0 },
      signal: controller.signal,
    });
    expect(aborted).toEqual([]);
    expect(
      service.peekAttributesAt({ systemId: "sys-1", coords: { t: 0, y: 0, x: 0 } }),
    ).toBeNull();
    // A fresh, unaborted ask runs the full pipeline.
    const results = await service.attributesAt({
      systemId: "sys-1",
      coords: { t: 0, y: 0, x: 0 },
    });
    expect(results).toHaveLength(1);
  });

  it("warm discovers plans once and warms the engine per plan", async () => {
    const { client, query } = fakeClient([planFragment("e1"), planFragment("e2")]);
    const service = createAttributeService({ client, datalayer: "http://dl" });
    await service.warm("sys-1");
    expect(query).toHaveBeenCalledTimes(1);
    expect(mocks.engine.warm).toHaveBeenCalledTimes(2);
  });

  it("invalidate drops cached discovery so the next ask re-discovers", async () => {
    const { client, query } = fakeClient();
    const service = createAttributeService({ client, datalayer: "http://dl" });
    await service.plansFor("sys-1");
    service.invalidate("sys-1");
    await service.plansFor("sys-1");
    expect(query).toHaveBeenCalledTimes(2);
  });
});

describe("acquireAttributeService", () => {
  it("shares one service per (client, datalayer) and ref-counts disposal", async () => {
    vi.useFakeTimers();
    const { client } = fakeClient();
    const a = acquireAttributeService({ client, datalayer: "http://dl" });
    const b = acquireAttributeService({ client, datalayer: "http://dl" });
    expect(a.service).toBe(b.service);

    a.release();
    a.release(); // double-release must not steal b's ref
    vi.advanceTimersByTime(60_000);
    expect(mocks.engine.dispose).not.toHaveBeenCalled();

    b.release();
    // Re-acquire within the linger window cancels disposal.
    const c = acquireAttributeService({ client, datalayer: "http://dl" });
    vi.advanceTimersByTime(60_000);
    expect(mocks.engine.dispose).not.toHaveBeenCalled();
    expect(c.service).toBe(a.service);

    c.release();
    vi.advanceTimersByTime(60_000);
    expect(mocks.engine.dispose).toHaveBeenCalledTimes(1);

    // After disposal a new acquire builds a fresh service.
    const d = acquireAttributeService({ client, datalayer: "http://dl" });
    expect(d.service).not.toBe(a.service);
    d.release();
    vi.advanceTimersByTime(60_000);
  });

  it("keeps services separate per datalayer", () => {
    vi.useFakeTimers();
    const { client } = fakeClient();
    const a = acquireAttributeService({ client, datalayer: "http://dl-1" });
    const b = acquireAttributeService({ client, datalayer: "http://dl-2" });
    expect(a.service).not.toBe(b.service);
    a.release();
    b.release();
    vi.advanceTimersByTime(60_000);
  });
});
