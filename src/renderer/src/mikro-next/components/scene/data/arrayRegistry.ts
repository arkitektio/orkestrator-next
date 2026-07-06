import { open, type Array as ZarrArray, type DataType } from "zarrita";
import { ZarrStore } from "../zarr/zarr_stores/type";

export type OpenedZarrArray = ZarrArray<DataType, ZarrStore>;

export type OpenedSceneArrays = {
  arraysByStoreId: Map<string, OpenedZarrArray>;
  arraysByStore: WeakMap<object, OpenedZarrArray>;
};

/**
 * Open every configured scene store into a zarr Array, keyed both by store id
 * and by store object. Extracted from `store/viewerStore.ts` so the store just
 * receives the opened arrays.
 */
export async function openSceneArrays(
  storesById: Map<string, ZarrStore>,
): Promise<OpenedSceneArrays> {
  const arraysByStoreId = new Map<string, OpenedZarrArray>();
  const arraysByStore = new WeakMap<object, OpenedZarrArray>();

  for (const [storeId, store] of storesById) {
    const opened = await (open.v3(store, { kind: "array" }) as Promise<OpenedZarrArray>);
    arraysByStoreId.set(storeId, opened);
    arraysByStore.set(store as object, opened);
  }

  return { arraysByStoreId, arraysByStore };
}
