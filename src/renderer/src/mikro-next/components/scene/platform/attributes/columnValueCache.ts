import type { AttributeLookupEngine } from "@/mikro-next/lib/attributes/lookupEngine";
import { LruMap } from "@/mikro-next/lib/attributes/lruMap";
import { readColumnByObjectId, type TableAccess } from "./columnLut";

/**
 * A per-engine cache of `objectId → value` column maps, sitting ABOVE
 * `engine.readAcross` (which is unbatched and uncached on purpose — the cache
 * belongs to the render path that knows the values are reusable, not to the
 * engine that must stay a plain executor).
 *
 * Why it exists: the LUT effects key on the CONTENT of the active colorBy /
 * filterBys, so every colormap switch, clim nudge or rule tweak rebuilds the
 * LUT — and without this cache each rebuild re-ran a full-table
 * `SELECT key, value FROM read_parquet(…)` per entry. The values themselves
 * change with none of those knobs; only the PAINT does. With the cache, a knob
 * change re-runs allocate + paint + one texture upload, and the scan runs once
 * per (store, key column, column) per engine lifetime.
 *
 * Staleness: this assumes a store id names IMMUTABLE parquet content within a
 * session — the same assumption `ParquetPart`'s footer memo and the attribute
 * plan cache already make. Grant/URL rotation does not change the values, so
 * it does not invalidate them.
 *
 * Lifecycle rides the engine: the WeakMap keys on the `AttributeLookupEngine`,
 * so when `AttributeService.dispose()` drops the engine the cached maps go
 * with it — no explicit invalidation API needed.
 *
 * The PROMISE is cached, not the map, so concurrent rebuilds (a colorBy and a
 * rule reading the same column) share one scan; a rejected read evicts itself
 * so a transient failure never poisons the key.
 */

/** Column maps kept per engine. Whole-column maps can be large, so the cap is
 * modest — a scene rarely has more than a handful of active columns. */
const CACHE_CAPACITY = 24;

const caches = new WeakMap<AttributeLookupEngine, LruMap<Promise<Map<number, unknown>>>>();

export const readColumnByObjectIdCached = (
  engine: AttributeLookupEngine,
  access: TableAccess,
  column: string,
): Promise<Map<number, unknown>> => {
  let cache = caches.get(engine);
  if (!cache) {
    cache = new LruMap(CACHE_CAPACITY);
    caches.set(engine, cache);
  }
  const key = `${access.store.id}:${access.keyColumn}:${column}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const promise: Promise<Map<number, unknown>> = readColumnByObjectId(
    engine,
    access,
    column,
  ).catch((error: unknown) => {
    // Self-evict on failure — but only if this promise is still the cached
    // one, so a retry that already replaced it is left alone.
    const current = caches.get(engine);
    if (current && current.get(key) === promise) current.take(key);
    throw error;
  });
  cache.set(key, promise);
  return promise;
};
