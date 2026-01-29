import {
  AccessCredentialsFragment,
  RequestAccessDocument,
  RequestAccessMutation,
  RequestAccessMutationVariables,
  ZarrStoreFragment,
} from "@/elektro/api/graphql";
import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import { useSettings } from "@/providers/settings/SettingsContext";
import { ApolloClient, NormalizedCache } from "@apollo/client";
import { AwsClient } from "aws4fetch";
import { useCallback } from "react";
import { Chunk, DataType, get, open } from "zarrita";
import { ArraySelection, Slice } from "zarrita/dist/types/core/types";
import { S3Store } from "../components/render/final/store";

export type DownloadedLabels = {
  shape: [number, number, number, number, number];
  out: Chunk<DataType>;
  selection: ArraySelection;
  size: number;
};

export const downloadSelectionFromStore = async (
  credentials: AccessCredentialsFragment,
  datalayerUrl: string,
  zarrStore: ZarrStoreFragment,
  selection: ArraySelection,
  abortSignal?: AbortSignal,
): Promise<DownloadedLabels> => {
  const path = datalayerUrl + "/" + zarrStore.bucket + "/" + zarrStore.key;

  const aws = new AwsClient({
    accessKeyId: credentials.accessKey,
    secretAccessKey: credentials.secretKey,
    sessionToken: credentials.sessionToken,
    service: "s3",
  });

  console.log("Path", path);
  const store = new S3Store(path, aws);

  const array = await open.v3(store, { kind: "array" });

  console.log("Array", array);

  const view = await get(array, selection);

  console.log("View", view);

  return {
    shape: array.shape as [number, number, number, number, number],
    out: view,
    selection: selection,
    size: array.shape[0],
  };
};

export const viewToSlices = (): Slice[] => {
  const selection: Slice[] = [
    {
      _slice: true,
      step: 1,
      start: null,
      stop: null,
    },
  ];

  return selection;
};

export const slicesToString = (slice: Slice[]): string => {
  return slice.map((x) => x.start + ":" + x.stop).join(",");
};

export type Plot = { [key: string]: number }[];

export const renderArray = async (
  credentials: AccessCredentialsFragment,
  datalayerUrl: string,
  store: ZarrStoreFragment,
  abortSignal?: AbortSignal,
): Promise<number[]> => {
  const slices = viewToSlices();
  console.log("Slices", slices);

  const selection = await downloadSelectionFromStore(
    credentials,
    datalayerUrl,
    store,
    slices,
    abortSignal,
  );

  console.log("Array is", selection.out.data);

  console.log("Reduced array", selection.out.data);

  return selection.out.data as number[];
};

const downloadLabels = async (
  client: ApolloClient<NormalizedCache> | undefined,
  endpoint_url: string | undefined,
  store: ZarrStoreFragment,
  signal?: AbortSignal,
) => {
  if (endpoint_url === undefined) {
    throw Error("No datalayer found");
  }

  const x = await client?.mutate<
    RequestAccessMutation,
    RequestAccessMutationVariables
  >({
    mutation: RequestAccessDocument,
    variables: { store: store.id },
    context: { fetchOptions: { signal } },
  });
  const data = x?.data;

  if (!data?.requestAccess) {
    throw Error("No credentials loaded");
  }

  return await renderArray(data.requestAccess, endpoint_url, store, signal);
};

export const useLabelsArray = () => {
  const {
    settings: { experimentalCache },
  } = useSettings();
  const client = useMikro();

  const endpoint_url = useDatalayerEndpoint();

  const loadLabels = useCallback(
    async (store: ZarrStoreFragment, signal?: AbortSignal) => {
      if (!client) {
        throw Error("No client found");
      }

      if (!endpoint_url) {
        throw Error("No fakts found");
      }

      const imageData = await downloadLabels(
        client,
        endpoint_url,
        store,
        signal,
      );

      return imageData;
    },
    [client, endpoint_url, experimentalCache],
  );

  return {
    loadLabels,
  };
};
