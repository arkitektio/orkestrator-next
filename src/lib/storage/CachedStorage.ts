import { AbsolutePath, AsyncReadable, RangeQuery } from "@zarrita/storage";

interface CacheEntry {
  data: Uint8Array;
  timestamp: number;
  expiresAt: number;
}

interface LocalStorageCacheEntry {
  data: string; // base64 encoded
  timestamp: number;
  expiresAt: number;
}

/**
 * A caching wrapper for storage implementations that provides:
 * - Result caching with expiration
 * - Prevention of duplicate concurrent fetches
 * - localStorage caching for small items with 1-day expiration
 * - IndexedDB caching for larger items
 */
export class CachedStorage<Options = unknown>
  implements AsyncReadable<Options>
{
  private storage: AsyncReadable<Options>;
  protected memoryCache: Map<string, CacheEntry> = new Map();
  private pendingRequests: Map<string, Promise<Uint8Array | undefined>> =
    new Map();
  protected dbName: string;
  protected storeName: string;
  private maxLocalStorageSize: number;
  private cacheExpirationMs: number;

  constructor(
    storage: AsyncReadable<Options>,
    options: {
      dbName?: string;
      storeName?: string;
      maxLocalStorageSize?: number; // Max size in bytes for localStorage
      cacheExpirationMs?: number; // Cache expiration in milliseconds
    } = {},
  ) {
    this.storage = storage;
    this.dbName = options.dbName || "zarrita-cache-db";
    this.storeName = options.storeName || "cache-store";
    this.maxLocalStorageSize = options.maxLocalStorageSize || 64 * 1024; // 64KB default
    this.cacheExpirationMs = options.cacheExpirationMs || 24 * 60 * 60 * 1000; // 1 day default
  }

  protected generateCacheKey(key: AbsolutePath, opts?: Options): string {
    const optsHash = opts ? JSON.stringify(opts) : "";
    return `${key}::${optsHash}`;
  }

  protected generateRangeCacheKey(
    key: AbsolutePath,
    range: RangeQuery,
    opts?: Options,
  ): string {
    const rangeHash = JSON.stringify(range);
    const optsHash = opts ? JSON.stringify(opts) : "";
    return `${key}::range::${rangeHash}::${optsHash}`;
  }

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.cacheExpirationMs;
  }

  private async getFromLocalStorage(
    cacheKey: string,
  ): Promise<Uint8Array | null> {
    try {
      const cached = localStorage.getItem(`zarrita_cache_${cacheKey}`);
      if (!cached) return null;

      const entry: LocalStorageCacheEntry = JSON.parse(cached);
      if (this.isExpired(entry.timestamp)) {
        localStorage.removeItem(`zarrita_cache_${cacheKey}`);
        return null;
      }

      // Decode base64 to Uint8Array
      const binaryString = atob(entry.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch (error) {
      console.warn("Failed to get from localStorage:", error);
      return null;
    }
  }

  private async setToLocalStorage(
    cacheKey: string,
    data: Uint8Array,
  ): Promise<void> {
    try {
      // Only cache small items in localStorage
      if (data.length > this.maxLocalStorageSize) return;

      // Encode Uint8Array to base64
      const binaryString = Array.from(data, (byte) =>
        String.fromCharCode(byte),
      ).join("");
      const base64Data = btoa(binaryString);

      const entry: LocalStorageCacheEntry = {
        data: base64Data,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.cacheExpirationMs,
      };

      localStorage.setItem(`zarrita_cache_${cacheKey}`, JSON.stringify(entry));
    } catch (error) {
      // localStorage might be full or disabled
      console.warn("Failed to set to localStorage:", error);
    }
  }

  protected async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (event.oldVersion < 1) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: "key",
          });
          store.createIndex("timestamp", "timestamp");
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async getFromIndexedDB(cacheKey: string): Promise<Uint8Array | null> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);

      return new Promise((resolve) => {
        const request = store.get(cacheKey);

        request.onsuccess = () => {
          if (request.result) {
            const entry: CacheEntry = request.result;
            if (this.isExpired(entry.timestamp)) {
              // Clean up expired entry
              this.deleteFromIndexedDB(cacheKey);
              resolve(null);
            } else {
              resolve(entry.data);
            }
          } else {
            resolve(null);
          }
        };

        request.onerror = () => {
          console.warn("Failed to get from IndexedDB:", request.error);
          resolve(null);
        };
      });
    } catch (error) {
      console.warn("Failed to access IndexedDB:", error);
      return null;
    }
  }

  private async setToIndexedDB(
    cacheKey: string,
    data: Uint8Array,
  ): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);

      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.cacheExpirationMs,
      };

      return new Promise((resolve) => {
        const request = store.put({ key: cacheKey, ...entry });

        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.warn("Failed to set to IndexedDB:", request.error);
          resolve(); // Don't fail the main operation
        };
      });
    } catch (error) {
      console.warn("Failed to access IndexedDB:", error);
    }
  }

  private async deleteFromIndexedDB(cacheKey: string): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);

      return new Promise((resolve) => {
        const request = store.delete(cacheKey);
        request.onsuccess = () => resolve();
        request.onerror = () => resolve(); // Don't fail if deletion fails
      });
    } catch (error) {
      console.warn("Failed to delete from IndexedDB:", error);
    }
  }

  private async getCachedData(cacheKey: string): Promise<Uint8Array | null> {
    // 1. Check memory cache first (fastest)
    const memoryEntry = this.memoryCache.get(cacheKey);
    if (memoryEntry && !this.isExpired(memoryEntry.timestamp)) {
      return memoryEntry.data;
    }

    // 2. Check localStorage for small items
    const localStorageData = await this.getFromLocalStorage(cacheKey);
    if (localStorageData) {
      // Update memory cache
      this.memoryCache.set(cacheKey, {
        data: localStorageData,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.cacheExpirationMs,
      });
      return localStorageData;
    }

    // 3. Check IndexedDB for larger items
    const indexedDBData = await this.getFromIndexedDB(cacheKey);
    if (indexedDBData) {
      // Update memory cache
      this.memoryCache.set(cacheKey, {
        data: indexedDBData,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.cacheExpirationMs,
      });
      return indexedDBData;
    }

    return null;
  }

  private async setCachedData(
    cacheKey: string,
    data: Uint8Array,
  ): Promise<void> {
    const now = Date.now();

    // Always update memory cache
    this.memoryCache.set(cacheKey, {
      data,
      timestamp: now,
      expiresAt: now + this.cacheExpirationMs,
    });

    // Store in localStorage if small enough
    if (data.length <= this.maxLocalStorageSize) {
      await this.setToLocalStorage(cacheKey, data);
    } else {
      // Store in IndexedDB for larger items
      await this.setToIndexedDB(cacheKey, data);
    }
  }

  async get(
    key: AbsolutePath,
    opts?: Options,
  ): Promise<Uint8Array | undefined> {
    const cacheKey = this.generateCacheKey(key, opts);

    // Check cache first
    const cachedData = await this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Check if there's already a pending request for this key
    const pendingRequest = this.pendingRequests.get(cacheKey);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Create a new request
    const request = this.fetchAndCache(key, cacheKey, opts);
    this.pendingRequests.set(cacheKey, request);

    try {
      const result = await request;
      return result;
    } finally {
      // Remove from pending requests when done
      this.pendingRequests.delete(cacheKey);
    }
  }

  private async fetchAndCache(
    key: AbsolutePath,
    cacheKey: string,
    opts?: Options,
  ): Promise<Uint8Array | undefined> {
    try {
      const result = await this.storage.get(key, opts);

      if (result) {
        // Cache the result
        await this.setCachedData(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.warn(`Failed to fetch key ${key}:`, error);
      throw error;
    }
  }

  async getRange?(
    key: AbsolutePath,
    range: RangeQuery,
    opts?: Options,
  ): Promise<Uint8Array | undefined> {
    if (!this.storage.getRange) {
      throw new Error("Underlying storage does not support range queries");
    }

    const cacheKey = this.generateRangeCacheKey(key, range, opts);

    // Check cache first
    const cachedData = await this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Check if there's already a pending request for this range
    const pendingRequest = this.pendingRequests.get(cacheKey);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Create a new request
    const request = this.fetchRangeAndCache(key, range, cacheKey, opts);
    this.pendingRequests.set(cacheKey, request);

    try {
      const result = await request;
      return result;
    } finally {
      // Remove from pending requests when done
      this.pendingRequests.delete(cacheKey);
    }
  }

  private async fetchRangeAndCache(
    key: AbsolutePath,
    range: RangeQuery,
    cacheKey: string,
    opts?: Options,
  ): Promise<Uint8Array | undefined> {
    try {
      const result = await this.storage.getRange!(key, range, opts);

      if (result) {
        // Cache the result
        await this.setCachedData(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.warn(`Failed to fetch range for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all caches (memory, localStorage, and IndexedDB)
   */
  async clearCache(): Promise<void> {
    // Clear memory cache
    this.memoryCache.clear();

    // Clear localStorage cache
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("zarrita_cache_")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Clear IndexedDB cache
    try {
      const db = await this.openDB();
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);

      return new Promise((resolve) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => resolve(); // Don't fail if clear fails
      });
    } catch (error) {
      console.warn("Failed to clear IndexedDB cache:", error);
    }
  }

  /**
   * Invalidate a specific cache key
   */
  async invalidateCacheKey(cacheKey: string): Promise<void> {
    // Remove from memory cache
    this.memoryCache.delete(cacheKey);

    // Remove from localStorage
    try {
      localStorage.removeItem(`zarrita_cache_${cacheKey}`);
    } catch (error) {
      console.warn("Failed to remove from localStorage:", error);
    }

    // Remove from IndexedDB
    try {
      const db = await this.openDB();
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);

      return new Promise((resolve) => {
        const request = store.delete(cacheKey);
        request.onsuccess = () => resolve();
        request.onerror = () => resolve(); // Don't fail if deletion fails
      });
    } catch (error) {
      console.warn("Failed to remove from IndexedDB:", error);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    memoryCacheSize: number;
    pendingRequestsCount: number;
  } {
    return {
      memoryCacheSize: this.memoryCache.size,
      pendingRequestsCount: this.pendingRequests.size,
    };
  }
}
