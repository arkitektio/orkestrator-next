import { Arkitekt, useMikro } from "@/lib/arkitekt/Arkitekt";
import { useService } from "@/arkitekt/hooks";
import {
  RequestAccessDocument,
  RequestAccessMutation,
  RequestAccessMutationVariables,
  ZarrStoreFragment,
} from "@/mikro-next/api/graphql";
import { AwsClient } from "aws4fetch";
import c from "colormap";
import React from "react";
import { open, get, Slice } from "zarrita";
import { ImageView, XArrayContext } from "./context";
import { BasicIndexer } from "./indexing";
import { S3Store } from "./store";
import { getChunkItem } from "./utils";
import { generateInstanceSegmentationColormapFormat } from "@/lib/colormap";
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
  "instance-segmentation",
] as const;

export type AvailableColormap = (typeof available_color_maps)[number];

export type ArraySelection = (number | Slice | null)[];

export const XArrayProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const client = useMikro();
  const fakts = Arkitekt.useFakts();

  const getSelectionAsImageView = async (
    zarrStore: ZarrStoreFragment,
    selection: ArraySelection,
  ) => {
    if (fakts?.datalayer?.endpoint_url === undefined) {
      throw Error("No datalayer found");
    }
    let path =
      fakts.datalayer.endpoint_url +
      "/" +
      zarrStore.bucket +
      "/" +
      zarrStore.key;

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

    let array = await open(store, { kind: "array" });

    let view = await get(array, selection);
    let imgwidth = array.shape[1];
    let imgheight = array.shape[0];

    let converted = new Array(imgwidth * imgheight);

    return {
      data: converted,
      width: imgwidth,
      height: imgheight,
      dtype: array.dtype,
      min: 0,
      max: 255,
    };
  };

  const renderImageView = async (
    view: ImageView,
    colormap: AvailableColormap,
    cmin?: number,
    cmax?: number,
    alpha?: number,
  ) => {
    let data = view.data;
    let imgwidth = view.width;
    let imgheight = view.height;
    let min = cmin || view.min;
    let max = cmax || view.max;

    let colors: [number, number, number, number][];
    
    if (colormap === "instance-segmentation") {
      // For instance segmentation, determine number of unique values in the data
      const uniqueValues = new Set(data);
      const numInstances = uniqueValues.size;
      
      // Generate colors using our HSV-based colormap
      colors = generateInstanceSegmentationColormapFormat(numInstances, 70, 90, 0);
      
      // Pad to 256 colors if needed for consistency with existing system
      while (colors.length < 256) {
        colors.push([0, 0, 0, alpha ? Math.round(alpha * 255) : 255]);
      }
      
      // Apply alpha if specified
      if (alpha !== undefined) {
        colors = colors.map(([r, g, b, _]) => [r, g, b, Math.round(alpha * 255)] as [number, number, number, number]);
      }
    } else {
      // Use existing colormap system for standard colormaps
      colors = c({
        nshades: 256,
        colormap: colormap,
        format: "rgba",
        alpha: alpha || 1,
      });
    }

    let iData = new Array(imgwidth * imgheight * 4);

    let z = 0;
    if (colormap === "instance-segmentation") {
      // For instance segmentation, map pixel values directly to color indices
      const uniqueValues = Array.from(new Set(data)).sort((a, b) => a - b);
      const valueToIndexMap = new Map(uniqueValues.map((val, idx) => [val, idx]));
      
      for (let j = 0; j < imgheight; j++) {
        for (let i = 0; i < imgwidth; i++) {
          let val = data[j * imgwidth + i];
          let colorIndex = valueToIndexMap.get(val) || 0;
          
          let color = colors[colorIndex] || [0, 0, 0, 255];

          iData[z] = color[0];
          iData[z + 1] = color[1];
          iData[z + 2] = color[2];
          iData[z + 3] = color[3];
          z += 4;
        }
      }
    } else {
      // Use existing logic for standard colormaps
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

          let color = colors[colorIndex] || [255, 0, 255, 255];

          iData[z] = color[0];
          iData[z + 1] = color[1];
          iData[z + 2] = color[2];
          iData[z + 3] = color[3];
          z += 4;
        }
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
