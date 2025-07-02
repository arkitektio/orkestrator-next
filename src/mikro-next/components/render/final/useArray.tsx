import { useDatalayerEndpoint, useMikro } from "@/lib/arkitekt/Arkitekt";
import {
  useRequestAccessMutation,
  ZarrStoreFragment,
} from "@/mikro-next/api/graphql";
import { S3Store } from "@/mikro-next/providers/xarray/store";
import { AwsClient } from "aws4fetch";
import { useCallback, useEffect, useState } from "react";
import { Array, Chunk, DataType, get, open } from "zarrita";

// Define the database schema
interface ChunkDB {
  chunks: {
    key: string;
    value: {
      data: ArrayBuffer | TypedArray;
      dtype: string;
      min: number;
      max: number;
      timestamp: number;
    };
  };
  metadata: {
    key: string;
    value: {
      lastAccessed: number;
      totalSize: number;
    };
  };
}

// TypedArray is a union of all typed array types
type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

export const useArray = (props: { store: ZarrStoreFragment }) => {
  const client = useMikro();
  const datalayerEndpoint = useDatalayerEndpoint();

  const [array, setArray] = useState<Array<DataType, S3Store> | null>(null);

  const [request, result] = useRequestAccessMutation({
    variables: { store: props.store.id },
  });

  useEffect(() => {
    request({
      variables: { store: props.store.id },
    }).then(async (x) => {
      if (!x.data?.requestAccess) {
        throw Error("No credentials loadable");
      }

      let path =
        datalayerEndpoint + "/" + props.store.bucket + "/" + props.store.key;

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
  }, [props.store, datalayerEndpoint, request]);

  const renderView = useCallback(
    async (
      signal: AbortSignal,
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
        {
          start: chunk_coords[3] * chunk_shape[3],
          stop: (chunk_coords[3] + 1) * chunk_shape[3],
          step: 1,
        },
        {
          start: chunk_coords[4] * chunk_shape[4],
          stop: (chunk_coords[4] + 1) * chunk_shape[4],
          step: 1,
        },
      ];

      console.log("Selection", selection);

      let chunk = (await get(array, selection, {
        opts: { signal: signal },
      })) as Chunk<DataType>;

      return { chunk, dtype: array.dtype };
    },
    [array],
  );

  return {
    renderView,
    array,
  };
};
