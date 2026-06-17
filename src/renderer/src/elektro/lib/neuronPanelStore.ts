import { create } from "zustand";

/**
 * A panel anchored to a point on the neuron morphology.
 *
 * `position` is a world-space coordinate (the point that was clicked on a
 * branch). The renderer projects it to screen-space every frame via the
 * three.js camera (the "scene api") so a plain DOM panel can be parked on top
 * of it — no `@react-three/drei` <Html> involved.
 */
export interface NeuronPanel {
  sectionId: string;
  position: [number, number, number];
}

interface NeuronPanelState {
  /** Open panels keyed by section id (a section may have at most one panel). */
  panels: Record<string, NeuronPanel>;
  /** Section currently hovered in the 3d scene, for cross-highlighting. */
  hoveredId: string | null;

  openPanel: (panel: NeuronPanel) => void;
  closePanel: (sectionId: string) => void;
  /** Toggle a panel while keeping any other open panels (additive, e.g. ctrl-click). */
  togglePanel: (panel: NeuronPanel) => void;
  /** Show only this panel, closing every other one (or close it if it was the only one open). */
  toggleExclusive: (panel: NeuronPanel) => void;
  closeAll: () => void;
  setHovered: (id: string | null) => void;
}

export const useNeuronPanelStore = create<NeuronPanelState>((set) => ({
  panels: {},
  hoveredId: null,

  openPanel: (panel) =>
    set((state) => ({ panels: { ...state.panels, [panel.sectionId]: panel } })),

  closePanel: (sectionId) =>
    set((state) => {
      const { [sectionId]: _removed, ...rest } = state.panels;
      return { panels: rest };
    }),

  togglePanel: (panel) =>
    set((state) => {
      if (state.panels[panel.sectionId]) {
        const { [panel.sectionId]: _removed, ...rest } = state.panels;
        return { panels: rest };
      }
      return { panels: { ...state.panels, [panel.sectionId]: panel } };
    }),

  toggleExclusive: (panel) =>
    set((state) => {
      const openIds = Object.keys(state.panels);
      // Clicking the already-and-only open panel closes it.
      if (openIds.length === 1 && state.panels[panel.sectionId]) {
        return { panels: {} };
      }
      return { panels: { [panel.sectionId]: panel } };
    }),

  closeAll: () => set({ panels: {} }),

  setHovered: (id) => set({ hoveredId: id }),
}));
