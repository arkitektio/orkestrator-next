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
  experimentalViv: boolean;
};

export type SettingsContextType = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};

export const SettingsContext = React.createContext<SettingsContextType>({
  settings: {
    autoResolve: true,
    allowAutoRequest: true,
    allowBatch: true,
    darkMode: true,
    colorScheme: "red",
    experimental: false,
    pollInterval: 1000,
    instanceId: "main",
    experimentalViv: false,
  },
  setSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);
