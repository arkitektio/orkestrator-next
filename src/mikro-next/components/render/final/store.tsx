import { AbsolutePath } from "@zarrita/storage";
import { AwsClient } from "aws4fetch";
import { FetchStore } from "zarrita";

enum HTTPMethod {
  Get = "GET",
  Head = "HEAD",
  Put = "PUT",
}

class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getMaxSize(): number {
    return this.maxSize;
  }
}

class AsyncLockManager {
  private locks = new Map<string, Promise<any>>();

  async withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
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
  constructor(code: any) {
    super(code);
    this.__zarr__ = "HTTPError";
    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}










export class KeyError extends Error {
  __zarr__: string;

  constructor(key: any) {
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

const global_cache = new LRUCache<string, ArrayBuffer>(100);

export class S3Store extends FetchStore {
  aws: AwsClient;
  private cache: LRUCache<string, ArrayBuffer>;
  private lockManager: AsyncLockManager;

  constructor(url: string, aws: AwsClient, options: any = {}) {
    super(url, options);
    this.aws = aws;
    this.url = url;
    this.cache = global_cache;
    this.lockManager = new AsyncLockManager();
  }

  async get(key: AbsolutePath, options: RequestInit = {}) {
    const cacheKey = key + this.url;
    console.log("getting", cacheKey);

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log("Cache hit for", cacheKey);
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
        const bufferToCache = result instanceof Uint8Array ? result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength) : result;
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
      maxSize: this.cache.getMaxSize()
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
  let labels = xarray_metadata.metadata["data/.zattrs"]
    ._ARRAY_DIMENSIONS as Labels;

  const channel_axis = labels.indexOf("c");
  return { labels, channel_axis };
}

export async function openZarrArray(
  url: string,
): Promise<{ data: ZarrArray; metadata: XArrayMetadata }> {
  // If the loader fails to load, handle the error (show an error snackbar).
  // Otherwise load.
  try {
    console.log(url);

    let aws = new AwsClient({
      accessKeyId: "kBcG6sCIlQvOWPOpzJhu",
      secretAccessKey: "FjiprDl3qHwIMR7azM2M",
      service: "s3",
    });

    let x = await aws.fetch(url + "/.zmetadata");
    let xarray_metadata = (await x.json()) as XArrayMetadata;

    const store = new S3Store(url, aws);
    console.log(store);
    const grp = await openGroup(store, "", "r");
    const rootAttrs = await grp.attrs.asObject();

    console.log(grp, rootAttrs, xarray_metadata);

    let data = (await grp.getItem("data")) as ZarrArray;

    return { data, metadata: xarray_metadata };
  } catch (e) {
    throw Error("Failed to load data");
  }
}

export type SelectionLoader = (s: any) => Promise<ZarrArray>;
