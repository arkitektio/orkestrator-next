import { useDatalayerEndpoint } from "@/lib/arkitekt/Arkitekt";
import {
  useRequestAccessMutation,
  ZarrStoreFragment,
} from "@/mikro-next/api/graphql";
import { S3Store } from "@/mikro-next/providers/xarray/store";
import { AwsClient } from "aws4fetch";
import { useCallback, useRef, useState } from "react";
import { Array, Chunk, DataType, get, open } from "zarrita";
import { Slice } from "../indexer";

export const useArray = (props: { store: ZarrStoreFragment }) => {
  const datalayerEndpoint = useDatalayerEndpoint();

  const [array, setArray] = useState<Array<DataType, S3Store> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const [request] = useRequestAccessMutation({
    variables: { store: props.store.id },
  });

  // Promise to track the loading process and prevent multiple simultaneous loads
  const arrayLoadPromiseRef = useRef<Promise<Array<DataType, S3Store>> | null>(
    null,
  );

  const loadArray = useCallback(async (): Promise<Array<DataType, S3Store>> => {
    // If already loading, return the existing promise
    if (arrayLoadPromiseRef.current) {
      return arrayLoadPromiseRef.current;
    }

    // If array is already loaded, return it
    if (array) {
      return array;
    }

    // Start loading
    setIsLoading(true);
    setLoadError(null);

    const loadPromise = (async () => {
      try {
        const response = await request({
          variables: { store: props.store.id },
        });

        if (!response.data?.requestAccess) {
          throw new Error("No credentials loadable");
        }

        const path =
          datalayerEndpoint + "/" + props.store.bucket + "/" + props.store.key;

        const aws = new AwsClient({
          accessKeyId: response.data.requestAccess.accessKey,
          secretAccessKey: response.data.requestAccess.secretKey,
          sessionToken: response.data.requestAccess.sessionToken,
          service: "s3",
        });

        console.log("Path", path);
        const store = new S3Store(path, aws);
        const loadedArray = await open.v3(store, { kind: "array" });

        setArray(loadedArray);
        setIsLoading(false);
        return loadedArray;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setLoadError(err);
        setIsLoading(false);
        throw err;
      } finally {
        // Clear the promise reference when done
        arrayLoadPromiseRef.current = null;
      }
    })();

    arrayLoadPromiseRef.current = loadPromise;
    return loadPromise;
  }, [
    array,
    request,
    props.store.id,
    datalayerEndpoint,
    props.store.bucket,
    props.store.key,
  ]);

  const renderView = useCallback(
    async (
      signal: AbortSignal,
      chunk_coords: number[],
      chunk_shape: number[],
      c: number,
      t: number,
      z: number,
    ) => {
      // Load array if not already loaded
      const loadedArray = await loadArray();

      const selection = [
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

      const chunk = (await get(loadedArray, selection, {
        opts: { signal: signal },
      })) as Chunk<DataType>;

      return { chunk, dtype: loadedArray.dtype };
    },
    [loadArray],
  );

  const renderSelection = useCallback(
    async (signal: AbortSignal, selection: (number | Slice | null)[]) => {
      // Load array if not already loaded
      const loadedArray = await loadArray();

      const chunk = (await get(loadedArray, selection, {
        opts: { signal: signal },
      })) as Chunk<DataType>;

      return { chunk, dtype: loadedArray.dtype };
    },
    [loadArray],
  );

  return {
    renderView,
    renderSelection,
    array,
    isLoading,
    loadError,
  };
};
