import { RoiKind } from "@/mikro-next/api/graphql";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState,
} from "react";
import { Panel } from "./panels";

export interface ViewerState {
  // Z/T navigation
  z: number;
  t: number;
  openPanels: Panel[];
  roiContextMenu: { open: boolean; x: number; y: number } | null;
  selectedScale: number;

  // Display options
  showRois: boolean;
  showLayerEdges: boolean;
  showDebugText: boolean;
  showDisplayStructures: boolean;
  showGrid: boolean;

  allowRoiDrawing: boolean; // Optional, used for ROIs
  roiDrawMode: RoiKind; // Optional, used for ROIs

  // Scale management
  enabledScales: Set<number>;

  // Display structures
  displayStructures: string[]; // Array of ROI IDs to display as structures
}

export interface ViewerStateActions {
  // Z/T navigation
  setZ: (z: number) => void;
  setT: (t: number) => void;
  setSelectedScale: (scale: number) => void;

  // Display options
  setShowRois: (show: boolean) => void;
  setShowLayerEdges: (show: boolean) => void;
  setShowDebugText: (show: boolean) => void;
  setShowDisplayStructures: (show: boolean) => void;
  setShowGrid: (show: boolean) => void;
  setOpenPanels: Dispatch<React.SetStateAction<Panel[]>>;
  setRoiContextMenu: (
    menu: { open: boolean; x: number; y: number } | null,
  ) => void;

  setAllowRoiDrawing: (allow: boolean) => void;
  setRoiDrawMode: (mode: RoiKind) => void;

  // Scale management
  setEnabledScales: (scales: Set<number>) => void;
  toggleScale: (scale: number) => void;

  // Display structures
  addDisplayStructure: (roiId: string) => void;
  removeDisplayStructure: (roiId: string) => void;
  clearDisplayStructures: () => void;
}

export interface ViewerStateContextType
  extends ViewerState,
  ViewerStateActions { }

const ViewerStateContext = createContext<ViewerStateContextType | undefined>(
  undefined,
);

export interface ViewerStateProviderProps {
  children: ReactNode;
  availableScales: number[];
  initialState?: Partial<ViewerState>;
}

export const ViewerStateProvider: React.FC<ViewerStateProviderProps> = ({
  children,
  availableScales,
  initialState = {},
}) => {
  // Initialize state with defaults, overridden by initialState
  const [z, setZ] = useState(initialState.z ?? 0);
  const [t, setT] = useState(initialState.t ?? 0);
  const [selectedScale, setSelectedScale] = useState(
    initialState.selectedScale ?? 0,
  );

  const [openPanels, setOpenPanels] = useState<Panel[]>([]);
  const [roiContextMenu, setRoiContextMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
  } | null>(null);

  const [showRois, setShowRois] = useState(initialState.showRois ?? false);
  const [showLayerEdges, setShowLayerEdges] = useState(
    initialState.showLayerEdges ?? false,
  );
  const [showDebugText, setShowDebugText] = useState(
    initialState.showDebugText ?? false,
  );
  const [showDisplayStructures, setShowDisplayStructures] = useState(
    initialState.showDisplayStructures ?? false,
  );
  const [showGrid, setShowGrid] = useState(initialState.showGrid ?? false);
  const [roiDrawMode, setRoiDrawMode] = useState(
    initialState.roiDrawMode ?? RoiKind.Rectangle,
  );
  const [allowRoiDrawing, setAllowRoiDrawing] = useState(
    initialState.allowRoiDrawing ?? false,
  );
  const [displayStructures, setDisplayStructures] = useState<string[]>(
    initialState.displayStructures ?? [],
  );

  // Default to only the most downscaled version enabled
  const defaultEnabledScales =
    initialState.enabledScales ?? new Set([Math.max(...availableScales)]);
  const [enabledScales, setEnabledScales] =
    useState<Set<number>>(defaultEnabledScales);

  // Toggle scale enabled/disabled
  const toggleScale = (scale: number) => {
    const newEnabledScales = new Set(enabledScales);
    if (newEnabledScales.has(scale)) {
      newEnabledScales.delete(scale);
    } else {
      newEnabledScales.add(scale);
    }
    setEnabledScales(newEnabledScales);
  };

  // Display structures management
  const addDisplayStructure = (roiId: string) => {
    setDisplayStructures((prev) => {
      if (prev.includes(roiId)) {
        return prev; // Already in the list
      }
      return [...prev, roiId];
    });
  };

  const removeDisplayStructure = (roiId: string) => {
    setDisplayStructures((prev) => prev.filter((id) => id !== roiId));
  };

  const clearDisplayStructures = () => {
    setDisplayStructures([]);
  };

  const contextValue: ViewerStateContextType = {
    // State
    z,
    t,
    selectedScale,
    showRois,
    showLayerEdges,
    showDebugText,
    showDisplayStructures,
    showGrid,
    enabledScales,
    displayStructures,
    allowRoiDrawing,
    roiDrawMode,

    // Actions
    setZ,
    setT,
    setSelectedScale,
    setShowRois,
    setShowLayerEdges,
    setShowDebugText,
    setShowDisplayStructures,
    setShowGrid,
    setRoiContextMenu,
    roiContextMenu,
    setOpenPanels,
    openPanels,
    setEnabledScales,
    setAllowRoiDrawing,
    setRoiDrawMode,
    toggleScale,
    addDisplayStructure,
    removeDisplayStructure,
    clearDisplayStructures,
  };

  return (
    <ViewerStateContext.Provider value={contextValue}>
      {children}
    </ViewerStateContext.Provider>
  );
};

export const useViewerState = (): ViewerStateContextType => {
  const context = useContext(ViewerStateContext);
  if (context === undefined) {
    throw new Error("useViewerState must be used within a ViewerStateProvider");
  }
  return context;
};
