import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { createScopedStoreHooks } from "./createScopedStore";

export type InteractionMode = "PAN" | "EDIT" | "SCAN" | "MOVE" | "META";
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

export const interactionModeOptions: InteractionModeOption[] = [
  {
    label: "Pan Mode",
    value: "PAN",
    description: "Default mode for navigating the scene",
  },
  {
    label: "Edit Mode",
    value: "EDIT",
    description: "Mode for selecting and modifying objects",
  },
  {
    label: "Scan Mode",
    value: "SCAN",
    description: "Mode for drawing selection boxes and scanning areas",
  },
  {
    label: "Move Mode",
    value: "MOVE",
    description: "Mode for moving selected objects",
  },
  {
    label: "Meta Mode",
    value: "META",
    description: "Mode for accessing meta-level controls and settings",
  },
];

export const displayModeOptions: DisplayModeOption[] = [
  { label: "2D View", value: "2D", description: "Display in 2D mode" },
  { label: "3D View", value: "3D", description: "Display in 3D mode" },
];

export interface ModeState {
  interactionMode: InteractionMode;
  displayMode: DisplayMode;
  interactionModeOptions: InteractionModeOption[];
  displayModeOptions: DisplayModeOption[];
  setInteractionMode: (mode: InteractionMode) => void;
  setDisplayMode: (mode: DisplayMode) => void;
}







export const createModeStore = () =>
  createStore<ModeState>()(
    immer((set) => ({
    interactionMode: "PAN", // Default starting mode
    displayMode: "2D", // Active when holding a modifier key
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
    })),
  );

const {
  StoreContext: ModeStoreContext,
  useScopedStore: useModeStore,
  useStoreApi: useModeStoreApi,
} = createScopedStoreHooks<ModeState>("ModeStore");

export { ModeStoreContext, useModeStore, useModeStoreApi };
