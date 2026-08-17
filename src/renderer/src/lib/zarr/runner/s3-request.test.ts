import type { AbsolutePath } from "@zarrita/storage";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchS3Path, resolveStoreUrl, type S3FetchConfig } from "./s3-request";

/**
 * SigV4 signing, and specifically the canonical URI.
 *
 * These exist because a signing mistake does not look like a signing mistake:
 * it comes back as a bare 403 with nothing to say which byte disagreed.
 */

const config = (): S3FetchConfig => ({
  accessKey: "AKIAEXAMPLE",
  baseUrl: "https://gateway.example/bucket/collection-id/",
  expiresAt: Date.now() + 3_600_000,
  region: "us-east-1",
  secretKey: "secret",
  sessionToken: "token",
  storeId: "store-1",
});

/** Capture the signed request without issuing it. */
const captureRequest = () => {
  const calls: { url: string; init: RequestInit }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string | URL, init: RequestInit = {}) => {
      calls.push({ url: String(url), init });
      return new Response(new Uint8Array(), { status: 200 });
    }),
  );
  return calls;
};

const authOf = (init: RequestInit): string =>
  new Headers(init.headers).get("Authorization") ?? "";

const signatureOf = (init: RequestInit): string =>
  authOf(init).split("Signature=")[1] ?? "";

const signedHeadersOf = (init: RequestInit): string =>
  (authOf(init).match(/SignedHeaders=([^,]+)/)?.[1] ?? "");

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("canonical URI encoding", () => {
  // `amzDate` comes from `new Date()` inside the signer, and it is signed. Two
  // requests issued either side of a second boundary therefore sign different
  // strings — which made the equality assertion below fail whenever the suite
  // was loaded enough to straddle one. Freeze the clock: this describe is about
  // the canonical URI, not about time.
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-17T11:15:12.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("signs a hive-partitioned key the same whether `=` arrives raw or escaped", async () => {
    // The regression this file exists for. `URL` leaves `=` literal in
    // `pathname`, but SigV4 — and S3 on the other side — require every byte
    // outside the unreserved set percent-encoded. Signing the literal produced
    // a 403 on the first fabriks geometry read (`level=0/part-00000.parquet`)
    // while every zarr chunk path, being unreserved throughout, was unaffected.
    const calls = captureRequest();

    await fetchS3Path(config(), "/level=0/part-00000.parquet" as AbsolutePath);
    await fetchS3Path(config(), "/level%3D0/part-00000.parquet" as AbsolutePath);

    expect(calls).toHaveLength(2);
    // Same object, therefore the same canonical form, therefore one signature.
    expect(signatureOf(calls[0].init)).toBe(signatureOf(calls[1].init));

    // The property that actually prevents SignatureDoesNotMatch: the WIRE
    // path is the strictly-encoded form the canonical request signs. The
    // server recomputes its signature from the bytes it receives — a literal
    // `=` on the wire while `%3D` was signed fails even though our own
    // canonical form is self-consistent.
    for (const call of calls) {
      expect(new URL(call.url).pathname).toContain("/level%3D0/");
      expect(call.url).not.toContain("level=0");
    }
  });

  it("distinguishes keys that genuinely differ", async () => {
    const calls = captureRequest();
    await fetchS3Path(config(), "/level=0/part-00000.parquet" as AbsolutePath);
    await fetchS3Path(config(), "/level=1/part-00000.parquet" as AbsolutePath);
    expect(signatureOf(calls[0].init)).not.toBe(signatureOf(calls[1].init));
  });

  it("leaves an all-unreserved zarr chunk path untouched", async () => {
    const calls = captureRequest();
    await fetchS3Path(config(), "/c/0/0/0" as AbsolutePath);
    expect(calls[0].url).toBe("https://gateway.example/bucket/collection-id/c/0/0/0");
  });
});

