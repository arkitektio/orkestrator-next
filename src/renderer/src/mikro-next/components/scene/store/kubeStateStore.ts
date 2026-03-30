import type { KubeUnionSchema } from "@/apps/default/hooks/states/ExpanseState";
import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { z } from "zod";
import { createScopedStoreHooks } from "@/lib/rekuest/createScopedStore";

export type KubeState = z.infer<typeof KubeUnionSchema>;

interface KubeStateStore {
  selectedKubeState: KubeState | null;
  setSelectedKubeState: (id: KubeState | null) => void;
}

export const createKubeStateStore = () =>
  createStore<KubeStateStore>()(
  immer((set) => ({
    selectedKubeState: null,
    setSelectedKubeState: (id) =>
      set((state) => {
        state.selectedKubeState = id;
      }),
  })),
);

const {
  StoreContext: KubeStateStoreContext,
  useScopedStore: useKubeStateStore,
  useStoreApi: useKubeStateStoreApi,
} = createScopedStoreHooks<KubeStateStore>("KubeStateStore");

export { KubeStateStoreContext, useKubeStateStore, useKubeStateStoreApi };
