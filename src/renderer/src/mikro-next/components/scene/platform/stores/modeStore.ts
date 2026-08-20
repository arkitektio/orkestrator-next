import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { createScopedStoreHooks } from "@/lib/generic/createScopedStore";

/**
 * Three modes, not seven. What used to be MOVE (no behaviour at all) and META
 * (hid the origin axis) are gone; SELECT folded into ANNOTATE as a pointer tool
 * alongside the shapes, and AUTO_PROBE became the `probeFollowsCursor` modifier
 * of PROBE. Camera behaviour that used to be an exclusive mode is now composable
 * booleans below.
 */
export type InteractionMode = "NAVIGATE" | "ANNOTATE" | "PROBE";
export type DisplayMode = "2D" | "3D";

export type DisplayModeOption = {
  label: string;
  value: DisplayMode;
  description?: string;
};

export type InteractionModeOption = {
  label: string;
  value: InteractionMode;
  description?: string;
};

/**
 * Canonical order and copy. Which of these are actually *offered* is decided by
 * `core/modeCompat.ts` — an option that would be inert is not shown.
 */
export const interactionModeOptions: InteractionModeOption[] = [
  {
    label: "Navigate",
    value: "NAVIGATE",
    description: "Pan, orbit and zoom the scene",
  },
  {
    label: "Annotate",
    value: "ANNOTATE",
    description: "Draw annotations, or drag-select existing ones (hold A)",
  },
  {
    label: "Probe",
    value: "PROBE",
    description: "Click a layer to read its voxel values (hold P)",
  },
];

export const displayModeOptions: DisplayModeOption[] = [
  { label: "2D View", value: "2D", description: "Display in 2D mode" },
  { label: "3D View", value: "3D", description: "Display in 3D mode" },
];

export interface ModeState {
  interactionMode: InteractionMode;
  displayMode: DisplayMode;
  /**
   * Zoom towards the pointer instead of the orbit target (3D). Was the
   * CURSOR_ORBIT camera mode — a boolean now, because it composes with the
   * pivot setting rather than excluding it.
   */
  zoomToCursor: boolean;
  /**
   * Re-center the orbit pivot on the last *click*-probed point (3D). Was the
   * PROBE_ORBIT camera mode. See `core/orbitPivot.ts`.
   */
  pivotOnProbe: boolean;
  /**
   * Hover-to-probe. Was the AUTO_PROBE interaction mode, now a modifier of
   * PROBE — on by default, since entering PROBE is already the statement that
   * you want to read values. Lives here rather than on `viewerStore` so the
   * brick layers keep a single reactive subscription for pointer behaviour —
   * they write probes through the non-reactive store api precisely to avoid
   * re-renders.
   */
  probeFollowsCursor: boolean;
  interactionModeOptions: InteractionModeOption[];
  displayModeOptions: DisplayModeOption[];
  setInteractionMode: (mode: InteractionMode) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setZoomToCursor: (on: boolean) => void;
  setPivotOnProbe: (on: boolean) => void;
  setProbeFollowsCursor: (on: boolean) => void;
}







/**
 * `displayMode` seeds from the scene's `preferredView` (resolved by
 * `core/preferredView.ts`, which is where the AUTO policy lives) and is the
 * user's from then on — nothing rehydrates it, so switching view never fights
 * the scene's stated preference.
 */
export const createModeStore = ({
  displayMode = "2D",
}: { displayMode?: DisplayMode } = {}) =>
  createStore<ModeState>()(
    immer((set) => ({
    interactionMode: "NAVIGATE", // Default starting mode
    displayMode,
    zoomToCursor: false,
    pivotOnProbe: false,
    probeFollowsCursor: true,
    interactionModeOptions,
    displayModeOptions,
    setInteractionMode: (mode) =>
      set((state) => {
        state.interactionMode = mode;
      }),
    setDisplayMode: (mode) =>
      set((state) => {
        state.displayMode = mode;
      }),
    setZoomToCursor: (on) =>
      set((state) => {
        state.zoomToCursor = on;
      }),
    setPivotOnProbe: (on) =>
      set((state) => {
        state.pivotOnProbe = on;
      }),
    setProbeFollowsCursor: (on) =>
      set((state) => {
        state.probeFollowsCursor = on;
      }),
    })),
  );

const {
  StoreContext: ModeStoreContext,
  useScopedStore: useModeStore,
  useStoreApi: useModeStoreApi,
} = createScopedStoreHooks<ModeState>("ModeStore");

export { ModeStoreContext, useModeStore, useModeStoreApi };
