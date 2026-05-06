/**
 * Read-only codec worker for zarr chunk fetching and decoding.
 */

import type { Chunk, DataType } from 'zarrita'

import { create_codec_pipeline } from './internals/codec-pipeline.js'
import { get_strides } from './internals/util.js'
import {
  deserializeRequestInit,
  fetchS3Path,
  type S3FetchConfig,
  type SerializedRequestInit,
} from './s3-request.js'
import type { CodecChunkMeta } from './types.js'

const ctx = self as unknown as DedicatedWorkerGlobalScope

type TextureCompatibleDataType = 'uint8' | 'float32'

function now(): number {
  return performance.now()
}

function fixEdgeChunkShapeStride<D extends DataType>(
  chunk: Chunk<D>,
  actualChunkShape?: number[],
): Chunk<D> {
  if (actualChunkShape) {
    const expectedElements = actualChunkShape.reduce((a, b) => a * b, 1)
    const actualElements = (chunk.data as unknown as ArrayLike<unknown>).length
    if (actualElements === expectedElements) {
      return {
        data: chunk.data,
        shape: actualChunkShape,
        stride: get_strides(actualChunkShape, 'C'),
      }
    }
    if (actualElements > expectedElements) {
      const src = chunk.data as unknown as { readonly [i: number]: unknown; readonly length: number }
      const Ctr = (chunk.data as { constructor: new (n: number) => typeof chunk.data }).constructor
      const dst = new Ctr(expectedElements)
      const srcStrides = get_strides(chunk.shape, 'C')
      copySubRegion(src, srcStrides, dst as unknown as { [i: number]: unknown; length: number }, actualChunkShape)
      return {
        data: dst,
        shape: actualChunkShape,
        stride: get_strides(actualChunkShape, 'C'),
      }
    }
  }
  return chunk
}

function promoteChunkForTexture(
  chunk: Chunk<DataType>,
): { chunk: Chunk<'uint8'> | Chunk<'float32'>; promotedType: TextureCompatibleDataType } {
  if (chunk.data instanceof Uint8Array || chunk.data instanceof Uint8ClampedArray) {
    return {
      chunk: {
        data: chunk.data instanceof Uint8Array ? chunk.data : new Uint8Array(chunk.data),
        shape: chunk.shape,
        stride: chunk.stride,
      } as Chunk<'uint8'>,
      promotedType: 'uint8',
    }
  }

  if (chunk.data instanceof Float32Array) {
    return {
      chunk: chunk as Chunk<'float32'>,
      promotedType: 'float32',
    }
  }

  const source = chunk.data as ArrayLike<number | bigint>
  const promoted = new Float32Array(source.length)
  for (let i = 0; i < source.length; i++) {
    promoted[i] = Number(source[i])
  }

  return {
    chunk: {
      data: promoted,
      shape: chunk.shape,
      stride: chunk.stride,
    } as Chunk<'float32'>,
    promotedType: 'float32',
  }
}

function copySubRegion(
  src: { readonly [i: number]: unknown; readonly length: number },
  srcStrides: number[],
  dst: { [i: number]: unknown; length: number },
  subShape: number[],
  srcOffset = 0,
  dstOffset = 0,
  dim = 0,
): void {
  if (dim === subShape.length - 1) {
    for (let i = 0; i < subShape[dim]; i++) {
      dst[dstOffset + i] = src[srcOffset + i]
    }
    return
  }

  const dstStride = subShape.slice(dim + 1).reduce((a, b) => a * b, 1)
  for (let i = 0; i < subShape[dim]; i++) {
    copySubRegion(
      src,
      srcStrides,
      dst,
      subShape,
      srcOffset + i * srcStrides[dim],
      dstOffset + i * dstStride,
      dim + 1,
    )
  }
}

const pipelineByMetaId = new Map<number, ReturnType<typeof create_codec_pipeline>>()
const metaByMetaId = new Map<number, CodecChunkMeta>()

function getPipeline(metaId: number): ReturnType<typeof create_codec_pipeline> {
  const pipeline = pipelineByMetaId.get(metaId)
  if (!pipeline) {
    throw new Error(`No pipeline for metaId ${metaId}. Send an 'init' message first.`)
  }
  return pipeline
}

function readZstdFrameContentSize(compressed: Uint8Array): number | null {
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

  const dv = new DataView(compressed.buffer, compressed.byteOffset + offset, 8)
  return Number(dv.getBigUint64(0, true))
}

function readBloscFrameContentSize(compressed: Uint8Array): number | null {
  if (compressed.length < 16) return null

  const version = compressed[0]
  if (version < 1 || version > 2) return null

  const typesize = compressed[3]
  if (typesize === 0 || typesize > 8) return null

  const nbytes =
    (compressed[4] |
      (compressed[5] << 8) |
      (compressed[6] << 16) |
      (compressed[7] << 24)) >>>
    0
  const cbytes =
    (compressed[12] |
      (compressed[13] << 8) |
      (compressed[14] << 16) |
      (compressed[15] << 24)) >>>
    0

  if (cbytes === 0 || cbytes > compressed.length + 16) return null
  if (nbytes === 0) return null

  return nbytes
}

