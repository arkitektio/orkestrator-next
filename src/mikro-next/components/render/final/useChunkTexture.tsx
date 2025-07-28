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
  const [render, setRender] = useState(false);

  const [texture, setTexture] = useState<{
    texture: THREE.Texture | null;
    min: number;
    max: number;
  } | null>(null);

  const calculateImageData = async (signal: AbortSignal) => {
    // Sequentially render each view to ensure proper blending

    // Fetch all ImageData objects for the views
    const { chunk, dtype } = (await props.renderFunc(
      signal,
      props.chunk_coords,
      props.chunk_shape,
      props.c,
      props.t,
      props.z,
    )) as { chunk: Chunk<DataType>; dtype: DataType };
    // Create a float32 texture
    let array = chunk as Chunk<DataType>;
    let textureData;
    let format;
    let type;

    let [dtypeMin, dtypeMax] = mapDTypeToMinMax(dtype);

    // Calculate actual min/max from the data for better normalization
    let min = dtypeMin;
    let max = dtypeMax;
    
    // For non-float types, calculate actual data range
    if (dtype !== "float32" && dtype !== "float64") {
      const data = array.data;
      let actualMin = Number.MAX_VALUE;
      let actualMax = Number.MIN_VALUE;
      
      for (let i = 0; i < data.length; i++) {
        const val = Number(data[i]);
        if (val < actualMin) actualMin = val;
        if (val > actualMax) actualMax = val;
      }
      
      // Use actual range if it's more restrictive than dtype range
      if (actualMin > dtypeMin || actualMax < dtypeMax) {
        min = actualMin;
        max = actualMax;
      }
    }


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
    } else if (array.data instanceof Uint32Array) {
      textureData = new Float32Array(array.data);
      format = THREE.RedFormat;
      type = THREE.FloatType;
    } else if (array.data instanceof Int32Array) {
      textureData = new Float32Array(array.data);
      format = THREE.RedFormat;
      type = THREE.FloatType;
    } else {
      // Handle other array types by iterating through them
      const sourceData = array.data;
      textureData = new Float32Array(sourceData.length);
      for (let i = 0; i < sourceData.length; i++) {
        textureData[i] = Number(sourceData[i]);
      }
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
    setTexture({ texture, min: min, max: max });
  };

  const shouldRender = true;

  const box_shape_3d = props.chunk_shape?.slice(3, 5);
  const box_shape = [
    box_shape_3d[0] * props.scaleX,
    box_shape_3d[1] * props.scaleY,
    1,
  ];

  // Get the position from coordinates
  const box_position_3d = props.chunk_coords.slice(3, 5);

  const xPosition =
    box_position_3d[1] * box_shape[1] + box_shape[1] / 2 - props.imageWidth / 2;
  const yPosition =
    box_position_3d[0] * box_shape[0] +
    box_shape[0] / 2 -
    props.imageHeight / 2;

  useFrame((state) => {
    if (state.camera.projectionMatrix) {
      // Convert world position to normalized device coordinates (NDC)
      const vector = new THREE.Vector3(xPosition, yPosition, 0);
      vector.project(state.camera);

      // If the vector is within the visible range (-1 to 1 for both x and y), it's in view
      const isInView =
        vector.x >= -1 &&
        vector.x <= 1 &&
        vector.y >= -1 &&
        vector.y <= 1 &&
        isScaled(state.camera.zoom, props.scaleX, props.scaleX);

      if (isInView && !render) {
        setRender(isInView);
      } else if (!isInView && render) {
        setRender(false);
      }
    }
  });

  useEffect(() => {
    if (shouldRender) {
      let abortController = new AbortController();
      
      calculateImageData(abortController.signal);

      return () => {
        abortController.abort();
      };
    } else {
      setTexture(null);
      return () => {}; // Return empty cleanup function
    }
  }, [
    props.chunk_coords,
    props.chunk_shape,
    props.c,
    props.t,
    props.z,
    shouldRender,
  ]);

  return texture;
};
