import type { PathStep, PathTransformLike } from "../coords/pathTypes";

/**
 * Attribute-plan data model — the read side of a FIELD edge. A plan is a pair
 * of instructions the server hands the client once: sample a zarr array at
 * the probed point (mapped along `path` when the plan is not rooted where the
 * probe lives), then look the sampled value up in a parquet table with
 * DuckDB. The server never sends values, credentials, or coordinates: the
 * same plan serves every probed point, so everything here is designed to be
 * cached and executed locally per hover.
 *
 * All types are STRUCTURAL subsets of the generated `AttributePlanFragment`
 * (the `TransformLike` convention): the core never imports the generated API,
 * so it stays framework-free and unit-testable.
 */

export type ParquetStoreLike = {
  id: string;
  bucket: string;
  key: string;
};

export type ZarrStoreLike = {
  id: string;
  bucket: string;
  key: string;
  shape?: readonly number[] | null;
  dtype?: string | null;
  chunks?: readonly number[] | null;
};

/** A path-step transformation (alias of the shared coords type). */
export type AttributePathTransformLike = PathTransformLike;

/** One step from the probed system toward the plan's root (pathToWorld contract). */
export type AttributePathStep = PathStep;

export type AttributeColumnLike = {
  name: string;
  dtype: string;
  longName?: string | null;
  unit?: string | null;
  role?: string | null;
  axisType?: string | null;
  /**
   * Declared foreign key: values of this column identify rows of the target
   * table, which is keyed by its single INDEX coordinate column. Following it
   * is one more lookup, never done on the hover path.
   */
  references?: {
    id: string;
    name: string;
    store: ParquetStoreLike;
    columns: readonly {
      name: string;
      dtype: string;
      role?: string | null;
      axisType?: string | null;
    }[];
  } | null;
};

/** Fields every sample step carries (the server's `SampleStep` interface). */
export type SampleStepCommonLike = {
  /** The system whose contents are the map; `consumes` is in its axis order. */
  system: {
    id: string;
    name?: string | null;
    axes: readonly { name: string; order: number }[];
  };
  consumes: readonly string[];
  produces: readonly string[];
  passthrough: readonly string[];
};

/** The id lives per PIXEL: index this zarr array at the mapped point.
 * `__typename` optional so legacy fixtures (pre-interface) stay valid. */
export type ArraySampleLike = SampleStepCommonLike & {
  __typename?: "ArraySample";
  store: ZarrStoreLike;
};

/** The id lives per GEOMETRY ROW of a fabriks collection: nothing is sampled
 * at a coordinate — a pick already holds the id and goes straight to the
 * lookup. The store is named for headless workers (and for matching a scene's
 * mesh layers: `collection.store.id`). */
export type MeshSampleLike = SampleStepCommonLike & {
  __typename: "MeshSample";
  store: { id: string; bucket?: string; key?: string };
};

export const isMeshSample = (
  sample: ArraySampleLike | MeshSampleLike,
): sample is MeshSampleLike => sample.__typename === "MeshSample";

export type AttributePlanLike = {
  /** The FIELD edge the plan was built from — half of the staleness key. */
  edge: { id: string; version: number };
  table: { id: string; name: string };
  path: readonly AttributePathStep[];
  sample: ArraySampleLike | MeshSampleLike;
  lookup: {
    store: ParquetStoreLike;
    keyColumns: readonly { axis: string; column: AttributeColumnLike }[];
    attributes: readonly AttributeColumnLike[];
    /** Parameterized DuckDB SQL: parquet path binds first, then key values. */
    sql: string;
  };
};

/**
 * The plan's full identity: the FIELD edge plus every path step, each as
 * `(id, version)`. This is the ONLY staleness vector a plan has — parquet
 * contents changing never stales one — so it doubles as the cache key for
 * prepared statements and result LRUs.
 */
export const planIdentity = (plan: AttributePlanLike): string =>
  [
    `${plan.table.id}:${plan.edge.id}@${plan.edge.version}`,
    ...plan.path.map(
      (step) =>
        `${step.inverted ? "~" : ""}${step.transformation?.id ?? "?"}@${step.transformation?.version ?? "?"}`,
    ),
  ].join("|");

/**
 * Identity of the probed point the attributes belong to. Deliberately
 * scene-agnostic: `pointId` is an OPAQUE identity for the queried point —
 * equal ids mean the same request (latest-wins dedupe), nothing more. Hosts
 * extend this with whatever they need to rebuild coordinates (the scene adds
 * `layerId`/`voxelIndex`/`sliceSignature`); the resolver and store merge
 * logic are generic over that extension.
 */
