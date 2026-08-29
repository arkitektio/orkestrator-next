/**
 * getWorker() — Worker-accelerated get for zarrita arrays.
 *
 * Reads data from a zarrita Array, offloading codec decode operations to a
 * WorkerPool. The main thread fetches raw bytes from the store, transfers
 * them to a worker for decoding, then copies the decoded chunk into the
 * output array on the main thread.
 *
 * Uses a persistent WorkerPool queue for bounded-concurrency scheduling.
 */

import type { WorkerPoolTaskHandle, WorkerPoolTaskInput } from "../pool/types"
import type {
  Chunk,
  DataType,
  Readable,
  Scalar,
  Slice,
  TypedArray,
  Array as ZarrArray,
} from "zarrita"

import { LRUCache } from "@/lib/zarr/caches/inMemoryLru"
import { BasicIndexer } from "./internals/indexer"
import { setter } from "./internals/setter"
import {
  assertSharedArrayBufferAvailable,
  create_chunk_key_encoder,
  createBuffer,
  get_strides,
} from "./internals/util"
import type { ChunkCache, CodecChunkMeta, GetWorkerOptions, TextureFidelity } from "./types"
import { disposeWorker, getMetaId, workerFetchDecode } from "./worker-rpc"
import { isWorkerFetchCapableStore, workerFetchConfigFor } from "@/lib/zarr/store/types"
import { serializeRequestInit } from "./s3-request"

/**
 * Default URL for the codec worker. Uses `import.meta.url` to resolve
 * relative to this module.
 *
 * @deprecated Use {@link createDefaultWorker} instead — it produces a
 *   `new Worker(new URL(..., import.meta.url))` expression that bundlers
 *   like Vite recognise as a worker entry point and bundle accordingly.
 */
export const DEFAULT_WORKER_URL = new URL("./codec-worker.js", import.meta.url)

/**
 * Create a Worker using the default codec-worker script bundled with this
 * package.
 *
 * Using `new Worker(new URL(..., import.meta.url))` in a single expression
 * allows bundlers (Vite, Rollup, webpack 5) to detect the worker entry point
 * and bundle its dependency graph into a self-contained asset. The previous
 * approach — storing the URL in a variable and passing it to `new Worker()`
 * separately — caused bundlers to treat the worker file as a plain static
 * asset, leaving its relative `./internals/*` imports unresolved.
 */
export function createDefaultWorker(): Worker {
  return new Worker(new URL("./codec-worker.js", import.meta.url), {
    type: "module",
  })
}

/** Shared TextDecoder instance. */
const decoder = new TextDecoder()

function createAbortError(): Error {
  if (typeof DOMException !== "undefined") {
    return new DOMException("Aborted", "AbortError")
  }

  const error = new Error("Aborted")
  error.name = "AbortError"
  return error
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw createAbortError()
  }
}

function withAbortSignal<StoreOpts>(
  storeOpts: StoreOpts | undefined,
  signal?: AbortSignal,
): StoreOpts | undefined {
  if (!signal) {
    return storeOpts
  }

  if (storeOpts == null) {
    return { signal } as StoreOpts
  }

  if (typeof storeOpts !== "object") {
    return storeOpts
  }

  if ("signal" in (storeOpts as Record<string, unknown>)) {
    return storeOpts
  }

  return {
    ...(storeOpts as Record<string, unknown>),
    signal,
  } as StoreOpts
}

async function abortable<T>(
  signal: AbortSignal | undefined,
  promiseFactory: () => Promise<T>,
  onAbort?: () => void,
): Promise<T> {
  throwIfAborted(signal)

  if (!signal) {
    return promiseFactory()
  }

  return new Promise<T>((resolve, reject) => {
    const abortHandler = () => {
      try {
        onAbort?.()
      } finally {
        reject(createAbortError())
      }
    }

    signal.addEventListener("abort", abortHandler, { once: true })

    Promise.resolve()
      .then(promiseFactory)
      .then(
        (value) => {
          signal.removeEventListener("abort", abortHandler)
          resolve(value)
        },
        (error) => {
          signal.removeEventListener("abort", abortHandler)
          reject(error)
        },
      )
  })
}

