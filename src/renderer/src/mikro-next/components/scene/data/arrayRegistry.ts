import { open, type Array as ZarrArray, type DataType } from "zarrita";
import { ZarrStore } from "../zarr/zarr_stores/type";

export type OpenedZarrArray = ZarrArray<DataType, ZarrStore>;

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
    const opened = await (open.v3(store, { kind: "array" }) as Promise<OpenedZarrArray>);
    arraysByStoreId.set(storeId, opened);
  }

  return arraysByStoreId;
}
