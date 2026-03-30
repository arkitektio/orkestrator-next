import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import * as THREE from "three";
import { z } from "zod";
import { ScanRegionArgsSchema } from "@/apps/default/hooks/actions";
import { createScopedStoreHooks } from "@/lib/rekuest/createScopedStore";

export type ScanPattern = z.infer<typeof ScanRegionArgsSchema>["scan_order"];



export interface ScanRegion {
  id: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  pattern: ScanPattern;
  overlap: number;
}

interface ScansState {
  regions: ScanRegion[];
  selectedRegionId: string | null;
  addRegion: (region: ScanRegion) => void;
  updateRegion: (id: string, updates: Partial<ScanRegion>) => void;
  deleteRegion: (id: string) => void;
  setSelectedRegionId: (id: string | null) => void;
}

export const createScansStore = () =>
  createStore<ScansState>()(
  immer((set) => ({
    regions: [],
    selectedRegionId: null,
    addRegion: (region) =>
      set((state) => {
        // Using immer, we can just push to the draft array
        state.regions.push(region);
      }),
    updateRegion: (id, updates) =>
      set((state) => {
        const index = state.regions.findIndex((r) => r.id === id);
        if (index !== -1) {
          // Merge the updates into the existing region
          Object.assign(state.regions[index], updates);
        }
      }),
    deleteRegion: (id) =>
      set((state) => {
        state.regions = state.regions.filter((r) => r.id !== id);
        if (state.selectedRegionId === id) {
          state.selectedRegionId = null;
        }
      }),
    setSelectedRegionId: (id) =>
      set((state) => {
        state.selectedRegionId = id;
      }),
  })),
);

const {
  StoreContext: ScansStoreContext,
  useScopedStore: useScansStore,
  useStoreApi: useScansStoreApi,
} = createScopedStoreHooks<ScansState>("ScansStore");

export { ScansStoreContext, useScansStore, useScansStoreApi };
