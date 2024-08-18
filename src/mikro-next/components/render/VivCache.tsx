export class LRUIndexedDBCache {
  private dbName: string;
  private storeName: string;
  private maxSize: number;

  constructor(
    dbName: string = "s3-cache-db",
    storeName: string = "items",
    maxSize: number = 100,
  ) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.maxSize = maxSize;
  }

  generateKey(url: string, item: any): string {
    return `${url}:::${JSON.stringify(item)}`;
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (event.oldVersion < 1) {
          db.createObjectStore(this.storeName, { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async getDBTransaction(
    storeName: string,
    mode: IDBTransactionMode,
  ): Promise<IDBObjectStore> {
    const db = await this.openDB();
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  async get(key: string): Promise<any | undefined> {
    const store = await this.getDBTransaction(this.storeName, "readonly");
    return new Promise((resolve, reject) => {
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result) {
          this.updateAccessTime(key); // Update access time for LRU
          resolve(request.result.value);
        } else {
          resolve(undefined);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async set(key: string, value: any): Promise<void> {
    const store = await this.getDBTransaction(this.storeName, "readwrite");
    return new Promise(async (resolve, reject) => {
      const countRequest = store.count();

      countRequest.onsuccess = async () => {
        if (countRequest.result >= this.maxSize) {
          await this.evict(store);
        }

        const putRequest = store.put({ key, value, timestamp: Date.now() });

        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };

      countRequest.onerror = () => reject(countRequest.error);
    });
  }

  async delete(key: string): Promise<void> {
    const store = await this.getDBTransaction(this.storeName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    const store = await this.getDBTransaction(this.storeName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async evict(store: IDBObjectStore): Promise<void> {
    return new Promise((resolve, reject) => {
      const index = store.index("timestamp");
      const request = index.openCursor();

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async updateAccessTime(key: string): Promise<void> {
    const store = await this.getDBTransaction(this.storeName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result) {
          const data = request.result;
          data.timestamp = Date.now();
          store.put(data);
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}
