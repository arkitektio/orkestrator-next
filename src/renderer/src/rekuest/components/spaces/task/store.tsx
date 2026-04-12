
// ── Local View Store (camera matrix bridge) ──────────────────────────

import { useContext } from "react";
import { createContext } from "react";
import { createStore, useStore } from "zustand";
import * as THREE from "three";
import { DetailAssignationFragment } from "@/rekuest/api/graphql";

interface SpaceViewState {
  task: DetailAssignationFragment;
  selectedTimepoint: number // UTC timestamp in milliseconds;
  viewProjectionMatrix: THREE.Matrix4 | null;
  viewportSize: { width: number; height: number };
  selectedPlacementId: string | null;
  selectedAgentId: string | null;
  selectedDependencyId: string | null;
  updateCameraData: (
    matrix: THREE.Matrix4,
    size: { width: number; height: number },
  ) => void;
  selectPlacement: (id: string | null) => void;
  selectAgent: (id: string | null) => void;
  selectDependency: (id: string | null) => void;
  selectTimepoint: (timestamp: number) => void;
}

export const createSpaceViewStore = (task: DetailAssignationFragment) =>
  createStore<SpaceViewState>((set) => ({
    task: task,
    viewProjectionMatrix: null,
    timepoint: 0,
    selectedTimepoint: 0,
    selectTimepoint: (timestamp) => set({ selectedTimepoint: timestamp }),
    viewportSize: { width: 0, height: 0 },
    selectedPlacementId: null,
    updateCameraData: (matrix, size) =>
      set({ viewProjectionMatrix: matrix, viewportSize: size }),
    selectPlacement: (id) => set({ selectedPlacementId: id }),
    selectedAgentId: null,
    selectAgent: (id) => set({ selectedAgentId: id }),
    selectedDependencyId: null,
    selectDependency: (id) => set({ selectedDependencyId: id }),
  }));

type SpaceViewStore = ReturnType<typeof createSpaceViewStore>;

export const SpaceViewStoreContext = createContext<SpaceViewStore | null>(null);

export function useSpaceViewStore<T>(selector: (s: SpaceViewState) => T): T {
  const store = useContext(SpaceViewStoreContext);
  if (!store) throw new Error("Missing SpaceViewStoreContext");
  return useStore(store, selector);
}
