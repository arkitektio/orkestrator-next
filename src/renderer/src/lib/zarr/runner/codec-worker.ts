/**
 * Web Worker that handles encode/decode operations using zarrita's codec pipeline.
 *
 * Uses our self-contained codec pipeline builder (which references zarrita's
 * publicly exported `registry`) to decode/encode chunks with real codecs
 * (gzip, blosc, zstd, bytes, transpose, etc.).
 *
 * Message protocol:
 *   init:        { type: 'init', id, metaId, meta: CodecChunkMeta }
 *                -> { type: 'init_ok', id }
 *
 *   decode:      { type: 'decode', id, bytes: ArrayBuffer, metaId }
 *                -> { type: 'decoded', id, data: ArrayBuffer, shape, stride }
 *
 *   decode_into: { type: 'decode_into', id, bytes, metaId, output: SAB, ... }
 *                -> { type: 'decode_into_ok', id }
 *                Worker decodes and writes directly into SharedArrayBuffer.
 *
 *   encode:      { type: 'encode', id, data: ArrayBuffer, metaId }
 *                -> { type: 'encoded', id, bytes: ArrayBuffer }
 */

import type { Chunk, DataType } from "zarrita"

import { create_codec_pipeline } from "./internals/codec-pipeline.js"
import { compat_chunk, set_from_chunk_binary } from "./internals/setter.js"
import { get_ctr, get_strides } from "./internals/util.js"
import { deserializeRequestInit, fetchS3Path, type S3FetchConfig, type SerializedRequestInit } from "./s3-request.js"
import type { CodecChunkMeta, Projection } from "./types.js"

const ctx = self as unknown as DedicatedWorkerGlobalScope

// ---------------------------------------------------------------------------
// Edge chunk shape correction
// ---------------------------------------------------------------------------

/**
 * Fix a decoded chunk's shape and stride when the actual data size differs
 * from the metadata chunk_shape. This happens with edge chunks — zarr v3
 * stores edge chunks at their actual smaller size, but our codec pipeline
 * always reports shape = chunk_shape from metadata.
 *
 * If actualChunkShape is provided, use it directly. Otherwise, infer from
 * the decoded data size vs the metadata chunk_shape.
 */
function fixEdgeChunkShapeStride<D extends DataType>(
  chunk: Chunk<D>,
  actualChunkShape?: number[],
): Chunk<D> {
  if (actualChunkShape) {
    const expectedElements = actualChunkShape.reduce((a, b) => a * b, 1)
    const actualElements = (chunk.data as unknown as ArrayLike<unknown>).length
    if (actualElements === expectedElements) {
      // Decoded size matches the actual edge shape — just fix shape/stride
      return {
        data: chunk.data,
        shape: actualChunkShape,
        stride: get_strides(actualChunkShape, "C"),
      }
    }
    if (actualElements > expectedElements) {
      // Decoded chunk is padded to full chunk_shape (e.g. by setWorker).
      // Extract the valid sub-region into a compact contiguous buffer.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const src = chunk.data as any
      const Ctr = src.constructor as new (n: number) => typeof src
      const dst = new Ctr(expectedElements)
      const srcStrides = get_strides(chunk.shape, "C")
      copySubRegion(src, srcStrides, dst, actualChunkShape)
      return {
        data: dst as typeof chunk.data,
        shape: actualChunkShape,
        stride: get_strides(actualChunkShape, "C"),
      }
    }
  }
  // No correction needed or no actualChunkShape provided
  return chunk
}

/**
 * Copy a sub-region from a padded C-order buffer into a compact destination.
 *
 * For each dimension, copies only the first `subShape[d]` elements along
 * that axis from the source (which has strides `srcStrides`).
 */
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
    // Innermost dimension — copy contiguous run
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

// ---------------------------------------------------------------------------
// Codec pipeline cache — keyed by metaId (integer lookup, no JSON.stringify)
// ---------------------------------------------------------------------------

const pipelineByMetaId = new Map<
  number,
  ReturnType<typeof create_codec_pipeline>
>()

const metaByMetaId = new Map<number, CodecChunkMeta>()

// Legacy fallback: pipeline cache keyed by JSON string (for any decode/encode
// messages that arrive with a full `meta` object instead of `metaId`)
const pipelineByKey = new Map<
  string,
  ReturnType<typeof create_codec_pipeline>
>()

function getPipeline(metaId: number): ReturnType<typeof create_codec_pipeline> {
  const pipeline = pipelineByMetaId.get(metaId)
  if (!pipeline) {
    throw new Error(
      `No pipeline for metaId ${metaId}. Send an 'init' message first.`,
    )
  }
  return pipeline
}

