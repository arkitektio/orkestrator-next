import { Arkitekt, useMikro } from "@/arkitekt/Arkitekt";
import {
  ColorMap,
  RequestAccessDocument,
  RequestAccessMutation,
  RequestAccessMutationVariables,
  RgbViewFragment,
  ZarrStoreFragment
} from "@/mikro-next/api/graphql";
import { AvailableColormap } from "@/mikro-next/providers/xarray/provider";
import c from "colormap";
import { useCallback, useEffect, useState } from "react";
import { NestedArray, TypedArray } from "zarr";
import { ArraySelection, Slice } from "zarr/types/core/types";
import { DtypeString } from "zarr/types/types";
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
      return [0, 255];
    case "uint32":
      return [0, 2147483647];
    case "int8":
      return [-128, 127];
    case "int16":
      return [-32768, 32767];
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
