import { open, type Array as ZarrArray, type DataType } from "zarrita";
import { ZarrStore } from "@/lib/zarr/store/types";

export type OpenedZarrArray = ZarrArray<DataType, ZarrStore>;

/**
 * Open one configured store into a zarr Array. The single open site, so the
 * cold path and the reconcile path (`openMissingSceneArrays`) cannot drift.
 */
export const openZarrArray = (store: ZarrStore): Promise<OpenedZarrArray> =>
  open.v3(store, { kind: "array" }) as Promise<OpenedZarrArray>;

/**
 * Open every configured scene store into a zarr Array, keyed by store id.
 * Extracted from `store/viewerStore.ts` so the store just receives the opened
 * arrays.
 */
export async function openSceneArrays(
  storesById: Map<string, ZarrStore>,
): Promise<Map<string, OpenedZarrArray>> {
  const arraysByStoreId = new Map<string, OpenedZarrArray>();

  for (const [storeId, store] of storesById) {
    arraysByStoreId.set(storeId, await openZarrArray(store));
  }

  return arraysByStoreId;
}
