import type { AbsolutePath } from "@zarrita/storage";
import type { S3FetchConfig } from "@/lib/zarr/runner/s3-request";

export type SceneZarrStoreDescriptor = {
  bucket: string;
  key: string;
  path: string;
  storeId: string;
};

export type GeneralZarrAccessGrant = {
  accessKey: string;
  bucket: string;
  expiresIn: number;
  region: string;
  secretKey: string;
  sessionToken: string;
};

export type ZarrStore = {
  url: string | URL;
  get: (key: AbsolutePath, options?: RequestInit ) => Promise<Uint8Array | undefined>;
  getWorkerFetchConfig?: () => S3FetchConfig;
};

export function isWorkerFetchCapableStore(store: ZarrStore): store is ZarrStore & { getWorkerFetchConfig: () => S3FetchConfig } {
  return typeof store.getWorkerFetchConfig === "function";
}

/** Minimal client interface - compatible with Apollo Client's mutate method */
export type MikroClient = {
  mutate(options: { mutation: any; variables?: any; context?: any }): Promise<{ data?: any | null }>;
};
