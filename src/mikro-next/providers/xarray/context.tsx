import { ZarrStoreFragment } from "@/mikro-next/api/graphql";
import React, { useContext } from "react";
import { ArraySelection } from "zarr/types/core/types";
import { DtypeString } from "zarr/types/types";
import { AvailableColormap } from "./provider";

export type ImageView = {
  data: Array<number>;
  height: number;
  width: number;
  dtype: DtypeString;
  min: number;
  max: number;
};

export type XArrayContextType = {
  getSelectionAsImageData: (
    zarrStore: ZarrStoreFragment,
    selection: ArraySelection,
    colormap: AvailableColormap,
  ) => Promise<ImageData>;
  getSelectionAsImageView: (
    zarrStore: ZarrStoreFragment,
    selection: ArraySelection,
  ) => Promise<ImageView>;
  renderImageView: (
    view: ImageView,
    colormap: AvailableColormap,
    cmin?: number,
    cmax?: number,
    alpha?: number,
  ) => Promise<ImageData>;
};

export const XArrayContext = React.createContext<XArrayContextType>({
  getSelectionAsImageData: async () => {
    return null as unknown as ImageData;
  },
  getSelectionAsImageView: async () => {
    return null as unknown as ImageView;
  },
  renderImageView: async () => {
    return null as unknown as ImageData;
  },
});

export const useXarray = () => useContext(XArrayContext);
