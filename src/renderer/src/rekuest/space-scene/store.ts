import { createStore, StoreApi } from "zustand/vanilla";
import { SpaceFragment, MediaStoreFragment } from "../api/graphql";

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
  memberships: MembershipEntry[];
  selectedMembershipId: string | null;

  // Actions
  setMemberships: (memberships: MembershipEntry[]) => void;
  addMembership: (membership: MembershipEntry) => void;
  removeMembership: (id: string) => void;
  updateMembershipTransform: (
    id: string,
    position: [number, number, number],
    rotation?: [number, number, number],
    scale?: [number, number, number],
  ) => void;
  selectMembership: (id: string | null) => void;
}

export type SpaceSceneStore = StoreApi<SpaceSceneState>;

export function membershipFromFragment(
  m: SpaceFragment["memberships"][number],
): MembershipEntry {
  const { position, rotation, scale } = parseAffineMatrix(m.affineMatrix);
  return {
    id: m.id,
    name: m.name,
    position,
    rotation,
    scale,
    sceneId: m.scene.id,
    sceneName: m.scene.name,
    agentId: m.scene.agent.id,
    agentName: m.scene.agent.name,
    media: m.scene.model.file,
  };
}

export const createSpaceSceneStore = (
  spaceId: string,
  initial: SpaceFragment["memberships"],
): SpaceSceneStore => {
  return createStore<SpaceSceneState>((set) => ({
    spaceId,
    memberships: initial.map(membershipFromFragment),
    selectedMembershipId: null,

    setMemberships: (memberships) => set({ memberships }),

    addMembership: (membership) =>
      set((state) => ({
        memberships: [...state.memberships, membership],
      })),

    removeMembership: (id) =>
      set((state) => ({
        memberships: state.memberships.filter((m) => m.id !== id),
        selectedMembershipId:
          state.selectedMembershipId === id
            ? null
            : state.selectedMembershipId,
      })),

    updateMembershipTransform: (id, position, rotation, scale) =>
      set((state) => ({
        memberships: state.memberships.map((m) =>
          m.id === id
            ? {
                ...m,
                position,
                rotation: rotation ?? m.rotation,
                scale: scale ?? m.scale,
              }
            : m,
        ),
      })),

    selectMembership: (id) => set({ selectedMembershipId: id }),
  }));
};
