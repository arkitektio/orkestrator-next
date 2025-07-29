import { useEffect, useState } from "react";
import * as THREE from "three";
import { Chunk, DataType } from "zarrita";
import { mapDTypeToMinMax } from "./utils";
import { useFrame } from "@react-three/fiber";

const f = 2;

const isScaled = (zoom: number, xScale: number, yScale: number) => {
  const window = (1 / zoom) * f;
  return xScale == 1;
};

export const useAsyncChunk = (props: {
  renderFunc: any;
  chunk_coords: number[];
  chunk_shape: number[];
  scaleX: number;
  scaleY: number;
  imageHeight: number;
  imageWidth: number;
  c: number;
  t: number;
  z: number;
}) => {
  const [texture, setTexture] = useState<{
    texture: THREE.Texture | null;
    min: number;
    max: number;
  } | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const calculateImageData = async () => {
      const { chunk, dtype } = (await props.renderFunc(
        abortController.signal,
        props.chunk_coords,
        props.chunk_shape,
        props.c,
        props.t,
        props.z,
      )) as { chunk: Chunk<DataType>; dtype: DataType };

      let array = chunk as Chunk<DataType>;
      let textureData: ArrayBufferView;
      let format: THREE.PixelFormat;
      let type: THREE.TextureDataType;
      let [min, max] = mapDTypeToMinMax(dtype);

      if (array.data instanceof Uint8Array) {

        textureData = new Float32Array(array.data);
        format = THREE.RedFormat; // compatible single-channel format
        type = THREE.FloatType;
        min = 0;
        max = 255;
      } else if (array.data instanceof Float32Array) {
        textureData = array.data;
        format = THREE.RedFormat;
        type = THREE.FloatType;
      } else if (
        array.data instanceof Int16Array ||
        array.data instanceof Uint16Array ||
        array.data instanceof Int32Array ||
        array.data instanceof Uint32Array
      ) {
        textureData = new Float32Array(array.data);
        format = THREE.RedFormat;
        type = THREE.FloatType;
      } else {
        console.error("Unsupported data type for texture creation:", array.data);
        return; // do not proceed with unsupported type
      }

      const tex = new THREE.DataTexture(
        textureData,
        array.shape[1],
        array.shape[0],
        format,
        type,
      );

      tex.needsUpdate = true;

      setTexture({ texture: tex, min, max });
    };

    calculateImageData();

    return () => abortController.abort();
  }, [
    props.chunk_coords,
    props.chunk_shape,
    props.c,
    props.t,
    props.z,
    props.renderFunc,
  ]);

  return texture;
};
