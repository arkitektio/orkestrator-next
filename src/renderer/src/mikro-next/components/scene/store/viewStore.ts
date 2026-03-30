import { createStore } from "zustand/vanilla";
import * as THREE from "three";
import { createScopedStoreHooks } from "./createScopedStore";

interface ViewState {
  // We store the combined projection + view matrix
  viewProjectionMatrix: THREE.Matrix4 | null;
  viewportSize: { width: number; height: number };

  updateCameraData: (
    matrix: THREE.Matrix4,
    size: { width: number; height: number },
  ) => void;
}

export const createViewStore = () =>
  createStore<ViewState>((set) => ({
    viewProjectionMatrix: null,
    viewportSize: { width: 0, height: 0 },

    updateCameraData: (matrix, size) =>


      set({
        viewProjectionMatrix: matrix,
        viewportSize: size,
      }),
  }));

const {
  StoreContext: ViewStoreContext,
  useScopedStore: useViewStore,
  useStoreApi: useViewStoreApi,
} = createScopedStoreHooks<ViewState>("ViewStore");

export { ViewStoreContext, useViewStore, useViewStoreApi };
