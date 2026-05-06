/**
 * Shared types for the read-only zarr worker runner.
 */

import { WorkerPool } from '../pool/workerpool'
import type { Chunk, CodecMetadata, DataType } from 'zarrita'

/**
 * Minimal metadata needed to reconstruct a zarrita codec pipeline in a worker.
 */
export interface CodecChunkMeta {
  data_type: DataType
  chunk_shape: number[]
  codecs: CodecMetadata[]
}

/**
 * Interface for a decoded-chunk cache, compatible with `Map`.
 */
export interface ChunkCache {
  get(key: string): Chunk<DataType> | undefined
  set(key: string, value: Chunk<DataType>): void
}

export interface GetWorkerOptions<StoreOpts = unknown> {
  /** The WorkerPool to use for codec decode operations. */
  pool: WorkerPool
  /** Higher values are scheduled ahead of lower values when the pool is saturated. */
  priority?: number
  /** Cancel queued work and abort in-flight worker tasks when aborted. */
  signal?: AbortSignal
  /** Pass-through options for the store's `get` method. */
  opts?: StoreOpts
  /** Optional override for the codec worker script URL. */
  workerUrl?: string | URL
  /** SharedArrayBuffer output is required for the active high-performance read path. */
  useSharedArrayBuffer?: boolean
  /** Optional decoded-chunk cache. Defaults to the shared LRU cache. */
  cache?: ChunkCache
}
