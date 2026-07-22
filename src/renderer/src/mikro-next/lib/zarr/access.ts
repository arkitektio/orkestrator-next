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
