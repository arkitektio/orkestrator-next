import { ApolloClient, NormalizedCache } from "@apollo/client";
import { S3FetchConfig } from "@/lib/zarr/runner/s3-request";
import { ConfiguredS3Store } from "@/mikro-next/components/scene/zarr/zarr_stores/s3Store";
import { createScopedStoreHooks } from "@/mikro-next/components/scene/store/createScopedStore";
import { ZarrStore } from "@/mikro-next/components/scene/zarr/zarr_stores/type";
import { Array as ZarrArray, Chunk, DataType, get, open } from "zarrita";
import { createStore } from "zustand/vanilla";
import {
  GeneralZarrAccessGrantFragment,
  RequestGeneralZarrAccessDocument,
  RequestGeneralZarrAccessMutation,
  RequestGeneralZarrAccessMutationVariables,
  ZarrStoreFragment,
} from "../../api/graphql";

type ElektroClient = ApolloClient<NormalizedCache>;

type OpenedZarrArray = ZarrArray<DataType, ZarrStore>;

// --- Selection / result types (shared with useTraceArray) ---

export type Slice = {
  _slice: true;
  step: number | null;
  start: number | null;
  stop: number | null;
};

export type ArraySelection = Slice[];

export type DownloadedArray = {
  shape: [number, number, number, number, number];
  out: Chunk<DataType>;
  selection: ArraySelection;
  tSize: number;
  cSize: number;
  dtypeMin: number;
  dtypeMax: number;
};

// --- Config ---

export interface ZarrStoreConfig {
  /** Requested lifetime (s) for the general access grant. `undefined` → server default. */
  grantExpiresIn?: number;
  /** Refresh the grant (and rebuild open stores) this long before it expires. */
  refreshMarginMs: number;
  /** Prime `/zarr.json` on store construction. `open.v3` reads metadata anyway, so off by default. */
  preloadMetadata: boolean;
}

export const DEFAULT_ZARR_CONFIG: ZarrStoreConfig = {
  grantExpiresIn: undefined,
  refreshMarginMs: 30_000,
  preloadMetadata: false,
};

// --- Store state ---

export interface ElektroZarrState {
  config: ZarrStoreConfig;
  setConfig: (partial: Partial<ZarrStoreConfig>) => void;

  /** Ids of stores currently held open in the registry (reactive, for debugging/UI). */
  openStoreIds: string[];

  /** Open (or reuse) the zarr array for a trace store. */
  getArray: (store: ZarrStoreFragment) => Promise<OpenedZarrArray>;
  /** Open the array and read a selection out of it. */
  getSelection: (
    store: ZarrStoreFragment,
    selection: ArraySelection,
    signal?: AbortSignal,
  ) => Promise<DownloadedArray>;

  /** Drop the cached grant and every open store (e.g. after a config change). */
  invalidate: () => void;
}

type CachedGrant = {
  promise: Promise<GeneralZarrAccessGrantFragment>;
  expiresAt: number;
};

type OpenEntry = {
  expiresAt: number;
  array: Promise<OpenedZarrArray>;
};

const requestGeneralAccess = async (
  client: ElektroClient,
  grantExpiresIn?: number,
): Promise<GeneralZarrAccessGrantFragment> => {
  const access = await client.mutate<
    RequestGeneralZarrAccessMutation,
    RequestGeneralZarrAccessMutationVariables
  >({
    mutation: RequestGeneralZarrAccessDocument,
    variables: { input: { expiresIn: grantExpiresIn ?? null } },
  });

  const grant = access.data?.requestGeneralZarrAccess;
  if (!grant) {
    throw new Error("Failed to obtain general Zarr access credentials");
  }
  return grant;
};

/**
 * Elektro-scoped zarr data store. Requests a single *general* zarr access grant
 * (cached and refreshed near expiry), keeps a lazy registry of open zarr arrays
 * keyed by `storeId`, and is reused across all elektro pages. Mirrors the mikro
 * scene `viewerStore`, but opens stores on demand instead of eagerly from a scene.
 */