async function waitForTaskHandles<T>(
  handles: Array<WorkerPoolTaskHandle<T>>,
  signal?: AbortSignal,
): Promise<T[]> {
  throwIfAborted(signal)

  return abortable(signal, () => Promise.all(handles.map((handle) => handle.promise)), () => {
    handles.forEach((handle) => {
      handle.cancel()
    })
  })
}

function enqueueWorkerTask<T>(
  pool: GetWorkerOptions["pool"],
  workerUrl: string | URL | undefined,
  signal: AbortSignal | undefined,
  task: (worker: Worker) => Promise<T>,
  priority?: number,
): WorkerPoolTaskHandle<T> {
  return pool.enqueue(createWorkerTask(workerUrl, signal, task, priority))
}

function createWorkerTask<T>(
  workerUrl: string | URL | undefined,
  signal: AbortSignal | undefined,
  task: (worker: Worker) => Promise<T>,
  priority?: number,
): WorkerPoolTaskInput<T> {
  return {
    priority,
    task: async (workerSlot: Worker | null) => {
      const worker =
        workerSlot ??
        (workerUrl
          ? new Worker(workerUrl, { type: "module" })
          : createDefaultWorker())

      return abortable(
        signal,
        async () => ({ worker, result: await task(worker) }),
        () => {
          disposeWorker(worker, createAbortError())
        },
      )
        .catch((error) => {
          if (!(error instanceof Error && error.name === "AbortError")) {
            disposeWorker(
              worker,
              error instanceof Error ? error : new Error(String(error)),
            )
          }
          throw error
        })
    },
  }
}

/** Constructor matching `promoteChunkForTexture`'s output for this dtype and
 * fidelity — fill-value substitute chunks must use the SAME representation as
 * fetched chunks, or a cache can hold mixed types for one array. */
function getTextureOutputConstructor(
  dataType: DataType,
  textureFidelity: TextureFidelity,
): Uint8ArrayConstructor | Uint16ArrayConstructor | Float32ArrayConstructor {
  if (dataType === "uint8") return Uint8Array
  if (textureFidelity === "raw16" && dataType === "uint16") return Uint16Array
  return Float32Array
}

function roundTiming(ms: number): number {
  return Number(ms.toFixed(2))
}

/**
 * Per-chunk timing logs are opt-in: they fire twice per chunk and are a
 * measurable cost when hundreds of chunks stream in. Enable at runtime with
 * `globalThis.__ZARR_TIMING__ = true`.
 */
function logChunkTiming(label: string, timings: Record<string, unknown>): void {
  if ((globalThis as { __ZARR_TIMING__?: boolean }).__ZARR_TIMING__ !== true) return
  console.log(label, timings)
}

// ---------------------------------------------------------------------------
// Chunk cache helpers — store-scoped key generation
// ---------------------------------------------------------------------------

const globalChunkCache = new LRUCache<string, Chunk<DataType>>(500)

const DEFAULT_CHUNK_CACHE: ChunkCache = {
  get: (key) => globalChunkCache.get(key) as Chunk<DataType> | undefined,
  set: (key, value) => {
    globalChunkCache.set(key, value as Chunk<DataType>)
  },
}

/** WeakMap to assign unique IDs to store instances, preventing cache collisions. */
const storeIdMap = new WeakMap<object, number>()
let storeIdCounter = 0

export function getStoreId(store: Readable): string {
  if (!storeIdMap.has(store)) {
    storeIdMap.set(store, storeIdCounter++)
  }
  return `store_${storeIdMap.get(store)}`
}

/**
 * Chunk objects the store could not provide get a fill-value substitute — a
 * legitimate zarr convention for genuinely-sparse arrays, but ALSO how a
 * missing/partially-uploaded store silently renders as blank data (e.g. ONE
 * blank channel when channels are chunked separately). Warn once per path so
 * "missing data" is never invisible.
 */
const warnedFillChunkPaths = new Set<string>()

function warnFillChunk(chunkPath: string, fillValue: unknown): void {
  if (warnedFillChunkPaths.has(chunkPath)) return
  warnedFillChunkPaths.add(chunkPath)
  console.warn(
    `[zarr] chunk object missing from store — substituting fill value ` +
      `${String(fillValue ?? 0)}: ${chunkPath}`,
  )
}

