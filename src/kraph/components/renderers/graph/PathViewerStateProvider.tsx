import React from "react";

export type PathViewerState = {
  showWidgets: boolean;
};

export const PathViewerStateContext = React.createContext<{
  viewerState: PathViewerState;
  setViewerState: React.Dispatch<React.SetStateAction<PathViewerState>>;
} | null>(null);

export const PathViewerStateProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [viewerState, setViewerState] = React.useState<PathViewerState>({
    showWidgets: true,
  });

  return (
    <PathViewerStateContext.Provider value={{ viewerState, setViewerState }}>
      {children}
    </PathViewerStateContext.Provider>
  );
};

export const usePathViewerState = () => {
  const context = React.useContext(PathViewerStateContext);
  if (!context) {
    throw new Error(
      "usePathViewerState must be used within a PathViewerStateProvider",
    );
  }
  return context;
};
