import type { AbsolutePath } from "@zarrita/storage";
import { CredentialRotation, type S3FetchConfigRefresher } from "@/lib/zarr/store/credentialRotation";
import { fetchS3Path, type S3FetchConfig } from "@/lib/zarr/runner/s3-request";
import { LruByteCache } from "./lruByteCache";
import type { FabriksTransport } from "./fabriksCollection";

/**
 * Authenticated reads of a fabriks prefix: whole objects for the manifest and
 * catalogs, byte RANGES for Parquet footers and row groups.
 *
 * Built directly on `fetchS3Path` rather than on `ConfiguredS3Store`, for two
 * reasons that are not stylistic:
 *
 *  - **That store's cache is range-blind.** Its key is `storeId:path`, so two
 *    different byte ranges of one object would serve each other's bytes.
 *  - **It is the wrong cache anyway.** `global_cache` is a 500-ENTRY LRU shared
 *    with every zarr chunk fetch in the app; filling it with row groups would
 *    evict the scene's bricks. A byte-bounded cache of our own keeps the two
 *    workloads from competing.
 *
 * What IS shared is the part worth sharing: `CredentialRotation` — freshness,
 * single-flight rotation, and the forced retry after a 403 the skew missed.
 *
 * Ranged GETs work because `fetchS3Path` folds any caller-supplied header into
 * the SIGNED canonical headers, so a `Range` header is covered by the
 * signature rather than rejected by it.
 */

/** Bytes of range/whole-object responses held per collection. */
const DEFAULT_CACHE_BYTES = 64 * 1024 * 1024;

export type FabriksStoreOptions = {
  config: S3FetchConfig;
  refreshConfig?: S3FetchConfigRefresher;
  maxCacheBytes?: number;
};

export class FabriksStore implements FabriksTransport {
  private readonly rotation: CredentialRotation;
  private readonly cache: LruByteCache<Uint8Array>;
  private readonly inFlight = new Map<string, Promise<Uint8Array>>();

  constructor(options: FabriksStoreOptions) {
    this.rotation = new CredentialRotation(options.config, options.refreshConfig ?? null);
    this.cache = new LruByteCache<Uint8Array>(options.maxCacheBytes ?? DEFAULT_CACHE_BYTES, () => {
      /* plain bytes: nothing to dispose */
    });
  }

  /** A whole object — the manifest and the catalogs. */
  get = async (path: string): Promise<Uint8Array> => this.read(path, null);

  /** A byte span, `end` exclusive — a Parquet footer or one row group. */
  getRange = async (path: string, start: number, end: number): Promise<Uint8Array> =>
    this.read(path, { start, end });

  private read(path: string, range: { start: number; end: number } | null): Promise<Uint8Array> {
    // The range is PART OF THE IDENTITY. Credentials are not: a rotation must
    // never invalidate a byte we already hold.
    const key = range ? `${path}:${range.start}-${range.end}` : `${path}:full`;
    const cached = this.cache.get(key);
    if (cached) return Promise.resolve(cached);

    const existing = this.inFlight.get(key);
    if (existing) return existing;

    const request = this.fetch(path, range)
      .then((bytes) => {
        this.cache.set(key, bytes, bytes.byteLength);
        return bytes;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, request);
    return request;
  }

  private async fetch(
    path: string,
    range: { start: number; end: number } | null,
  ): Promise<Uint8Array> {
    await this.rotation.beforeRequest();

    const absolute = (path.startsWith("/") ? path : `/${path}`) as AbsolutePath;
    const init: RequestInit = range
      ? { headers: { Range: `bytes=${range.start}-${range.end - 1}` } }
      : {};

    let response = await fetchS3Path(this.rotation.current(), absolute, init);

    // The skew missed: S3 rejected credentials we still believed in. Force past
    // the cached grant — by definition the one that just failed — and retry once.
    if (response.status === 403 && this.rotation.canRetryForbidden()) {
      await this.rotation.rotate({ forceRefresh: true });
      response = await fetchS3Path(this.rotation.current(), absolute, init);
    }

    if (!response.ok) {
      throw new Error(`fabriks read of ${path} failed: ${response.status} ${response.statusText}`);
    }

    const body = new Uint8Array(await response.arrayBuffer());
    if (!range) return body;

    // A gateway that ignores Range answers 200 with the WHOLE object. Slicing
    // locally is the difference between correct-and-slow and handing the
    // Parquet reader bytes from the wrong offset.
    if (response.status === 200 && !response.headers.get("Content-Range")) {
      return body.subarray(range.start, range.end);
    }
    return body;
  }

  /** Drop cached bytes; credentials and in-flight requests are unaffected. */
  clear(): void {
    this.cache.clear();
  }
}
