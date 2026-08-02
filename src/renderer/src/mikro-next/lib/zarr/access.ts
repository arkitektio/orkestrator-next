import {
  S3_CREDENTIAL_REFRESH_SKEW_MS,
  type S3FetchConfig,
} from "@/lib/zarr/runner/s3-request";
import {
  RequestGeneralZarrAccessDocument,
  RequestGeneralZarrAccessMutation,
} from "@/mikro-next/api/graphql";
import type { GeneralZarrAccessGrant, MikroClient } from "@/lib/zarr/store/types";

/**
 * The one general-zarr-credentials round-trip, shared by every consumer that
 * opens datalayer stores imperatively (scene store creation, the attribute
 * pipeline's foreign-array opens). Imperative `client.mutate` — no hook
 * mounts, so the Guard.Mikro obligation stays on the calling host.
 */
export async function requestGeneralAccess(
  client: MikroClient,
): Promise<GeneralZarrAccessGrant> {
  const access = (await client.mutate({
    mutation: RequestGeneralZarrAccessDocument,
    variables: { input: {} },
  })) as { data?: RequestGeneralZarrAccessMutation };

  const credentials = access.data?.requestGeneralZarrAccess;
  if (!credentials) {
    throw new Error("Failed to obtain general Zarr access credentials");
  }

  return credentials;
}

/**
 * A grant with the absolute instant it stops being usable — the wire type
 * carries a relative `expiresIn`, which is only meaningful at arrival.
 */
export type DatedGrant = { grant: GeneralZarrAccessGrant; expiresAt: number };

/**
 * Usable means "and will still be usable by the time a request signed with it
 * lands" — the same skew the stores rotate on, so a grant handed out here is
 * never one a store would immediately reject as stale.
 */
export const isGrantUsable = (dated: DatedGrant | null, now: number): boolean =>
  dated !== null && now < dated.expiresAt - S3_CREDENTIAL_REFRESH_SKEW_MS;

/**
 * The S3 config a grant produces for one store. The grant decides the BUCKET,
 * so the base URL is rebuilt on every rotation rather than carried over — and
 * `expiresAt` is absolute here, the one place the wire's relative `expiresIn`
 * gets pinned to a clock.
 */
export function buildS3FetchConfig(
  dated: DatedGrant,
  store: { key: string; storeId: string },
  datalayer: string,
): S3FetchConfig {
  return {
    accessKey: dated.grant.accessKey,
    baseUrl: `${datalayer.replace(/\/$/, "")}/${dated.grant.bucket}/${store.key}`,
    expiresAt: dated.expiresAt,
    region: dated.grant.region,
    secretKey: dated.grant.secretKey,
    sessionToken: dated.grant.sessionToken,
    storeId: store.storeId,
  };
}

type ProviderState = { current: DatedGrant | null; inFlight: Promise<DatedGrant> | null };

/**
 * Per-client credential cache. WeakMap so a torn-down Apollo client takes its
 * grant with it; module-level so every store in the app shares ONE grant and
 * one refresh — a scene with eight stores hitting expiry at the same instant
 * issues a single mutation, not eight.
 */
const providers = new WeakMap<MikroClient, ProviderState>();

const stateFor = (client: MikroClient): ProviderState => {
  let state = providers.get(client);
  if (!state) {
    state = { current: null, inFlight: null };
    providers.set(client, state);
  }
  return state;
};

/**
 * The current general grant, minting one only when there is no usable grant
 * cached. Concurrent callers share the in-flight request rather than racing
 * their own mutations.
 *
 * `forceRefresh` discards the cached grant first — for a caller that has
 * already been told by S3 that its credentials are no good (a 403 the skew
 * failed to prevent), where the cached grant is by definition the bad one.
 * Concurrent forced refreshes still collapse into the one in-flight request,
 * so a storm of 403s costs a single round-trip.
 */
export function getGeneralAccess(
  client: MikroClient,
  options: { forceRefresh?: boolean } = {},
): Promise<DatedGrant> {
  const state = stateFor(client);

  if (!options.forceRefresh && isGrantUsable(state.current, Date.now())) {
    return Promise.resolve(state.current!);
  }
  if (state.inFlight) return state.inFlight;

  const request = requestGeneralAccess(client)
    .then((grant) => {
      const dated = { grant, expiresAt: Date.now() + grant.expiresIn * 1000 };
      state.current = dated;
      return dated;
    })
    .finally(() => {
      state.inFlight = null;
    });

  state.inFlight = request;
  return request;
}
