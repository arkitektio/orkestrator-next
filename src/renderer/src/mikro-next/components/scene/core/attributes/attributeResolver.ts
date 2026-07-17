import type {
  AttributeFetchKey,
  AttributePlanLike,
  PlanRowsState,
} from "./attributeTypes";
import { attributeKeyId, planIdentity } from "./attributeTypes";

/**
 * Hover-loop orchestration for attribute plans, modeled on
 * `exactValueResolver`: latest-wins per probed point, per-plan incremental
 * delivery as each lookup settles, and stale settlements dropped before they
 * reach the store. Where the exact-value resolver funnels ONE fetch, this one
 * fans out over every plan of the probed system — but a request that is no
 * longer the newest never starts (or delivers) work: `isStale` is threaded
 * into the executor so even a queued DuckDB query can bail before issuing.
 *
 * Pure and dependency-injected; the tracker wires `resolvePlans` to the plan
 * cache, `executePlan` to sample+lookup, and `begin`/`deliver` to the store.
 */

export type AttributeResolver = {
  request(key: AttributeFetchKey): void;
  dispose(): void;
};

export function createAttributeResolver(deps: {
  /** Cached plan discovery for the probed system; null = none / unavailable. */
  resolvePlans: (
    key: AttributeFetchKey,
  ) => Promise<readonly AttributePlanLike[] | null>;
  /**
   * Sample + lookup for one plan. `isStale` becomes true the moment a newer
   * request supersedes this one — check it before expensive work. Resolving
   * null means "dropped, deliver nothing".
   */
  executePlan: (
    key: AttributeFetchKey,
    plan: AttributePlanLike,
    isStale: () => boolean,
  ) => Promise<PlanRowsState | null>;
  /** A new point's plans are known: mark them pending in the store. */
  begin: (key: AttributeFetchKey, plans: readonly AttributePlanLike[]) => void;
  deliver: (
    key: AttributeFetchKey,
    planKey: string,
    state: PlanRowsState,
  ) => void;
}): AttributeResolver {
  let disposed = false;
  /** Id of the most recent request — only its work may begin or deliver. */
  let latestId: string | null = null;

  const run = async (key: AttributeFetchKey, id: string) => {
    const isStale = () => disposed || latestId !== id;
    let plans: readonly AttributePlanLike[] | null = null;
    try {
      plans = await deps.resolvePlans(key);
    } catch {
      return; // Discovery failure: a later request may retry.
    }
    if (isStale() || plans === null || plans.length === 0) return;

    deps.begin(key, plans);
    for (const plan of plans) {
      const planKey = planIdentity(plan);
      deps
        .executePlan(key, plan, isStale)
        .then((state) => {
          if (state !== null && !isStale()) deps.deliver(key, planKey, state);
        })
        .catch(() => {
          if (!isStale()) {
            deps.deliver(key, planKey, {
              status: "error",
              rows: [],
              error: "lookup failed",
            });
          }
        });
    }
  };

  return {
    request(key: AttributeFetchKey) {
      if (disposed) return;
      const id = attributeKeyId(key);
      if (id === latestId) return; // Dedupe: already newest.
      latestId = id;
      void run(key, id);
    },
    dispose() {
      disposed = true;
    },
  };
}
