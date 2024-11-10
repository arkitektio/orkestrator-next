import React, { useContext } from "react";
import { defaultSettings, Settings } from "./validator";

export type SettingsContextType = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};

export const SettingsContext = React.createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);
