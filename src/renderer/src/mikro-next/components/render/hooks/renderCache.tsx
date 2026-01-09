const dbName = "RenderCacheDB";
const storeName = "renderCacheStore";
const maxCacheSize = 100; // Adjust the cache size as needed

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        const objectStore = db.createObjectStore(storeName, { keyPath: "key" });
        objectStore.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

const getObjectStore = (
  db: IDBDatabase,
  mode: IDBTransactionMode,
): IDBObjectStore => {
  const transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
};

export const addImageDataToCache = async (
  key: string,
  data: ImageData,
): Promise<void> => {
  const db = await openDB();
  const store = getObjectStore(db, "readwrite");
  const timestamp = Date.now();

  const request = store.put({ key, data, timestamp });

  return new Promise((resolve, reject) => {
    request.onsuccess = async () => {
      await enforceMaxCacheSize(store);
      resolve();
    };
    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};

export const getImageDataFromCache = async (
  key: string,
  signal: AbortSignal | undefined,
): Promise<ImageData | null> => {
  const db = await openDB();
  const store = getObjectStore(db, "readonly");

  const request = store.get(key);

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const result = (event.target as IDBRequest).result;
      if (result) {
        // Update timestamp to mark as recently used
        const writeStore = getObjectStore(db, "readwrite");
        result.timestamp = Date.now();
        writeStore.put(result);

        resolve(result.data);
      } else {
        resolve(null);
      }
    };
    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};

const enforceMaxCacheSize = async (store: IDBObjectStore): Promise<void> => {
  const request = store.index("timestamp").openCursor(null, "next");

  return new Promise((resolve, reject) => {
    const itemsToDelete: IDBValidKey[] = [];
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        itemsToDelete.push(cursor.primaryKey);
        cursor.continue();
      } else {
        if (itemsToDelete.length > maxCacheSize) {
          const excessItems = itemsToDelete.length - maxCacheSize;
          const deleteRequests = itemsToDelete
            .slice(0, excessItems)
            .map((key) => store.delete(key));
          Promise.all(deleteRequests)
            .then(() => resolve())
            .catch(reject);
        } else {
          resolve();
        }
      }
    };
    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};

export const deleteRenderCache = async (): Promise<void> => {
  const db = await openDB();
  const store = getObjectStore(db, "readwrite");
  const request = store.clear();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      console.log("Render cache cleared");
      resolve();
    };

    request.onerror = (event) => {
      console.error("Failed to clear render cache", event);
      reject((event.target as IDBRequest).error);
    };
  });
};
