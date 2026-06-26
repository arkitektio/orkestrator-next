import { create } from "zustand";

/**
 * The "active workspace" is a purely client-side, session-only concept: the
 * elektro backend has no notion of a currently-selected workspace or model.
 *
 * While a workspace is active, models the user saves from the neuron editor are
 * automatically added to it (see NeuronModelEditorPage), and the workspace page
 * renders the `activeModelId` model big in the visualizer. State is intentionally
 * in-memory only — it is reset on reload.
 */
interface ActiveWorkspaceState {
  /** Id of the workspace newly-created models should join, or null. */
  activeWorkspaceId: string | null;
  /** Id of the model currently shown "in its glory" on the workspace page. */
  activeModelId: string | null;

  /** Set (or clear) the active workspace. Clears the active model. */
  setActiveWorkspace: (id: string | null) => void;
  setActiveModel: (id: string | null) => void;
  clear: () => void;
}

export const useActiveWorkspaceStore = create<ActiveWorkspaceState>((set) => ({
  activeWorkspaceId: null,
  activeModelId: null,
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id, activeModelId: null }),
  setActiveModel: (id) => set({ activeModelId: id }),
  clear: () => set({ activeWorkspaceId: null, activeModelId: null }),
}));
