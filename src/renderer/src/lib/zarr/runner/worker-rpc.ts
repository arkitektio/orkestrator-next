/**
 * Main-thread helpers for communicating with the read-only codec worker.
 */

import type { DataType, TypedArray } from 'zarrita'
import { get_ctr } from './internals/util.js'
import type { CodecChunkMeta, TextureChunkBounds, TexturedChunk } from './types.js'
import type { TextureFidelity } from './types.js'
import type { S3FetchConfig, SerializedRequestInit } from './s3-request.js'

type TextureCompatibleDataType = 'uint8' | 'uint16' | 'float32'

export interface WorkerDecodeTimings {
  metaInitMs: number
  roundTripMs: number
  fetchMs: number
  decodeMs: number
  reshapeMs: number
  promoteMs: number
  totalWorkerMs: number
}

export interface WorkerFetchDecodeResult<D extends DataType> {
  chunk: TexturedChunk<D> | undefined
  timings: WorkerDecodeTimings
}

function createPromotedArray<D extends DataType>(
  promotedType: TextureCompatibleDataType | undefined,
  buffer: ArrayBufferLike,
  byteOffset: number,
  byteLength: number,
  meta: CodecChunkMeta,
): TypedArray<D> {
  if (promotedType === 'uint8') {
    return new Uint8Array(buffer, byteOffset, byteLength) as TypedArray<D>
  }

  if (promotedType === 'float32') {
    return new Float32Array(buffer, byteOffset, byteLength / Float32Array.BYTES_PER_ELEMENT) as TypedArray<D>
  }

  if (promotedType === 'uint16') {
    return new Uint16Array(buffer, byteOffset, byteLength / Uint16Array.BYTES_PER_ELEMENT) as TypedArray<D>
  }

  const Ctr = get_ctr(meta.data_type) as unknown as {
    new (buf: ArrayBuffer, off: number, len: number): TypedArray<D>
    BYTES_PER_ELEMENT: number
  }
  return new Ctr(buffer, byteOffset, byteLength / Ctr.BYTES_PER_ELEMENT)
}

interface PendingRequest {
  resolve: (data: unknown) => void
  reject: (err: Error) => void
}

class WorkerDispatcher {
  private pending = new Map<number, PendingRequest>()
  private sentMetas = new Set<number>()

  constructor(private worker: Worker) {
    worker.addEventListener('message', this.onMessage)
    worker.addEventListener('error', this.onError)
  }

  private onMessage = (event: MessageEvent): void => {
    const { id } = event.data
    const req = this.pending.get(id)
    if (!req) return
    this.pending.delete(id)

    if (event.data.error) {
      req.reject(new Error(event.data.error))
    } else {
      req.resolve(event.data)
    }
  }

  private onError = (err: ErrorEvent): void => {
    this.rejectAll(new Error(err.message ?? 'Worker error'))
  }

  send(id: number, message: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.worker.postMessage(message)
    })
  }

  hasMeta(metaId: number): boolean {
    return this.sentMetas.has(metaId)
  }

  markMeta(metaId: number): void {
    this.sentMetas.add(metaId)
  }

  rejectAll(error: Error): void {
    for (const req of this.pending.values()) {
      req.reject(error)
    }
    this.pending.clear()
  }

  destroy(): void {
    this.worker.removeEventListener('message', this.onMessage)
    this.worker.removeEventListener('error', this.onError)
    this.pending.clear()
    this.sentMetas.clear()
  }
}

const dispatchers = new WeakMap<Worker, WorkerDispatcher>()

function getDispatcher(worker: Worker): WorkerDispatcher {
  let dispatcher = dispatchers.get(worker)
  if (!dispatcher) {
    dispatcher = new WorkerDispatcher(worker)
    dispatchers.set(worker, dispatcher)
  }
  return dispatcher
}

export function disposeWorker(
  worker: Worker,
  error: Error = new Error('Worker terminated'),
): void {
  const dispatcher = dispatchers.get(worker)
  if (dispatcher) {
    dispatcher.rejectAll(error)
    dispatcher.destroy()
    dispatchers.delete(worker)
  }
  worker.terminate()
}

let nextMetaId = 0
const metaKeyToId = new Map<string, number>()
const metaIdToMeta = new Map<number, CodecChunkMeta>()

export function getMetaId(meta: CodecChunkMeta): number {
  const key = JSON.stringify(meta)
  let id = metaKeyToId.get(key)
  if (id === undefined) {
    id = nextMetaId++
    metaKeyToId.set(key, id)
    metaIdToMeta.set(id, meta)
  }
  return id
}

