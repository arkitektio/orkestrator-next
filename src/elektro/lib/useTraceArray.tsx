import {
  AccessCredentialsFragment,
  RequestAccessDocument,
  RequestAccessMutation,
  RequestAccessMutationVariables,
  ZarrStoreFragment,
} from "@/elektro/api/graphql";
import { Arkitekt, useDatalayerEndpoint, useElektro } from "@/lib/arkitekt/Arkitekt";
import { useSettings } from "@/providers/settings/SettingsContext";
import { ApolloClient } from "@apollo/client";
import { AwsClient } from "aws4fetch";
import { useCallback } from "react";
import { Chunk, DataType, get, open } from "zarrita";
import { DetailTraceFragment } from "../api/graphql";
import { ArraySelection, Slice } from "zarr/types/core/types";
import { S3Store } from "./store";



export type DownloadedArray = {
  shape: [number, number, number, number, number];
  out: Chunk<DataType>;
  selection: ArraySelection;
  tSize: number;
  cSize: number;
  dtypeMin: number;
  dtypeMax: number;
};

export const downloadSelectionFromStore = async (
  credentials: AccessCredentialsFragment,
  datalayerUrl: string,
  zarrStore: ZarrStoreFragment,
  selection: ArraySelection,
  abortSignal?: AbortSignal,
): Promise<DownloadedArray> => {
  let path = datalayerUrl + "/" + zarrStore.bucket + "/" + zarrStore.key;

  let aws = new AwsClient({
    accessKeyId: credentials.accessKey,
    secretAccessKey: credentials.secretKey,
    sessionToken: credentials.sessionToken,
    service: "s3",
  });

  console.log("Path", path);
  let store = new S3Store(path, aws);

  let array = await open.v3(store, { kind: "array" });

  console.log("Array", array);

  let view = await get(array, selection);

  console.log("View", view);

  return {
    shape: array.shape as [number, number, number, number, number],
    out: view,
    selection: selection,
    dtypeMin: 0,
    dtypeMax: 255,
    tSize: array.shape[1],
    cSize: array.shape[0],
  };
};

export const viewToSlices = (t: number | null): Slice[] => {
  let selection: Slice[] = [
    {
      _slice: true,
      step: t,
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
  t: number | null,
  abortSignal?: AbortSignal,
): Promise<number[]> => {
  let slices = viewToSlices(t);
  console.log("Slices", slices);

  let selection = await downloadSelectionFromStore(
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

const downloadArray = async (
  client: ApolloClient<any> | undefined,
  endpoint_url: string | undefined,
  t: number | null,
  store: ZarrStoreFragment,
  signal?: AbortSignal,
) => {
  if (endpoint_url === undefined) {
    throw Error("No datalayer found");
  }

  let x = await client?.mutate<
    RequestAccessMutation,
    RequestAccessMutationVariables
  >({
    mutation: RequestAccessDocument,
    variables: { store: store.id },
    context: { fetchOptions: { signal } },
  });
  let data = x?.data;

  if (!data?.requestAccess) {
    throw Error("No credentials loaded");
  }

  return await renderArray(data.requestAccess, endpoint_url, store, t, signal);
};

export const useTraceArray = () => {
  const {
    settings: { experimentalCache },
  } = useSettings();
  const client = useElektro();

  const endpoint_url = useDatalayerEndpoint();

  const renderView = useCallback(
    async (
      trace: DetailTraceFragment,
      t: number | null,
      signal?: AbortSignal,
    ) => {
      if (!client) {
        throw Error("No client found");
      }

      if (!endpoint_url) {
        throw Error("No fakts found");
      }

      const imageData = await downloadArray(
        client,
        endpoint_url,
        t,
        trace.store,
        signal,
      );

      return imageData;
    },
    [client, endpoint_url, experimentalCache],
  );

  return {
    renderView,
  };
};