export function createCacheKey<D extends DataType, Store extends Readable>(
  arr: ZarrArray<D, Store>,
  encodeChunkKey: (chunk_coords: number[]) => string,
  chunk_coords: number[],
): string {
  const chunkKey = encodeChunkKey(chunk_coords)
  const storeId = getStoreId(arr.store)
  return `${storeId}:${arr.path}:${chunkKey}`
}

// ---------------------------------------------------------------------------
// Unified metadata reader — reads zarr.json once, returns everything needed
// ---------------------------------------------------------------------------

export interface ArrayMetadata {
  codecMeta: CodecChunkMeta
  encodeChunkKey: (chunk_coords: number[]) => string
  fillValue: Scalar<DataType> | null
}

/**
 * Per-array memo of `readArrayMetadata`. The result (`codecMeta`,
 * `encodeChunkKey`, `fillValue`) is array-invariant, but the uncached reader
 * runs on the MAIN thread for every chunk fetch — a `store.get(zarr.json)` +
 * `TextDecoder` + `JSON.parse` + key-encoder rebuild per chunk. Keyed weakly on
 * the array object; a rejected read (e.g. aborted signal) is evicted so the
 * next caller retries instead of hitting a poisoned promise.
 */
const arrayMetadataCache = new WeakMap<object, Promise<ArrayMetadata>>()

export function readArrayMetadataCached<
  D extends DataType,
  Store extends Readable,
>(
  arr: ZarrArray<D, Store>,
  storeOpts?: Parameters<Store["get"]>[1],
): Promise<ArrayMetadata> {
  const cached = arrayMetadataCache.get(arr)
  if (cached) return cached
  const promise = readArrayMetadata(arr, storeOpts)
  arrayMetadataCache.set(arr, promise)
  promise.catch(() => {
    if (arrayMetadataCache.get(arr) === promise) arrayMetadataCache.delete(arr)
  })
  return promise
}

export async function readArrayMetadata<
  D extends DataType,
  Store extends Readable,
>(
  arr: ZarrArray<D, Store>,
  storeOpts?: Parameters<Store["get"]>[1],
): Promise<ArrayMetadata> {
  const store = arr.store

  // Try v3 first: read zarr.json
  const v3Path = (
    arr.path === "/" ? "/zarr.json" : `${arr.path}/zarr.json`
  ) as `/${string}`
  const v3Bytes = await store.get(v3Path, storeOpts)
  if (v3Bytes) {
    const metadata = JSON.parse(decoder.decode(v3Bytes))
    return {
      codecMeta: {
        data_type: metadata.data_type,
        chunk_shape: metadata.chunk_grid.configuration.chunk_shape,
        codecs: metadata.codecs,
      },
      encodeChunkKey: create_chunk_key_encoder(metadata.chunk_key_encoding),
      fillValue: metadata.fill_value ?? null,
    }
  }

  // Fallback: BytesCodec only, default v3 key encoding
  return {
    codecMeta: {
      data_type: arr.dtype,
      chunk_shape: arr.chunks,
      codecs: [{ name: "bytes", configuration: { endian: "little" } }],
    },
    encodeChunkKey: create_chunk_key_encoder({ name: "default" }),
    fillValue: null,
  }
}

// ---------------------------------------------------------------------------
// getChunkWorker
// ---------------------------------------------------------------------------

/**
 * Read a single chunk from a zarrita Array with codec decoding offloaded to
 * Web Workers.
 *
 * Mirrors zarrita's `arr.getChunk(chunkCoords)` API but uses the same worker
 * decode pipeline as {@link getWorker}.
 */
