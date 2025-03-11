import { useEffect, useState } from "react";
import * as THREE from 'three';
import { Chunk, DataType } from "zarrita";
import { mapDTypeToMinMax } from "./utils";




export const useAsyncChunk = (props: {renderFunc: any, chunk_coords: number[], chunk_shape: number[], c: number, t: number, z: number}) => {
  const [texture, setTexture] = useState<{texture: THREE.Texture | null, min: number, max: number} | null>(null);

  const calculateImageData = async (signal: AbortSignal) => {
    // Sequentially render each view to ensure proper blending

    // Fetch all ImageData objects for the views
    const {chunk, dtype} = await props.renderFunc(signal, props.chunk_coords, props.chunk_shape, props.c, props.t, props.z,) as {chunk: Chunk<DataType>, dtype: DataType};
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
