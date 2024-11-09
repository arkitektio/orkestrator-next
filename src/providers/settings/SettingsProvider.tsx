import React, { useEffect, useState } from "react";
import * as zod from "yup";
import { Settings, SettingsContext } from "./SettingsContext";
import { set } from "date-fns";

export type SettingsProps = {
  children: React.ReactNode;
  defaultSettings?: Settings;
};

const settingsValidator = zod.object().shape({
  autoResolve: zod.boolean().required(),
  allowAutoRequest: zod.boolean().required(),
  allowBatch: zod.boolean().required(),
  darkMode: zod.boolean().required(),
  colorScheme: zod.string().required(),
  experimental: zod.boolean().required(),
  pollInterval: zod.number().required(),
  instanceId: zod.string().required(),
  experimentalViv: zod.boolean().required(),
});

export const SettingsProvider: React.FC<SettingsProps> = ({
  children,
  defaultSettings = {
    autoResolve: true,
    allowAutoRequest: true,
    allowBatch: true,
    darkMode: true,
    colorScheme: "red",
    experimental: false,
    pollInterval: 3000,
    instanceId: "main",
    experimentalViv: false,
  },
}) => {
  const [settings, setLocalSettings] = useState<Settings | undefined>(
    undefined,
  );

  const setSettings = (settings: Settings) => {
    console.log("Saving settings", settings);
    if (settings) {
      localStorage.setItem("wasser-settings", JSON.stringify(settings));
      console.log("Settings saved to local storage");
    }
    setLocalSettings(settings);
  };

  useEffect(() => {
    if (settings?.darkMode) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      document.documentElement.classList.add("theme-back-bright");
      document.documentElement.classList.remove("theme-back-zink");
    }
    if (!settings?.darkMode) {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("theme-back-bright");
      document.documentElement.classList.add("theme-back-zink");
    }
  }, [settings?.darkMode]);

  useEffect(() => {
    if (settings?.colorScheme) {
      document.documentElement.classList.remove(
        "theme-green",
        "theme-blue",
        "theme-red",
      );
      document.documentElement.classList.add(`theme-${settings.colorScheme}`);
    }
  }, [settings?.colorScheme]);

  useEffect(() => {
    // load settings from local storage
    const loadValidateSettings = async () => {
      let localSettings;
      try {
        let l = localStorage.getItem("wasser-settings");
        console.log("Loaded Settings", l);
        if (l) {
          localSettings = await settingsValidator.validate(JSON.parse(l));
          console.log("Settings loaded from local storage");
        }
      } catch (e) {
        console.error(e);
        localSettings = undefined;
      }

      if (localSettings) {
        setSettings(localSettings as Settings);
      } else {
        console.log("Could not load settings from local storage");
        // settings the defaults if no settings are found in local storage
        setSettings(defaultSettings);
      }
    };

    loadValidateSettings();
  }, []);

  if (!settings) {
    return <>Loading settings</>;
  }

  return (
    <SettingsContext.Provider
      value={{
        settings: settings,
        setSettings: setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