export async function getChunkWorker<D extends DataType, Store extends Readable>(
  arr: ZarrArray<D, Store>,
  chunkCoords: number[],
  opts: GetWorkerOptions<Parameters<Store["get"]>[1]>,
): Promise<Chunk<D>> {
  const startedAt = performance.now()
  const { pool, workerUrl } = opts
  const useShared = opts.useSharedArrayBuffer !== false
  const cache = opts.cache ?? DEFAULT_CHUNK_CACHE
  const storeOptsWithSignal = withAbortSignal(opts.opts, opts.signal)

  throwIfAborted(opts.signal)

  if (!useShared) {
    throw new Error("Worker chunk loading requires SharedArrayBuffer output")
  }

  assertSharedArrayBufferAvailable()

  const metadataReadStartedAt = performance.now()
  const { codecMeta, encodeChunkKey, fillValue } = await readArrayMetadataCached(
    arr,
    storeOptsWithSignal,
  )
  const metadataReadMs = performance.now() - metadataReadStartedAt

  const actualChunkShape = codecMeta.chunk_shape
  const correctedCodecMeta = codecMeta
  // 'raw16' and 'default' are the only fidelities a production caller passes;
  // the per-chunk-normalizing 'low'/'high' would break multi-chunk surfaces
  // (see TextureFidelity) and are refused here rather than silently honored.
  const textureFidelity = opts.textureFidelity ?? "default"
  if (textureFidelity === "low" || textureFidelity === "high") {
    throw new Error(
      "getChunkWorker: per-chunk-normalized fidelities ('low'/'high') window each chunk independently and cannot serve multi-chunk consumers",
    )
  }
  const OutputCtr = getTextureOutputConstructor(correctedCodecMeta.data_type, textureFidelity)
  const metaId = getMetaId(correctedCodecMeta)

  if (!isWorkerFetchCapableStore(arr.store)) {
    throw new Error("Worker chunk loading requires a worker-fetch-capable store")
  }

  const workerStore = await workerFetchConfigFor(arr.store)
  const chunkKey = encodeChunkKey(chunkCoords)
  const chunkPath = arr.resolve(chunkKey).path
  const edgeChunkShape = chunkCoords.map((coord, dim) =>
    Math.min(actualChunkShape[dim], arr.shape[dim] - coord * actualChunkShape[dim]),
  )
  const isEdgeChunk = edgeChunkShape.some((size, index) => size !== actualChunkShape[index])

  const cacheKey = createCacheKey(arr, encodeChunkKey, chunkCoords)
  const cacheLookupStartedAt = performance.now()
  const cachedChunk = cache.get(cacheKey)
  const cacheLookupMs = performance.now() - cacheLookupStartedAt

  if (cachedChunk) {
    logChunkTiming("[zarr chunk timing]", {
      chunkPath,
      chunkCoords: [...chunkCoords],
      cacheStatus: "hit",
      metadataReadMs: roundTiming(metadataReadMs),
      cacheLookupMs: roundTiming(cacheLookupMs),
      queueWaitMs: 0,
      workerMetaInitMs: 0,
      workerRoundTripMs: 0,
      workerFetchMs: 0,
      workerDecodeMs: 0,
      workerReshapeMs: 0,
      workerPromoteMs: 0,
      workerTotalMs: 0,
      fillChunkMs: 0,
      mainThreadWriteMs: 0,
      totalMs: roundTiming(performance.now() - startedAt),
    })
    logChunkTiming("[zarr get timing]", {
      selectionShape: [...cachedChunk.shape],
      chunkCount: 1,
      metadataReadMs: roundTiming(metadataReadMs),
      totalMs: roundTiming(performance.now() - startedAt),
    })
    return cachedChunk as Chunk<D>
  }

  const enqueuedAt = performance.now()
  const taskPriority = opts.priority ?? 0
  const handle = enqueueWorkerTask(
    pool,
    workerUrl,
    opts.signal,
    async (worker) => {
      const queueWaitMs = performance.now() - enqueuedAt
      const { chunk: fetchedChunk, timings: workerTimings } = await workerFetchDecode<D>(
        worker,
        workerStore,
        chunkPath,
        metaId,
        correctedCodecMeta,
        serializeRequestInit(storeOptsWithSignal as RequestInit | undefined),
        isEdgeChunk ? edgeChunkShape : undefined,
        // Explicit defaults for the trailing positionals: this call previously
        // stopped at 7 args, silently dropping the caller's useSharedArrayBuffer
        // (it defaulted to false and the SAB path never engaged).
        textureFidelity,
        useShared,
      )

      let chunkToReturn: Chunk<D>
      let fillChunkMs = 0

      if (fetchedChunk) {
        cache.set(cacheKey, fetchedChunk)
        chunkToReturn = fetchedChunk
      } else {
        warnFillChunk(chunkPath, fillValue)
        const fillStartedAt = performance.now()
        const fillChunkStrides = get_strides(edgeChunkShape)
        const fillChunkSize = edgeChunkShape.reduce(
          (accumulator: number, dimension: number) => accumulator * dimension,
          1,
        )
        const chunkData = new OutputCtr(fillChunkSize)
        if (fillValue != null) {
          chunkData.fill(Number(fillValue))
        }
        chunkToReturn = {
          data: chunkData as Chunk<D>["data"],
          shape: edgeChunkShape,
          stride: fillChunkStrides,
        }
        cache.set(cacheKey, chunkToReturn)
        fillChunkMs = performance.now() - fillStartedAt
      }

      logChunkTiming("[zarr chunk timing]", {
        chunkPath,
        chunkCoords: [...chunkCoords],
        cacheStatus: fetchedChunk ? "miss" : "missing-fill",
        metadataReadMs: roundTiming(metadataReadMs),
        cacheLookupMs: roundTiming(cacheLookupMs),
        queueWaitMs: roundTiming(queueWaitMs),
        workerMetaInitMs: roundTiming(workerTimings.metaInitMs),
        workerRoundTripMs: roundTiming(workerTimings.roundTripMs),
        workerFetchMs: roundTiming(workerTimings.fetchMs),
        workerDecodeMs: roundTiming(workerTimings.decodeMs),
        workerReshapeMs: roundTiming(workerTimings.reshapeMs),
        workerPromoteMs: roundTiming(workerTimings.promoteMs),
        workerTotalMs: roundTiming(workerTimings.totalWorkerMs),
        fillChunkMs: roundTiming(fillChunkMs),
        mainThreadWriteMs: 0,
        totalMs: roundTiming(performance.now() - startedAt),
      })

      return chunkToReturn
    },
    taskPriority,
  )

  const [chunk] = await waitForTaskHandles([handle], opts.signal)

  logChunkTiming("[zarr get timing]", {
    selectionShape: [...chunk.shape],
    chunkCount: 1,
    metadataReadMs: roundTiming(metadataReadMs),
    totalMs: roundTiming(performance.now() - startedAt),
  })

  return chunk
}

