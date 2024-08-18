import { AwsClient } from "aws4fetch";
import { HTTPStore } from "zarr";
import { LRUIndexedDBCache } from "./VivCache";

enum HTTPMethod {
  Get = "GET",
  Head = "HEAD",
  Put = "PUT",
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

export class VivS3Store extends HTTPStore {
  aws: AwsClient;
  cache: LRUIndexedDBCache;

  constructor(
    url: string,
    aws: AwsClient,
    cache: LRUIndexedDBCache,
    options: any = {},
  ) {
    super(url, options);
    this.aws = aws;
    this.cache = cache;
  }

  async getItem(item: any, opts: any) {
    const cacheKey = this.cache.generateKey(this.url, item);

    // Check if the item is in the shared cache (IndexedDB)
    const cachedValue = await this.cache.get(cacheKey);
    if (cachedValue && false) {
      console.warn("Cache hit for item", item);
      return new Uint8Array(cachedValue).buffer;
    }

    const url = joinUrlParts(this.url, item);
    console.warn("Getting item", url);
    let value: any;
    try {
      value = await this.aws.fetch(url, { ...this.fetchOptions, ...opts });
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

    const data = await value.arrayBuffer(); // Browser only decode if 200

    // Store the result in the shared cache (IndexedDB)
    // await this.cache.set(cacheKey, data);

    return data;
  }

  async setItem(item: any, value: any) {
    const url = joinUrlParts(this.url, item);
    if (typeof value === "string") {
      value = new TextEncoder().encode(value).buffer;
    }
    const set = await this.aws.fetch(url, {
      ...this.fetchOptions,
      method: HTTPMethod.Put,
      body: value,
    });

    // Invalidate cache for the item in the shared cache (IndexedDB)
    const cacheKey = this.cache.generateKey(this.url, item);
    await this.cache.delete(cacheKey);

    return set.status.toString()[0] === "2";
  }

  async containsItem(item: any) {
    const url = joinUrlParts(this.url, item);
    try {
      const value = await this.aws.fetch(url, {
        ...this.fetchOptions,
      });

      return value.status === 200;
    } catch (e) {
      console.error(url, e);
      return false;
    }
  }
}
