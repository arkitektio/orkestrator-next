import { type AbsolutePath } from "@zarrita/storage";
import { LRUCache } from "../caches/inMemoryLru";
import {
  fetchS3Path,
  isExpiredS3FetchConfig,
  isStaleS3FetchConfig,
  type S3FetchConfig,
} from "@/lib/zarr/runner/s3-request";
import type { ZarrStore } from "./types";


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

/**
 * Mints a fresh config for THIS store — same bucket/key, new credentials. The
 * store never talks to the credential service itself: it is in `lib/`, and who
 * issues grants is a module concern (see `mikro-next/lib/zarr/access.ts`).
 */
export type S3FetchConfigRefresher = (
  options: { forceRefresh?: boolean },
) => Promise<S3FetchConfig>;

export class ConfiguredS3Store implements ZarrStore {
  url: string | URL;
  private cache: LRUCache<string, ArrayBuffer>;
  private lockManager: AsyncLockManager;
  private metadataPromise: Promise<void>;
  private workerFetchConfig: S3FetchConfig;
  private refresher: S3FetchConfigRefresher | null;
  /** In-flight rotation, so a burst of stale requests costs one refresh. */
  private refreshInFlight: Promise<S3FetchConfig> | null = null;

  constructor(
    workerFetchConfig: S3FetchConfig,
    options: {
      preloadMetadata?: boolean;
      /**
       * How to re-credential this store when its config goes stale. Without
       * one, an expired config is a hard error — the historical behavior, kept
       * for callers that have no way to mint new credentials.
       */
      refreshConfig?: S3FetchConfigRefresher;
    } = {},
  ) {
    this.url = workerFetchConfig.baseUrl;
    this.cache = global_cache;
    this.lockManager = new AsyncLockManager();
    this.workerFetchConfig = workerFetchConfig;
    this.refresher = options.refreshConfig ?? null;
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

  /**
   * The config to hand a decode worker. Workers fetch with the snapshot they
   * were given, so a config that goes stale between here and the worker's
   * request dies as a 403 the worker cannot recover from — rotating on the way
   * out is what keeps the streaming path alive.
   *
   * Returns SYNCHRONOUSLY (not a promise) in the overwhelmingly common fresh
   * case, so the per-chunk cost is one `Date.now()` compare and callers that
   * `await` it pay nothing but a microtask.
   */
  ensureFreshWorkerFetchConfig(): S3FetchConfig | Promise<S3FetchConfig> {
    if (!this.needsRotation()) return this.workerFetchConfig;
    return this.rotateConfig({});
  }

  async get(key: AbsolutePath, options: RequestInit = {}): Promise<Uint8Array | undefined> {
    await this.metadataPromise;

    return this.getInternal(key, options);
  }

  clearCache(): void {
    this.cache.clear();
  }

  /** Stale (within the rotation skew) and we have a way to do something about it. */
  private needsRotation(): boolean {
    return this.refresher !== null && isStaleS3FetchConfig(this.workerFetchConfig);
  }

  /**
   * Replace this store's credentials, once. Callers arriving during a rotation
   * await the same one rather than starting their own — with the shared
   * provider behind it, a whole scene going stale at the same instant is a
   * single credentials round-trip.
   */
  private rotateConfig(options: { forceRefresh?: boolean }): Promise<S3FetchConfig> {
    if (this.refreshInFlight) return this.refreshInFlight;
    const refresher = this.refresher;
    if (!refresher) return Promise.resolve(this.workerFetchConfig);

    const rotation = refresher(options)
      .then((config) => {
        this.workerFetchConfig = config;
        // The bucket/key are unchanged by a re-credentialing, but the grant
        // decides the bucket, so keep `url` honest either way.
        this.url = config.baseUrl;
        return config;
      })
      .finally(() => {
        this.refreshInFlight = null;
      });

    this.refreshInFlight = rotation;
    return rotation;
  }

  private async getInternal(key: AbsolutePath, options: RequestInit = {}): Promise<Uint8Array | undefined> {
    // Hot path: one Date.now() compare. Everything below only runs when the
    // credentials are actually within the rotation window.
    if (this.needsRotation()) {
      await this.rotateConfig({});
    } else if (isExpiredS3FetchConfig(this.workerFetchConfig)) {
      // No refresher wired — nothing to do but say so plainly.
      throw new Error(`S3 credentials for ${this.workerFetchConfig.storeId} have expired`);
    }

    // Content-addressed by store and key: credentials are not part of the
    // identity, so a rotation never invalidates a byte of it.
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

      let response = await fetchS3Path(this.workerFetchConfig, key, options);

      // The skew missed: S3 rejected credentials we still believed in (clock
      // drift, or a grant revoked early). Force past the cached grant — it is
      // by definition the one that just failed — and try once more. A second
      // 403 falls through to handle_response as a real error.
      if (response.status === 403 && this.refresher) {
        await this.rotateConfig({ forceRefresh: true });
        response = await fetchS3Path(this.workerFetchConfig, key, options);
      }

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
