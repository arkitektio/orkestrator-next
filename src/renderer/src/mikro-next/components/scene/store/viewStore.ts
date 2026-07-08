import { createStore } from "zustand/vanilla";
import * as THREE from "three";
import { createScopedStoreHooks } from "./createScopedStore";

/** Camera facts the matrix alone cannot provide (perspective LOD math). */
export interface CameraPose {
  /** Camera world position. */
  position: [number, number, number];
  isPerspective: boolean;
  /** Vertical field of view in radians; 0 for orthographic cameras. */
  fovY: number;
}

export interface ViewState {
  // We store the combined projection + view matrix
  viewProjectionMatrix: THREE.Matrix4 | null;
  viewportSize: { width: number; height: number };
  cameraPose: CameraPose | null;
  /** True while the camera is in continuous motion (throttled emissions);
   * false once the trailing settle emission lands. Render-quality scaling. */
  cameraMoving: boolean;

  updateCameraData: (
    matrix: THREE.Matrix4,
    size: { width: number; height: number },
    pose?: CameraPose,
    moving?: boolean,
  ) => void;
}

export const createViewStore = () =>
  createStore<ViewState>((set) => ({
    viewProjectionMatrix: null,
    viewportSize: { width: 0, height: 0 },
    cameraPose: null,
    cameraMoving: false,

    updateCameraData: (matrix, size, pose, moving) =>

      set({
        viewProjectionMatrix: matrix,
        viewportSize: size,
        cameraPose: pose ?? null,
        cameraMoving: moving ?? false,
      }),
  }));

const {
  StoreContext: ViewStoreContext,
  useScopedStore: useViewStore,
  useStoreApi: useViewStoreApi,
} = createScopedStoreHooks<ViewState>("ViewStore");

export { ViewStoreContext, useViewStore, useViewStoreApi };