let nextRequestId = 0

async function ensureMeta(
  dispatcher: WorkerDispatcher,
  metaId: number,
): Promise<number> {
  if (dispatcher.hasMeta(metaId)) return 0
  const meta = metaIdToMeta.get(metaId)
  if (!meta) {
    throw new Error(`No metadata registered for metaId ${metaId}`)
  }
  const id = nextRequestId++
  const startedAt = performance.now()
  await dispatcher.send(id, { type: 'init', id, metaId, meta })
  dispatcher.markMeta(metaId)
  return performance.now() - startedAt
}

export async function workerFetchDecode<D extends DataType>(
  worker: Worker,
  store: S3FetchConfig,
  path: `/${string}`,
  metaId: number,
  meta: CodecChunkMeta,
  requestInit?: SerializedRequestInit,
  actualChunkShape?: number[],
  textureFidelity: TextureFidelity = 'default',
  useSharedArrayBuffer = false,
): Promise<WorkerFetchDecodeResult<D>> {
  const dispatcher = getDispatcher(worker)
  // Piggyback the codec meta on the first fetch_decode this worker sees for
  // this metaId instead of a separate serial `init` round-trip (which used to
  // cost one full worker RT per cold worker — the dominant fixed cost on a
  // cold pool). Marking BEFORE the send is race-free: the pool checks workers
  // out exclusively, so no other request can interleave on this worker.
  let inlineMeta: CodecChunkMeta | undefined
  if (!dispatcher.hasMeta(metaId)) {
    inlineMeta = meta
    dispatcher.markMeta(metaId)
  }
  const metaInitMs = 0 // meta rides the fetch_decode message now

  const id = nextRequestId++
  const roundTripStartedAt = performance.now()
  const response = await dispatcher.send(id, {
    type: 'fetch_decode' as const,
    id,
    store,
    path,
    metaId,
    meta: inlineMeta,
    requestInit,
    actualChunkShape,
    textureFidelity,
    useSharedArrayBuffer,
  }) as {
    missing?: boolean
    promotedType?: TextureCompatibleDataType
    textureBounds?: TextureChunkBounds
    data?: ArrayBufferLike
    byteOffset?: number
    byteLength?: number
    shape?: number[]
    stride?: number[]
    timings?: {
      fetchMs?: number
      decodeMs?: number
      reshapeMs?: number
      promoteMs?: number
      totalMs?: number
    }
  }

  const timings: WorkerDecodeTimings = {
    metaInitMs,
    roundTripMs: performance.now() - roundTripStartedAt,
    fetchMs: response.timings?.fetchMs ?? 0,
    decodeMs: response.timings?.decodeMs ?? 0,
    reshapeMs: response.timings?.reshapeMs ?? 0,
    promoteMs: response.timings?.promoteMs ?? 0,
    totalWorkerMs: response.timings?.totalMs ?? 0,
  }

  if (response.missing) {
    return {
      chunk: undefined,
      timings,
    }
  }

  const data = createPromotedArray<D>(
    response.promotedType,
    response.data!,
    response.byteOffset ?? 0,
    response.byteLength ?? response.data!.byteLength,
    meta,
  )
  return {
    chunk: {
      data,
      shape: response.shape!,
      stride: response.stride!,
      textureBounds: response.textureBounds,
    } as TexturedChunk<D>,
    timings,
  }
}

export async function workerFetchExists(
  worker: Worker,
  store: S3FetchConfig,
  path: `/${string}`,
  requestInit?: SerializedRequestInit,
): Promise<boolean> {
  const dispatcher = getDispatcher(worker)
  const id = nextRequestId++
  const response = await dispatcher.send(id, {
    type: 'fetch_exists' as const,
    id,
    store,
    path,
    requestInit,
  }) as { exists: boolean }

  return response.exists
}

export async function workerFetchProbeDecompressedSize(
  worker: Worker,
  store: S3FetchConfig,
  path: `/${string}`,
  metaId: number,
  _meta: CodecChunkMeta,
  bytesPerElement: number,
  requestInit?: SerializedRequestInit,
): Promise<number | null> {
  const dispatcher = getDispatcher(worker)
  await ensureMeta(dispatcher, metaId)

  const id = nextRequestId++
  const response = await dispatcher.send(id, {
    type: 'fetch_probe_size' as const,
    id,
    store,
    path,
    metaId,
    bytesPerElement,
    requestInit,
  }) as { decompressedBytes: number | null }

  return response.decompressedBytes
}
