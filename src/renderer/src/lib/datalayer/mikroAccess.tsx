import { MediaAccessGrantFragment, MediaStoreFragment, RequestMediaAccessDocument, RequestMediaAccessInput, RequestMediaAccessMutation, RequestMediaAccessMutationVariables } from "@/mikro/api/graphql";
import { signS3Request } from "./s3request";
import { ApolloClient } from "@apollo/client";
import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import React from "react";
import { GeneralMediaAccessGrantFragment, RequestGeneralMediaAccessDocument, RequestGeneralMediaAccessInput, RequestGeneralMediaAccessMutation, RequestGeneralMediaAccessMutationVariables } from "@/mikro-next/api/graphql";

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

    console.log("Received and cached credentials for media access:", credentials);

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
  console.log("Item URL:", s3Url);

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


export const WithMikroMediaUrl = (props: { children: (url: string) => React.ReactNode, media?: MediaStoreFragment | undefined | null }) => {
  const endpointUrl = useDatalayerEndpoint();
  const mikro = useMikro();

  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!endpointUrl) return;
    if (!props.media) return;

    // Track mounted state to avoid React memory leak warnings
    // if components unmount while waiting on the shared lock
    let isMounted = true;

    createBlobedUrl(props.media, mikro, endpointUrl)
      .then((blobUrl) => {
        if (isMounted) setUrl(blobUrl);
      })
      .catch(err => console.error("Error creating blob URL:", err));

    return () => {
      isMounted = false;
    };
  }, [props.media, endpointUrl, mikro]);

  if (!url) {
    return null;
  }

  return props.children(url);
};
