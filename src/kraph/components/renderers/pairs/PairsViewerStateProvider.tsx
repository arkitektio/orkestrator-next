import React from "react";

export type PairsViewerState = {
  showWidgets: boolean;
};

export const PairsViewerStateContext = React.createContext<{
  viewerState: PairsViewerState;
  setViewerState: React.Dispatch<React.SetStateAction<PairsViewerState>>;
} | null>(null);

export const PairsViewerStateProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [viewerState, setViewerState] = React.useState<PairsViewerState>({
    showWidgets: false,
  });

  return (
    <PairsViewerStateContext.Provider value={{ viewerState, setViewerState }}>
      {children}
    </PairsViewerStateContext.Provider>
  );
};

export const usePairsViewerState = () => {
  const context = React.useContext(PairsViewerStateContext);
  if (!context) {
    throw new Error(
      "usePairsViewerState must be used within a PairsViewerStateProvider",
    );
  }
  return context;
};
