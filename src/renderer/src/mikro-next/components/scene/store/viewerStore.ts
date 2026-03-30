import { createStore } from "zustand/vanilla";
import { createScopedStoreHooks } from "./createScopedStore"
import { ZarrAccessGrantFragment, ZarrStoreFragment } from "@/mikro-next/api/graphql";
import { TestNoiseZarrStore } from "../zarr/zarr_stores/noiseStore";
import { CachedFetchStore } from "../zarr/zarr_stores/fetchStore";
import { ZarrStore } from "../zarr/zarr_stores/type";
import { AwsClient } from "aws4fetch";
import { CachedS3Store } from "../zarr/zarr_stores/s3Store";
export type StoreBuilder = (fragment: ZarrAccessGrantFragment, datalayer: string) => Promise<ZarrStore>;


interface ViewerState {
  // We store the combined projection + view matrix
  zStart: number | null;
  zEnd: number | null;
  tStart: Date | null;
  tEnd: Date | null;
  debug: boolean;
  storeBuilder: StoreBuilder;

  setZRange: (start: number | null, end: number | null) => void;
  setTRange: (start: Date | null, end: Date | null) => void;
  setDebug: (debug: boolean) => void;
}


export const localBuilder = async (fragment: ZarrAccessGrantFragment, datalayer: string) => {
  console.log("[BUILD] Using localBuilder with fragment:", fragment, datalayer);
  return new TestNoiseZarrStore(fragment);
}

export const fetchBuilder = async (fragment: ZarrAccessGrantFragment, datalayer: string) => {

  console.log("Using fetchBuilder with fragment:", fragment);








  return new CachedFetchStore(fragment.store.bucket);
}

export const s3Builder = async (fragment: ZarrAccessGrantFragment, datalayer: string) => {




  const aws = new AwsClient({
    accessKeyId: fragment.accessKey,
    secretAccessKey: fragment.secretKey,
    sessionToken: fragment.sessionToken,
    service: "s3",
  });

  const path = datalayer + "/" + fragment.bucket + "/" + fragment.key;
  console.log("Using s3Builder with path:", path);

  const store = new CachedS3Store(aws, path, {});
  return store;
}



export const createViewerStore = () =>
  createStore<ViewerState>((set) => ({
    zStart: 0,
    zEnd: 100,
    tStart: null,
    tEnd: null,
    debug: false,
    storeBuilder: s3Builder, // Default to fetchBuilder, can be switched to localBuilder for testing
    setZRange: (start, end) => set({ zStart: start, zEnd: end }),
    setTRange: (start, end) => set({ tStart: start, tEnd: end }),
    setDebug: (debug) => set({ debug }),
  }));

const {
  StoreContext: ViewerStoreContext,
  useScopedStore: useViewerStore,
  useStoreApi: useViewerStoreApi,
} = createScopedStoreHooks<ViewerState>("ViewerStore");

export { ViewerStoreContext, useViewerStore, useViewerStoreApi };