// ---------------------------------------------------------------------------
// getWorker
// ---------------------------------------------------------------------------

/**
 * Read data from a zarrita Array with codec decoding offloaded to Web Workers.
 *
 * Drop-in replacement for zarrita's `get()` with worker acceleration.
 * The main thread fetches raw bytes from the store, then workers handle
 * the (potentially expensive) codec decode operations in parallel.
 *
 * @param arr       - The zarrita Array to read from.
 * @param selection - Index selection (null for full array, or per-dimension slices/indices).
 * @param opts      - Options including the WorkerPool and store options.
 * @returns The result chunk, or a scalar if all dimensions are integer-indexed.
 *
 * @example
 * ```ts
 * import { WorkerPool } from '@fideus-labs/worker-pool'
 * import { getWorker } from '@fideus-labs/fizarrita'
 * import * as zarr from 'zarrita'
 *
 * const pool = new WorkerPool(4)
 * const store = new zarr.FetchStore('https://example.com/data.zarr')
 * const arr = await zarr.open(store, { kind: 'array' })
 * const result = await getWorker(arr, null, { pool })
 *
 * pool.terminateWorkers()
 * ```
 */
export async function getWorker<
  D extends DataType,
  Store extends Readable,
  Sel extends (null | Slice | number)[],
>(
  arr: ZarrArray<D, Store>,
  selection: Sel | null = null,
  opts: GetWorkerOptions<Parameters<Store["get"]>[1]>,
): Promise<
  null extends Sel[number]
    ? Chunk<D>
    : Slice extends Sel[number]
      ? Chunk<D>
      : Scalar<D>
