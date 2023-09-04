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

export type SettingsContextType = {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>;
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
  },
  setSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);
