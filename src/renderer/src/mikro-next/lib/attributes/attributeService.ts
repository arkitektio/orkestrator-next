import type { MikroClient } from "@/lib/zarr/store/types";
import type { AxisCoords } from "../coords/axisPath";
import {
  planIdentity,
  type AttributeColumnLike,
  type AttributePlanLike,
  type AttributeRow,
  type PlanRowsState,
} from "./attributeTypes";
import {
  createExactSampler,
  type OpenedZarrArray,
} from "./exactSampleSource";
import { createLookupEngine } from "./createLookupEngine";
import { executePlanAt, type ExecutePlanOptions } from "./executePlan";
import type { AttributeLookupEngine } from "./lookupEngine";
import { LruMap } from "./lruMap";
import type { HeldValue } from "./planExec";
import { AttributePlanCache, type QueryClient } from "./planCache";

/**
 * The standalone "what are the attributes at this point?" service: given a
 * coordinate-system id and named coordinates in its level-0 frame, discover
 * the system's attribute plans (cached), sample each plan's field array (the
 * scene-free exact path), and look the values up with DuckDB — no mounted
 * <Scene> required. The scene's probe tracker runs on the SAME service (its
 * resident fast path and coordinate assembly stay scene-side), so scene and
 * non-scene consumers share one engine, one plan cache, one result LRU.
 *
 * Lifecycle: `acquireAttributeService` ref-counts one service per
 * (client, datalayer); `dispose()` closes the engine and empties every cache.
 * All caches are bounded (engine LRUs, plan-cache system cap, foreign-array
 * cap, results cap) so an app-lifetime service cannot grow without limit.
 *
 * Guard convention: everything here is imperative GraphQL — hosts mount the
 * React surface (AttributeServiceProvider) under Guard.Mikro.
 */

export type AttributeServiceClient = QueryClient & MikroClient;

export type AttributeServiceOptions = {
  client: AttributeServiceClient;
  datalayer: string;
  /** Cap on concurrently-held foreign zarr arrays. */
  foreignArrayCap?: number;
  /** Cap on systems with cached plan discovery. */
  planCacheCap?: number;
  /** Cap on cached whole-point results (`peekAttributesAt`). */
  resultCap?: number;
};

export type AttributesAtInput = {
  systemId: string;
  /** Named integer coordinates in the system's level-0 frame. */
  coords: AxisCoords;
  signal?: AbortSignal;
};

/** One plan's outcome, with the display metadata the caller needs to render it. */
export type PlanAttributesResult = {
  planKey: string;
  table: { id: string; name: string };
  attributes: readonly AttributeColumnLike[];
  state: PlanRowsState;
};

export interface AttributeService {
  /**
   * Run every plan of `systemId` at `coords`. One entry per plan; an aborted
   * request resolves to what settled before the abort (callers usually
   * discard on abort anyway). Rejects on plan-discovery failure.
   */
  attributesAt(input: AttributesAtInput): Promise<readonly PlanAttributesResult[]>;
  /** Synchronous cache-only answer for a point this service already ran. */
  peekAttributesAt(input: { systemId: string; coords: AxisCoords }): readonly PlanAttributesResult[] | null;
  /** The system's plans (discovery cached; empty array = none attached). */
  plansFor(systemId: string): Promise<readonly AttributePlanLike[]>;
  peekPlans(systemId: string): readonly AttributePlanLike[] | null;
  /** Pre-pay a system's fixed costs (discovery, secrets, statements). */
  warm(systemId: string): Promise<void>;
  followReference(
    column: AttributeColumnLike,
    value: HeldValue,
  ): Promise<readonly AttributeRow[] | null>;
  peekReference(
    column: AttributeColumnLike,
    value: HeldValue,
  ): readonly AttributeRow[] | null;
  /** Host hooks (the scene tracker): shared executor + result-LRU peek. */
  executePlanAt(
    plan: AttributePlanLike,
    coords: AxisCoords,
    opts?: ExecutePlanOptions,
  ): Promise<PlanRowsState | null>;
  peekRows(
    plan: AttributePlanLike,
    held: Record<string, HeldValue>,
  ): readonly AttributeRow[] | null;
  /** Attach/detach a host's already-open arrays (scene registry). */
  registerArrayProvider(
    provider: ((storeId: string) => OpenedZarrArray | null) | null,
  ): void;
  /** Drop cached plan discovery (edge changed on the server). */
  invalidate(systemId?: string): void;
  dispose(): void;
  /** The underlying engine, for warm-per-plan wiring. */
  readonly engine: AttributeLookupEngine;
}

const DEFAULT_RESULT_CAP = 64;

const pointKey = (systemId: string, coords: AxisCoords): string =>
  `${systemId}|${Object.keys(coords)
    .sort()
    .map((axis) => `${axis}=${coords[axis]}`)
    .join(",")}`;

