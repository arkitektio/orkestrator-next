import {  MediaAccessGrantFragment, MediaStoreFragment, RequestMediaAccessDocument, RequestMediaAccessInput, RequestMediaAccessMutation, RequestMediaAccessMutationVariables } from "@/rekuest/api/graphql";
import {  signS3Request } from "./s3request";
import { ApolloClient } from "@apollo/client";
import { useDatalayerEndpoint, useRekuest } from "@/app/Arkitekt";
import React from "react";


export const createBlobUrl = async (_media: MediaStoreFragment, datalayer: string, credentials: MediaAccessGrantFragment) => {


  const s3Url = datalayer + "/" + credentials.bucket + "/" + credentials.key;
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




export const createBlobedUrl = async (media: MediaStoreFragment, mikro: ApolloClient, datalayer: string) => {

  const { data } = await mikro.mutate<RequestMediaAccessMutation, RequestMediaAccessMutationVariables>({
    mutation: RequestMediaAccessDocument,
    variables: {
      input: { storeId: media.id } as RequestMediaAccessInput
    }
  });

  const credentials = data?.requestMediaAccess;

  if (!credentials) {
    throw new Error("Failed to get media access credentials");
  }

  console.log("Received credentials for media access:", credentials);

  return await createBlobUrl(media, datalayer, credentials);
};



export const WithMediaUrl = (props: { children: (url) => React.ReactNode, media?: MediaStoreFragment | undefined | null }) => {

  const endpointUrl = useDatalayerEndpoint();
  const rekuest = useRekuest();


  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!endpointUrl) return;
    if (!props.media) return;

    let isMounted = true;

    createBlobedUrl(props.media, rekuest, endpointUrl)
      .then((blobUrl) => {
        if (isMounted) setUrl(blobUrl);
        else URL.revokeObjectURL(blobUrl);
      })
      .catch(err => console.error("Error creating blob URL:", err));

    return () => {
      isMounted = false;
    };
  }, [props.media, endpointUrl, rekuest]);

  // Revoke the previous blob URL when it is replaced or the component unmounts —
  // otherwise every rendered media object leaks its object URL.
  React.useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  if (!url) {
    return null;
  }

  return props.children(url);
};


