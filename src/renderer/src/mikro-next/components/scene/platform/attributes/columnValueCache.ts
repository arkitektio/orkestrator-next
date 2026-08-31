import type { AttributeLookupEngine } from "@/mikro-next/lib/attributes/lookupEngine";
import { LruMap } from "@/mikro-next/lib/attributes/lruMap";
import {
  readColumnValues,
  type ColumnValues,
} from "@/mikro-next/lib/attributes/columnarReads";
import {
  readColumnByCompositeKey,
  readColumnByObjectId,
  type CompositeTableAccess,
  type TableAccess,
} from "./columnLut";

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

/**
 * The same cache, for the COMPOSITE-keyed read (a network node/edge table's
 * `(object, node…)` columns). Its own `LruMap` for the reason the columnar one
 * has its own: the value type differs (`Map<string, …>` against
 * `Map<number, …>`), and a shared cache with a union type would hand a caller
 * the shape it did not ask for. Keyed by the ORDERED key-column list — order
 * is meaning for a composite key, so `(a,b)` and `(b,a)` are different reads.
 */
const compositeCaches = new WeakMap<
  AttributeLookupEngine,
  LruMap<Promise<Map<string, unknown>>>
>();

export const readColumnByCompositeKeyCached = (
  engine: AttributeLookupEngine,
  access: CompositeTableAccess,
  column: string,
): Promise<Map<string, unknown>> => {
  let cache = compositeCaches.get(engine);
  if (!cache) {
    cache = new LruMap(CACHE_CAPACITY);
    compositeCaches.set(engine, cache);
  }
  const key = `${access.store.id}:${access.keyColumns.join(",")}:${column}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const promise: Promise<Map<string, unknown>> = readColumnByCompositeKey(
    engine,
    access,
    column,
  ).catch((error: unknown) => {
    // Self-evict on failure — but only if this promise is still the cached
    // one, so a retry that already replaced it is left alone.
    const current = compositeCaches.get(engine);
    if (current && current.get(key) === promise) current.take(key);
    throw error;
  });
  cache.set(key, promise);
  return promise;
};

/**
 * The same cache, for the COLUMNAR read.
 *
 * A separate `LruMap` rather than a shared one keyed by shape: the two hold
 * different things for the same key, and one cache with a union value type
 * would hand a caller the shape it did not ask for. They are cheap to keep
 * apart — a scene reads a handful of columns — and the label path is the only
 * caller of this one, so in practice only one of the two is ever populated for
 * a given column.
 *
 * Null is cached too, and deliberately: a column the columnar path cannot
 * answer (a non-numeric key, a result with no columnar view) will not become
 * answerable on a retry, and re-running a full-table scan on every rebuild to
 * rediscover that is the cost this cache exists to remove. The caller falls
 * back to `readColumnByObjectIdCached`, which has its own entry.
 */
const columnarCaches = new WeakMap<
  AttributeLookupEngine,
  LruMap<Promise<ColumnValues | null>>
>();

export const readColumnValuesCached = (
  engine: AttributeLookupEngine,
  access: TableAccess,
  column: string,
): Promise<ColumnValues | null> => {
  let cache = columnarCaches.get(engine);
  if (!cache) {
    cache = new LruMap(CACHE_CAPACITY);
    columnarCaches.set(engine, cache);
  }
  const key = `${access.store.id}:${access.keyColumn}:${column}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const promise: Promise<ColumnValues | null> = readColumnValues(engine, access, column).catch(
    (error: unknown) => {
      // Self-evict on failure — but only if this promise is still the cached
      // one, so a retry that already replaced it is left alone.
      const current = columnarCaches.get(engine);
      if (current && current.get(key) === promise) current.take(key);
      throw error;
    },
  );
  cache.set(key, promise);
  return promise;
};