async function probeDecompressedSize(
  rawBytes: Uint8Array,
  codecMeta: CodecChunkMeta,
  bytesPerElement: number,
): Promise<number | null> {
  const zstdSize = readZstdFrameContentSize(rawBytes)
  if (zstdSize != null) return zstdSize

  const bloscSize = readBloscFrameContentSize(rawBytes)
  if (bloscSize != null) return bloscSize

  const hasCompression = codecMeta.codecs.some((codec) => {
    const name = codec.name.toLowerCase()
    return (
      name === 'gzip' ||
      name === 'zlib' ||
      name === 'blosc' ||
      name === 'zstd' ||
      name === 'lz4' ||
      name === 'bz2' ||
      name === 'lzma' ||
      name === 'snappy'
    )
  })

  if (!hasCompression) {
    return rawBytes.byteLength
  }

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

async function fetchChunkBytes(
  store: S3FetchConfig,
  path: `/${string}`,
  requestInit?: SerializedRequestInit,
): Promise<Uint8Array | undefined> {
  const response = await fetchS3Path(
    store,
    path,
    deserializeRequestInit(requestInit) ?? {},
  )

  if (response.status === 404) {
    return undefined
  }

  if (response.status !== 200 && response.status !== 206) {
    throw new Error(`Unexpected response status ${response.status} ${response.statusText}`)
  }

  return new Uint8Array(await response.arrayBuffer())
}

type WorkerMessage =
  | { type: 'init'; id: number; metaId: number; meta: CodecChunkMeta }
  | {
      type: 'fetch_decode'
      id: number
      store: S3FetchConfig
      path: `/${string}`
      metaId: number
      requestInit?: SerializedRequestInit
      actualChunkShape?: number[]
    }
  | {
      type: 'fetch_exists'
      id: number
      store: S3FetchConfig
      path: `/${string}`
      requestInit?: SerializedRequestInit
    }
  | {
      type: 'fetch_probe_size'
      id: number
      store: S3FetchConfig
      path: `/${string}`
      metaId: number
      bytesPerElement: number
      requestInit?: SerializedRequestInit
    }

ctx.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data

  try {
    if (msg.type === 'init') {
      metaByMetaId.set(msg.metaId, msg.meta)
      pipelineByMetaId.set(
        msg.metaId,
        create_codec_pipeline({
          data_type: msg.meta.data_type,
          shape: msg.meta.chunk_shape,
          codecs: msg.meta.codecs,
        }),
      )
      ctx.postMessage({ type: 'init_ok', id: msg.id })
      return
    }

    if (msg.type === 'fetch_exists') {
      const response = await fetchS3Path(
        msg.store,
        msg.path,
        { ...(deserializeRequestInit(msg.requestInit) ?? {}), method: 'HEAD' },
      )
      ctx.postMessage({ type: 'fetch_exists_ok', id: msg.id, exists: response.status !== 404 })
      return
    }

    if (msg.type === 'fetch_probe_size') {
      const rawBytes = await fetchChunkBytes(msg.store, msg.path, msg.requestInit)
      if (!rawBytes) {
        ctx.postMessage({ type: 'fetch_probe_size_ok', id: msg.id, decompressedBytes: null })
        return
      }

      const meta = metaByMetaId.get(msg.metaId)
      if (!meta) {
        throw new Error(`No metadata registered for metaId ${msg.metaId}`)
      }

      const decompressedBytes = await probeDecompressedSize(
        rawBytes,
        meta,
        msg.bytesPerElement,
      )
      ctx.postMessage({ type: 'fetch_probe_size_ok', id: msg.id, decompressedBytes })
      return
    }

    if (msg.type === 'fetch_decode') {
      const workerStartedAt = now()
      const pipeline = getPipeline(msg.metaId)
      const fetchStartedAt = now()
      const rawBytes = await fetchChunkBytes(msg.store, msg.path, msg.requestInit)
      const fetchMs = now() - fetchStartedAt
      if (!rawBytes) {
        ctx.postMessage({
          type: 'fetch_decode_ok',
          id: msg.id,
          missing: true,
          timings: {
            fetchMs,
            decodeMs: 0,
            reshapeMs: 0,
            promoteMs: 0,
            totalMs: now() - workerStartedAt,
          },
        })
        return
      }

      const decodeStartedAt = now()
      let chunk = (await pipeline.decode(rawBytes)) as Chunk<DataType>
      const decodeMs = now() - decodeStartedAt

      const reshapeStartedAt = now()
      chunk = fixEdgeChunkShapeStride(chunk, msg.actualChunkShape)
      const reshapeMs = now() - reshapeStartedAt

      const promoteStartedAt = now()
      const promoted = promoteChunkForTexture(chunk)
      const promoteMs = now() - promoteStartedAt

      const dataView = promoted.chunk.data as unknown as {
        buffer: ArrayBuffer
        byteOffset: number
        byteLength: number
      }
      const buffer = dataView.buffer
      const byteOffset = dataView.byteOffset
      const byteLength = dataView.byteLength
      const transferBuffer =
        byteOffset === 0 && byteLength === buffer.byteLength
          ? buffer
          : buffer.slice(byteOffset, byteOffset + byteLength)

      ctx.postMessage(
        {
          type: 'fetch_decoded' as const,
          id: msg.id,
          promotedType: promoted.promotedType,
          data: transferBuffer,
          shape: promoted.chunk.shape,
          stride: promoted.chunk.stride,
          timings: {
            fetchMs,
            decodeMs,
            reshapeMs,
            promoteMs,
            totalMs: now() - workerStartedAt,
          },
        },
        [transferBuffer],
      )
    }
  } catch (error) {
    ctx.postMessage({
      type: 'init_ok',
      id: msg.id,
      error: error instanceof Error ? error.message : String(error),
    })
  }
})
