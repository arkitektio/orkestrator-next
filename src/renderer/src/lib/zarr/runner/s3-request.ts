import type { AbsolutePath } from '@zarrita/storage'

export interface SerializedRequestInit {
  cache?: RequestCache
  credentials?: RequestCredentials
  headers?: Array<[string, string]>
  integrity?: string
  keepalive?: boolean
  method?: string
  mode?: RequestMode
  redirect?: RequestRedirect
  referrer?: string
  referrerPolicy?: ReferrerPolicy
}

export interface S3FetchConfig {
  accessKey: string
  baseUrl: string
  expiresAt: number
  region: string
  secretKey: string
  sessionToken: string
  storeId: string
}

const encoder = new TextEncoder()

function encodeRfc3986(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  )
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return toHex(new Uint8Array(digest))
}

async function hmacSha256(
  key: Uint8Array<ArrayBuffer>,
  value: string,
): Promise<Uint8Array<ArrayBuffer>> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(value),
  )

  return new Uint8Array(signature)
}

async function deriveSigningKey(
  secretKey: string,
  dateStamp: string,
  region: string,
): Promise<Uint8Array<ArrayBuffer>> {
  const kDate = await hmacSha256(encoder.encode(`AWS4${secretKey}`), dateStamp)
  const kRegion = await hmacSha256(kDate, region)
  const kService = await hmacSha256(kRegion, 's3')
  return hmacSha256(kService, 'aws4_request')
}

/**
 * SigV4 signing keys change only with (credentials, UTC date, region) — at
 * most once per day per store — but every chunk request needs one, and a
 * fresh derivation is 4 sequential `crypto.subtle` HMAC round-trips (8 async
 * calls). Memoize the derivation PROMISE per (accessKey, date, region) so
 * concurrent first requests share one derivation; ~6 crypto ops per chunk
 * drop to 2. Module state — this file runs inside each decode worker, so the
 * memo is naturally per-worker. Date rollover self-handles via the key.
 */
const signingKeyMemo = new Map<string, Promise<Uint8Array<ArrayBuffer>>>()
const SIGNING_KEY_MEMO_MAX = 8

function deriveSigningKeyCached(
  config: S3FetchConfig,
  dateStamp: string,
): Promise<Uint8Array<ArrayBuffer>> {
  // accessKey identifies the credential set (a secret rotation issues a new
  // access key alongside it); the secret itself stays out of the map key.
  const memoKey = `${config.accessKey}|${dateStamp}|${config.region}`
  const cached = signingKeyMemo.get(memoKey)
  if (cached) return cached
  const derived = deriveSigningKey(config.secretKey, dateStamp, config.region)
  if (signingKeyMemo.size >= SIGNING_KEY_MEMO_MAX) {
    const oldest = signingKeyMemo.keys().next().value
    if (oldest !== undefined) signingKeyMemo.delete(oldest)
  }
  signingKeyMemo.set(memoKey, derived)
  // A failed derivation must not poison the memo.
  derived.catch(() => signingKeyMemo.delete(memoKey))
  return derived
}

function canonicalQueryString(url: URL): string {
  const entries = Array.from(url.searchParams.entries()).sort(([leftKey, leftValue], [rightKey, rightValue]) => {
    if (leftKey !== rightKey) {
      return leftKey.localeCompare(rightKey)
    }

    return leftValue.localeCompare(rightValue)
  })

  return entries
    .map(([key, value]) => `${encodeRfc3986(key)}=${encodeRfc3986(value)}`)
    .join('&')
}

function canonicalUri(url: URL): string {
  return url.pathname.replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  )
}

