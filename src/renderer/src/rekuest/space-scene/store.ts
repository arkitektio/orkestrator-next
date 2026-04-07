import { createStore, StoreApi } from "zustand/vanilla";
import { SpaceFragment, MediaStoreFragment, PlacementFragment } from "../api/graphql";

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
 * Converts a 4x4 affine matrix (row-major) to position/rotation/scale.
 * Falls back to identity if the matrix is null/undefined.
 */
function parseAffineMatrix(matrix: number[][] | null | undefined): {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
} {
  if (!matrix || matrix.length < 4) {
    return {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    };
  }
  return {
    position: [matrix[0][3], matrix[1][3], matrix[2][3]],
    rotation: [0, 0, 0], // Simplified: rotation extraction from affine is complex
    scale: [1, 1, 1],
  };
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
  placements: PlacementFragment[];
  selectedPlacementId: string | null;

  // Actions
  setPlacements: (placements: PlacementFragment[]) => void;
  addPlacement: (placement: PlacementFragment) => void;
  removePlacement: (id: string) => void;
  updatePlacementTransform: (
    id: string,
    position: [number, number, number],
    rotation?: [number, number, number],
    scale?: [number, number, number],
  ) => void;
  selectPlacement: (id: string | null) => void;
}

export type SpaceSceneStore = StoreApi<SpaceSceneState>;



export const createSpaceSceneStore = (
  spaceId: string,
  initial: SpaceFragment["placements"],
): SpaceSceneStore => {
  return createStore<SpaceSceneState>((set) => ({
    spaceId,
    placements: initial,
    selectedPlacementId: null,

    setPlacements: (placements) => set({ placements }),

    addPlacement: (placement) =>
      set((state) => ({
        placements: [...state.placements, placement],
      })),

    removePlacement: (id) =>
      set((state) => ({
        placements: state.placements.filter((p) => p.id !== id),
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

    selectPlacement: (id) => set({ selectedPlacementId: id }),
  }));
};