export type AttributeFetchKey = {
  /** The probed system the plans were discovered for. */
  systemId: string;
  /** Opaque point identity within that system. */
  pointId: string;
};

export const attributeKeyId = (key: AttributeFetchKey): string =>
  `${key.systemId}|${key.pointId}`;

export const isSameAttributeKey = (
  a: AttributeFetchKey,
  b: AttributeFetchKey,
): boolean => attributeKeyId(a) === attributeKeyId(b);

export type AttributeRow = Record<string, unknown>;

export type PlanRowsStatus =
  /** Sampling or lookup still running. */
  | "pending"
  /** Lookup ran; `rows` holds 0..n results (plural is the contract). */
  | "rows"
  /** Sampled value was 0 — background, nothing to look up. */
  | "background"
  /** The path (or held/bind construction) could not be composed. */
  | "unreachable"
  | "error";

export type PlanRowsState = {
  status: PlanRowsStatus;
  rows: readonly AttributeRow[];
  /** The sampled object id (what the mask said), for display. */
  sampledValue?: number | bigint | null;
  /** Where the sampled value came from — mirrors probe provenance. */
  sampleSource?: "resident" | "exact";
  error?: string;
};

/** Everything known about the attributes under one probed point. */
export type ProbedAttributes<K extends AttributeFetchKey = AttributeFetchKey> = {
  key: K;
  /** Plan identity (`planIdentity`) → its current state. */
  byPlan: Record<string, PlanRowsState>;
  /** Plan identity → display metadata, captured when the fetch began. The
   * attribute columns ride along so the HUD can offer the `references`
   * follow-up without holding the plan itself. */
  planMeta: Record<
    string,
    { tableName: string; tableId: string; attributes: readonly AttributeColumnLike[] }
  >;
};

/**
 * The whole probed-attributes slice for one point, in ONE object.
 *
 * The synchronous "everything was already cached" path used to reach the store
 * through `begin` + one `merge` per plan — 1+N separate commits, each waking
 * every React subscriber, on a path that runs whenever the cursor re-crosses a
 * voxel it has already visited.
 *
 * Returns null when the result is value-equal to `current`, so the caller can
 * skip the set entirely: re-crossing the same voxel with the same cached rows
 * then costs zero renders rather than 1+N.
 */
export function buildProbedAttributes<K extends AttributeFetchKey>(
  current: ProbedAttributes<K> | null,
  key: K,
  planMeta: ProbedAttributes<K>["planMeta"],
  states: readonly (readonly [string, PlanRowsState])[],
): ProbedAttributes<K> | null {
  const byPlan: Record<string, PlanRowsState> = {};
  for (const [planKey, state] of states) byPlan[planKey] = state;

  if (
    current !== null &&
    isSameAttributeKey(current.key, key) &&
    samePlanRows(current.byPlan, byPlan)
  ) {
    return null;
  }
  return { key, byPlan, planMeta };
}

const samePlanRows = (
  a: Record<string, PlanRowsState>,
  b: Record<string, PlanRowsState>,
): boolean => {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  for (const planKey of keys) {
    const left = a[planKey];
    const right = b[planKey];
    if (left === right) continue;
    if (left === undefined || right === undefined) return false;
    // `rows` is compared by IDENTITY on purpose: it comes from the engine's
    // result LRU, so the same lookup hands back the same array — a deep
    // compare would buy nothing and cost per cell.
    if (
      left.status !== right.status ||
      left.rows !== right.rows ||
      left.sampledValue !== right.sampledValue ||
      left.sampleSource !== right.sampleSource ||
      left.error !== right.error
    ) {
      return false;
    }
  }
  return true;
};

/**
 * Merge one plan's settled state into the probed-attributes slice. Returns
 * null when `key` no longer matches the active entry — callers must treat
 * that as a no-op set (same state object) so late async arrivals never cause
 * renders. Mirrors `applyExactValues`.
 */
export function applyAttributeRows<K extends AttributeFetchKey>(
  current: ProbedAttributes<K> | null,
  key: K,
  planKey: string,
  state: PlanRowsState,
): ProbedAttributes<K> | null {
  if (current === null || !isSameAttributeKey(current.key, key)) return null;
  if (!(planKey in current.byPlan)) return null;
  return {
    ...current,
    byPlan: { ...current.byPlan, [planKey]: state },
  };
}
