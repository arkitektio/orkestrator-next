import React, { useCallback, useEffect, useRef, useState } from "react";
import { SettingsContext } from "./SettingsContext";
import {
  Settings,
  defaultSettings as defSett,
  settingsValidator,
} from "./validator";

export type SettingsProps = {
  children: React.ReactNode;
  defaultSettings?: Settings;
};

export const SettingsProvider: React.FC<SettingsProps> = ({
  children,
  defaultSettings = defSett,
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

  // Debounced zoom level application
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const applyZoomLevel = useCallback((zoomLevel: number) => {
    if (typeof window !== 'undefined' && window.api) {
      window.api.setZoomLevel(zoomLevel).catch(console.error);
    }
  }, []);

  const debouncedApplyZoomLevel = useCallback((zoomLevel: number) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      applyZoomLevel(zoomLevel);
    }, 150); // 150ms debounce delay
  }, [applyZoomLevel]);

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
    if (settings?.primaryColor) {
      document.documentElement.style.setProperty("--primary", settings.primaryColor);
      document.documentElement.style.setProperty("--sidebar-primary", settings.primaryColor);
      // We might want to set derived colors too, but let's start with this
    }
  }, [settings?.primaryColor]);

  useEffect(() => {
    // Apply zoom level when settings change (debounced)
    if (settings?.defaultZoomLevel) {
      debouncedApplyZoomLevel(settings.defaultZoomLevel);
    }
  }, [settings?.defaultZoomLevel, debouncedApplyZoomLevel]);

  useEffect(() => {
    // load settings from local storage
    const loadValidateSettings = async () => {
      let localSettings;
      try {
        let l = localStorage.getItem("wasser-settings");
        console.log("Loaded Settings", l);
        if (l) {
          localSettings = await settingsValidator.parseAsync(JSON.parse(l));
          console.log("Settings loaded from local storage");
        }
      } catch (e) {
        console.error(e);
        localSettings = undefined;
      }

      if (localSettings) {
        setSettings(localSettings as Settings);
        // Apply zoom level immediately when settings are loaded (non-debounced for initial load)
        if (localSettings.defaultZoomLevel) {
          applyZoomLevel(localSettings.defaultZoomLevel);
        }
      } else {
        console.log("Could not load settings from local storage");
        // settings the defaults if no settings are found in local storage
        setSettings(defaultSettings);
        // Apply default zoom level (non-debounced for initial load)
        if (defaultSettings.defaultZoomLevel) {
          applyZoomLevel(defaultSettings.defaultZoomLevel);
        }
      }
    };

    loadValidateSettings();
  }, [applyZoomLevel]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
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