function getOrCreatePipelineLegacy(meta: CodecChunkMeta) {
  const key = JSON.stringify(meta)
  let pipeline = pipelineByKey.get(key)
  if (!pipeline) {
    pipeline = create_codec_pipeline({
      data_type: meta.data_type,
      shape: meta.chunk_shape,
      codecs: meta.codecs,
    })
    pipelineByKey.set(key, pipeline)
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
  const response = await fetchS3Path(store, path, deserializeRequestInit(requestInit) ?? {})

  if (response.status === 404) {
    return undefined
  }

  if (response.status !== 200 && response.status !== 206) {
    throw new Error(`Unexpected response status ${response.status} ${response.statusText}`)
  }

  return new Uint8Array(await response.arrayBuffer())
}

// ---------------------------------------------------------------------------
// Message handler
// ---------------------------------------------------------------------------

type WorkerMessage =
  | { type: "init"; id: number; metaId: number; meta: CodecChunkMeta }
  | {
      type: "fetch_decode"
      id: number
      store: S3FetchConfig
      path: `/${string}`
      metaId: number
      requestInit?: SerializedRequestInit
      actualChunkShape?: number[]
    }
  | {
      type: "fetch_decode_into"
      id: number
      store: S3FetchConfig
      path: `/${string}`
      metaId: number
      output: SharedArrayBuffer
      outputByteLength: number
      outputStride: number[]
      projections: Projection[]
      bytesPerElement: number
      requestInit?: SerializedRequestInit
      actualChunkShape?: number[]
    }
  | {
      type: "fetch_exists"
      id: number
      store: S3FetchConfig
      path: `/${string}`
      requestInit?: SerializedRequestInit
    }
  | {
      type: "fetch_probe_size"
      id: number
      store: S3FetchConfig
      path: `/${string}`
      metaId: number
      bytesPerElement: number
      requestInit?: SerializedRequestInit
    }
  | {
      type: "decode"
      id: number
      bytes: ArrayBuffer
      metaId?: number
      meta?: CodecChunkMeta
      actualChunkShape?: number[]
    }
  | {
      type: "decode_into"
      id: number
      bytes: ArrayBuffer
      metaId: number
      output: SharedArrayBuffer
      outputByteLength: number
      outputStride: number[]
      projections: Projection[]
      bytesPerElement: number
      actualChunkShape?: number[]
    }
  | {
      type: "encode"
      id: number
      data: ArrayBuffer
      metaId?: number
      meta?: CodecChunkMeta
    }

ctx.addEventListener("message", async (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data

  try {
    if (msg.type === "init") {
      // Register codec metadata and pre-create pipeline
      metaByMetaId.set(msg.metaId, msg.meta)
      const pipeline = create_codec_pipeline({
        data_type: msg.meta.data_type,
        shape: msg.meta.chunk_shape,
        codecs: msg.meta.codecs,
      })
      pipelineByMetaId.set(msg.metaId, pipeline)
      ctx.postMessage({ type: "init_ok", id: msg.id })
      return
    }

    if (msg.type === "fetch_exists") {
      const response = await fetchS3Path(
        msg.store,
        msg.path,
        { ...(deserializeRequestInit(msg.requestInit) ?? {}), method: 'HEAD' },
      )
      ctx.postMessage({ type: 'fetch_exists_ok', id: msg.id, exists: response.status !== 404 })
      return
    }

    if (msg.type === "fetch_probe_size") {
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

    if (msg.type === "fetch_decode") {
      const pipeline = getPipeline(msg.metaId)
      const rawBytes = await fetchChunkBytes(msg.store, msg.path, msg.requestInit)
      if (!rawBytes) {
        ctx.postMessage({ type: 'fetch_decode_ok', id: msg.id, missing: true })
        return
      }

      let chunk = (await pipeline.decode(rawBytes)) as Chunk<DataType>
      chunk = fixEdgeChunkShapeStride(chunk, msg.actualChunkShape)

      const dataView = chunk.data as unknown as {
        buffer: ArrayBuffer
        byteOffset: number
        byteLength: number
      }
      const buffer = dataView.buffer
      const byteOffset = dataView.byteOffset
      const byteLength = dataView.byteLength
      const transferBuffer = byteOffset === 0 && byteLength === buffer.byteLength
        ? buffer
        : buffer.slice(byteOffset, byteOffset + byteLength)

      ctx.postMessage(
        {
          type: 'fetch_decoded' as const,
          id: msg.id,
          data: transferBuffer,
          shape: chunk.shape,
          stride: chunk.stride,
        },
        [transferBuffer],
      )
      return
    }

    if (msg.type === "fetch_decode_into") {
      const pipeline = getPipeline(msg.metaId)
      const rawBytes = await fetchChunkBytes(msg.store, msg.path, msg.requestInit)
      if (!rawBytes) {
        ctx.postMessage({ type: 'fetch_decode_into_ok', id: msg.id, missing: true })
        return
      }

      let chunk = (await pipeline.decode(rawBytes)) as Chunk<DataType>
      chunk = fixEdgeChunkShapeStride(chunk, msg.actualChunkShape)

      const destView = new Uint8Array(msg.output, 0, msg.outputByteLength)
      set_from_chunk_binary(
        {
          data: destView,
          stride: msg.outputStride,
        },
        compat_chunk(chunk),
        msg.bytesPerElement,
        msg.projections,
      )

      ctx.postMessage({ type: 'fetch_decode_into_ok', id: msg.id, missing: false })
      return
    }

    if (msg.type === "decode") {
      // Resolve pipeline: prefer metaId, fall back to legacy meta
      const pipeline =
        msg.metaId !== undefined && pipelineByMetaId.has(msg.metaId)
          ? getPipeline(msg.metaId)
          : getOrCreatePipelineLegacy(msg.meta!)

      const bytes = new Uint8Array(msg.bytes)
      let chunk = (await pipeline.decode(bytes)) as Chunk<DataType>

      // Fix shape/stride for edge chunks (smaller than metadata chunk_shape)
      chunk = fixEdgeChunkShapeStride(chunk, msg.actualChunkShape)

      // Extract the underlying ArrayBuffer from the decoded TypedArray
      const dataView = chunk.data as unknown as {
        buffer: ArrayBuffer
        byteOffset: number
        byteLength: number
      }
      const buffer = dataView.buffer
      const byteOffset = dataView.byteOffset
      const byteLength = dataView.byteLength

      // If the decoded data doesn't own the full buffer, copy for clean transfer
      let transferBuffer: ArrayBuffer
      if (byteOffset === 0 && byteLength === buffer.byteLength) {
        transferBuffer = buffer
      } else {
        transferBuffer = buffer.slice(byteOffset, byteOffset + byteLength)
      }

      ctx.postMessage(
        {
          type: "decoded" as const,
          id: msg.id,
          data: transferBuffer,
          shape: chunk.shape,
          stride: chunk.stride,
        },
        [transferBuffer],
      )
    } else if (msg.type === "decode_into") {
      // Decode and write directly into SharedArrayBuffer — no transfer back
      const pipeline = getPipeline(msg.metaId)
      const bytes = new Uint8Array(msg.bytes)
      let chunk = (await pipeline.decode(bytes)) as Chunk<DataType>

      // Fix shape/stride for edge chunks (smaller than metadata chunk_shape)
      chunk = fixEdgeChunkShapeStride(chunk, msg.actualChunkShape)

      // Create a Uint8Array view over the shared output buffer
      const destView = new Uint8Array(msg.output, 0, msg.outputByteLength)

      // Convert decoded chunk to byte-level representation
      const src = compat_chunk(chunk)

      // Write decoded data directly into the shared output memory
      set_from_chunk_binary(
        { data: destView, stride: msg.outputStride },
        src,
        msg.bytesPerElement,
        msg.projections,
      )

      ctx.postMessage({ type: "decode_into_ok", id: msg.id })
    } else if (msg.type === "encode") {
      // Resolve pipeline and meta
      let pipeline: ReturnType<typeof create_codec_pipeline>
      let meta: CodecChunkMeta
      if (msg.metaId !== undefined && pipelineByMetaId.has(msg.metaId)) {
        pipeline = getPipeline(msg.metaId)
        meta = metaByMetaId.get(msg.metaId)!
      } else {
        meta = msg.meta!
        pipeline = getOrCreatePipelineLegacy(meta)
      }

      // Reconstruct a Chunk from the transferred ArrayBuffer
      const Ctr = get_ctr(meta.data_type) as unknown as {
        new (buf: ArrayBuffer, off: number, len: number): unknown
        BYTES_PER_ELEMENT: number
      }
      const data = new Ctr(
        msg.data,
        0,
        msg.data.byteLength / Ctr.BYTES_PER_ELEMENT,
      )
      const shape = meta.chunk_shape
      const stride = get_strides(shape, "C")

      const chunk = { data, shape, stride } as Chunk<DataType>
      const encoded = await pipeline.encode(chunk)

      // Transfer the encoded bytes back
      const transferBuffer =
        encoded.byteOffset === 0 &&
        encoded.byteLength === encoded.buffer.byteLength
          ? (encoded.buffer as ArrayBuffer)
          : encoded.buffer.slice(
              encoded.byteOffset,
              encoded.byteOffset + encoded.byteLength,
            )

      ctx.postMessage(
        {
          type: "encoded" as const,
          id: msg.id,
          bytes: transferBuffer,
        },
        [transferBuffer],
      )
    }
  } catch (error) {
    // Send error back to main thread
    ctx.postMessage({
      type:
        msg.type === "decode"
          ? "decoded"
          : msg.type === "encode"
            ? "encoded"
            : msg.type === "decode_into"
              ? "decode_into_ok"
              : "init_ok",
      id: msg.id,
      error: error instanceof Error ? error.message : String(error),
    })
  }
})
