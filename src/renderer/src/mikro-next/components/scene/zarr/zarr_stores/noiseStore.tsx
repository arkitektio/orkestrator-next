
import type { AbsolutePath } from "node_modules/@zarrita/storage/dist/src/types";
// ------------------------------------------------

// --- Stores ---

/**
 * A mock Zarrita store that generates noise data instead of fetching from a backend.
 * It intercepts requests for 'zarr.json' to provide structural metadata,
 * and generates random Uint8 arrays for chunk data requests.
 */
export class TestNoiseZarrStore {
  url: string | URL;

  constructor(url: string | URL) {
    this.url = url;
  }

  async get(key: AbsolutePath, options: RequestInit = {}): Promise<Uint8Array | undefined> {
    // 1. Intercept array metadata request
    if (key === "/zarr.json") {
      const mockMetadata = {
        zarr_format: 3,
        node_type: "array",
        shape: [1, 50, 256, 256], // [T, Z, Y, X]
        data_type: "uint8",
        chunk_grid: {
          name: "regular",
          configuration: { chunk_shape: [1, 10, 64, 64] }
        },
        chunk_key_encoding: {
          name: "default",
          configuration: { separator: "/" }
        },
        fill_value: 0,
        codecs: [{ name: "bytes", configuration: { endian: "little" } }]
      };
      return new TextEncoder().encode(JSON.stringify(mockMetadata));
    }

    console.log(`TestNoiseZarrStore received get request for key: ${key}`, options);

    // 2. Intercept chunk data requests
    if (key.startsWith("/c/")) {
      const chunkSize = 1 * 10 * 64 * 64; // Matches the chunk_shape above
      const noiseData = new Uint8Array(chunkSize);
      for (let i = 0; i < chunkSize; i++) {
        noiseData[i] = Math.floor(Math.random() * 256);
      }
      return noiseData;
    }

    return undefined;
  }
}
