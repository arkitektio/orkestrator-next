import { Arkitekt, useMikro } from "@/arkitekt/Arkitekt";
import { useService } from "@/arkitekt/hooks";
import {
  Blending,
  ColorMap,
  ListRgbContextFragment,
  RequestAccessDocument,
  RequestAccessMutation,
  RequestAccessMutationVariables,
  RgbViewFragment,
  ZarrStoreFragment,
} from "@/mikro-next/api/graphql";
import { BasicIndexer } from "@/mikro-next/providers/xarray/indexing";
import { AvailableColormap } from "@/mikro-next/providers/xarray/provider";
import { S3Store } from "@/mikro-next/providers/xarray/store";
import { getChunkItem } from "@/mikro-next/providers/xarray/utils";
import { AwsClient } from "aws4fetch";
import c from "colormap";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { NestedArray, TypedArray, ZarrArray, openGroup } from "zarr";
import { ArraySelection, Slice } from "zarr/types/core/types";
import { DtypeString } from "zarr/types/types";
export const available_color_maps = [
  "jet",
  "hot",
  "cool",
  "spring",
  "summer",
  "autumn",
  "winter",
  "bone",
  "copper",
  "greys",
  "YIGnBu",
  "greens",
  "YIOrRd",
  "bluered",
  "RdBu",
  "picnic",
  "rainbow",
  "portland",
  "blackbody",
  "earth",
  "electric",
  "viridis",
  "inferno",
  "magma",
  "plasma",
  "warm",
  "rainbow-soft",
  "bathymetry",
  "cdom",
  "chlorophyll",
  "density",
  "freesurface-blue",
  "freesurface-red",
  "oxygen",
  "par",
  "phase",
  "salinity",
  "temperature",
  "turbidity",
  "velocity-blue",
  "velocity-green",
  "cubehelix",
] as const;

export const mapDTypeToMinMax = (dtype: DtypeString): [number, number] => {
  switch (dtype) {
    case "|b":
      return [0, 127];
    case "|B":
      return [0, 255];
    case "|u1":
      return [0, 255];
    case "|i1":
      return [0, 127];
    case "<i8":
      return [0, 127];
    case "<b":
      return [0, 127];
    case "<B":
      return [0, 255];
    case "<u1":
      return [0, 255];
    case "<i1":
      return [0, 127];
    case "<u2":
      return [0, 65535];
    case "<i2":
      return [0, 32767];
    case "<u4":
      return [0, 4294967295];
    case "<i4":
      return [0, 2147483647];
    case "<f4":
      return [0, 1];
    case "<f8":
      return [0, 1];
    case ">b":
      return [0, 127];
    case ">B":
      return [0, 255];
    case ">u1":
      return [0, 255];
    case ">i1":
      return [0, 127];
    case ">u2":
      return [0, 65535];
    case ">i2":
      return [0, 32767];
    case ">u4":
      return [0, 4294967295];
    case ">i4":
      return [0, 2147483647];
    case ">f4":
      return [0, 1];
    case ">f8":
      return [0, 1];
    default:
      throw new Error(`Unsupported dtype: ${dtype}`);
  }
};