describe("ranged reads", () => {
  it("carries a Range header into the signature, not just the request", async () => {
    // fabriks reads Parquet footers and row groups by byte span. If `Range`
    // were sent unsigned, S3 would reject the request it was actually given.
    const calls = captureRequest();
    await fetchS3Path(config(), "/catalog/cells.parquet" as AbsolutePath, {
      headers: { Range: "bytes=0-1023" },
    });

    expect(new Headers(calls[0].init.headers).get("Range")).toBe("bytes=0-1023");
    expect(signedHeadersOf(calls[0].init).split(";")).toContain("range");
  });

  it("signs different byte spans differently", async () => {
    const calls = captureRequest();
    const path = "/level=0/part-00000.parquet" as AbsolutePath;
    await fetchS3Path(config(), path, { headers: { Range: "bytes=0-99" } });
    await fetchS3Path(config(), path, { headers: { Range: "bytes=100-199" } });
    expect(signatureOf(calls[0].init)).not.toBe(signatureOf(calls[1].init));
  });
});

describe("resolveStoreUrl", () => {
  it("resolves a key under a prefix, adding the separator the prefix omits", () => {
    const url = resolveStoreUrl("https://gateway.example/bucket/prefix", "/fabriks.json" as AbsolutePath);
    expect(url.href).toBe("https://gateway.example/bucket/prefix/fabriks.json");
  });

  it("keeps a hive segment literal on the wire", () => {
    // Only the CANONICAL form is encoded; the request line still carries the
    // key as written, which is what the store holds.
    const url = resolveStoreUrl(
      "https://gateway.example/bucket/prefix/",
      "/level=2/part-00001.parquet" as AbsolutePath,
    );
    expect(url.pathname).toBe("/bucket/prefix/level=2/part-00001.parquet");
  });
});

describe("signing-key cache", () => {
  // Same reason as above: these compare two signatures, so the clock must not
  // move between them.
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-17T11:15:12.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * The 403 this exists for: a datalayer whose STS is unavailable falls back to
   * its STATIC credentials, so every grant it issues carries the SAME access
   * key while the secret behind it can change. Keyed on the access key alone,
   * the signing key derived for the first grant was reused for every later one
   * — `Credential=` current, HMAC stale — and refreshing the grant could not
   * recover it, because the memo never saw a new key.
   */
  it("re-derives when a new grant reuses the access key with a different secret", async () => {
    const calls = captureRequest();
    const path = "/level0/part-00000.parquet" as AbsolutePath;

    await fetchS3Path({ ...config(), secretKey: "first-secret" }, path);
    await fetchS3Path({ ...config(), secretKey: "second-secret" }, path);

    expect(calls).toHaveLength(2);
    // Same access key on the wire both times — that is the whole trap.
    for (const call of calls) {
      expect(authOf(call.init)).toContain("Credential=AKIAEXAMPLE/");
    }
    expect(signatureOf(calls[0].init)).not.toBe(signatureOf(calls[1].init));
  });

  it("still memoizes when the credentials are genuinely unchanged", async () => {
    const calls = captureRequest();
    const path = "/level0/part-00000.parquet" as AbsolutePath;

    await fetchS3Path(config(), path);
    await fetchS3Path(config(), path);

    expect(signatureOf(calls[0].init)).toBe(signatureOf(calls[1].init));
  });
});

describe("browser cache interference", () => {
  /**
   * The 403 this exists for, and it presented as a credentials problem for a
   * long time. `range` is a SIGNED header, and Chromium stores a 206 as a
   * SPARSE cache entry: once the Parquet footer (the tail of the object) is
   * cached, a later overlapping read is narrowed before it leaves the browser.
   * The app signed `bytes=10009781-10534068` and the wire carried
   * `bytes=10009781-10528209` — the server canonicalizes what it RECEIVES, so
   * the signature could never match, and MinIO answered SignatureDoesNotMatch.
   */
  it("opts a ranged request out of the HTTP cache, so `range` cannot be rewritten", async () => {
    const calls = captureRequest();
    await fetchS3Path(config(), "/level0/part-00000.parquet" as AbsolutePath, {
      headers: { Range: "bytes=10009781-10534068" },
    });
    expect(calls[0].init.cache).toBe("no-store");
  });

  it("leaves a whole-object read cacheable — it is never rewritten", async () => {
    const calls = captureRequest();
    await fetchS3Path(config(), "/c/0/0/0" as AbsolutePath);
    expect(calls[0].init.cache).toBeUndefined();
  });

  it("does not disturb a caller that chose its own cache mode", async () => {
    const calls = captureRequest();
    await fetchS3Path(config(), "/zarr.json" as AbsolutePath, { cache: "reload" });
    expect(calls[0].init.cache).toBe("reload");
  });
});
