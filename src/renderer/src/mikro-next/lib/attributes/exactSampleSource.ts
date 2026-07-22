import { open, type Array as ZarrArray, type DataType } from "zarrita";
import { getChunkWorker } from "@/lib/zarr/runner";
import { ConfiguredS3Store } from "@/lib/zarr/store/s3Store";
import type { MikroClient, ZarrStore } from "@/lib/zarr/store/types";
import { workerPool } from "@/mikro-next/workers/pool";
import { requestGeneralAccess } from "@/mikro-next/lib/zarr/access";
import type { ZarrStoreLike } from "./attributeTypes";
import { LruMap } from "./lruMap";
import type { HeldValue } from "./planExec";
import { readTypedValue } from "./sampleSource";

/**
 * The scene-free EXACT sampling path for attribute plans: read one element of
 * a plan's field array through the shared zarr worker pipeline (decoded-chunk
 * LRU + in-flight dedupe — the same cache the renderer fills). The array is
 * either provided by the host (a scene's already-open registry array, costing
 * no new credentials) or opened FOREIGN once per store through a general zarr
 * grant — which is how the pipeline runs with no scene at all.
 *
 * GC: foreign opens are held in a capped LRU (evicted entries just drop their
 * references — chunk bytes live in the bounded global store cache, so there
 * is no per-store handle to close). `dispose()` empties it.
 *
 * Requires SharedArrayBuffer (cross-origin isolation) for the worker read.
 */

export type OpenedZarrArray = ZarrArray<DataType, ZarrStore>;

export type ExactSamplerOptions = {
  client: MikroClient;
  /** Datalayer base URL the foreign stores are opened against. */
  datalayer: string;
  /** Cap on concurrently-held foreign arrays (LRU-evicted). */
  foreignArrayCap?: number;
};

export type ExactSampler = {
  /**
   * The element at `index` (full array index in the sample system's axis
   * order), as `number | bigint` — label ids may exceed 2^53 and are lookup
   * KEYS, never forced through `Number()`. Null when out of shape.
   */
  readExact(store: ZarrStoreLike, index: readonly number[]): Promise<HeldValue | null>;
  /**
   * Host-provided already-open arrays (e.g. the scene's registry). The
   * provider is consulted per read, so a scene can attach on mount and
   * detach on unmount while others keep the service. Null return (or no
   * provider) falls back to the foreign open.
   */
  registerArrayProvider(provider: ((storeId: string) => OpenedZarrArray | null) | null): void;
  dispose(): void;
};

const DEFAULT_FOREIGN_ARRAY_CAP = 16;

export function createExactSampler(options: ExactSamplerOptions): ExactSampler {
  const foreignArrays = new LruMap<Promise<OpenedZarrArray>>(
    options.foreignArrayCap ?? DEFAULT_FOREIGN_ARRAY_CAP,
  );
  let arrayProvider: ((storeId: string) => OpenedZarrArray | null) | null = null;

  const openForeignArray = (store: ZarrStoreLike): Promise<OpenedZarrArray> => {
    let opened = foreignArrays.get(store.id);
    if (!opened) {
      opened = (async () => {
        const credentials = await requestGeneralAccess(options.client);
        const s3Store = new ConfiguredS3Store(
          {
            accessKey: credentials.accessKey,
            baseUrl: `${options.datalayer.replace(/\/$/, "")}/${credentials.bucket}/${store.key}`,
            expiresAt: Date.now() + credentials.expiresIn * 1000,
            region: credentials.region,
            secretKey: credentials.secretKey,
            sessionToken: credentials.sessionToken,
            storeId: store.id,
          },
          { preloadMetadata: true },
        );
        await s3Store.ready();
        return (await open.v3(s3Store, { kind: "array" })) as OpenedZarrArray;
      })().catch((error) => {
        foreignArrays.take(store.id); // allow retry after transient failures
        throw error;
      });
      foreignArrays.set(store.id, opened);
    }
    return opened;
  };

  const getArray = (store: ZarrStoreLike): Promise<OpenedZarrArray> => {
    const provided = arrayProvider?.(store.id) ?? null;
    return provided ? Promise.resolve(provided) : openForeignArray(store);
  };

  return {
    async readExact(store, index) {
      const arr = await getArray(store);
      if (index.length !== arr.shape.length) return null;
      const chunkShape = arr.chunks;
      const chunkCoords = index.map((v, d) => Math.floor(v / chunkShape[d]));
      const chunk = await getChunkWorker(arr, chunkCoords, {
        pool: workerPool,
        priority: 0,
        useSharedArrayBuffer: true,
      });
      const flat = index.reduce(
        (acc, v, d) => acc + (v - chunkCoords[d] * chunkShape[d]) * (chunk.stride[d] ?? 0),
        0,
      );
      return readTypedValue(chunk.data as ArrayLike<number> | ArrayLike<bigint>, flat);
    },
    registerArrayProvider(provider) {
      arrayProvider = provider;
    },
    dispose() {
      arrayProvider = null;
      foreignArrays.drain();
    },
  };
}
