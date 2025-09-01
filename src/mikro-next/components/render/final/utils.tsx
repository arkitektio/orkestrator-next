import {
  ColorMap
} from "@/mikro-next/api/graphql";
import c from "colormap";
import { NestedArray, TypedArray } from "zarr";
import { ArraySelection, Slice } from "zarr/types/core/types";
import { DataType } from "zarrita";

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

export const mapDTypeToMinMax = (dtype: DataType): [number, number] => {
  switch (dtype) {
    case "uint8":
      return [0, 255];
    case "uint16":
      return [0, 65535];
    case "uint32":
      return [0, 4294967295];
    case "int8":
      return [-128, 127];
    case "int16":
      return [0, 65535];
    case "int32":
      return [-2147483648, 2147483647];
    case "float32":
      return [0, 1];
    case "float64":
      return [0, 1];
    case "bool":
      return [0, 1];

    default:
      throw new Error(`Unsupported dtype: ${dtype}`);
  }
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

export type FourDColour = [number, number, number, number];
