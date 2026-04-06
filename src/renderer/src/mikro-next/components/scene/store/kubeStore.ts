import type { KubeUnionSchema } from "@/apps/default/hooks/states/LightPathState";
import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { z } from "zod";
import { createScopedStoreHooks } from "@/lib/rekuest/createScopedStore";

export type Kube = z.infer<typeof KubeUnionSchema>;

interface KubeStore {
  selectedKube: Kube | null;
  setSelectedKube: (id: Kube | null) => void;
}

export const createKubeStore = () =>
  createStore<KubeStore>()(
  immer((set) => ({
    selectedKube: null,
    setSelectedKube: (id) =>
      set((state) => {
        state.selectedKube = id;
      }),
  })),
);

const {
  StoreContext: KubeStoreContext,
  useScopedStore: useKubeStore,
  useStoreApi: useKubeStoreApi,
} = createScopedStoreHooks<KubeStore>("KubeStore");

export { KubeStoreContext, useKubeStore, useKubeStoreApi };
