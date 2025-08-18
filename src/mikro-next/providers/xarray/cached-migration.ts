/**
 * Easy Migration Helper
 *
 * This file provides simple exports to migrate from the original storage
 * to the cached versions with minimal code changes.
 */

// Export enhanced versions with caching
export { CachedS3Store as S3Store } from "./cached-store";
export {
  clearZarrCache,
  clearZarrCacheForUrl, openZarrArrayCached as openZarrArray
} from "./cached-zarr";

// Re-export types that might be needed
export type {
  Compressor,
  DataZarray,
  DataZattrs,
  Metadata, SelectionLoader, XArrayMetadata, Zattrs,
  Zgroup
} from "./cached-zarr";

export { HTTPError, joinUrlParts, KeyError } from "./cached-store";

/**
 * Usage:
 *
 * Simply change your imports from:
 *   import { S3Store, openZarrArray } from "./store";
 *
 * To:
 *   import { S3Store, openZarrArray } from "./cached-migration";
 *
 * Everything else stays the same, but now you get automatic caching!
 */
