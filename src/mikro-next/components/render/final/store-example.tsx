import { AwsClient } from "aws4fetch";
import { S3Store } from "./store";

// Example usage of the enhanced S3Store with caching and async locking

async function demonstrateEnhancedStore() {
  // Create AWS client
  const aws = new AwsClient({
    accessKeyId: "your-access-key",
    secretAccessKey: "your-secret-key",
    service: "s3",
  });

  // Create S3Store with custom cache size
  const store = new S3Store("https://your-bucket.s3.amazonaws.com/path", aws, {
    cacheSize: 50, // Custom cache size (default is 100)
  });

  // Example 1: Multiple concurrent requests to the same item
  // Only one actual request will be made to S3, others will wait for the result
  const promises = [
    store.getItem("data/array.zarr", {}),
    store.getItem("data/array.zarr", {}),
    store.getItem("data/array.zarr", {}),
  ];

  const results = await Promise.all(promises);
  console.log(
    "All requests completed. Results are identical:",
    results[0] === results[1] && results[1] === results[2],
  );

  // Example 2: Cache hit on subsequent request
  console.log("Making another request for the same item (should be cached)...");
  const cachedResult = await store.getItem("data/array.zarr", {});
  console.log("Got cached result");

  // Example 3: Check cache stats
  const stats = store.getCacheStats();
  console.log(`Cache stats: ${stats.size}/${stats.maxSize} items`);

  // Example 4: Check if item is cached
  console.log(
    "Is 'data/array.zarr' cached?",
    store.isCached("data/array.zarr"),
  );
  console.log("Is 'other/item' cached?", store.isCached("other/item"));

  // Example 5: Clear cache
  store.clearCache();
  console.log("Cache cleared. New stats:", store.getCacheStats());

  // Example 6: Using the get method (for AbsolutePath)
  const uint8Result = await store.get("/some/path", {});
  console.log("Got Uint8Array result:", uint8Result?.constructor.name);
}

// Export for demonstration
export { demonstrateEnhancedStore };

// Key benefits of the enhanced store:
// 1. **Deduplication**: Multiple concurrent requests for the same resource are deduplicated
// 2. **Caching**: Successfully fetched resources are cached in memory with LRU eviction
// 3. **Performance**: Subsequent requests for cached items are served instantly
// 4. **Memory Management**: LRU cache prevents unlimited memory growth
// 5. **Error Handling**: Errors are not cached, allowing retries
