import { AwsClient } from "aws4fetch";
import { ZarrArray, openGroup } from "zarr";
import { CachedS3Store } from "./cached-store";

// Re-export types from the original store
export interface Zattrs {
  fileversion: string;
}

export interface Zgroup {
  zarr_format: number;
}

export interface Compressor {
  blocksize: number;
  clevel: number;
  cname: string;
  id: string;
  shuffle: number;
}

export interface DataZarray {
  chunks: number[];
  compressor: Compressor;
  dtype: string;
  fill_value: string;
  filters?: unknown;
  order: string;
  shape: number[];
  zarr_format: number;
}

export interface DataZattrs {
  _ARRAY_DIMENSIONS: string[];
}

export interface Metadata {
  ".zattrs": Zattrs;
  ".zgroup": Zgroup;
  "data/.zarray": DataZarray;
  "data/.zattrs": DataZattrs;
}

export interface XArrayMetadata {
  metadata: Metadata;
  zarr_consolidated_format: number;
}

/**
 * Enhanced openZarrArray with caching capabilities
 * This replaces the original function and provides:
 * - Automatic caching of zarr metadata and chunks
 * - Deduplication of concurrent requests
 * - Multi-layer storage (memory, localStorage, IndexedDB)
 * - Configurable cache expiration
 */
export async function openZarrArrayCached(
  url: string,
  cacheOptions?: {
    dbName?: string;
    storeName?: string;
    maxLocalStorageSize?: number;
    cacheExpirationMs?: number;
  },
): Promise<{ data: ZarrArray; metadata: XArrayMetadata }> {
  // If the loader fails to load, handle the error (show an error snackbar).
  // Otherwise load.
  try {
    console.log("Loading zarr array with caching:", url);

    const aws = new AwsClient({
      accessKeyId: "kBcG6sCIlQvOWPOpzJhu",
      secretAccessKey: "FjiprDl3qHwIMR7azM2M",
      service: "s3",
    });

    // Fetch metadata (this could also be cached)
    const metadataResponse = await aws.fetch(url + "/.zmetadata");
    const xarray_metadata = (await metadataResponse.json()) as XArrayMetadata;

    // Create cached store instead of regular S3Store
    const store = new CachedS3Store(
      url,
      aws,
      {}, // FetchStore options
      {
        dbName: cacheOptions?.dbName || "zarr-cache-db",
        storeName: cacheOptions?.storeName || "zarr-chunks",
        maxLocalStorageSize: cacheOptions?.maxLocalStorageSize || 64 * 1024, // 64KB
        cacheExpirationMs:
          cacheOptions?.cacheExpirationMs || 24 * 60 * 60 * 1000, // 1 day
      },
    );

    console.log("Using cached store:", store);

    const grp = await openGroup(store, "", "r");
    const rootAttrs = await grp.attrs.asObject();

    console.log("Group and attributes loaded:", {
      grp,
      rootAttrs,
      xarray_metadata,
    });

    const data = (await grp.getItem("data")) as ZarrArray;

    // Log cache statistics
    const cacheStats = store.getCacheStats();
    console.log("Cache statistics:", cacheStats);

    return { data, metadata: xarray_metadata };
  } catch (e) {
    console.error("Failed to load zarr array:", e);
    throw Error("Failed to load data");
  }
}

/**
 * Original openZarrArray function for backward compatibility
 * Use openZarrArrayCached for better performance
 */
export async function openZarrArray(
  url: string,
): Promise<{ data: ZarrArray; metadata: XArrayMetadata }> {
  console.warn(
    "Using non-cached openZarrArray. Consider migrating to openZarrArrayCached for better performance.",
  );
  return openZarrArrayCached(url);
}

export type SelectionLoader = (s: unknown) => Promise<ZarrArray>;

/**
 * Utility function to clear zarr cache
 */
export async function clearZarrCache(cacheOptions?: {
  dbName?: string;
  storeName?: string;
}): Promise<void> {
  // Create a temporary cached store just to clear the cache
  const aws = new AwsClient({
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
    service: "s3",
  });

  const store = new CachedS3Store(
    "https://dummy.com",
    aws,
    {},
    {
      dbName: cacheOptions?.dbName || "zarr-cache-db",
      storeName: cacheOptions?.storeName || "zarr-chunks",
    },
  );

  await store.clearCache();
  console.log("Zarr cache cleared");
}

/**
 * Utility function to clear cache for a specific URL pattern
 */
export async function clearZarrCacheForUrl(
  urlPattern: string | RegExp,
  cacheOptions?: {
    dbName?: string;
    storeName?: string;
  },
): Promise<void> {
  const aws = new AwsClient({
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
    service: "s3",
  });

  const store = new CachedS3Store(
    "https://dummy.com",
    aws,
    {},
    {
      dbName: cacheOptions?.dbName || "zarr-cache-db",
      storeName: cacheOptions?.storeName || "zarr-chunks",
    },
  );

  const pattern =
    typeof urlPattern === "string" ? new RegExp(urlPattern) : urlPattern;
  await store.clearCacheForPattern(pattern);
  console.log("Zarr cache cleared for pattern:", pattern);
}
