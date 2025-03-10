import { Arkitekt, useMikro } from "@/arkitekt/Arkitekt";
import {
  AccessCredentialsFragment,
  useRequestAccessMutation,
  ZarrStoreFragment
} from "@/mikro-next/api/graphql";
import { S3Store } from "@/mikro-next/providers/xarray/store";
import { AwsClient } from "aws4fetch";
import { useCallback, useEffect, useState } from "react";
import * as THREE from 'three';
import { ArraySelection, Slice } from "zarr/types/core/types";
import { Array, Chunk, DataType, get, open } from "zarrita";
import { colorMapperMap, mapDTypeToMinMax } from "./utils";
import { c } from "node_modules/@udecode/plate-emoji/dist/IndexSearch-Dvqq913n";

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
  chunk_coords: number[],
  chunk_shape: number[],
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

  // multiple chunk_coords by chunk_shape and add them to the selection
let selection: ArraySelection = {
    chunks: chunk_shape,
    slices: chunk_coords,
};
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
    array: Chunk<DataType>,
    dTypeMin: number,
    xSize : number,
        ySize: number,
        cSize: number,
    dTypeMax: number,
    rescale: boolean,
    colorMap: string,
    baseColor: [number, number, number, number],
) => {
  let min = 0;
  let max = 0;

  if (rescale) {
    let flattend = array.data;

    for (var i = 0; i < flattend.length; i++) {
      if (flattend[i] < min) {
        min = Number(flattend[i]);
      }
      if (flattend[i] > max) {
        max = Number(flattend[i]);
      }
    }
  } else {
    min = dTypeMin;
    max = dTypeMax;
  }

  let mapper = colorMapperMap[colorMap];

  let iData = new Uint8ClampedArray(xSize * ySize * 4);

  let z = 0;

  for (let j = 0; j < ySize; j++) {
    for (let i = 0; i < xSize; i++) {
      let channelValues: number[] = [];

      for (let c = 0; c < cSize; c++) {
        let val =
          array.data[
            i + j * xSize + c * xSize * ySize
          ];
        val = Math.floor(((val - min) / (max - min)) * 255);
        channelValues.push(val);
      }

      let color = mapper(channelValues, baseColor);
      iData[z] = color[0];
      iData[z + 1] = color[1];
      iData[z + 2] = color[2];
      iData[z + 3] = color[3];
      z += 4;
    }
  }

  return new ImageData(iData, xSize, ySize);
};



export const slicesToString = (slice: Slice[]): string => {
  return slice.map((x) => x.start + ":" + x.stop).join(",");
};

export const renderView = async (
  credentials: AccessCredentialsFragment,
  datalayerUrl: string,
  chunk_coords: number[],
  chunk_shape: number[],
  store: ZarrStoreFragment,
  abortSignal?: AbortSignal,
): Promise<ImageData> => {

  let selection = await downloadSelectionFromStore(
    credentials,
    datalayerUrl,
    store,
    abortSignal,
  );

  return await renderSelection(selection);
};

const downloadView = async (
  fakts: any,
  credentials: AccessCredentialsFragment,
  chunk_coords: Slice[],
  chunk_shape: Slice[],
  store: ZarrStoreFragment,
) => {
  let endpoint_url = (fakts?.datalayer as any)?.endpoint_url;

  return await renderView(
    credentials,
    endpoint_url,
    chunk_coords,
    chunk_shape,
    store,
  );
};








export const useArray = (props: {store: ZarrStoreFragment}) => {
  
  const client = useMikro();
  const fakts = Arkitekt.useFakts();

  const [array, setArray] = useState<Array<DataType, S3Store> | null>(null);




  const [request, result] = useRequestAccessMutation({
    variables: { store: props.store.id }
  });


    useEffect(() => {
        request({
            variables: { store: props.store.id }
        }).then(async (x) => {
            if (!x.data?.requestAccess) {
                throw Error("No credentials loadable");

            }

            let endpoint_url = (fakts?.datalayer as any)?.endpoint_url;
            let path = endpoint_url + "/" + props.store.bucket + "/" + props.store.key;


            let aws = new AwsClient({
                accessKeyId: x.data?.requestAccess.accessKey,
                secretAccessKey: x.data?.requestAccess.secretKey,
                sessionToken: x.data?.requestAccess.sessionToken,
                service: "s3",
              });
            
              console.log("Path", path);
              let store = new S3Store(path, aws);
            
            let array = await open.v3(store, { kind: "array" });
            setArray(array);
        });

    }, [props.store, fakts.datalayer, request]);





  const renderView = useCallback(
    async (
      chunk_coords: number[],
      chunk_shape: number[],
      c: number,
      t: number,
      z: number,
    ) => {

     if (!array) {
        throw Error("No credentials loaded");
     }

    let selection = [
       c,
       t,
       z,
       {start: chunk_coords[3] * chunk_shape[3], stop: (chunk_coords[3] + 1) * chunk_shape[3], step: 1},
       {start: chunk_coords[4] * chunk_shape[4], stop: (chunk_coords[4] + 1) * chunk_shape[4], step: 1},
    ];

      console.log("Selection", selection);




      let chunk = await get(array, selection) as Chunk<DataType>;

      return { chunk, dtype: array.dtype };
      
        
    },
    [array],
  );

  return {
    renderView,
    array
    
  };
};




export const useAsyncChunk = (props: {renderFunc: any, chunk_coords: number[], chunk_shape: number[], c: number, t: number, z: number}) => {
  const [texture, setTexture] = useState<{texture: THREE.Texture | null, min: number, max: number} | null>(null);

  const calculateImageData = async (signal: AbortSignal) => {
    // Sequentially render each view to ensure proper blending

    // Fetch all ImageData objects for the views
    const {chunk, dtype} = await props.renderFunc(props.chunk_coords, props.chunk_shape, props.c, props.t, props.z) as {chunk: Chunk<DataType>, dtype: DataType};
    // Create a float32 texture
    let array = chunk as Chunk<DataType>;
    let textureData;
    let format;
    let type;

    let [min, max] = mapDTypeToMinMax(dtype);

    if (chunk.data instanceof Uint8Array) {
      textureData = array.data;
      format = THREE.RedFormat;
      type = THREE.UnsignedByteType;
      min = 0;
      max = 1;
    } else if (array.data instanceof Float32Array) {
      textureData = array.data;
      format = THREE.RedFormat;
      type = THREE.FloatType;
    
    } else if (array.data instanceof Int16Array) {
      textureData = new Float32Array(array.data);
      format = THREE.RedFormat;
      type = THREE.FloatType;
    } else if (array.data instanceof Uint16Array) {
      textureData = new Float32Array(array.data);
      format = THREE.RedFormat;
      type = THREE.FloatType;
    } else {
      textureData = new Float32Array(array.data);
      format = THREE.RedFormat;
      type = THREE.FloatType;
    }

    const texture = new THREE.DataTexture(
      textureData,
      array.shape[1],
      array.shape[0],
      format,
      type,
    );

    texture.needsUpdate = true;
    console.log("RESEEÉ")
    setTexture({texture, min: min, max: max, });
  };

  useEffect(() => {
    let abortController = new AbortController();
    console.log("Rendering chunk", props.chunk_coords, props.chunk_shape, props.c, props.t, props.z);
    calculateImageData(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [props.chunk_coords, props.chunk_shape, props.c, props.t, props.z]);

  return texture;
};