export const createElektroZarrStore = (
  client: ElektroClient | undefined,
  datalayer: string | undefined,
  config: ZarrStoreConfig,
) => {
  // Imperative caches kept outside reactive state.
  const openByStoreId = new Map<string, OpenEntry>();
  let grant: CachedGrant | null = null;

  return createStore<ElektroZarrState>((set, get_) => {
    const ensureGrant = (): Promise<GeneralZarrAccessGrantFragment> => {
      if (!client) throw new Error("No elektro client found");
      const { refreshMarginMs, grantExpiresIn } = get_().config;

      if (grant && Date.now() < grant.expiresAt - refreshMarginMs) {
        return grant.promise;
      }

      // Stale/near-expiry: re-request and drop every open store built on the old grant.
      openByStoreId.clear();
      set({ openStoreIds: [] });

      const promise = requestGeneralAccess(client, grantExpiresIn);
      // Optimistically cache the promise; back-fill the real expiry once resolved.
      grant = { promise, expiresAt: Number.POSITIVE_INFINITY };
      promise
        .then(g => {
          if (grant && grant.promise === promise) {
            grant.expiresAt = Date.now() + g.expiresIn * 1000;
          }
        })
        .catch(() => {
          if (grant && grant.promise === promise) grant = null;
        });
      return promise;
    };

    const openArray = async (store: ZarrStoreFragment): Promise<OpenedZarrArray> => {
      if (!datalayer) throw new Error("No datalayer endpoint configured");
      const g = await ensureGrant();
      const expiresAt = Date.now() + g.expiresIn * 1000;
      const s3config: S3FetchConfig = {
        accessKey: g.accessKey,
        secretKey: g.secretKey,
        sessionToken: g.sessionToken,
        region: g.region,
        expiresAt,
        storeId: store.id,
        baseUrl: `${datalayer.replace(/\/$/, "")}/${g.bucket}/${store.key}`,
      };
      const s3 = new ConfiguredS3Store(s3config, {
        preloadMetadata: get_().config.preloadMetadata,
      });
      return open.v3(s3, { kind: "array" }) as Promise<OpenedZarrArray>;
    };

    return {
      config,
      setConfig: partial => set(s => ({ config: { ...s.config, ...partial } })),

      openStoreIds: [],

      getArray: store => {
        const existing = openByStoreId.get(store.id);
        if (existing && Date.now() < existing.expiresAt) {
          return existing.array;
        }

        const entry: OpenEntry = {
          // Provisional; the real expiry comes from the grant, but the registry is
          // cleared on grant refresh anyway, so this only guards against reuse races.
          expiresAt: Number.POSITIVE_INFINITY,
          array: openArray(store),
        };
        // Drop the cached promise if opening fails, so the next call retries.
        entry.array.catch(() => {
          if (openByStoreId.get(store.id) === entry) {
            openByStoreId.delete(store.id);
            set(s => ({ openStoreIds: s.openStoreIds.filter(id => id !== store.id) }));
          }
        });
        openByStoreId.set(store.id, entry);
        set(s =>
          s.openStoreIds.includes(store.id)
            ? s
            : { openStoreIds: [...s.openStoreIds, store.id] },
        );
        return entry.array;
      },

      getSelection: async (store, selection, _signal) => {
        const array = await get_().getArray(store);
        const view = (await get(array, selection)) as Chunk<DataType>;
        return {
          shape: array.shape as [number, number, number, number, number],
          out: view,
          selection,
          dtypeMin: 0,
          dtypeMax: 255,
          tSize: array.shape[1],
          cSize: array.shape[0],
        };
      },

      invalidate: () => {
        grant = null;
        openByStoreId.clear();
        set({ openStoreIds: [] });
      },
    };
  });
};

export type ElektroZarrStore = ReturnType<typeof createElektroZarrStore>;

const {
  StoreContext: ElektroZarrStoreContext,
  useScopedStore: useElektroZarrStore,
  useStoreApi: useElektroZarrStoreApi,
} = createScopedStoreHooks<ElektroZarrState>("ElektroZarrStore");

export { ElektroZarrStoreContext, useElektroZarrStore, useElektroZarrStoreApi };