export const downloadArray = async (
  data: RequestAccessMutation,
  path: string,
  selection: ArraySelection,
  abortSignal?: AbortSignal,
): Promise<ImageArray> => {
  let aws = new AwsClient({
    accessKeyId: data.requestAccess.accessKey,
    secretAccessKey: data.requestAccess.secretKey,
    sessionToken: data.requestAccess.sessionToken,
    service: "s3",
  });

  console.log(await aws.fetch(path + "/.zattrs"));

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
    promises.push(getChunkItem(aws, proj, array, path));
  }

  let chunkPairs = await Promise.all(promises);

  for (const { decodedChunk, proj } of chunkPairs) {
    out.set(proj.outSelection, decodedChunk);
  }
  let min = 0;
  let max = 0;

  let flattend = out.flatten();

  for (var i = 0; i < outSize; i++) {
    if (flattend[i] < min) {
      min = Number(flattend[i]);
    }
    if (flattend[i] > max) {
      max = Number(flattend[i]);
    }
  }

  if (out.shape.length !== 5) {
    throw Error("Anything but 5D arrays are not supported. Got" + out.shape);
  }

  const [dtypeMin, dtypeMax] = mapDTypeToMinMax(outDtype);

  return {
    shape: outShape as [number, number, number, number, number],
    min: min,
    max: max,
    nested: out,
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

export type ImageArray = {
  min: number;
  max: number;
  shape: [number, number, number, number, number];
  selection: ArraySelection;
  ySize: number;
  xSize: number;
  tSize: number;
  zSize: number;
  cSize: number;
  dtypeMin: number;
  dtypeMax: number;
  nested: NestedArray<TypedArray>;
};

export type Overwrites = {
  z?: Slice;
  t?: Slice;
  c?: Slice;
  x?: Slice;
  y?: Slice;
};

export const useImageViewDownload = () => {
  const client = useMikro();
  const fakts = Arkitekt.useFakts();

  const downloadImage = useCallback(
    async (store: ZarrStoreFragment, selection: ArraySelection) => {
      let endpoint_url = (fakts?.datalayer as any)?.endpoint_url;
      if (endpoint_url === undefined) {
        throw Error("No datalayer found");
      }

      let path = endpoint_url + "/" + store.bucket + "/" + store.key;

      let x = await client?.mutate<
        RequestAccessMutation,
        RequestAccessMutationVariables
      >({ mutation: RequestAccessDocument, variables: { store: store.id } });
      let data = x?.data;

      if (!data?.requestAccess) {
        throw Error("No credentials loaded");
      }

      return await downloadArray(data, path, selection);
    },
    [client, fakts],
  );

  const downloadView = useCallback(
    async (view: RgbViewFragment, overwrites?: Overwrites) => {
      console.log("Downloading view", view, overwrites);
      return await downloadImage(view.image.store, [
        {
          start: view?.cMin || 0,
          stop: (view?.cMax || view?.cMin || 0) + 1,
          step: 1,
          _slice: true,
        },
        overwrites?.t || {
          start: 0,
          stop: 1,
          step: 1,
          _slice: true,
        },
        overwrites?.t || {
          start: 0,
          stop: 0 + 1,
          step: 1,
          _slice: true,
        },
        ":",
        ":",
      ]);
    },
    [downloadImage],
  );

  return {
    downloadImage,
    downloadView,
  };
};

export const useImageArray = (view: RgbViewFragment) => {
  const [array, setArray] = useState<ImageArray | undefined>(undefined);

  const { downloadImage, downloadView } = useImageViewDownload();

  useEffect(() => {
    if (view.image) {
      downloadView(view)
        .then((array) => {
          console.log("Got array", array);
          setArray(array);
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      setArray(undefined);
    }
  }, [view.id]);

  return array;
};

export type FourDColour = [number, number, number, number];

export type ColorMapper = (
  value: number[],
  baseColor: FourDColour | null | undefined,
) => FourDColour;
export type BlendingFunction = (values: FourDColour[]) => FourDColour;

export const BlueMapper = (value: number[]): FourDColour => {
  return [0, 0, value[0], 255];
};

export const YellowMapper = (value: number[]): FourDColour => {
  return [255, 255, value[0], 255];
};

export const IntensityMapper = (
  value: number[],
  baseColor: FourDColour | undefined | null,
) => {
  return baseColor?.map((x) => (x * value[0]) / 255) as FourDColour;
};

export const RedMapper = (value: number[]): FourDColour => {
  return [value[0], 0, 0, 255];
};
export const GreenMapper = (value: number[]): FourDColour => {
  return [0, value[0], 0, 255];
};

export const buildOtherMapper = (map: AvailableColormap) => {
  let colors = c({
    nshades: 256,
    colormap: map,
    format: "rgba",
    alpha: 255,
  });

  return (value: number[]): FourDColour => {
    let colorIndex = value[0];
    if (colorIndex > 255) {
      colorIndex = 255;
    }
    if (colorIndex < 0) {
      colorIndex = 0;
    }
    let c = colors[colorIndex] || [255, 0, 255, 255];
    c[3] = 255;
    return c;
  };
};

export const colorMapperMap: { [key in ColorMap]: ColorMapper } = {
  BLUE: BlueMapper,
  RED: RedMapper,
  GREEN: GreenMapper,
  INFERNO: buildOtherMapper("inferno"),
  MAGMA: buildOtherMapper("magma"),
  PLASMA: buildOtherMapper("plasma"),
  VIRIDIS: buildOtherMapper("viridis"),
  INTENSITY: IntensityMapper,
};

export const AdditiveBlender = (values: FourDColour[]): FourDColour => {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 255;

  for (const [r_, g_, b_, a_] of values) {
    r = Math.min(r + r_, 255); // Ensure values do not exceed 255
    g = Math.min(g + g_, 255);
    b = Math.min(b + b_, 255);
  }

  return [r, g, b, a];
};

export const blendFunctions: { [key in Blending]: BlendingFunction } = {
  ADDITIVE: AdditiveBlender,
  MULTIPLICATIVE: AdditiveBlender,
};

export type TwoDRenderingOptions = {
  context: ListRgbContextFragment;
  t: number;
  z: number;
};

export const remapBuilder = (
  min: number,
  max: number,
): ((x: number) => number) => {
  return (val) => Math.floor((val - min) / (max - min)) * 255;
};

export type ArrayViewTuple = {
  view: RgbViewFragment;
  array: ImageArray;
};

export type ImageState = {
  id: string;
  width: number;
  height: number;
  views: ArrayViewTuple[];
};

export const useTwoDContext = (options: TwoDRenderingOptions) => {
  const [imageState, setImageState] = useState<ImageState | undefined>(
    undefined,
  );
  const [imageData, setImageData] = useState<ImageData | undefined>();
  const { downloadImage, downloadView } = useImageViewDownload();

  const downloadArrayViews = useCallback(
    async (views: RgbViewFragment[], t: number, z: number) => {
      let height: number | undefined = undefined;
      let width: number | undefined = undefined;

      let viewArrays = await Promise.all(
        views.map(async (view) => ({
          view: view,
          array: await downloadView(view, {
            t: { start: t, stop: t + 1, _slice: true, step: 1 },
            z: { start: z, stop: z + 1, _slice: true, step: 1 },
          }),
        })),
      );

      if (viewArrays.length === 0) {
        throw Error("No views found");
      }

      for (const { array } of viewArrays) {
        if (height === undefined) {
          height = array.xSize;
        } else if (height !== array.xSize) {
          throw Error("Height mismatch");
        }

        if (width === undefined) {
          width = array.ySize;
        } else if (width !== array.ySize) {
          throw Error("Width mismatch");
        }

        if (array.zSize !== 1) {
          throw Error("Z size not 1");
        }

        if (array.tSize !== 1) {
          throw Error("T size not 1");
        }

        if (array.cSize < 1) {
          throw Error("C size not equal to one");
        }

        console.log(
          "Got array",
          array.dtypeMax,
          array.dtypeMin,
          array.min,
          array.max,
        );
      }

      if (height === undefined || width === undefined) {
        throw Error("No height or width");
      }

      return {
        id: uuid4(),
        height: height,
        width: width,
        views: viewArrays,
      };
    },
    [downloadView],
  );

  useEffect(() => {
    downloadArrayViews(options.context.views, options.t, options.z)
      .then((state) => {
        setImageState(state);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [
    options.context.views.map((view) => view.id).join(","),
    options.t,
    options.z,
  ]);

  const renderImage = useCallback(
    async (imageState: ImageState, blending: Blending) => {
      if (imageState.height === undefined || imageState.width === undefined) {
        throw Error("No height or width");
      }

      console.log("Start Rendering");
      let iData = new Array(imageState.height * imageState.width * 4);
      const blendingFunction = blendFunctions[blending];

      let z = 0;
      for (let j = 0; j < imageState.height; j++) {
        for (let i = 0; i < imageState.width; i++) {
          let values: FourDColour[] = [];

          for (const { view, array } of imageState.views) {
            let arrayValues = array.nested.get([
              ":",
              0,
              0,
              j,
              i,
            ]) as NestedArray<TypedArray>;

            let channelValues: number[] = [];

            for (let c = 0; c < array.cSize; c++) {
              let val = arrayValues.get([c]) as number;
              if (view.rescale) {
                val = Math.floor(
                  ((val - array.min) / (array.max - array.min)) * 255,
                );
              } else {
                val = Math.floor(
                  ((val - array.dtypeMin) / (array.dtypeMax - array.dtypeMin)) *
                    255,
                );
              }
              channelValues.push(val);
            }

            let color = colorMapperMap[view.colorMap](
              channelValues,
              view.baseColor,
            );

            values.push(color);
          }

          let blendedColor = blendingFunction(values);
          iData[z] = blendedColor[0];
          iData[z + 1] = blendedColor[1];
          iData[z + 2] = blendedColor[2];
          iData[z + 3] = blendedColor[3];
          z += 4;
        }
      }

      console.log("Image Data Array", iData.slice(0, 100));

      const imageData = new ImageData(
        new Uint8ClampedArray(iData),
        imageState.width,
        imageState.height,
      );

      console.log("Got arrays", imageData);

      return imageData;
    },
    [downloadView],
  );

  useEffect(() => {
    if (!imageState) {
      return;
    }
    renderImage(imageState, options.context.blending).then(
      (imageData) => {
        setImageData(imageData);
      },
      (e) => {
        console.error(e);
      },
    );
  }, [imageState?.id, options.context.blending]);

  return imageData;
};

export const useViewRender = () => {};
