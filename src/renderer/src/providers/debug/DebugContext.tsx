import React, { useContext } from "react";

export type Settings = {
  autoResolve: boolean;
  allowAutoRequest: boolean;
  darkMode: boolean;
  colorScheme: "red" | "green" | "blue";
  allowBatch: boolean;
  experimental: boolean;
  pollInterval: number;
  instanceId: string;
};

export type DebugContextType = {
  debug: boolean;
  setDebug: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DebugContext = React.createContext<DebugContextType>({
  debug: false,
  setDebug: () => { },
});

export const useDebug = () => useContext(DebugContext);
