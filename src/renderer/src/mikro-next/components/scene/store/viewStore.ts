import { createStore } from "zustand/vanilla";
import * as THREE from "three";
import { createScopedStoreHooks } from "@/lib/generic/createScopedStore";

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

const samePose = (a: CameraPose | null, b: CameraPose | null): boolean =>
  a === b ||
  (!!a &&
    !!b &&
    a.isPerspective === b.isPerspective &&
    a.fovY === b.fovY &&
    a.position[0] === b.position[0] &&
    a.position[1] === b.position[1] &&
    a.position[2] === b.position[2]);

export const createViewStore = () =>
  createStore<ViewState>((set, get) => ({
    viewProjectionMatrix: null,
    viewportSize: { width: 0, height: 0 },
    cameraPose: null,
    cameraMoving: false,

    // Camera emissions arrive ~16/s during a drag. Keep the PREVIOUS object
    // references for viewportSize/cameraPose when their values are unchanged —
    // otherwise every emission mints fresh identities and any React selector
    // returning one of these objects re-renders at frame rate (P9c/P17).
    updateCameraData: (matrix, size, pose, moving) => {
      const prev = get();
      const sameSize =
        prev.viewportSize.width === size.width &&
        prev.viewportSize.height === size.height;
      const nextPose = pose ?? null;
      set({
        viewProjectionMatrix: matrix,
        viewportSize: sameSize ? prev.viewportSize : size,
        cameraPose: samePose(prev.cameraPose, nextPose) ? prev.cameraPose : nextPose,
        cameraMoving: moving ?? false,
      });
    },
  }));

const {
  StoreContext: ViewStoreContext,
  useScopedStore: useViewStore,
  useStoreApi: useViewStoreApi,
} = createScopedStoreHooks<ViewState>("ViewStore");

export { ViewStoreContext, useViewStore, useViewStoreApi };
