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
import { create_codec_pipeline } from "./internals/codec-pipeline"
import { BasicIndexer } from "./internals/indexer"
import { setter } from "./internals/setter"
import {
  assertSharedArrayBufferAvailable,
  create_chunk_key_encoder,
  createBuffer,
  get_strides,
} from "./internals/util"
import type { ChunkCache, CodecChunkMeta, GetWorkerOptions } from "./types"
import { disposeWorker, getMetaId, workerFetchDecode, workerFetchExists, workerFetchProbeDecompressedSize } from "./worker-rpc"
import { isWorkerFetchCapableStore } from "@/lib/zarr/store/types"
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

function getTextureOutputConstructor(dataType: DataType):
  | Uint8ArrayConstructor
  | Float32ArrayConstructor {
  return dataType === "uint8" ? Uint8Array : Float32Array
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
// Chunk shape probing — detect and correct wrong metadata chunk_shape
// ---------------------------------------------------------------------------

/**
 * Read the decompressed (frame content) size from a zstd-compressed buffer's
 * frame header, without decompressing. Returns null if not zstd or if the
 * frame content size is not present.
 *
 * Zstd frame format:
 *   [4 bytes magic 0xFD2FB528] [1 byte FHD] [0-1 byte window] [0-4 dict] [0-8 FCS]
 */
export function readZstdFrameContentSize(
  compressed: Uint8Array,
): number | null {
  if (compressed.length < 6) return null

  const magic =
    compressed[0] |
    (compressed[1] << 8) |
    (compressed[2] << 16) |
    (compressed[3] << 24)
  if (magic >>> 0 !== 0xfd2fb528) return null

  const fhd = compressed[4]
  const fcsFlag = (fhd >> 6) & 3
  const singleSegment = (fhd >> 5) & 1
  const dictIdFlag = fhd & 3
  const dictIdSize = [0, 1, 2, 4][dictIdFlag]
  const windowDescSize = singleSegment ? 0 : 1

  let fcsFieldSize: number
  if (fcsFlag === 0) fcsFieldSize = singleSegment ? 1 : 0
  else if (fcsFlag === 1) fcsFieldSize = 2
  else if (fcsFlag === 2) fcsFieldSize = 4
  else fcsFieldSize = 8

  if (fcsFieldSize === 0) return null

  const offset = 5 + windowDescSize + dictIdSize
  if (compressed.length < offset + fcsFieldSize) return null

  if (fcsFieldSize === 1) return compressed[offset]
  if (fcsFieldSize === 2) {
    return (compressed[offset] | (compressed[offset + 1] << 8)) + 256
  }
  if (fcsFieldSize === 4) {
    return (
      (compressed[offset] |
        (compressed[offset + 1] << 8) |
        (compressed[offset + 2] << 16) |
        (compressed[offset + 3] << 24)) >>>
      0
    )
  }
  // 8-byte: use DataView for 64-bit (return as Number, safe for chunk sizes)
  const dv = new DataView(compressed.buffer, compressed.byteOffset + offset, 8)
  return Number(dv.getBigUint64(0, true))
}

/**
 * Read the uncompressed size (nbytes) from a blosc-compressed buffer's header,
 * without decompressing. Returns null if not a valid blosc buffer.
 *
 * Blosc 1.x header (16 bytes, little-endian):
 *   [1 byte version] [1 byte versionlz] [1 byte flags] [1 byte typesize]
 *   [4 bytes nbytes] [4 bytes blocksize] [4 bytes cbytes]
 *
 * The nbytes field at offset 4 is the uncompressed data size in bytes.
 */
export function readBloscFrameContentSize(
  compressed: Uint8Array,
): number | null {
  if (compressed.length < 16) return null

  // Blosc version must be >= 1 (version byte at offset 0)
  const version = compressed[0]
  if (version < 1 || version > 2) return null

  // Sanity: typesize at offset 3 should be 1-8 for typical numeric data
  const typesize = compressed[3]
  if (typesize === 0 || typesize > 8) return null

  // Read nbytes (uint32 LE) at offset 4
  const nbytes =
    (compressed[4] |
      (compressed[5] << 8) |
      (compressed[6] << 16) |
      (compressed[7] << 24)) >>>
    0

  // Read cbytes (uint32 LE) at offset 12
  const cbytes =
    (compressed[12] |
      (compressed[13] << 8) |
      (compressed[14] << 16) |
      (compressed[15] << 24)) >>>
    0

  // Sanity: cbytes should roughly match the actual buffer size
  // Allow some slack since the buffer might contain trailing data
  if (cbytes === 0 || cbytes > compressed.length + 16) return null

  // Sanity: nbytes should be reasonable (> 0, not astronomically large)
  if (nbytes === 0) return null

  return nbytes
}

/**
 * Try to determine the decompressed byte size of a raw chunk without full decoding.
 *
 * Hybrid strategy (cheapest first):
 *  1. Zstd frame header — read FCS field (zero-cost, no decompression)
 *  2. Blosc header — read nbytes field (zero-cost, no decompression)
 *  3. Uncompressed check — if raw byte count matches a plausible element count,
 *     the chunk may be uncompressed (bytes codec only)
 *  4. Full decode — decode chunk c/0/0/0 using the codec pipeline and count elements
 *
 * Returns the decompressed byte size, or null if detection failed.
 */
async function probeDecompressedSize(
  rawBytes: Uint8Array,
  codecMeta: CodecChunkMeta,
  bytesPerElement: number,
): Promise<number | null> {
  // 1. Try zstd header (cheapest — just reads a few bytes)
  const zstdSize = readZstdFrameContentSize(rawBytes)
  if (zstdSize != null) return zstdSize

  // 2. Try blosc header
  const bloscSize = readBloscFrameContentSize(rawBytes)
  if (bloscSize != null) return bloscSize

  // 3. Check if the raw bytes could be an uncompressed chunk.
  //    For the bytes codec (no compression), rawBytes.byteLength IS the
  //    decompressed size. We check whether the codec chain is bytes-only
  //    (no bytes_to_bytes compression codecs).
  const hasCompression = codecMeta.codecs.some((c) => {
    const name = c.name.toLowerCase()
    // array_to_array codecs (transpose, etc.) don't change byte size
    // array_to_bytes codecs (bytes, etc.) don't compress
    // bytes_to_bytes codecs are the compressors
    return (
      name === "gzip" ||
      name === "zlib" ||
      name === "blosc" ||
      name === "zstd" ||
      name === "lz4" ||
      name === "bz2" ||
      name === "lzma" ||
      name === "snappy"
    )
  })
  if (!hasCompression) {
    // No compression codec — raw bytes are the decompressed data
    return rawBytes.byteLength
  }

  // 4. Full decode fallback — decode the chunk using the codec pipeline
  //    This handles any codec (gzip, lz4, etc.) at the cost of one decompression
  try {
    const pipeline = create_codec_pipeline({
      data_type: codecMeta.data_type,
      shape: codecMeta.chunk_shape,
      codecs: codecMeta.codecs,
    })
    const chunk = await pipeline.decode(rawBytes)
    const data = chunk.data as unknown as ArrayLike<unknown>
    return data.length * bytesPerElement
  } catch {
    return null
  }
}

interface ChunkShapeCandidate {
  shape: number[]
  score: number
}

/**
 * Infer candidate chunk shapes from the decompressed element count.
 * Returns an array of candidates sorted by quality score (lower = better).
 *
 * Scoring considers:
 *  1. Closeness to metadata chunk_shape (L1 distance)
 *  2. Whether each chunk dimension is a power-of-2 (common in scientific imaging)
 *  3. Whether the chunk dimensions evenly divide the array shape
 *  4. Whether chunk_x >= chunk_y (OME-Zarr convention for faster-varying dims)
 */
export function inferChunkShape(
  actualElements: number,
  metadataChunkShape: number[],
  arrayShape: number[],
): number[][] {
  const ndim = metadataChunkShape.length
  const metaElements = metadataChunkShape.reduce((a, b) => a * b, 1)
  if (actualElements === metaElements) return [metadataChunkShape]

  const allCandidates: ChunkShapeCandidate[] = []
  const seen = new Set<string>()

  function isPowerOf2(n: number): boolean {
    return n > 0 && (n & (n - 1)) === 0
  }

  function scoreCandidate(shape: number[]): number {
    // L1 distance from metadata
    let l1 = 0
    for (let i = 0; i < shape.length; i++)
      l1 += Math.abs(shape[i] - metadataChunkShape[i])

    // Penalty for non-power-of-2 dimensions
    let pow2Penalty = 0
    for (let i = 0; i < shape.length; i++) {
      if (!isPowerOf2(shape[i])) pow2Penalty += 10
    }

    // Penalty for not evenly dividing array shape
    let divPenalty = 0
    for (let i = 0; i < shape.length; i++) {
      if (arrayShape[i] % shape[i] !== 0) divPenalty += 5
    }

    // Penalty for chunk dim > array dim (invalid)
    let overPenalty = 0
    for (let i = 0; i < shape.length; i++) {
      if (shape[i] > arrayShape[i]) overPenalty += 1000
    }

    // OME-Zarr convention: for 3D (z,y,x), prefer chunk_x >= chunk_y
    let conventionPenalty = 0
    if (ndim >= 2) {
      const lastDim = shape[ndim - 1] // x
      const prevDim = shape[ndim - 2] // y
      if (lastDim < prevDim) conventionPenalty += 20
    }

    return l1 + pow2Penalty + divPenalty + overPenalty + conventionPenalty
  }

  function addCandidate(shape: number[]): void {
    const key = shape.join(",")
    if (seen.has(key)) return
    seen.add(key)
    allCandidates.push({ shape, score: scoreCandidate(shape) })
  }

  // Strategy 1: Keep all but one dimension from metadata, solve for the remaining
  for (let vary = 0; vary < ndim; vary++) {
    const fixedProduct = metadataChunkShape.reduce(
      (acc, v, i) => (i === vary ? acc : acc * v),
      1,
    )
    if (fixedProduct === 0 || actualElements % fixedProduct !== 0) continue
    const candidate = actualElements / fixedProduct
    if (
      candidate > 0 &&
      candidate <= arrayShape[vary] &&
      Number.isInteger(candidate)
    ) {
      const result = [...metadataChunkShape]
      result[vary] = candidate
      addCandidate(result)
    }
  }

  // Strategy 2: For 3D arrays, try common chunk sizes for two dimensions, solve for third
  if (ndim === 3) {
    const commonSizes = [256, 128, 96, 64, 48, 32]
    for (const cy of commonSizes) {
      if (cy > arrayShape[1] || actualElements % cy !== 0) continue
      for (const cx of commonSizes) {
        if (cx > arrayShape[2]) continue
        const yx = cy * cx
        if (actualElements % yx !== 0) continue
        const cz = actualElements / yx
        if (cz > 0 && cz <= arrayShape[0] && Number.isInteger(cz)) {
          addCandidate([cz, cy, cx])
        }
      }
    }
  }

  // Strategy 3: Try adjusting one dim by small delta, solve for other two
  if (ndim === 3) {
    const deltas = [1, -1, 2, -2, 3, -3]
    const commonSizes = [256, 128, 96, 64, 48, 32]
    for (let vary = 0; vary < ndim; vary++) {
      for (const delta of deltas) {
        const trial = metadataChunkShape[vary] + delta
        if (trial <= 0 || trial > arrayShape[vary]) continue
        if (actualElements % trial !== 0) continue
        const remaining = actualElements / trial
        const otherDims: number[] = []
        for (let d = 0; d < ndim; d++) {
          if (d !== vary) otherDims.push(d)
        }
        const [d1, d2] = otherDims
        for (const s1 of commonSizes) {
          if (s1 > arrayShape[d1] || remaining % s1 !== 0) continue
          const s2 = remaining / s1
          if (s2 > 0 && s2 <= arrayShape[d2] && Number.isInteger(s2)) {
            const result = [...metadataChunkShape]
            result[vary] = trial
            result[d1] = s1
            result[d2] = s2
            addCandidate(result)
          }
        }
      }
    }
  }

  // Sort by quality score (lower = better)
  allCandidates.sort((a, b) => a.score - b.score)
  return allCandidates.map((c) => c.shape)
}

/**
 * Validate a candidate chunk shape by probing one-past-the-end along the
 * dimension with the smallest grid extent. If the probe returns data, the
 * candidate's chunks are too large (the real grid has more chunks in that
 * dimension) and should be rejected.
 *
 * Returns true if the candidate is valid (probe returned 404/empty),
 * false if invalid (probe returned data, meaning chunks are too coarse).
 */
async function validateCandidateChunkShape<
  D extends DataType,
  Store extends Readable,
>(
  arr: ZarrArray<D, Store>,
  encodeChunkKey: (chunk_coords: number[]) => string,
  candidate: number[],
  storeOpts?: Parameters<Store["get"]>[1],
  workerOpts?: Pick<GetWorkerOptions<Parameters<Store["get"]>[1]>, "pool" | "workerUrl" | "signal">,
): Promise<boolean> {
  const ndim = candidate.length

  // Compute grid dimensions and find the dimension with the smallest extent > 1
  // (most likely to differ between wrong and correct candidates)
  const gridDims = candidate.map((c, i) => Math.ceil(arr.shape[i] / c))

  // Find a dimension where gridDims > 1 to probe one-past-the-end
  // Prefer the dimension with the smallest grid extent (fewest chunks),
  // as that's where over-sized chunks are most detectable
  let probeDim = -1
  let minGrid = Infinity
  for (let i = 0; i < ndim; i++) {
    if (gridDims[i] > 1 && gridDims[i] < minGrid) {
      minGrid = gridDims[i]
      probeDim = i
    }
  }

  if (probeDim === -1) {
    // All dimensions have only 1 chunk — can't validate, assume correct
    return true
  }

  // Probe one-past-the-end: if the store has a chunk at this coordinate,
  // the candidate's chunks are too large (real grid is finer)
  const probeCoords = candidate.map(() => 0)
  probeCoords[probeDim] = gridDims[probeDim] // one past last valid index
  const probeKey = encodeChunkKey(probeCoords)
  const probePath = arr.resolve(probeKey).path

  try {
    if (isWorkerFetchCapableStore(arr.store) && workerOpts) {
      const storeConfig = arr.store.getWorkerFetchConfig()
      const handle = enqueueWorkerTask(
        workerOpts.pool,
        workerOpts.workerUrl,
        workerOpts.signal,
        (worker) =>
          workerFetchExists(
            worker,
            storeConfig,
            probePath,
            serializeRequestInit(storeOpts as RequestInit | undefined),
          ),
      )
      const [exists] = await waitForTaskHandles(
        [handle],
        workerOpts.signal,
      )
      return !exists
    }

    const probeBytes = await arr.store.get(probePath, storeOpts)
    // If data returned, there's a chunk beyond our expected grid → reject
    return !probeBytes
  } catch {
    // Fetch error (404, network error) → no chunk there → accept
    return true
  }
}

/**
 * Detect actual chunk shape by probing the first chunk's decompressed size
 * and using heuristic scoring to infer the most likely chunk shape.
 *
 * Uses a hybrid approach to determine decompressed size:
 *  1. Zstd frame header (zero-cost)
 *  2. Blosc header (zero-cost)
 *  3. Raw size check for uncompressed data (zero-cost)
 *  4. Full decode fallback for any other codec (one decompression)
 *
 * After inference, validates the top candidate by probing one-past-the-end
 * along its smallest grid dimension. If the store has a chunk beyond the
 * candidate's expected grid, the candidate is rejected in favor of the next.
 *
 * Returns the corrected chunk shape, or the metadata chunk shape if no
 * correction is needed or possible.
 */
export async function probeActualChunkShape<
  D extends DataType,
  Store extends Readable,
>(
  arr: ZarrArray<D, Store>,
  encodeChunkKey: (chunk_coords: number[]) => string,
  codecMeta: CodecChunkMeta,
  bytesPerElement: number,
  storeOpts?: Parameters<Store["get"]>[1],
  workerOpts?: Pick<GetWorkerOptions<Parameters<Store["get"]>[1]>, "pool" | "workerUrl" | "signal">,
): Promise<number[]> {
  throwIfAborted(workerOpts?.signal)

  const metadataChunkShape = codecMeta.chunk_shape
  const metaElements = metadataChunkShape.reduce((a, b) => a * b, 1)

  // Fetch the first chunk (c/0/0/0)
  const zeroCoords = metadataChunkShape.map(() => 0)
  const chunkKey = encodeChunkKey(zeroCoords)
  const chunkPath = arr.resolve(chunkKey).path

  try {
    let decompressedBytes: number | null

    if (isWorkerFetchCapableStore(arr.store) && workerOpts) {
      const storeConfig = arr.store.getWorkerFetchConfig()
      const metaId = getMetaId(codecMeta)
      const handle = enqueueWorkerTask(
        workerOpts.pool,
        workerOpts.workerUrl,
        workerOpts.signal,
        (worker) =>
          workerFetchProbeDecompressedSize(
            worker,
            storeConfig,
            chunkPath,
            metaId,
            codecMeta,
            bytesPerElement,
            serializeRequestInit(storeOpts as RequestInit | undefined),
          ),
      )
      ;[decompressedBytes] = await waitForTaskHandles(
        [handle],
        workerOpts.signal,
      )
    } else {
      const rawBytes = await arr.store.get(chunkPath, storeOpts)
      if (!rawBytes) return metadataChunkShape

      decompressedBytes = await probeDecompressedSize(
        rawBytes,
        codecMeta,
        bytesPerElement,
      )
    }

    if (decompressedBytes == null) return metadataChunkShape

    const actualElements = decompressedBytes / bytesPerElement
    if (actualElements === metaElements) return metadataChunkShape

    // Mismatch detected — infer chunk shape from element count + heuristics
    const candidates = inferChunkShape(
      actualElements,
      metadataChunkShape,
      arr.shape,
    )
    if (candidates.length === 0) return metadataChunkShape

    // Validate candidates by probing one-past-the-end.
    // The first candidate that passes validation wins.
    // Limit validation attempts to avoid excessive network requests.
    const maxValidationAttempts = Math.min(candidates.length, 5)
    for (let i = 0; i < maxValidationAttempts; i++) {
      const candidate = candidates[i]
      const isValid = await validateCandidateChunkShape(
        arr,
        encodeChunkKey,
        candidate,
        storeOpts,
        workerOpts,
      )
      if (isValid) {
        console.warn(
          `[fizarrita] Metadata chunk_shape ${JSON.stringify(metadataChunkShape)} ` +
            `does not match actual chunk data (${actualElements} elements). ` +
            `Using inferred chunk_shape: ${JSON.stringify(candidate)}`,
        )
        return candidate
      }
    }

    // No candidate passed validation — fall back to best-scored
    const fallback = candidates[0]
    console.warn(
      `[fizarrita] Metadata chunk_shape ${JSON.stringify(metadataChunkShape)} ` +
        `does not match actual chunk data (${actualElements} elements). ` +
        `Using inferred chunk_shape: ${JSON.stringify(fallback)} (unvalidated)`,
    )
    return fallback
  } catch {
    return metadataChunkShape
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
  const OutputCtr = getTextureOutputConstructor(correctedCodecMeta.data_type)
  const metaId = getMetaId(correctedCodecMeta)

  if (!isWorkerFetchCapableStore(arr.store)) {
    throw new Error("Worker chunk loading requires a worker-fetch-capable store")
  }

  const workerStore = arr.store.getWorkerFetchConfig()
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
        'default',
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

  const OutputCtr = getTextureOutputConstructor(correctedCodecMeta.data_type)
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
  const workerStore = arr.store.getWorkerFetchConfig()

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
