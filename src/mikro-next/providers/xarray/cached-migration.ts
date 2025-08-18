/**
 * Easy Migration Helper
 *
 * This file provides simple exports to migrate from the original storage
 * to the cached versions with minimal code changes.
 */

// Export enhanced versions with caching
export { CachedS3Store as S3Store } from "./cached-store";
export {
  openZarrArrayCached as openZarrArray,
  clearZarrCache,
  clearZarrCacheForUrl,
} from "./cached-zarr";

// Re-export types that might be needed
export type {
  Zattrs,
  Zgroup,
  Compressor,
  DataZarray,
  DataZattrs,
  Metadata,
  XArrayMetadata,
  SelectionLoader,
} from "./cached-zarr";

export { HTTPError, KeyError, joinUrlParts } from "./cached-store";

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
