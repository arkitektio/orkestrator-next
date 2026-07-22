import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { createScopedStoreHooks } from "@/lib/generic/createScopedStore";

export interface SelectionState {
  selectedLayerId: string | null;
  armedLayerIds: string[];
  setSelectedLayerId: (id: string | null) => void;
  toggleArmedLayerId: (id: string) => void;
  clearArmedLayerIds: () => void;
}

export const createSelectionStore = () =>
  createStore<SelectionState>()(
  immer((set) => ({
    selectedLayerId: null,
    armedLayerIds: [],
    setSelectedLayerId: (id) =>
      set((state) => {
        state.selectedLayerId = id;
      }),
    toggleArmedLayerId: (id) =>
      set((state) => {
        if (state.armedLayerIds.includes(id)) {
          state.armedLayerIds = state.armedLayerIds.filter((layerId) => layerId !== id);
          return;
        }

        state.armedLayerIds.push(id);
      }),
    clearArmedLayerIds: () =>
      set((state) => {
        state.armedLayerIds = [];
      }),

  })),
);

const {
  StoreContext: SelectionStoreContext,
  useScopedStore: useSelectionStore,
  useStoreApi: useSelectionStoreApi,
} = createScopedStoreHooks<SelectionState>("SelectionStore");

export { SelectionStoreContext, useSelectionStore, useSelectionStoreApi };
