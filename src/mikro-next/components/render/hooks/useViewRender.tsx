import { Arkitekt, useMikro } from "@/arkitekt/Arkitekt";
import {
  AccessCredentialsFragment,
  RequestAccessDocument,
  RequestAccessMutation,
  RequestAccessMutationVariables,
  RgbViewFragment,
  ZarrStoreFragment,
} from "@/mikro-next/api/graphql";
import { BasicIndexer } from "@/mikro-next/providers/xarray/indexing";
import { S3Store } from "@/mikro-next/providers/xarray/store";
import { getChunkItem } from "@/mikro-next/providers/xarray/utils";
import { useSettings } from "@/providers/settings/SettingsContext";
import { ApolloClient } from "@apollo/client";
import { AwsClient } from "aws4fetch";
import { useCallback } from "react";
import { open, get, Chunk, DataType } from "zarrita";
import { ArraySelection, Slice } from "zarr/types/core/types";
import {
  addImageDataToCache,
  deleteRenderCache,
  getImageDataFromCache,
} from "./renderCache";
import { colorMapperMap, mapDTypeToMinMax } from "./useArray";
import { ar } from "date-fns/locale";

export type DownloadedArray = {
  shape: [number, number, number, number, number];
  out: Chunk<DataType>;
  selection: ArraySelection;
  ySize: number;
  xSize: number;
  tSize: number;
  zSize: number;
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

  let view = await get(array, selection);

  return {
    shape: array.shape as [number, number, number, number, number],
    out: view,
    selection: selection,
    dtypeMin: 0,
    dtypeMax: 255,
    ySize: array.shape[4],
    xSize: array.shape[3],
    zSize: array.shape[2],
    tSize: array.shape[1],
    cSize: array.shape[0],
  };
};

export const renderSelectionViaView = async (
  selection: DownloadedArray,
  view: RgbViewFragment,
) => {
  let min = 0;
  let max = 0;

  if (view.rescale) {
    let flattend = selection.out.data;

    for (var i = 0; i < flattend.length; i++) {
      if (flattend[i] < min) {
        min = Number(flattend[i]);
      }
      if (flattend[i] > max) {
        max = Number(flattend[i]);
      }
    }
  } else {
    min = selection.dtypeMin;
    max = selection.dtypeMax;
  }

  let mapper = colorMapperMap[view.colorMap];

  let iData = new Uint8ClampedArray(selection.xSize * selection.ySize * 4);

  let z = 0;

  for (let j = 0; j < selection.ySize; j++) {
    for (let i = 0; i < selection.xSize; i++) {
      let channelValues: number[] = [];

      for (let c = 0; c < selection.cSize; c++) {
        let val =
          selection.out.data[
            i + j * selection.xSize + c * selection.xSize * selection.ySize
          ];
        val = Math.floor(((val - min) / (max - min)) * 255);
        channelValues.push(val);
      }

      let color = mapper(channelValues, view.baseColor);
      iData[z] = color[0];
      iData[z + 1] = color[1];
      iData[z + 2] = color[2];
      iData[z + 3] = color[3];
      z += 4;
    }
  }

  return new ImageData(iData, selection.xSize, selection.ySize);
};

export const viewToSlices = (
  view: RgbViewFragment,
  t: number,
  z: number,
): Slice[] => {
  let selection: Slice[] = [
    {
      start: view?.cMin || 0,
      stop: (view?.cMax || view?.cMin || 0) + 1,
      step: 1,
      _slice: true,
    },
    {
      start: t || 0,
      stop: t + 1,
      step: 1,
      _slice: true,
    },
    {
      start: z || 0,
      stop: z + 1,
      step: 1,
      _slice: true,
    },
    {
      _slice: true,
      step: 1,
      start: null,
      stop: null,
    },
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

export const renderView = async (
  credentials: AccessCredentialsFragment,
  datalayerUrl: string,
  view: RgbViewFragment,
  store: ZarrStoreFragment,
  t: number,
  z: number,
  abortSignal?: AbortSignal,
): Promise<ImageData> => {
  let slices = viewToSlices(view, t, z);
  console.log("Slices", slices);

  let selection = await downloadSelectionFromStore(
    credentials,
    datalayerUrl,
    store,
    slices,
    abortSignal,
  );

  return await renderSelectionViaView(selection, view);
};

const downloadView = async (
  client: ApolloClient<any> | undefined,
  fakts: any,
  t: number,
  z: number,
  view: RgbViewFragment,
  store: ZarrStoreFragment,
  signal?: AbortSignal,
) => {
  let endpoint_url = (fakts?.datalayer as any)?.endpoint_url;
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

  return await renderView(
    data.requestAccess,
    endpoint_url,
    view,
    store,
    t,
    z,
    signal,
  );
};

export const useViewRenderFunction = () => {
  const {
    settings: { experimentalCache },
  } = useSettings();
  const client = useMikro();
  const fakts = Arkitekt.useFakts();

  const renderView = useCallback(
    async (
      view: RgbViewFragment,
      t: number,
      z: number,
      signal?: AbortSignal,
    ) => {
      let smallestScale =
        view.image.derivedScaleViews.at(-1)?.image || view.image;
      let tRescale = view.image.derivedScaleViews.at(-1)?.scaleT || 1;
      let zRescale = view.image.derivedScaleViews.at(-1)?.scaleZ || 1;

      console.log(smallestScale.store.shape);

      let renderView = { ...view, rescale: true };

      const cacheKey = `renderedViews-${smallestScale.store.id}(${slicesToString(viewToSlices(view, t, z))})-rescale:${renderView.rescale}-${view.colorMap}$`;
      let cachedImageData = experimentalCache
        ? await getImageDataFromCache(cacheKey, signal)
        : null;

      if (cachedImageData) {
        console.log("Loaded rendered view from cache");
        return cachedImageData;
      }

      if (!client) {
        throw Error("No client found");
      }

      if (!fakts) {
        throw Error("No fakts found");
      }

      const imageData = await downloadView(
        client,
        fakts,
        t,
        z,
        renderView,
        smallestScale.store,
        signal,
      );
      await addImageDataToCache(cacheKey, imageData);

      return imageData;
    },
    [client, fakts, experimentalCache],
  );

  return {
    renderView,
  };
};

export const useDeleteCache = () => {
  const deleteCache = async () => {
    await deleteRenderCache();
  };

  return {
    deleteCache,
  };
};
