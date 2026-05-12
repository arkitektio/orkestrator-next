import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { createScopedStoreHooks } from "./createScopedStore";

export type InteractionMode = "PAN" | "EDIT" | "SELECT" | "MOVE" | "META";
export type DisplayMode = "2D" | "3D";
export type CameraControllerMode = "ORBIT" | "CURSOR_ORBIT" | "ARCBALL";

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

export type CameraControllerModeOption = {
  label: string;
  value: CameraControllerMode;
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
    label: "Select Mode",
    value: "SELECT",
    description: "Mode for selecting ROIs directly or with a drag box",
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

export const cameraControllerModeOptions: CameraControllerModeOption[] = [
  {
    label: "Orbit",
    value: "ORBIT",
    description: "Classic orbit camera around the current target",
  },
  {
    label: "Cursor Orbit",
    value: "CURSOR_ORBIT",
    description: "Orbit camera with cursor-focused zoom behavior",
  },
  {
    label: "Arcball",
    value: "ARCBALL",
    description: "Arcball controller for pointer-centered 3D rotation",
  },
];

export interface ModeState {
  interactionMode: InteractionMode;
  displayMode: DisplayMode;
  cameraControllerMode: CameraControllerMode;
  interactionModeOptions: InteractionModeOption[];
  displayModeOptions: DisplayModeOption[];
  cameraControllerModeOptions: CameraControllerModeOption[];
  setInteractionMode: (mode: InteractionMode) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setCameraControllerMode: (mode: CameraControllerMode) => void;
}







export const createModeStore = () =>
  createStore<ModeState>()(
    immer((set) => ({
    interactionMode: "PAN", // Default starting mode
    displayMode: "2D", // Active when holding a modifier key
    cameraControllerMode: "ORBIT",
    interactionModeOptions,
    displayModeOptions,
    cameraControllerModeOptions,
    setInteractionMode: (mode) =>
      set((state) => {
        state.interactionMode = mode;
      }),
    setDisplayMode: (mode) =>
      set((state) => {
        state.displayMode = mode;
      }),
    setCameraControllerMode: (mode) =>
      set((state) => {
        state.cameraControllerMode = mode;
      }),
    })),
  );

const {
  StoreContext: ModeStoreContext,
  useScopedStore: useModeStore,
  useStoreApi: useModeStoreApi,
} = createScopedStoreHooks<ModeState>("ModeStore");

export { ModeStoreContext, useModeStore, useModeStoreApi };
