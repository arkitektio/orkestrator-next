import { useEffect, useState } from "react";
import * as THREE from "three";
import { Chunk, DataType } from "zarrita";
import { mapDTypeToMinMax } from "./utils";
import { useChunkCulling, ChunkBounds } from "./useViewportCulling";

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
}) => {
  const [texture, setTexture] = useState<{
    texture: THREE.Texture | null;
    min: number;
    max: number;
  } | null>(null);

  // Calculate chunk bounds for viewport culling - must match ChunkMesh positioning logic
  const box_shape_3d = props.chunk_shape?.slice(3, 5) || [0, 0];
  const baseChunkWidth = box_shape_3d[1];
  const baseChunkHeight = box_shape_3d[0];
  const scaledWidth = baseChunkWidth * props.scaleX;
  const scaledHeight = baseChunkHeight * props.scaleY;

  const box_position_3d = props.chunk_coords.slice(3, 5);

  const chunkBounds: ChunkBounds = {
    x:
      box_position_3d[1] * scaledWidth + scaledWidth / 2 - props.imageWidth / 2,
    y:
      box_position_3d[0] * scaledHeight +
      scaledHeight / 2 -
      props.imageHeight / 2,
    width: scaledWidth,
    height: scaledHeight,
  };

  // Use viewport culling if enabled
  const cullingResult = useChunkCulling(
    chunkBounds,
    props.scaleX,
    props.imageWidth,
    props.imageHeight,
  );

  const shouldRender = true;

  useEffect(() => {
    // Don't render if culling is enabled and chunk should not be rendered
    if (!shouldRender) {
      setTexture(null);
      return;
    }

    console.log(
      "Rendering chunk with coords",
      props.chunk_coords,
      "shouldRender:",
      shouldRender,
    );
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
    shouldRender, // Include shouldRender in dependencies
  ]);

  return texture;
};
