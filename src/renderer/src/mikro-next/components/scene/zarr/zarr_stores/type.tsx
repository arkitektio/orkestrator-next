import type { AbsolutePath } from "@zarrita/storage";

export type ZarrStore = {
  url: string | URL;
  get: (key: AbsolutePath, options?: RequestInit ) => Promise<Uint8Array | undefined>;
};

/** Minimal client interface - compatible with Apollo Client's mutate method */
export type MikroClient = {
  mutate(options: { mutation: any; variables?: any; context?: any }): Promise<{ data?: any | null }>;
};