function normalizeHeaderValue(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function createCanonicalHeaders(
  url: URL,
  headers: Headers,
  amzDate: string,
  sessionToken: string,
): {
  canonicalHeaders: string
  requestHeaders: Headers
  signedHeaders: string
} {
  const requestHeaders = new Headers(headers)
  requestHeaders.set('x-amz-content-sha256', 'UNSIGNED-PAYLOAD')
  requestHeaders.set('x-amz-date', amzDate)
  requestHeaders.set('x-amz-security-token', sessionToken)

  const canonicalHeaderMap = new Map<string, string>()
  canonicalHeaderMap.set('host', url.host)

  for (const [key, value] of requestHeaders.entries()) {
    canonicalHeaderMap.set(key.toLowerCase(), normalizeHeaderValue(value))
  }

  const sortedHeaders = Array.from(canonicalHeaderMap.entries()).sort(([left], [right]) =>
    left.localeCompare(right),
  )

  return {
    canonicalHeaders: sortedHeaders
      .map(([key, value]) => `${key}:${value}\n`)
      .join(''),
    requestHeaders,
    signedHeaders: sortedHeaders.map(([key]) => key).join(';'),
  }
}

function assertCredentialsValid(config: S3FetchConfig): void {
  if (Date.now() >= config.expiresAt) {
    throw new Error(`S3 credentials for ${config.storeId} have expired`)
  }
}

async function signRequest(
  url: URL,
  config: S3FetchConfig,
  init: RequestInit,
): Promise<RequestInit> {
  assertCredentialsValid(config)

  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const method = (init.method ?? 'GET').toUpperCase()
  const payloadHash = 'UNSIGNED-PAYLOAD'
  const { canonicalHeaders, requestHeaders, signedHeaders } = createCanonicalHeaders(
    url,
    new Headers(init.headers),
    amzDate,
    config.sessionToken,
  )

  const credentialScope = `${dateStamp}/${config.region}/s3/aws4_request`
  const canonicalRequest = [
    method,
    canonicalUri(url),
    canonicalQueryString(url),
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join('\n')

  const signingKey = await deriveSigningKeyCached(config, dateStamp)
  const signature = toHex(await hmacSha256(signingKey, stringToSign))

  requestHeaders.set(
    'Authorization',
    [
      `AWS4-HMAC-SHA256 Credential=${config.accessKey}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`,
    ].join(', '),
  )

  return {
    ...init,
    method,
    headers: requestHeaders,
  }
}

export function resolveStoreUrl(root: string | URL, path: AbsolutePath): URL {
  const base = typeof root === 'string' ? new URL(root) : new URL(root.href)
  if (!base.pathname.endsWith('/')) {
    base.pathname += '/'
  }

  const resolved = new URL(path.slice(1), base)
  resolved.search = base.search
  return resolved
}

export async function fetchS3Path(
  config: S3FetchConfig,
  path: AbsolutePath,
  init: RequestInit = {},
): Promise<Response> {
  const url = resolveStoreUrl(config.baseUrl, path)
  return fetch(url, await signRequest(url, config, init))
}

export function serializeRequestInit(
  init?: RequestInit,
): SerializedRequestInit | undefined {
  if (!init) {
    return undefined
  }

  return {
    cache: init.cache,
    credentials: init.credentials,
    headers: Array.from(new Headers(init.headers).entries()),
    integrity: init.integrity,
    keepalive: init.keepalive,
    method: init.method,
    mode: init.mode,
    redirect: init.redirect,
    referrer: init.referrer,
    referrerPolicy: init.referrerPolicy,
  }
}

export function deserializeRequestInit(
  init?: SerializedRequestInit,
): RequestInit | undefined {
  if (!init) {
    return undefined
  }

  return {
    cache: init.cache,
    credentials: init.credentials,
    headers: init.headers,
    integrity: init.integrity,
    keepalive: init.keepalive,
    method: init.method,
    mode: init.mode,
    redirect: init.redirect,
    referrer: init.referrer,
    referrerPolicy: init.referrerPolicy,
  }
}

export function isExpiredS3FetchConfig(config: S3FetchConfig): boolean {
  return Date.now() >= config.expiresAt
}
