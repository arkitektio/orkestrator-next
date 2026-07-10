import { createContext, ReactNode, useContext, useState } from "react";
import { Vector3 } from "three";

export type PanelData = {
  screenPos: { x: number; y: number };
  worldPos: Vector3;
  panelType: RegisteredPanels;
};

interface PanelContextType {
  activePanel: PanelData | null;
  openPanel: (options: PanelData) => void;
  closePanel: () => void;
}

export const PanelContext = createContext<PanelContextType | undefined>(
  undefined,
);

type RegisteredPanels = "clickWidget" | "otherPanelTypes";

export const PanelProvider = ({ children }: { children: ReactNode }) => {
  const [activePanel, setActivePanel] =
    useState<PanelContextType["activePanel"]>(null);

  const openPanel = (options: {
    screenPos: { x: number; y: number };
    worldPos: Vector3;
    panelType: RegisteredPanels;
  }) => {
    // We store the 3D position to calculate screen projection,
    // and the raw world coords for the text display.
    setActivePanel({ ...options });
  };

  const closePanel = () => setActivePanel(null);

  return (
    <PanelContext.Provider value={{ activePanel, openPanel, closePanel }}>
      {children}
    </PanelContext.Provider>
  );
};

export const usePanel = () => {
  const context = useContext(PanelContext);
  if (!context) throw new Error("usePanel must be used within PanelProvider");
  return context;
};
