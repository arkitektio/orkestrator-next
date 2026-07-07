import { type AbsolutePath } from "@zarrita/storage";
import { LRUCache } from "../caches/in_memory_lru";
import { fetchS3Path, isExpiredS3FetchConfig, type S3FetchConfig } from "@/lib/zarr/runner/s3-request";
import type { ZarrStore } from "./type";


class AsyncLockManager {
  private locks = new Map<string, Promise<Uint8Array | undefined>>();

  async withLock(key: string, fn: () => Promise<Uint8Array | undefined>): Promise<Uint8Array | undefined> {
    if (this.locks.has(key)) {
      return await this.locks.get(key)!;
    }

    const promise = fn().finally(() => {
      this.locks.delete(key);
    });

    this.locks.set(key, promise);
    return await promise;
  }
}

export class HTTPError extends Error {
  __zarr__: string;
  constructor(code: string | undefined) {
    super(code);
    this.__zarr__ = "HTTPError";
    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}

export class KeyError extends Error {
  __zarr__: string;

  constructor(key: string | undefined) {
    super(`key ${key} not present`);
    this.__zarr__ = "KeyError";
    Object.setPrototypeOf(this, KeyError.prototype);
  }
}

async function handle_response(
  response: Response,
): Promise<Uint8Array | undefined> {
  if (response.status === 404) {
    return undefined;
  }
  if (response.status === 200 || response.status === 206) {
    return new Uint8Array(await response.arrayBuffer());
  }
  throw new Error(
    `Unexpected response status ${response.status} ${response.statusText}`,
  );
}

const global_cache = new LRUCache<string, ArrayBuffer>(500);

const defaultMetadataKeys: AbsolutePath[] = ["/zarr.json"];

export class ConfiguredS3Store implements ZarrStore {
  url: string | URL;
  private cache: LRUCache<string, ArrayBuffer>;
  private lockManager: AsyncLockManager;
  private metadataPromise: Promise<void>;
  private workerFetchConfig: S3FetchConfig;

  constructor(workerFetchConfig: S3FetchConfig, options: { preloadMetadata?: boolean } = {}) {
    this.url = workerFetchConfig.baseUrl;
    this.cache = global_cache;
    this.lockManager = new AsyncLockManager();
    this.workerFetchConfig = workerFetchConfig;
    this.metadataPromise = options.preloadMetadata === false
      ? Promise.resolve()
      : this.primeMetadata();
  }

  async ready(): Promise<void> {
    await this.metadataPromise;
  }

  getWorkerFetchConfig(): S3FetchConfig {
    return this.workerFetchConfig;
  }

  async get(key: AbsolutePath, options: RequestInit = {}): Promise<Uint8Array | undefined> {
    await this.metadataPromise;

    return this.getInternal(key, options);
  }

  clearCache(): void {
    this.cache.clear();
  }

  private async getInternal(key: AbsolutePath, options: RequestInit = {}): Promise<Uint8Array | undefined> {

    if (isExpiredS3FetchConfig(this.workerFetchConfig)) {
      throw new Error(`S3 credentials for ${this.workerFetchConfig.storeId} have expired`);
    }

    const cacheKey = `${this.workerFetchConfig.storeId}:${key}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return new Uint8Array(cached);
    }

    return this.lockManager.withLock(cacheKey, async () => {
      const cachedAfterLock = this.cache.get(cacheKey);
      if (cachedAfterLock) {
        return new Uint8Array(cachedAfterLock);
      }

      const response = await fetchS3Path(this.workerFetchConfig, key, options);
      const result = await handle_response(response);

      if (result) {
        const bufferToCache = result.buffer.slice(
          result.byteOffset,
          result.byteOffset + result.byteLength,
        );
        this.cache.set(cacheKey, bufferToCache as ArrayBuffer);
      }

      return result;
    });
  }

  private async primeMetadata(): Promise<void> {
    await Promise.all(
      defaultMetadataKeys.map(async (metadataKey) => {
        try {
          await this.getInternal(metadataKey);
        } catch (error) {
          if (!(error instanceof Error) || !error.message.includes("Unexpected response status 404")) {
            throw error;
          }
        }
      }),
    );
  }
}

export interface Zattrs {
  fileversion: string;
}

export interface Zgroup {
  zarr_format: number;
}

export interface Compressor {
  blocksize: number;
  clevel: number;
  cname: string;
  id: string;
  shuffle: number;
}

export interface DataZarray {
  chunks: number[];
  compressor: Compressor;
  dtype: string;
  fill_value: string;
  filters?: any;
  order: string;
  shape: number[];
  zarr_format: number;
}

export interface DataZattrs {
  _ARRAY_DIMENSIONS: string[];
}

export interface Metadata {
  ".zattrs": Zattrs;
  ".zgroup": Zgroup;
  "data/.zarray": DataZarray;
  "data/.zattrs": DataZattrs;
}

export interface XArrayMetadata {
  metadata: Metadata;
  zarr_consolidated_format: number;
}
