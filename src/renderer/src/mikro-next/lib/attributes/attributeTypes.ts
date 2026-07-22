import type { TransformLike } from "../transformGraph";
import type { ProbeFetchKey } from "../probe/probeTypes";

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

/** A path-step transformation: the shared shape plus the cache-key fields. */
export type AttributePathTransformLike = NonNullable<TransformLike> & {
  id?: string;
  version?: number;
};

/** One step from the probed system toward the plan's root (pathToWorld contract). */
export type AttributePathStep = {
  transformation: AttributePathTransformLike | null;
  /** Walk the edge output→input: invert it before composing. */
  inverted: boolean;
};

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

export type AttributePlanLike = {
  /** The FIELD edge the plan was built from — half of the staleness key. */
  edge: { id: string; version: number };
  table: { id: string; name: string };
  path: readonly AttributePathStep[];
  sample: {
    /** The system of the array being sampled; `consumes` is in its axis order. */
    system: {
      id: string;
      name?: string | null;
      axes: readonly { name: string; order: number }[];
    };
    store: ZarrStoreLike;
    consumes: readonly string[];
    produces: readonly string[];
    passthrough: readonly string[];
  };
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

/** Identity of the probed point the attributes belong to. */
export type AttributeFetchKey = ProbeFetchKey & {
  /** The probed system the plans were discovered for. */
  systemId: string;
};

export const attributeKeyId = (key: AttributeFetchKey): string =>
  `${key.layerId}:${key.voxelIndex.join(",")}:${key.sliceSignature}:${key.systemId}`;

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
export type ProbedAttributes = {
  key: AttributeFetchKey;
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
 * Merge one plan's settled state into the probed-attributes slice. Returns
 * null when `key` no longer matches the active entry — callers must treat
 * that as a no-op set (same state object) so late async arrivals never cause
 * renders. Mirrors `applyExactValues`.
 */
export function applyAttributeRows(
  current: ProbedAttributes | null,
  key: AttributeFetchKey,
  planKey: string,
  state: PlanRowsState,
): ProbedAttributes | null {
  if (current === null || !isSameAttributeKey(current.key, key)) return null;
  if (!(planKey in current.byPlan)) return null;
  return {
    ...current,
    byPlan: { ...current.byPlan, [planKey]: state },
  };
}
