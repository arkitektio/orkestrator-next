import { useEffect, useState } from "react";
import * as THREE from "three";
import { Chunk, DataType } from "zarrita";
import { mapDTypeToMinMax } from "./utils";

export const useAsyncChunk = (props: {
  renderFunc: (
    signal: AbortSignal,
    chunk_coords: number[],
    chunk_shape: number[],
    c: number,
    t: number,
    z: number,
  ) => Promise<{ chunk: Chunk<DataType>; dtype: DataType }>;
  chunk_coords: number[];
  chunk_shape: number[];
  scaleX: number;
  scaleY: number;
  imageHeight: number;
  imageWidth: number;
  viewId: string;
  c: number;
  t: number;
  z: number;
  enableCulling?: boolean;
  shouldRender: boolean; // New parameter to control when to load texture
}) => {
  const [texture, setTexture] = useState<{
    texture: THREE.Texture | null;
    min: number;
    max: number;
  } | null>(null);

  useEffect(() => {
    // Don't render if shouldRender is false
    if (!props.shouldRender) {
      setTexture(null);
      return;
    }

    const abortController = new AbortController();

    const calculateImageData = async () => {
      try {
        const { chunk, dtype } = (await props.renderFunc(
          abortController.signal,
          props.chunk_coords,
          props.chunk_shape,
          props.c,
          props.t,
          props.z,
        )) as { chunk: Chunk<DataType>; dtype: DataType };

        if (abortController.signal.aborted) return;

        const array = chunk as Chunk<DataType>;
        let textureData: ArrayBufferView;
        let format: THREE.PixelFormat;
        let type: THREE.TextureDataType;
        let [min, max] = mapDTypeToMinMax(dtype);

        if (array.data instanceof Uint8Array) {
          textureData = new Float32Array(array.data);
          format = THREE.RedFormat;
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
        } else if (array.data instanceof Uint8ClampedArray) {
          textureData = new Float32Array(array.data);
          format = THREE.RedFormat;
          type = THREE.FloatType;
        } else if (array.data instanceof ArrayBuffer) {
          textureData = new Float32Array(array.data);
          format = THREE.RedFormat;
          type = THREE.FloatType;
        } else if (array.data instanceof Float64Array) {
          textureData = new Float32Array(array.data);
          format = THREE.RedFormat;
          type = THREE.FloatType;
        } else {
          console.error(
            "Unsupported data type for texture creation:",
            array.data,
          );
          return;
        }

        const tex = new THREE.DataTexture(
          textureData,
          array.shape[1],
          array.shape[0],
          format,
          type,
        );

        // Set filtering for smooth interpolation when zooming
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.flipY = false; // Disable Y-flipping to match image orientation
        tex.needsUpdate = true;

        if (!abortController.signal.aborted) {
          setTexture({ texture: tex, min, max });
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error loading texture:", error);
        }
      }
    };

    calculateImageData();

    return () => abortController.abort();
  }, [
    props.viewId,
    props.chunk_coords.join("-"),
    props.chunk_shape.join("-"),
    props.c,
    props.t,
    props.z,
    props.shouldRender, // Include shouldRender in dependencies
  ]);

  return texture;
};
