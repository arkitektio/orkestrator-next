// --- 1. Promise Cache for Suspense ---

import type { ChunkRender } from "../../stores/cacheStore";
import { LRUCache } from "./caches/in_memory_lru";

// This prevents infinite re-renders by storing the fetch promises. The promise
// cache self-deletes on settle, so it is bounded by the number of in-flight
// fetches. The data cache, however, would grow unbounded as the user pans/zooms,
// retaining every decoded chunk's bytes — so it is bounded with an LRU (same cap
// the sibling S3Store / fetchStore use for this data).
const chunkPromiseCache = new Map<string, Promise<Uint8Array | undefined>>();
const chunkDataCache = new LRUCache<string, Uint8Array | null>(500);

/**
 * Suspense-compatible data fetcher for a single chunk.
 */
export function useChunkData(chunk: ChunkRender): Uint8Array | null {
  // We use the store URL + chunk key as a globally unique identifier
  const uniqueKey = `${chunk.store.url}-${chunk.chunk_key}`;

  if (chunkDataCache.has(uniqueKey)) {
    return chunkDataCache.get(uniqueKey)!;
  }

  if (!chunkPromiseCache.has(uniqueKey)) {
    const fetchPromise = chunk.store.get(chunk.chunk_key).then((data: Uint8Array | undefined) => {
      chunkDataCache.set(uniqueKey, data ?? null);
      chunkPromiseCache.delete(uniqueKey);
      return data;
    });
    chunkPromiseCache.set(uniqueKey, fetchPromise);
  }

  throw chunkPromiseCache.get(uniqueKey);
}