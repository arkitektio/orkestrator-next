import type { AbsolutePath } from "@zarrita/storage";

export type ZarrStore = {
  url: string | URL;
  get: (key: AbsolutePath, options?: RequestInit ) => Promise<Uint8Array | undefined>;
};