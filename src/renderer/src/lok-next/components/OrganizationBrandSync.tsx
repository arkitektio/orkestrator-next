import { useEffect } from "react";
import { setBrandRemote } from "@/providers/settings/brandTheme";
import { useMyContextQuery } from "../api/graphql";
import { EMPTY_BRAND, resolveContextBrand } from "../lib/membershipBrand";

/**
 * Pushes the caller's membership brand into the shared `--brand-hue` /
 * `--brand-chroma` variables for as long as it is mounted.
 *
 * Renders nothing — it exists only to own that one write. It must be mounted
 * inside `Guard.Lok`: `useMyContextQuery` needs lok's Apollo client, which only
 * exists once the service is ready. Unmounting hands the variables back to the
 * local settings brand, which is also what a deployment without lok gets.
 */
export const OrganizationBrandSync = () => {
  const { data } = useMyContextQuery({ fetchPolicy: "cache-and-network" });
  const brand = resolveContextBrand(data?.mycontext);

  // Depending on the resolved numbers rather than on `data` keeps this to one
  // write per actual colour change — the query refetches on reactivate and
  // would otherwise re-apply an identical brand each time.
  useEffect(() => {
    setBrandRemote({ hue: brand.hue, chroma: brand.chroma });
  }, [brand.hue, brand.chroma]);

  useEffect(() => () => setBrandRemote(EMPTY_BRAND), []);

  return null;
};

export default OrganizationBrandSync;
