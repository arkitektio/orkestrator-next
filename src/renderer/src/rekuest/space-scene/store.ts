import { Matrix4 } from "three";
import { createStore, StoreApi } from "zustand/vanilla";
import { SpaceFragment, MediaStoreFragment, SpacePlacementFragment } from "../api/graphql";

export interface MembershipEntry {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  sceneId: string;
  sceneName: string;
  agentId: string;
  agentName: string;
  media: MediaStoreFragment;
}

/**
 * Builds a 4x4 affine matrix (row-major) from position/rotation/scale.
 * For now we only encode translation; rotation/scale can be extended later.
 */
export function buildAffineMatrix(
  position: [number, number, number],
  _rotation: [number, number, number],
  _scale: [number, number, number],
): number[][] {
  return [
    [1, 0, 0, position[0]],
    [0, 1, 0, position[1]],
    [0, 0, 1, position[2]],
    [0, 0, 0, 1],
  ];
}

export interface SpaceSceneState {
  spaceId: string;
  placements: SpacePlacementFragment[];
  selectedPlacementId: string | null;
  openPanels: SpaceScenePanel[];
  viewProjectionMatrix: Matrix4 | null;
  viewportSize: { width: number; height: number };

  // Actions
  setPlacements: (placements: SpacePlacementFragment[]) => void;
  addPlacement: (placement: SpacePlacementFragment) => void;
  removePlacement: (id: string) => void;
  updatePlacementTransform: (
    id: string,
    position: [number, number, number],
    rotation?: [number, number, number],
    scale?: [number, number, number],
  ) => void;
  updateCameraData: (matrix: Matrix4, size: { width: number; height: number }) => void;
  selectPlacement: (id: string | null) => void;
  openPlacementPanel: (placementId: string) => void;
  closePanel: (panelId: string) => void;
  clearPanels: () => void;
}

export type SpaceSceneStore = StoreApi<SpaceSceneState>;

export interface SpaceScenePanel {
  id: string;
  kind: "materialized-blok";
  placementId: string;
}



export const createSpaceSceneStore = (
  spaceId: string,
  initial: SpaceFragment["placements"],
): SpaceSceneStore => {
  return createStore<SpaceSceneState>((set) => ({
    spaceId,
    placements: initial,
    selectedPlacementId: null,
    openPanels: [],
    viewProjectionMatrix: null,
    viewportSize: { width: 0, height: 0 },

    setPlacements: (placements) => set({ placements }),

    addPlacement: (placement) =>
      set((state) => ({
        placements: [...state.placements, placement],
      })),

    removePlacement: (id) =>
      set((state) => ({
        placements: state.placements.filter((p) => p.id !== id),
        openPanels: state.openPanels.filter((panel) => panel.placementId !== id),
        selectedPlacementId:
          state.selectedPlacementId === id
            ? null
            : state.selectedPlacementId,
      })),

    updatePlacementTransform: (id, position, rotation, scale) =>
      set((state) => ({
        placements: state.placements.map((p) =>
          p.id === id
            ? {
                ...p,
                affineMatrix: buildAffineMatrix(
                  position,
                  rotation || [0, 0, 0],
                  scale || [1, 1, 1],
                ),
              }
            : p,
        ),
      })),

    updateCameraData: (matrix, size) =>
      set({ viewProjectionMatrix: matrix, viewportSize: size }),

    selectPlacement: (id) => set({ selectedPlacementId: id }),

    openPlacementPanel: (placementId) =>
      set((state) => {
        const panelId = `materialized-blok:${placementId}`;
        const nextPanel = {
          id: panelId,
          kind: "materialized-blok" as const,
          placementId,
        };

        return {
          openPanels: [
            ...state.openPanels.filter((panel) => panel.id !== panelId),
            nextPanel,
          ],
        };
      }),

    closePanel: (panelId) =>
      set((state) => ({
        openPanels: state.openPanels.filter((panel) => panel.id !== panelId),
      })),

    clearPanels: () => set({ openPanels: [] }),
  }));
};
