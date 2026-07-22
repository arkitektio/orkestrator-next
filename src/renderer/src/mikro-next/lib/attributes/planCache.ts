import {
  AttributePlanFragment,
  AttributePlansDocument,
  AttributePlansQuery,
  AttributePlansQueryVariables,
} from "@/mikro-next/api/graphql";
import type { AttributePlanLike } from "../core/attributes/attributeTypes";

/**
 * Plan discovery, memoized per probed system for the scene's life. The
 * contract makes this safe and cheap: a plan takes no coordinate — the same
 * plan serves every point — and its only staleness vector is a deleted or
 * version-bumped edge, which we accept as "until the scene remounts" (the
 * same freshness the scene's layers already have). An empty result is a
 * NEGATIVE cache entry: systems with no attached tables answer every
 * subsequent hover with one map lookup. Discovery failures are not cached, so
 * a later hover retries.
 *
 * Fetched imperatively (the `sceneStores.ts` pattern) — no hook mounts, so
 * the Guard.Mikro obligation stays where it already is, on the hosts
 * mounting `<Scene>`.
 */

/** The imperative slice of ApolloClient this cache needs (structural). */
export type QueryClient = {
  query(options: {
    query: unknown;
    variables?: unknown;
    fetchPolicy?: string;
  }): Promise<{ data?: AttributePlansQuery | null }>;
};

/**
 * The generated fragment is a structural superset of the core's plan type;
 * this typed identity is where the compiler PROVES that (no cast) — the one
 * place the codegen dependency touches the core contract.
 */
const toStructuralPlans = (
  fragments: readonly AttributePlanFragment[],
): readonly AttributePlanLike[] => fragments;

export class AttributePlanCache {
  private plans = new Map<string, Promise<readonly AttributePlanLike[]>>();
  /** Settled results, for the tracker's synchronous fast path. */
  private resolved = new Map<string, readonly AttributePlanLike[]>();

  constructor(private readonly client: QueryClient) {}

  /** Already-fetched plans for a system, synchronously; null while unknown. */
  peek(systemId: string): readonly AttributePlanLike[] | null {
    return this.resolved.get(systemId) ?? null;
  }

  get(systemId: string): Promise<readonly AttributePlanLike[]> {
    let pending = this.plans.get(systemId);
    if (!pending) {
      const variables: AttributePlansQueryVariables = { system: systemId };
      pending = this.client
        .query({ query: AttributePlansDocument, variables })
        .then((result) => {
          const plans = toStructuralPlans(result.data?.attributePlans ?? []);
          if (plans.length === 0) {
            // The one silent way the feature can "do nothing": make it loud.
            console.warn(
              `[attributePlans] system ${systemId}: no plans discovered — ` +
                `nothing links this system to a table (negative-cached for this scene)`,
            );
          } else {
            console.debug(
              `[attributePlans] system ${systemId}: ${plans.length} plan(s)`,
              plans.map((plan) => ({
                table: plan.table.name,
                pathSteps: plan.path.map(
                  (step) =>
                    `${step.inverted ? "~" : ""}${step.transformation?.__typename ?? "?"}`,
                ),
                consumes: plan.sample.consumes,
                passthrough: plan.sample.passthrough,
              })),
            );
          }
          this.resolved.set(systemId, plans);
          return plans;
        })
        .catch((error) => {
          this.plans.delete(systemId); // do not cache failures
          console.warn(`[attributePlans] system ${systemId}: discovery failed`, error);
          throw error;
        });
      this.plans.set(systemId, pending);
    }
    return pending;
  }
}
