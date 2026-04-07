import {  MediaAccessGrantFragment, MediaStore, MediaStoreFragment, RequestMediaAccessDocument, RequestMediaAccessInput, RequestMediaAccessMutation, RequestMediaAccessMutationVariables } from "@/rekuest/api/graphql";
import {  signS3Request } from "./s3request";
import { ApolloClient } from "@apollo/client";
import { useDatalayerEndpoint, useRekuest } from "@/app/Arkitekt";
import React from "react";


export const createBlobUrl = async (media: MediaStoreFragment, datalayer: string, credentials: MediaAccessGrantFragment) => {


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

    createBlobedUrl(props.media, rekuest, endpointUrl)
      .then(setUrl)
      .catch(err => console.error("Error creating blob URL:", err));
  }, [props.media, endpointUrl, rekuest]);

  if (!url) {
    return null;
  }

  return props.children(url);
};


