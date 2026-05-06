import { type AbsolutePath } from "@zarrita/storage";
import { FetchStore } from "zarrita";
import { LRUCache } from "../caches/in_memory_lru";
import { AwsClient } from "aws4fetch";
import { fetchS3Path, isExpiredS3FetchConfig, type S3FetchConfig } from "@/lib/zarr/runner/s3-request";
import {
  RequestZarrAccessDocument,
  RequestZarrAccessMutation,
  RequestZarrAccessMutationVariables,
} from "@/mikro-next/api/graphql";
import type { MikroClient, ZarrStore } from "./type";


type ZarrAccessGrant = {
  accessKey: string;
  secretKey: string;
  sessionToken: string;
  bucket: string;
  key: string;
};

type AccessRequester = (
  storeId: string,
  client: MikroClient,
) => Promise<ZarrAccessGrant>;


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

export class CachedS3Store extends FetchStore {
  private aws: AwsClient | null = null;
  private cache: LRUCache<string, ArrayBuffer>;
  private lockManager: AsyncLockManager;
  private initPromise: Promise<void> | null = null;
  private storeId: string;
  private mikroClient: MikroClient;
  private datalayer: string;
  private requestAccess: AccessRequester;

  constructor(storeId: string, mikroClient: MikroClient, datalayer: string, options: any = {}) {
    super(datalayer, options);
    this.storeId = storeId;
    this.mikroClient = mikroClient;
    this.datalayer = datalayer;
    this.cache = global_cache;
    this.lockManager = new AsyncLockManager();
    this.requestAccess = options.requestAccess ?? defaultRequestAccess;
  }

  private async ensureInitialized(): Promise<void> {
    if (this.aws) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const credentials = await this.requestAccess(this.storeId, this.mikroClient);

      this.aws = new AwsClient({
        accessKeyId: credentials.accessKey,
        secretAccessKey: credentials.secretKey,
        sessionToken: credentials.sessionToken,
        service: "s3",
      });

      this.url = this.datalayer + "/" + credentials.bucket + "/" + credentials.key;
    })();

    return this.initPromise;
  }

  async get(key: AbsolutePath, options: RequestInit = {}) {
    await this.ensureInitialized();

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
      const response = await this.aws!.fetch(href, { ...options });
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

const defaultRequestAccess: AccessRequester = async (storeId, mikroClient) => {
  const access = await mikroClient.mutate<RequestZarrAccessMutation, RequestZarrAccessMutationVariables>({
    mutation: RequestZarrAccessDocument,
    variables: { input: { storeId } },
  });

  const credentials = access.data?.requestZarrAccess;
  if (!credentials) throw new Error("Failed to obtain Zarr access credentials");

  return credentials;
};

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
