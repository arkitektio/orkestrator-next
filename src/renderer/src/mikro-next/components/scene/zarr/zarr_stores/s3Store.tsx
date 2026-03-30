import { type AbsolutePath } from "@zarrita/storage";
import { FetchStore } from "zarrita";
import { LRUCache } from "../caches/in_memory_lru";
import { AwsClient } from "aws4fetch";



class AsyncLockManager {
  private locks = new Map<string, Promise<Uint8Array<ArrayBufferLike>>>();

  async withLock(key: string, fn: () => Promise<Uint8Array<ArrayBufferLike>>): Promise<Uint8Array<ArrayBufferLike>> {
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

export function joinUrlParts(...args: string[]) {
  return args
    .map((part, i) => {
      if (i === 0) {
        return part.trim().replace(/[\/]*$/g, "");
      } else {
        return part.trim().replace(/(^[\/]*|[\/]*$)/g, "");
      }
    })
    .filter((x) => x.length)
    .join("/");
}

function resolve(root: string | URL, path: AbsolutePath): URL {
  const base = typeof root === "string" ? new URL(root) : root;
  if (!base.pathname.endsWith("/")) {
    // ensure trailing slash so that base is resolved as _directory_
    base.pathname += "/";
  }
  const resolved = new URL(path.slice(1), base);
  // copy search params to new URL
  resolved.search = base.search;
  return resolved;
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

export class CachedS3Store extends FetchStore {
  private aws:  AwsClient;
  private cache: LRUCache<string, ArrayBuffer>;
  private lockManager: AsyncLockManager;

  constructor(aws: AwsClient, url: string, options: any = {}) {
    super(url, options);
    this.aws = aws;
    this.url = url;
    this.cache = global_cache;
    this.lockManager = new AsyncLockManager();
  }

  async get(key: AbsolutePath, options: RequestInit = {}) {
    const cacheKey = key + this.url;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return new Uint8Array(cached);
    }

    // Use async lock to prevent duplicate requests
    return this.lockManager.withLock(cacheKey, async () => {
      // Double-check cache in case another request filled it
      const cachedAfterLock = this.cache.get(cacheKey);
      if (cachedAfterLock) {
        return new Uint8Array(cachedAfterLock);
      }

      const href = resolve(this.url, key).href;
      const response = await this.aws.fetch(href, { ...options });
      const result = await handle_response(response);

      if (result) {
        // Cache the result - convert to ArrayBuffer if it's not already
        const bufferToCache =
          result instanceof Uint8Array
            ? result.buffer.slice(
                result.byteOffset,
                result.byteOffset + result.byteLength,
              )
            : result;
        this.cache.set(cacheKey, bufferToCache as ArrayBuffer);
      }

      return result;
    });
  }

  // Cache management methods
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size(),
      maxSize: this.cache.getMaxSize(),
    };
  }

  // Check if an item is cached
  isCached(key: string): boolean {
    return this.cache.has(key) || this.cache.has(`getItem:${key}`);
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

type Labels = [...string[], "y", "x"];
function getAxisLabelsAndChannelAxis(
  xarray_metadata: XArrayMetadata,
  arr: ZarrArray,
): { labels: Labels; channel_axis: number } {
  // type cast string[] to Labels
  const labels = xarray_metadata.metadata["data/.zattrs"]
    ._ARRAY_DIMENSIONS as Labels;

  const channel_axis = labels.indexOf("c");
  return { labels, channel_axis };
}



export type SelectionLoader = (s: any) => Promise<ZarrArray>;
