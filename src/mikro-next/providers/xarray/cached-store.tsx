import { AbsolutePath } from "@zarrita/storage";
import { AwsClient } from "aws4fetch";
import { FetchStore } from "zarrita";
import { CachedStorage } from "../../../lib/storage/CachedStorage";

enum HTTPMethod {
  Get = "GET",
  Head = "HEAD",
  Put = "PUT",
}

export class HTTPError extends Error {
  __zarr__: string;
  constructor(code: string | number) {
    super(code.toString());
    this.__zarr__ = "HTTPError";
    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}

export class KeyError extends Error {
  __zarr__: string;

  constructor(key: string) {
    super(`key ${key} not present`);
    this.__zarr__ = "KeyError";
    Object.setPrototypeOf(this, KeyError.prototype);
  }
}

export function joinUrlParts(...args: string[]) {
  return args
    .map((part, i) => {
      if (i === 0) {
        return part.trim().replace(/\/*$/g, "");
      } else {
        return part.trim().replace(/(^\/*|\/*$)/g, "");
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

/**
 * Basic S3Store without caching (for internal use)
 */
class BasicS3Store extends FetchStore {
  aws: AwsClient;

  constructor(
    url: string,
    aws: AwsClient,
    options: Record<string, unknown> = {},
  ) {
    super(url, options);
    this.aws = aws;
    this.url = url;
  }

  async get(key: AbsolutePath, options: RequestInit = {}) {
    const href = resolve(this.url, key).href;
    const response = await this.aws.fetch(href, { ...options });
    return handle_response(response);
  }

  async getItem(item: string, opts: RequestInit) {
    const url = joinUrlParts(this.url as string, item);
    console.warn("Getting item", url);
    let value: Response;
    try {
      value = await this.aws.fetch(url, { ...opts });
    } catch (e) {
      console.log(e);
      throw new HTTPError("present");
    }
    if (value.status === 404) {
      // Item is not found
      throw new KeyError(item);
    } else if (value.status !== 200) {
      throw new HTTPError(String(value.status));
    }
    return value.arrayBuffer(); // Browser
    // only decode if 200
  }

  async setItem(item: string, value: string | ArrayBuffer) {
    const url = joinUrlParts(this.url as string, item);
    const bodyValue: BodyInit =
      value instanceof ArrayBuffer ? value : new TextEncoder().encode(value);
    const set = await this.aws.fetch(url, {
      method: HTTPMethod.Put,
      body: bodyValue,
    });
    return set.status.toString()[0] === "2";
  }

  async containsItem(item: string) {
    const url = joinUrlParts(this.url as string, item);
    try {
      const value = await this.aws.fetch(url, {});
      return value.status === 200;
    } catch (e) {
      console.error(url, e);
      return false;
    }
  }
}

/**
 * Enhanced S3Store with caching capabilities
 */
export class CachedS3Store extends CachedStorage<RequestInit> {
  private basicStore: BasicS3Store;

  constructor(
    url: string,
    aws: AwsClient,
    options: Record<string, unknown> = {},
    cacheOptions: {
      dbName?: string;
      storeName?: string;
      maxLocalStorageSize?: number;
      cacheExpirationMs?: number;
    } = {},
  ) {
    const basicStore = new BasicS3Store(url, aws, options);
    super(basicStore, {
      dbName: cacheOptions.dbName || "s3-zarrita-cache",
      storeName: cacheOptions.storeName || "s3-cache",
      maxLocalStorageSize: cacheOptions.maxLocalStorageSize || 64 * 1024, // 64KB
      cacheExpirationMs: cacheOptions.cacheExpirationMs || 24 * 60 * 60 * 1000, // 1 day
    });
    this.basicStore = basicStore;
  }

  // Expose the original methods for backward compatibility
  async getItem(item: string, opts: RequestInit) {
    return this.basicStore.getItem(item, opts);
  }

  async setItem(item: string, value: string | ArrayBuffer) {
    // Clear cache when setting items
    const cacheKey = this.generateCacheKey(`/${item}` as AbsolutePath);
    await this.invalidateCacheKey(cacheKey);
    return this.basicStore.setItem(item, value);
  }

  async containsItem(item: string) {
    return this.basicStore.containsItem(item);
  }

  /**
   * Clear cache for a specific URL pattern
   */
  async clearCacheForPattern(pattern: RegExp): Promise<void> {
    // Clear matching keys from memory cache
    for (const [key] of this.memoryCache) {
      if (pattern.test(key)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear matching keys from localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("zarrita_cache_") && pattern.test(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Clear matching keys from IndexedDB
    try {
      const db = await this.openDB();
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);

      return new Promise((resolve) => {
        const request = store.openCursor();

        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            if (pattern.test(cursor.key as string)) {
              cursor.delete();
            }
            cursor.continue();
          } else {
            resolve();
          }
        };

        request.onerror = () => resolve(); // Don't fail if operation fails
      });
    } catch (error) {
      console.warn("Failed to clear pattern from IndexedDB:", error);
    }
  }
}

// Keep the original S3Store class for backward compatibility
export class S3Store extends BasicS3Store {
  // This is the original implementation without caching
}