> {
  const startedAt = performance.now()
  const { pool, workerUrl } = opts
  const useShared = opts.useSharedArrayBuffer !== false
  const cache = opts.cache ?? DEFAULT_CHUNK_CACHE
  const storeOptsWithSignal = withAbortSignal(opts.opts, opts.signal)

  throwIfAborted(opts.signal)

  if (!useShared) {
    throw new Error("Worker chunk loading requires SharedArrayBuffer output")
  }

  assertSharedArrayBufferAvailable()

  // Read metadata from store — single read, single parse
  const metadataReadStartedAt = performance.now()
  const { codecMeta, encodeChunkKey, fillValue } = await readArrayMetadataCached(
    arr,
    storeOptsWithSignal,
  )
  const metadataReadMs = performance.now() - metadataReadStartedAt

  const actualChunkShape = codecMeta.chunk_shape

  // Update codecMeta to use the actual chunk shape for codec pipeline
  const correctedCodecMeta = codecMeta

  // getWorker always decodes at 'default' fidelity (its consumers assemble
  // into uint8/float32 outputs); raw16 is a getChunkWorker concern.
  const OutputCtr = getTextureOutputConstructor(correctedCodecMeta.data_type, "default")
  const outputBytesPerElement = OutputCtr.BYTES_PER_ELEMENT

  // Get stable metaId for the codec metadata (used by worker-rpc meta-init)
  const metaId = getMetaId(correctedCodecMeta)

  // Set up the indexer with the actual (possibly corrected) chunk shape
  const indexer = new BasicIndexer({
    selection,
    shape: arr.shape,
    chunk_shape: actualChunkShape,
  })

  // Allocate output — backed by SharedArrayBuffer when requested
  const size = indexer.shape.reduce((a: number, b: number) => a * b, 1)
  const buffer = createBuffer(size * outputBytesPerElement, useShared)
  // `createBuffer` returns a `SharedArrayBuffer` when `useShared` is true,
  // which every JS engine accepts as a TypedArray backing buffer even though
  // the current DOM lib types `ArrayBuffer`/`SharedArrayBuffer` as structurally
  // distinct (missing `resizable`/`resize`/etc.).
  const data = new OutputCtr(buffer as ArrayBuffer, 0, size)
  const outStride = get_strides(indexer.shape)
  // `OutputCtr` is chosen at runtime from `correctedCodecMeta.data_type`, so TS
  // can't statically narrow `data`'s element type to the generic `D`.
  const out = setter.prepare(data as unknown as TypedArray<D>, indexer.shape, outStride) as Chunk<D>

  // Pre-compute chunk invariants (hoisted out of loop)
  const chunkShape = actualChunkShape
  if (!isWorkerFetchCapableStore(arr.store)) {
    throw new Error("Worker chunk loading requires a worker-fetch-capable store")
  }
  const workerStore = await workerFetchConfigFor(arr.store)

  // Build tasks — one per chunk
  const tasks: Array<WorkerPoolTaskHandle<void>> = []
  const taskPriority = opts.priority ?? 0

  for (const { chunk_coords, mapping } of indexer) {
    const chunkStartedAt = performance.now()
    const chunkKey = encodeChunkKey(chunk_coords)
    const chunkPath = arr.resolve(chunkKey).path

    // Compute edge chunk shape: min(chunk_shape[d], array_shape[d] - coord * chunk_shape[d])
    const edgeChunkShape = chunk_coords.map((coord, dim) =>
      Math.min(chunkShape[dim], arr.shape[dim] - coord * chunkShape[dim]),
    )
    const isEdgeChunk = edgeChunkShape.some((s, i) => s !== chunkShape[i])

    // Check cache before building the task — cache hits skip the worker entirely
    const cacheKey = createCacheKey(arr, encodeChunkKey, chunk_coords)
    const cacheLookupStartedAt = performance.now()
    const cachedChunk = cache.get(cacheKey)
    const cacheLookupMs = performance.now() - cacheLookupStartedAt

    if (cachedChunk) {
      // Cache hit — copy cached decoded chunk into output on main thread.
      // No worker needed, no fetch, no decompression.
      const writeStartedAt = performance.now()
      setter.set_from_chunk(out, cachedChunk as Chunk<D>, mapping)
      const mainThreadWriteMs = performance.now() - writeStartedAt
      logChunkTiming("[zarr chunk timing]", {
        chunkPath,
        chunkCoords: [...chunk_coords],
        cacheStatus: "hit",
        metadataReadMs: roundTiming(metadataReadMs),
        cacheLookupMs: roundTiming(cacheLookupMs),
        queueWaitMs: 0,
        workerMetaInitMs: 0,
        workerRoundTripMs: 0,
        workerFetchMs: 0,
        workerDecodeMs: 0,
        workerReshapeMs: 0,
        workerPromoteMs: 0,
        workerTotalMs: 0,
        fillChunkMs: 0,
        mainThreadWriteMs: roundTiming(mainThreadWriteMs),
        totalMs: roundTiming(performance.now() - chunkStartedAt),
      })
      continue
    }

    const enqueuedAt = performance.now()

    tasks.push(
      enqueueWorkerTask(
        pool,
        workerUrl,
        opts.signal,
        async (worker) => {
          const queueWaitMs = performance.now() - enqueuedAt
          const { chunk: fetchedChunk, timings: workerTimings } = await workerFetchDecode<D>(
            worker,
            workerStore,
            chunkPath,
            metaId,
            correctedCodecMeta,
            serializeRequestInit(storeOptsWithSignal as RequestInit | undefined),
            isEdgeChunk ? edgeChunkShape : undefined,
          )

          let chunkToWrite: Chunk<D>
          let fillChunkMs = 0
          if (fetchedChunk) {
            cache.set(cacheKey, fetchedChunk)
            chunkToWrite = fetchedChunk
          } else {
            warnFillChunk(chunkPath, fillValue)
            const fillStartedAt = performance.now()
            const fillChunkShape = edgeChunkShape
            const fillChunkStrides = get_strides(fillChunkShape)
            const fillChunkSize = fillChunkShape.reduce(
              (a: number, b: number) => a * b,
              1,
            )
            const chunkData = new OutputCtr(fillChunkSize)
            if (fillValue != null) {
              chunkData.fill(Number(fillValue))
            }
            chunkToWrite = {
              data: chunkData as Chunk<D>["data"],
              shape: fillChunkShape,
              stride: fillChunkStrides,
            }
            cache.set(cacheKey, chunkToWrite)
            fillChunkMs = performance.now() - fillStartedAt
          }

          const writeStartedAt = performance.now()
          setter.set_from_chunk(out, chunkToWrite, mapping)
          const mainThreadWriteMs = performance.now() - writeStartedAt
          logChunkTiming("[zarr chunk timing]", {
            chunkPath,
            chunkCoords: [...chunk_coords],
            cacheStatus: fetchedChunk ? "miss" : "missing-fill",
            metadataReadMs: roundTiming(metadataReadMs),
            cacheLookupMs: roundTiming(cacheLookupMs),
            queueWaitMs: roundTiming(queueWaitMs),
            workerMetaInitMs: roundTiming(workerTimings.metaInitMs),
            workerRoundTripMs: roundTiming(workerTimings.roundTripMs),
            workerFetchMs: roundTiming(workerTimings.fetchMs),
            workerDecodeMs: roundTiming(workerTimings.decodeMs),
            workerReshapeMs: roundTiming(workerTimings.reshapeMs),
            workerPromoteMs: roundTiming(workerTimings.promoteMs),
            workerTotalMs: roundTiming(workerTimings.totalWorkerMs),
            fillChunkMs: roundTiming(fillChunkMs),
            mainThreadWriteMs: roundTiming(mainThreadWriteMs),
            totalMs: roundTiming(performance.now() - chunkStartedAt),
          })
        },
        taskPriority,
      ),
    )
  }

  // Execute all tasks with bounded concurrency via WorkerPool
  if (tasks.length > 0) {
    await waitForTaskHandles(tasks, opts.signal)
  }

  logChunkTiming("[zarr get timing]", {
    selectionShape: [...indexer.shape],
    chunkCount: tasks.length,
    metadataReadMs: roundTiming(metadataReadMs),
    totalMs: roundTiming(performance.now() - startedAt),
  })

  // If the final shape is empty (all integer selections), return a scalar
  if (indexer.shape.length === 0) {
    const unwrap =
      "get" in out.data
        ? (out.data as unknown as { get(idx: number): Scalar<D> }).get(0)
        : (out.data as unknown as ArrayLike<Scalar<D>>)[0]
    // @ts-expect-error: TS can't narrow conditional type
    return unwrap
  }

  // @ts-expect-error: TS can't narrow conditional type
  return out
}