export function createAttributeService(
  options: AttributeServiceOptions,
): AttributeService {
  const engine = createLookupEngine(options.client, options.datalayer);
  const planCache = new AttributePlanCache(options.client, options.planCacheCap);
  const sampler = createExactSampler({
    client: options.client,
    datalayer: options.datalayer,
    foreignArrayCap: options.foreignArrayCap,
  });
  /** Whole-point results, so repeat asks (hover re-entry) answer instantly. */
  const results = new LruMap<readonly PlanAttributesResult[]>(
    options.resultCap ?? DEFAULT_RESULT_CAP,
  );

  const execDeps = {
    engine,
    sampleExact: (plan: AttributePlanLike, index: readonly number[]) =>
      sampler.readExact(plan.sample.store, index).catch(() => null),
  };

  const toResult = (
    plan: AttributePlanLike,
    state: PlanRowsState,
  ): PlanAttributesResult => ({
    planKey: planIdentity(plan),
    table: plan.table,
    attributes: plan.lookup.attributes,
    state,
  });

  const service: AttributeService = {
    engine,

    async attributesAt({ systemId, coords, signal }) {
      const cached = results.get(pointKey(systemId, coords));
      if (cached !== undefined) return cached;
      const isStale = () => !!signal?.aborted;
      const plans = await planCache.get(systemId);
      const settled = await Promise.all(
        plans.map((plan) =>
          executePlanAt(execDeps, plan, coords, { isStale }).then((state) =>
            state === null ? null : toResult(plan, state),
          ),
        ),
      );
      const complete = settled.filter(
        (entry): entry is PlanAttributesResult => entry !== null,
      );
      // Cache only complete, uninterrupted answers.
      if (!signal?.aborted && complete.length === plans.length) {
        results.set(pointKey(systemId, coords), complete);
      }
      return complete;
    },

    peekAttributesAt({ systemId, coords }) {
      return results.get(pointKey(systemId, coords)) ?? null;
    },

    plansFor(systemId) {
      return planCache.get(systemId);
    },

    peekPlans(systemId) {
      return planCache.peek(systemId);
    },

    async warm(systemId) {
      const plans = await planCache.get(systemId);
      for (const plan of plans) engine.warm(plan);
    },

    followReference(column, value) {
      return engine.followReference(column, value);
    },

    peekReference(column, value) {
      return engine.peekReference(column, value);
    },

    executePlanAt(plan, coords, opts) {
      return executePlanAt(execDeps, plan, coords, opts);
    },

    peekRows(plan, held) {
      return engine.peek(plan, held);
    },

    registerArrayProvider(provider) {
      sampler.registerArrayProvider(provider);
    },

    invalidate(systemId) {
      planCache.invalidate(systemId);
      results.drain();
    },

    dispose() {
      engine.dispose();
      sampler.dispose();
      planCache.invalidate();
      results.drain();
    },
  };

  return service;
}

// ---- ref-counted registry ---------------------------------------------------

type RegistryEntry = {
  service: AttributeService;
  refs: number;
  linger: ReturnType<typeof setTimeout> | null;
};

/**
 * One service per (client, datalayer), shared by every acquirer — the scene,
 * hover cards, tables — so they hit the same warm caches and the one DuckDB
 * connection. INTENTIONAL module-level state: WeakMap-keyed on the client
 * object, so a torn-down Apollo client can never pin a service; entries
 * linger 30s at zero refs before disposing, so route changes don't thrash
 * the DuckDB connection.
 *
 * Creation-time options (caps) apply on FIRST creation per key; later
 * acquirers share the existing instance.
 */
const registry = new WeakMap<object, Map<string, RegistryEntry>>();
const DISPOSE_LINGER_MS = 30_000;

export function acquireAttributeService(options: AttributeServiceOptions): {
  service: AttributeService;
  release: () => void;
} {
  let byDatalayer = registry.get(options.client);
  if (!byDatalayer) {
    byDatalayer = new Map();
    registry.set(options.client, byDatalayer);
  }
  const existing = byDatalayer.get(options.datalayer);
  const entry: RegistryEntry = existing ?? {
    service: createAttributeService(options),
    refs: 0,
    linger: null,
  };
  if (!existing) byDatalayer.set(options.datalayer, entry);
  if (entry.linger !== null) {
    clearTimeout(entry.linger);
    entry.linger = null;
  }
  entry.refs++;

  const pool = byDatalayer;
  let released = false;
  const release = () => {
    if (released) return; // double-release must not steal someone's ref
    released = true;
    entry.refs--;
    if (entry.refs > 0) return;
    entry.linger = setTimeout(() => {
      pool.delete(options.datalayer);
      entry.service.dispose();
    }, DISPOSE_LINGER_MS);
  };

  return { service: entry.service, release };
}
