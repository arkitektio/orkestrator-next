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

  constructor(private readonly client: QueryClient) {}

  get(systemId: string): Promise<readonly AttributePlanLike[]> {
    let pending = this.plans.get(systemId);
    if (!pending) {
      const variables: AttributePlansQueryVariables = { system: systemId };
      pending = this.client
        .query({ query: AttributePlansDocument, variables })
        .then((result) => toStructuralPlans(result.data?.attributePlans ?? []))
        .catch((error) => {
          this.plans.delete(systemId); // do not cache failures
          throw error;
        });
      this.plans.set(systemId, pending);
    }
    return pending;
  }
}
