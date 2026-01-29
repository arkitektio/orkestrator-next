import { Arkitekt, useMikro } from "@/app/Arkitekt";
import {
  useRequestAccessMutation,
  ZarrStoreFragment,
} from "@/mikro-next/api/graphql";
import { S3Store } from "@/mikro-next/providers/xarray/store";
import { AwsClient } from "aws4fetch";
import { IDBPDatabase, openDB } from "idb";
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

export const useCachedArray = (props: { store: ZarrStoreFragment }) => {
  const client = useMikro();
  const fakts = Arkitekt.useFakts();
  const [array, setArray] = useState<Array<DataType, S3Store> | null>(null);
  const [db, setDb] = useState<IDBPDatabase<ChunkDB> | null>(null);
  const [request, result] = useRequestAccessMutation({
    variables: { store: props.store.id },
  });

  // Database configuration
  const DB_NAME = "zarr-chunk-cache";
  const DB_VERSION = 1;
  const MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB max cache size

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await openDB<ChunkDB>(DB_NAME, DB_VERSION, {
          upgrade(db) {
            // Create object stores if they don't exist
            if (!db.objectStoreNames.contains("chunks")) {
              db.createObjectStore("chunks");
            }
            if (!db.objectStoreNames.contains("metadata")) {
              db.createObjectStore("metadata");
            }
          },
        });

        // Initialize metadata if it doesn't exist
        const tx = database.transaction("metadata", "readwrite");
        const meta = await tx.store.get("cacheInfo");
        if (!meta) {
          await tx.store.put(
            {
              lastAccessed: Date.now(),
              totalSize: 0,
            },
            "cacheInfo",
          );
        }
        await tx.done;

        setDb(database);
      } catch (error) {
        console.error("Failed to open IndexedDB:", error);
      }
    };

    initDB();

    return () => {
      // Close the database when component unmounts
      if (db) {
        db.close();
      }
    };
  }, []);

  // Initialize the Zarr array
  useEffect(() => {
    const initArray = async () => {
      try {
        const response = await request({
          variables: { store: props.store.id },
        });

        if (!response.data?.requestAccess) {
          throw Error("No credentials loadable");
        }

        let endpoint_url = (fakts?.datalayer as any)?.endpoint_url;
        let path =
          endpoint_url + "/" + props.store.bucket + "/" + props.store.key;
        let aws = new AwsClient({
          accessKeyId: response.data.requestAccess.accessKey,
          secretAccessKey: response.data.requestAccess.secretKey,
          sessionToken: response.data.requestAccess.sessionToken,
          service: "s3",
        });

        console.log("Path", path);
        let store = new S3Store(path, aws);
        let zarrArray = await open.v3(store, { kind: "array" });
        setArray(zarrArray);
        console.log("Zarr array initialized");
      } catch (error) {
        console.error("Failed to initialize Zarr array:", error);
      }
    };

    initArray();
  }, [props.store, fakts?.datalayer, request]);

  // Create a unique cache key for each chunk
  const createCacheKey = (
    c: number,
    t: number,
    z: number,
    yStart: number,
    yStop: number,
    xStart: number,
    xStop: number,
  ) => {
    return `${props.store.id}_c${c}_t${t}_z${z}_y${yStart}-${yStop}_x${xStart}-${xStop}`;
  };

  // Update metadata and manage cache size
  const updateMetadata = useCallback(
    async (sizeChange: number) => {
      if (!db) return;

      const tx = db.transaction("metadata", "readwrite");
      const meta = (await tx.store.get("cacheInfo")) || {
        lastAccessed: Date.now(),
        totalSize: 0,
      };

      meta.lastAccessed = Date.now();
      meta.totalSize += sizeChange;

      await tx.store.put(meta, "cacheInfo");
      await tx.done;

      // Check if we need to clean up old chunks
      if (meta.totalSize > MAX_CACHE_SIZE) {
        await cleanupOldChunks();
      }
    },
    [db],
  );

  // Clean up old chunks when cache gets too large
  const cleanupOldChunks = useCallback(async () => {
    if (!db) return;

    console.log("Cleaning up old chunks...");

    // Get all chunks with timestamps
    const tx = db.transaction("chunks", "readwrite");
    const keys = await tx.store.getAllKeys();
    const chunks = await Promise.all(
      keys.map(async (key) => {
        const chunk = await tx.store.get(key);
        return { key, timestamp: chunk.timestamp, size: chunk.data.byteLength };
      }),
    );

    // Sort by timestamp (oldest first)
    chunks.sort((a, b) => a.timestamp - b.timestamp);

    // Delete oldest chunks until we're under 80% of max size
    let currentSize = (await db.get("metadata", "cacheInfo"))?.totalSize || 0;
    let targetSize = MAX_CACHE_SIZE * 0.8;
    let freedSize = 0;

    for (const chunk of chunks) {
      if (currentSize - freedSize <= targetSize) break;

      await tx.store.delete(chunk.key);
      freedSize += chunk.size;
      console.log(`Deleted old chunk ${chunk.key}, freed ${chunk.size} bytes`);
    }

    await tx.done;

    // Update metadata
    const metaTx = db.transaction("metadata", "readwrite");
    const meta = await metaTx.store.get("cacheInfo");
    if (meta) {
      meta.totalSize -= freedSize;
      await metaTx.store.put(meta, "cacheInfo");
    }
    await metaTx.done;

    console.log(`Cleanup complete. Freed ${freedSize} bytes.`);
  }, [db]);

  // Get array details like min/max for a chunk
  const getArrayStats = (data: TypedArray): { min: number; max: number } => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }

    return { min, max };
  };

  // Estimate size of a typed array in bytes
  const getArraySize = (data: TypedArray): number => {
    return data.byteLength;
  };

  // Main renderView function with database caching
  const renderView = useCallback(
    async (
      chunk_coords: number[],
      chunk_shape: number[],
      c: number,
      t: number,
      z: number,
    ) => {
      if (!array) {
        throw Error("No array available");
      }

      const yStart = chunk_coords[3] * chunk_shape[3];
      const yStop = (chunk_coords[3] + 1) * chunk_shape[3];
      const xStart = chunk_coords[4] * chunk_shape[4];
      const xStop = (chunk_coords[4] + 1) * chunk_shape[4];

      // Create a unique key for this chunk
      const cacheKey = createCacheKey(c, t, z, yStart, yStop, xStart, xStop);

      try {
        // Try to get from IndexedDB first
        if (db) {
          const cachedChunk = await db.get("chunks", cacheKey);

          if (cachedChunk) {
            console.log(`Cache hit for ${cacheKey}`);

            // Update last accessed time
            await db.put(
              "chunks",
              {
                ...cachedChunk,
                timestamp: Date.now(),
              },
              cacheKey,
            );

            // Return the cached chunk
            return {
              chunk: { data: cachedChunk.data },
              dtype: cachedChunk.dtype,
              min: cachedChunk.min,
              max: cachedChunk.max,
              texture: null, // Texture needs to be created by the rendering component
            };
          }
        }

        // Cache miss, fetch from source
        console.log(`Cache miss for ${cacheKey}, fetching data...`);

        const selection = [
          c,
          t,
          z,
          { start: yStart, stop: yStop, step: 1 },
          { start: xStart, stop: xStop, step: 1 },
        ];

        console.log("Selection", selection);
        const chunk = (await get(array, selection)) as Chunk<DataType>;
        const { min, max } = getArrayStats(chunk.data as TypedArray);

        // Store in IndexedDB for future use
        if (db) {
          const chunkSize = getArraySize(chunk.data as TypedArray);

          await db.put(
            "chunks",
            {
              data: chunk.data,
              dtype: array.dtype,
              min,
              max,
              timestamp: Date.now(),
            },
            cacheKey,
          );

          // Update metadata with new size
          await updateMetadata(chunkSize);
        }

        return {
          chunk,
          dtype: array.dtype,
          min,
          max,
          texture: null,
        };
      } catch (error) {
        console.error(`Error fetching chunk ${cacheKey}:`, error);
        throw error;
      }
    },
    [array, db, updateMetadata],
  );

  // Function to clear the entire cache
  const clearCache = useCallback(async () => {
    if (!db) return;

    try {
      console.log("Clearing chunk cache...");

      // Clear chunks store
      await db.clear("chunks");

      // Reset metadata
      const tx = db.transaction("metadata", "readwrite");
      await tx.store.put(
        {
          lastAccessed: Date.now(),
          totalSize: 0,
        },
        "cacheInfo",
      );
      await tx.done;

      console.log("Cache cleared successfully");
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }, [db]);

  // Function to get cache stats
  const getCacheStats = useCallback(async () => {
    if (!db) return null;

    try {
      const meta = await db.get("metadata", "cacheInfo");
      const keys = await db.getAllKeys("chunks");

      return {
        totalSize: meta?.totalSize || 0,
        chunkCount: keys.length,
        lastAccessed: meta?.lastAccessed || 0,
      };
    } catch (error) {
      console.error("Error getting cache stats:", error);
      return null;
    }
  }, [db]);

  return {
    renderView,
    array,
    clearCache,
    getCacheStats,
  };
};
