import { RoiKind } from "@/mikro-next/api/graphql";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ViewerState {
  // Z/T navigation
  z: number;
  t: number;
  selectedScale: number;

  // Display options
  showRois: boolean;
  showLayerEdges: boolean;
  showDebugText: boolean;

  allowRoiDrawing: boolean; // Optional, used for ROIs
  roiDrawMode: RoiKind; // Optional, used for ROIs

  // Scale management
  enabledScales: Set<number>;
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

  setAllowRoiDrawing: (allow: boolean) => void;
  setRoiDrawMode: (mode: RoiKind) => void;

  // Scale management
  setEnabledScales: (scales: Set<number>) => void;
  toggleScale: (scale: number) => void;
}

export interface ViewerStateContextType
  extends ViewerState,
    ViewerStateActions {}

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

  const [showRois, setShowRois] = useState(initialState.showRois ?? false);
  const [showLayerEdges, setShowLayerEdges] = useState(
    initialState.showLayerEdges ?? false,
  );
  const [showDebugText, setShowDebugText] = useState(
    initialState.showDebugText ?? false,
  );
  const [roiDrawMode, setRoiDrawMode] = useState(
    initialState.roiDrawMode ?? RoiKind.Rectangle,
  );
  const [allowRoiDrawing, setAllowRoiDrawing] = useState(
    initialState.allowRoiDrawing ?? false,
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

  const contextValue: ViewerStateContextType = {
    // State
    z,
    t,
    selectedScale,
    showRois,
    showLayerEdges,
    showDebugText,
    enabledScales,

    allowRoiDrawing,
    roiDrawMode,

    // Actions
    setZ,
    setT,
    setSelectedScale,
    setShowRois,
    setShowLayerEdges,
    setShowDebugText,
    setEnabledScales,
    setAllowRoiDrawing,
    setRoiDrawMode,
    toggleScale,
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
