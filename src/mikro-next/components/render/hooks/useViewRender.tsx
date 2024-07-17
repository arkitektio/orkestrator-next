import { Arkitekt, useMikro } from "@/arkitekt";
import { useService } from "@/arkitekt/hooks";
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
import { ApolloClient } from "@apollo/client";
import { AwsClient } from "aws4fetch";
import { useCallback } from "react";
import { NestedArray, TypedArray, ZarrArray, openGroup } from "zarr";
import { ArraySelection, Slice } from "zarr/types/core/types";
import {
  addImageDataToCache,
  deleteRenderCache,
  getImageDataFromCache,
} from "./renderCache";
import { colorMapperMap, mapDTypeToMinMax } from "./useArray";

export type DownloadedArray = {
  shape: [number, number, number, number, number];
  out: NestedArray<TypedArray>;
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

  console.log(await aws.fetch(path + "/.zattrs", { signal: abortSignal }));

  let store = new S3Store(path, aws);

  let group = await openGroup(store, "", "r");
  let array = (await group.getItem("data")) as ZarrArray;

  let indexer = new BasicIndexer(selection, array);
  const outShape = indexer.shape;
  console.log("THE OUTSHAPE", outShape);

  const outDtype = array.dtype;

  const outSize = outShape.reduce((x, y) => x * y, 1);

  const out = new NestedArray(null, outShape, outDtype);
  if (outSize === 0) {
    throw Error("Selection is empty.");
  }

  let promises = [];

  for (const proj of indexer.iter()) {
    promises.push(getChunkItem(aws, proj, array, path, abortSignal));
  }

  let chunkPairs = await Promise.all(promises);

  for (const { decodedChunk, proj } of chunkPairs) {
    out.set(proj.outSelection, decodedChunk);
  }

  if (out.shape.length !== 5) {
    throw Error("Anything but 5D arrays are not supported. Got" + out.shape);
  }

  const [dtypeMin, dtypeMax] = mapDTypeToMinMax(outDtype);

  return {
    shape: outShape as [number, number, number, number, number],
    out: out,
    selection: selection,
    dtypeMin: dtypeMin,
    dtypeMax: dtypeMax,
    ySize: outShape[4],
    xSize: outShape[3],
    zSize: outShape[2],
    tSize: outShape[1],
    cSize: outShape[0],
  };
};

export const renderSelectionViaView = async (
  selection: DownloadedArray,
  view: RgbViewFragment,
) => {
  let min = 0;
  let max = 0;

  if (view.rescale) {
    let flattend = selection.out.flatten();

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
      let arrayValues = selection.out.get([
        ":",
        0,
        0,
        i,
        j,
      ]) as NestedArray<TypedArray>;

      let channelValues: number[] = [];

      for (let c = 0; c < selection.cSize; c++) {
        let val = arrayValues.get([c]) as number;
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
  t: number,
  z: number,
  abortSignal?: AbortSignal,
): Promise<ImageData> => {
  let slices = viewToSlices(view, t, z);

  let selection = await downloadSelectionFromStore(
    credentials,
    datalayerUrl,
    view.image.store,
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
    variables: { store: view.image.store.id },
    context: { fetchOptions: { signal } },
  });
  let data = x?.data;

  if (!data?.requestAccess) {
    throw Error("No credentials loaded");
  }

  return await renderView(data.requestAccess, endpoint_url, view, t, z, signal);
};

export const useViewRenderFunction = () => {
  const client = useMikro();
  const fakts = Arkitekt.useFakts();

  const renderView = useCallback(
    async (
      view: RgbViewFragment,
      t: number,
      z: number,
      signal?: AbortSignal,
    ) => {
      const cacheKey = `renderedView-${view.image.store.id}(${slicesToString(viewToSlices(view, t, z))})-rescale:${view.rescale}-${view.colorMap}$`;
      let cachedImageData = await getImageDataFromCache(cacheKey, signal);

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

      const imageData = await downloadView(client, fakts, t, z, view, signal);
      await addImageDataToCache(cacheKey, imageData);

      return imageData;
    },
    [client, fakts],
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
