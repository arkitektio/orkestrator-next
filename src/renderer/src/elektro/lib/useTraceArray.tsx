import { useDatalayerEndpoint, useElektro } from "@/app/Arkitekt";
import { ApolloClient, NormalizedCache } from "@apollo/client";
import { useCallback } from "react";
import { Chunk, DataType, get, open } from "zarrita";
import { DetailTraceFragment, ZarrStoreFragment } from "../api/graphql";
import { CachedS3Store } from "@/mikro-next/components/scene/zarr/zarr_stores/s3Store";
import { parse } from "graphql";

const RequestZarrAccessDocument = parse(`
  mutation RequestZarrAccess($input: RequestZarrAccessInput!) {
    requestZarrAccess(input: $input) {
      accessKey
      secretKey
      sessionToken
      bucket
      key
    }
  }
`);

type Slice = {
  _slice: true;
  step: number | null;
  start: number | null;
  stop: number | null;
};

type ArraySelection = Slice[];

type ElektroClient = ApolloClient<NormalizedCache> & {
  mutate: ApolloClient<NormalizedCache>["mutate"];
};

type RequestZarrAccessMutation = {
  requestZarrAccess: {
    accessKey: string;
    secretKey: string;
    sessionToken: string;
    bucket: string;
    key: string;
  };
};

type RequestZarrAccessMutationVariables = {
  input: {
    storeId: string;
  };
};



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
  client: ElektroClient,
  datalayerUrl: string,
  zarrStore: ZarrStoreFragment,
  selection: ArraySelection,
  _abortSignal?: AbortSignal,
): Promise<DownloadedArray> => {
  const store = new CachedS3Store(zarrStore.id, client as never, datalayerUrl, {
    requestAccess: async (storeId: string, accessClient: ElektroClient) => {
      const access = await accessClient.mutate<
        RequestZarrAccessMutation,
        RequestZarrAccessMutationVariables
      >({
        mutation: RequestZarrAccessDocument,
        variables: { input: { storeId } },
      });

      const credentials = access.data?.requestZarrAccess;
      if (!credentials) {
        throw new Error("Failed to obtain Zarr access credentials");
      }

      return credentials;
    },
  });

  const array = await open.v3(store, { kind: "array" });


  const view = (await get(array, selection)) as Chunk<DataType>;

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

export const viewToSlices = (t: number | null, left?: number | undefined | null, right?: number | undefined | null): Slice[] => {
  const selection: Slice[] = [
    {
      _slice: true,
      step: t,
      start: left ?? null,
      stop: right ?? null,
    },
  ];

  return selection;
};

export const slicesToString = (slice: Slice[]): string => {
  return slice.map((x) => x.start + ":" + x.stop).join(",");
};

export type Plot = { [key: string]: number }[];

export const renderArray = async (
  client: ElektroClient,
  datalayerUrl: string,
  store: ZarrStoreFragment,
  t: number | null,
  left?: number | undefined | null,
  right?: number | undefined | null,
  abortSignal?: AbortSignal,
): Promise<number[]> => {
  const slices = viewToSlices(t, left, right);

  const selection = await downloadSelectionFromStore(
    client,
    datalayerUrl,
    store,
    slices,
    abortSignal,
  );

  return selection.out.data as number[];
};

const downloadArray = async (
  client: ElektroClient | undefined,
  endpoint_url: string | undefined,
  t: number | null,
  left: number | undefined | null,
  right: number | undefined | null,
  store: ZarrStoreFragment,
  signal?: AbortSignal,
) => {
  if (endpoint_url === undefined) {
    throw Error("No datalayer found");
  }

  if (!client) {
    throw Error("No client found");
  }

  return await renderArray(client, endpoint_url, store, t, left, right, signal);
};

export const useTraceArray = () => {
  const client = useElektro();

  const endpoint_url = useDatalayerEndpoint();

  const renderView = useCallback(
    async (
      trace: DetailTraceFragment,
      t: number | null,
      left?: number | undefined | null,
      right?: number | undefined | null,
      signal?: AbortSignal,
    ) => {
      if (!client) {
        throw Error("No client found");
      }

      if (!endpoint_url) {
        throw Error("No fakts found");
      }



      const imageData = await downloadArray(
        client as ElektroClient,
        endpoint_url,
        t,
        left, right,
        trace.store,
        signal,
      );

      return imageData;
    },
    [client, endpoint_url],
  );

  return {
    renderView,
  };
};
