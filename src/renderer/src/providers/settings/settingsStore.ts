import { createStore, type StoreApi } from "zustand/vanilla";
import { defaultSettings, type Settings, settingsValidator } from "./validator";

export type SettingsStoreState = {
  settings: Settings | undefined;
  setSettings: (settings: Settings) => void;
  hydrate: () => void;
  setDefaultSettings: (settings: Settings) => void;
};

export type SettingsStore = StoreApi<SettingsStoreState> & {
  cleanup: () => void;
};

function normalizeSettings(
  value: unknown,
  fallbackSettings: Settings,
): Settings | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const definedEntries = Object.fromEntries(
    Object.entries(value as object).filter(([, entryValue]) => entryValue !== undefined),
  );

  const result = settingsValidator.safeParse({
    ...fallbackSettings,
    ...definedEntries,
  });

  if (!result.success) {
    console.error("Invalid settings", result.error);
    return undefined;
  }

  return result.data;
}

function applyThemeSettings(settings: Settings) {
  if (typeof document === "undefined") {
    return;
  }

  const theme = settings.darkMode ? "dark" : "light";
  localStorage.setItem("theme", theme);
  localStorage.setItem("vite-ui-theme", theme);

  if (settings.darkMode) {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("theme-back-bright");
    document.documentElement.classList.remove("theme-back-zink");
    return;
  }

  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("light");
  document.documentElement.classList.remove("theme-back-bright");
  document.documentElement.classList.add("theme-back-zink");
}

function applyBrandSettings(settings: Settings) {
  if (typeof document === "undefined") {
    return;
  }

  if (settings.brandHue !== undefined) {
    document.documentElement.style.setProperty("--brand-hue", settings.brandHue.toString());
  } else {
    document.documentElement.style.removeProperty("--brand-hue");
  }

  if (settings.brandChroma !== undefined) {
    document.documentElement.style.setProperty("--brand-chroma", settings.brandChroma.toString());
  } else {
    document.documentElement.style.removeProperty("--brand-chroma");
  }
}

function applyZoomLevel(zoomLevel: number) {
  if (typeof window !== "undefined" && window.api) {
    window.api.setZoomLevel(zoomLevel).catch(console.error);
  }
}

export function createSettingsStore(
  initialDefaultSettings: Settings = defaultSettings,
): SettingsStore {
  let currentDefaultSettings = initialDefaultSettings;
  let isHydrating = false;

  const store = createStore<SettingsStoreState>((set) => ({
    settings: undefined,
    setSettings: (nextSettings) => {
      const previousSettings = store.getState().settings;
      const normalizedSettings = normalizeSettings(nextSettings, currentDefaultSettings);
      if (normalizedSettings) {
        localStorage.setItem("wasser-settings", JSON.stringify(normalizedSettings));
        console.log("Settings saved to local storage");

        applyThemeSettings(normalizedSettings);
        applyBrandSettings(normalizedSettings);

        if (
          isHydrating ||
          normalizedSettings.defaultZoomLevel !== previousSettings?.defaultZoomLevel
        ) {
          applyZoomLevel(normalizedSettings.defaultZoomLevel);
        }
      }
      set({ settings: normalizedSettings });
    },
    hydrate: () => {
      let localSettings: Settings | undefined;
      isHydrating = true;
      try {
        const serializedSettings = localStorage.getItem("wasser-settings");
        if (serializedSettings) {
          localSettings = normalizeSettings(
            JSON.parse(serializedSettings),
            currentDefaultSettings,
          );
          if (localSettings) {
            console.log("Settings loaded from local storage");
          }
        }
      } catch (error) {
        console.error(error);
        localSettings = undefined;
      }

      if (localSettings) {
        store.getState().setSettings(localSettings);
      } else {
        console.log("Could not load settings from local storage");
        store.getState().setSettings(currentDefaultSettings);
      }
      isHydrating = false;
    },
    setDefaultSettings: (settings) => {
      currentDefaultSettings = settings;
    },
  }));

  const extendedStore = store as SettingsStore;
  extendedStore.cleanup = () => {
    return;
  };

  return extendedStore;
}
