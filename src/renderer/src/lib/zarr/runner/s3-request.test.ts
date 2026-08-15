import type { AbsolutePath } from "@zarrita/storage";
import { afterEach, describe, expect, it, vi } from "vitest";
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
