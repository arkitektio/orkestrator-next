import { signS3Request } from "./s3request";
import { ApolloClient } from "@apollo/client";
import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import React from "react";
import { GeneralMediaAccessGrantFragment, MediaStoreFragment, RequestGeneralMediaAccessDocument, RequestGeneralMediaAccessMutation, RequestGeneralMediaAccessMutationVariables } from "@/mikro-next/api/graphql";

// --- Caching & Lock Mechanism ---
let cachedCredentialsPromise: Promise<GeneralMediaAccessGrantFragment> | null = null;
let cachedCredentials: GeneralMediaAccessGrantFragment | null = null;
let credentialsExpiration: number | null = null;

const getCredentials = async (client: ApolloClient<any>): Promise<GeneralMediaAccessGrantFragment> => {
  const now = Date.now();

  // 1. Return valid cached credentials
  // Note: If your GraphQL schema provides an expiration date, it gets used below.
  // Otherwise, this defaults to a safe 55-minute TTL.
  if (cachedCredentials && credentialsExpiration && now < credentialsExpiration) {
    return cachedCredentials;
  }

  // 2. If a request is already in flight, wait for it to finish (The Lock)
  if (cachedCredentialsPromise) {
    return cachedCredentialsPromise;
  }

  // 3. Initiate a new request and store the promise lock
  cachedCredentialsPromise = client.mutate<RequestGeneralMediaAccessMutation, RequestGeneralMediaAccessMutationVariables>({
    mutation: RequestGeneralMediaAccessDocument,
    variables: {
      input: {}
    }
  }).then(({ data }) => {
    const credentials = data?.requestGeneralMediaAccess;

    if (!credentials) {
      throw new Error("Failed to get media access credentials");
    }

    cachedCredentials = credentials;

    // Extract expiration if available (adjust the property name to match your GraphQL schema)
    // If your schema doesn't provide an expiration time, we default to expiring in 55 minutes.
    const expiryFromCreds = (credentials as any).expiration ? new Date((credentials as any).expiration).getTime() : null;
    credentialsExpiration = expiryFromCreds || (Date.now() + 55 * 60 * 1000);

    return credentials;
  }).catch((err) => {
    // Clear cache on error so subsequent attempts can retry cleanly
    cachedCredentials = null;
    credentialsExpiration = null;
    throw err;
  }).finally(() => {
    // Clear the promise lock once resolved or rejected
    cachedCredentialsPromise = null;
  });

  return cachedCredentialsPromise;
};


export const createBlobUrl = async (media: MediaStoreFragment, datalayer: string, credentials: GeneralMediaAccessGrantFragment) => {
  const s3Url = datalayer + "/" + credentials.bucket + "/" + media.key;

  const headers = await signS3Request(s3Url, 'GET', credentials);

  const response = await fetch(s3Url, {
    method: 'GET',
    headers: headers
  });

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
};


export const createBlobedUrl = async (media: MediaStoreFragment, client: ApolloClient<any>, datalayer: string) => {
  // Grab credentials via the lock/cache mechanism instead of calling mutate directly
  const credentials = await getCredentials(client);

  return await createBlobUrl(media, datalayer, credentials);
};


// --- Shared blob-URL cache ---
//
// Cards in a grid frequently show the same snapshot, and a grid re-mounts its
// cards on every pagination / filter change. Each mount used to sign and
// download the full object again. Blob URLs are now shared per (endpoint, key)
// and reference counted; a URL is revoked shortly after its last user unmounts
// so a quick remount (pagination back and forth) still hits the cache.
type BlobCacheEntry = {
  promise: Promise<string>;
  url: string | null;
  refs: number;
  releaseTimer: ReturnType<typeof setTimeout> | null;
};

const blobUrlCache = new Map<string, BlobCacheEntry>();
const BLOB_RELEASE_DELAY_MS = 30_000;

const blobCacheKey = (endpoint: string, media: MediaStoreFragment) =>
  `${endpoint}::${media.id ?? media.key}`;

/**
 * Acquire a shared blob URL for `media`. Returns the (cached or in-flight)
 * promise and a `release` function that must be called exactly once when the
 * caller no longer needs the URL.
 */
export const acquireBlobUrl = (
  media: MediaStoreFragment,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: ApolloClient<any>,
  endpoint: string,
): { promise: Promise<string>; release: () => void } => {
  const key = blobCacheKey(endpoint, media);
  let entry = blobUrlCache.get(key);

  if (!entry) {
    const created: BlobCacheEntry = {
      promise: Promise.resolve(""),
      url: null,
      refs: 0,
      releaseTimer: null,
    };
    created.promise = createBlobedUrl(media, client, endpoint)
      .then((url) => {
        created.url = url;
        return url;
      })
      .catch((error) => {
        // Do not cache failures: the next acquire retries.
        if (blobUrlCache.get(key) === created) blobUrlCache.delete(key);
        throw error;
      });
    blobUrlCache.set(key, created);
    entry = created;
  }

  if (entry.releaseTimer) {
    clearTimeout(entry.releaseTimer);
    entry.releaseTimer = null;
  }
  entry.refs += 1;

  let released = false;
  const current = entry;
  const release = () => {
    if (released) return;
    released = true;
    current.refs -= 1;
    if (current.refs > 0) return;
    current.releaseTimer = setTimeout(() => {
      if (current.refs > 0) return;
      if (blobUrlCache.get(key) === current) blobUrlCache.delete(key);
      if (current.url) URL.revokeObjectURL(current.url);
    }, BLOB_RELEASE_DELAY_MS);
  };

  return { promise: entry.promise, release };
};

/**
 * Whether `ref`'s element is (about to be) visible. Starts `false` and flips
 * to `true` once, the first time the element enters the viewport margin; the
 * fetch behind it should not start before then.
 */
const useNearViewport = (ref: React.RefObject<Element | null>) => {
  // Without an IntersectionObserver (tests, old runtimes) everything counts
  // as near, so the fetch is not deferred forever.
  const [near, setNear] = React.useState(
    () => typeof IntersectionObserver === "undefined",
  );

  React.useEffect(() => {
    if (near) return;
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, near]);

  return near;
};

export const WithMikroMediaUrl = (props: { children: (url: string) => React.ReactNode, media?: MediaStoreFragment | undefined | null }) => {
  const endpointUrl = useDatalayerEndpoint();
  const mikro = useMikro();

  const sentinelRef = React.useRef<HTMLSpanElement | null>(null);
  const near = useNearViewport(sentinelRef);
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!endpointUrl) return;
    if (!props.media) return;
    if (!near) return;

    let isMounted = true;
    const { promise, release } = acquireBlobUrl(props.media, mikro, endpointUrl);

    promise
      .then((blobUrl) => {
        if (isMounted) setUrl(blobUrl);
      })
      .catch((err) => console.error("Error creating blob URL:", err));

    return () => {
      isMounted = false;
      setUrl(null);
      release();
    };
  }, [props.media, endpointUrl, mikro, near]);

  if (!url) {
    // Zero-size sentinel: lets the viewport observer decide when to fetch.
    return <span ref={sentinelRef} aria-hidden className="absolute inset-0 pointer-events-none" />;
  }

  return props.children(url);
};
