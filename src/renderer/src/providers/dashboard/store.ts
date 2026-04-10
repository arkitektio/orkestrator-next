import { create } from "zustand";
import { ReactNode } from "react";
import { SerializedDockview } from "dockview";

// ── Types ──

export type DashboardWidgetSize = "1x1" | "1x2" | "2x1" | "2x2";

export type DashboardWidgetRegistration = {
  key: string;
  label: string;
  module: string;
  icon?: ReactNode;
  component: () => ReactNode;
  defaultSize: DashboardWidgetSize;
  /** Preferred initial width proportion (0-100). Used when building default layout. */
  defaultWidth?: number;
  /** Preferred initial height proportion (0-100). Used when building default layout. */
  defaultHeight?: number;
};

type DashboardRegistryState = {
  /** All registered widget definitions — modules call `register` to add these */
  widgets: Record<string, DashboardWidgetRegistration>;

  /** Current scope key (server+user+org) — determines which layout to load/save */
  scopeKey: string | null;

  /** Serialized DockView layout (persisted per scope) */
  serializedLayout: SerializedDockview | null;

  // ── Actions ──
  register: (widget: DashboardWidgetRegistration) => void;
  unregister: (key: string) => void;
  setScope: (scopeKey: string) => void;
  saveLayout: (layout: SerializedDockview) => void;
  loadLayout: () => SerializedDockview | null;
  clearLayout: () => void;
};

const STORAGE_PREFIX = "home-dashboard-layout-";

const storageKeyFor = (scopeKey: string) => `${STORAGE_PREFIX}${scopeKey}`;

const persistLayout = (scopeKey: string, layout: SerializedDockview) => {
  try {
    localStorage.setItem(storageKeyFor(scopeKey), JSON.stringify(layout));
  } catch {
    // Silently fail if storage is full
  }
};

const loadLayoutFromStorage = (scopeKey: string): SerializedDockview | null => {
  try {
    const raw = localStorage.getItem(storageKeyFor(scopeKey));
    if (!raw) return null;
    return JSON.parse(raw) as SerializedDockview;
  } catch {
    return null;
  }
};

export const useDashboardRegistry = create<DashboardRegistryState>(
  (set, get) => ({
    widgets: {},
    scopeKey: null,
    serializedLayout: null,

    register: (widget) => {
      set((state) => ({
        widgets: { ...state.widgets, [widget.key]: widget },
      }));
    },

    unregister: (key) => {
      set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _removed, ...widgets } = state.widgets;
        return { widgets };
      });
    },

    setScope: (scopeKey) => {
      const layout = loadLayoutFromStorage(scopeKey);
      set({ scopeKey, serializedLayout: layout });
    },

    saveLayout: (layout) => {
      const { scopeKey } = get();
      if (scopeKey) persistLayout(scopeKey, layout);
      set({ serializedLayout: layout });
    },

    loadLayout: () => {
      const { scopeKey } = get();
      if (!scopeKey) return null;
      return loadLayoutFromStorage(scopeKey);
    },

    clearLayout: () => {
      const { scopeKey } = get();
      if (scopeKey) {
        try {
          localStorage.removeItem(storageKeyFor(scopeKey));
        } catch {
          // ignore
        }
      }
      set({ serializedLayout: null });
    },
  }),
);
