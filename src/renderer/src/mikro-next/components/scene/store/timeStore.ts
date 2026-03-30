import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { createScopedStoreHooks } from "@/lib/rekuest/createScopedStore";

export interface TimeState {
  from: Date | null;
  to: Date | null;
  rangeFrom: Date | null;
  rangeTo: Date | null;
  setInterval: (from: Date | null, to: Date | null) => void;
  setRange: (from: Date | null, to: Date | null) => void;
  resetRange: () => void;
  resetInterval: () => void;
}

export const createTimeStore = () =>
  createStore<TimeState>()(
  immer((set) => ({
    from: null,
    to: null,
    rangeFrom: null,
    rangeTo: null,
    setInterval: (from, to) =>
      set((state) => {
        state.from = from;
        state.to = to;
      }),
    setRange: (from, to) =>
      set((state) => {
        state.rangeFrom = from;
        state.rangeTo = to;
      }),
    resetRange: () =>
      set((state) => {
        state.rangeFrom = null;
        state.rangeTo = null;
      }),
    resetInterval: () =>
      set((state) => {
        state.from = null;
        state.to = null;
      }),
  })),
);

const {
  StoreContext: TimeStoreContext,
  useScopedStore: useTimeStore,
  useStoreApi: useTimeStoreApi,
} = createScopedStoreHooks<TimeState>("TimeStore");

export { TimeStoreContext, useTimeStore, useTimeStoreApi };
