import { AwsClient } from "aws4fetch";
import c from "colormap";
import React from "react";
import { NestedArray, ZarrArray, openGroup } from "zarr";
import { ArraySelection } from "zarr/types/core/types";
import { ImageView, XArrayContext } from "./context";
import { BasicIndexer } from "./indexing";
import { S3Store } from "./store";
import { getChunkItem } from "./utils";
import { useMikroNext, withMikroNext } from "@jhnnsrs/mikro-next";
import {
  RequestAccessDocument,
  RequestAccessMutation,
  RequestAccessMutationVariables,
  ZarrStoreFragment,
} from "@/mikro-next/api/graphql";
import { useDatalayer } from "@jhnnsrs/datalayer";
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

export type AvailableColormap = (typeof available_color_maps)[number];

export const XArrayProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const { client } = useMikroNext();
  const { s3resolve } = useDatalayer();

  const getSelectionAsImageView = async (
    zarrStore: ZarrStoreFragment,
    selection: ArraySelection,
  ) => {
    let path = s3resolve(zarrStore.bucket + "/" + zarrStore.key);

    let x = await client?.mutate<
      RequestAccessMutation,
      RequestAccessMutationVariables
    >({ mutation: RequestAccessDocument, variables: { store: zarrStore.id } });
    let data = x?.data;

    if (!data?.requestAccess) {
      throw Error("No credentials loaded");
    }

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
    if (outShape.length !== 2) {
      throw Error(
        `Only 2D selections are supported, got ${outShape.length}D selection.`,
      );
    }
    if (outShape[0] * outShape[1] > 4000 * 4000) {
      throw Error(
        `Selection is too large, got ${outShape[0]}x${outShape[1]} pixels.`,
      );
    }

    const outDtype = array.dtype;
    const outSize = indexer.shape.reduce((x, y) => x * y, 1);

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
    let imgwidth = out.shape[1];
    let imgheight = out.shape[0];

    let converted = new Array(imgwidth * imgheight);

    for (var i = 0; i < imgwidth * imgheight; i++) {
      converted[i] = Number(flattend[i]);
      if (flattend[i] < min) {
        min = Number(flattend[i]);
      }
      if (flattend[i] > max) {
        max = Number(flattend[i]);
      }
    }
    return {
      data: converted,
      width: imgwidth,
      height: imgheight,
      dtype: outDtype,
      min: min,
      max: max,
    };
  };

  const renderImageView = async (
    view: ImageView,
    colormap: AvailableColormap,
    cmin?: number,
    cmax?: number,
  ) => {
    let data = view.data;
    let imgwidth = view.width;
    let imgheight = view.height;
    let min = cmin || view.min;
    let max = cmax || view.max;

    let colors = c({
      nshades: 256,
      colormap: colormap,
      format: "rgba",
      alpha: 255,
    });

    let iData = new Array(imgwidth * imgheight * 4);

    let z = 0;
    for (let j = 0; j < imgheight; j++) {
      for (let i = 0; i < imgwidth; i++) {
        let val = data[j * imgwidth + i];
        let colorIndex = Math.floor(((val - min) / max) * 255);
        if (colorIndex > 255) {
          colorIndex = 255;
        }
        if (colorIndex < 0) {
          colorIndex = 0;
        }
        //console.log((val / max) * 255);

        let color = colors[colorIndex] || [255, 0, 255, 255];

        iData[z] = color[0];
        iData[z + 1] = color[1];
        iData[z + 2] = color[2];
        iData[z + 3] = 255;
        z += 4;
      }
    }

    return new ImageData(new Uint8ClampedArray(iData), imgwidth, imgheight);
  };

  const failureFunc = async (...args: any[]): Promise<any> => {
    console.log("No Postman Provider", args);
    throw Error("No Postman Provider");
  };

  return (
    <XArrayContext.Provider
      value={{
        getSelectionAsImageData: failureFunc,
        getSelectionAsImageView,
        renderImageView,
      }}
    >
      {props.children}
    </XArrayContext.Provider>
  );
};
