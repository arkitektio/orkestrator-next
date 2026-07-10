import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { createStore, type StoreApi } from "zustand/vanilla";
import { startVisibilityTracking } from "./visibilityTracker";
import type { LayerState } from "../core/layerModel";
import type { SceneState } from "../store/sceneStore";
import type { ViewerState } from "../store/viewerStore";
import type { ViewState } from "../store/viewStore";

const LAYER_ID = "layer-1";

const layer = {
  id: LAYER_ID,
  affineMatrix: null,
  xDim: "x",
  yDim: "y",
  zDim: null,
  intensityDim: null,
  lens: { dims: ["y", "x"], shape: [50, 100] },
} as unknown as LayerState;

const makeMatrix = () => {
  const camera = new THREE.OrthographicCamera(-100, 100, 50, -50, 0.1, 1000);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
};

// Minimal store fakes carrying only the state the tracker touches.
const makeStores = () => {
  const viewStore = createStore<Pick<ViewState, "viewProjectionMatrix" | "viewportSize">>(() => ({
    viewProjectionMatrix: null,
    viewportSize: { width: 200, height: 100 },
  })) as unknown as StoreApi<ViewState>;

  const mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 50, 1));
  const trackable = { kind: "layer" as const, id: LAYER_ID, ref: { current: mesh } };

  type ViewerSubset = Pick<
    ViewerState,
    "trackables" | "visibleLayers" | "layerViewRanges" | "setVisible" | "setLayerViewRanges"
  >;
  const viewerStore = createStore<ViewerSubset>((set) => ({
    trackables: new Set([trackable]) as ViewerSubset["trackables"],
    visibleLayers: [],
    layerViewRanges: {},
    setVisible: (visibleSet) => set({ visibleLayers: Array.from(visibleSet) }),
    setLayerViewRanges: (ranges) => set({ layerViewRanges: ranges }),
  })) as unknown as StoreApi<ViewerState>;

  const sceneStore = createStore<Pick<SceneState, "layers">>(() => ({
    layers: [layer],
  })) as unknown as StoreApi<SceneState>;

  return { viewStore, viewerStore, sceneStore };
};

// The tracker coalesces via setTimeout(0) outside the browser.
const settle = () => new Promise((resolve) => setTimeout(resolve, 20));

describe("startVisibilityTracking", () => {
  it("computes visibility once the camera matrix syncs", async () => {
    const stores = makeStores();
    const stop = startVisibilityTracking(stores);

    await settle();
    expect(stores.viewerStore.getState().visibleLayers).toEqual([]); // no matrix yet

    stores.viewStore.setState({ viewProjectionMatrix: makeMatrix() });
    await settle();

    expect(stores.viewerStore.getState().visibleLayers).toEqual([LAYER_ID]);
    expect(stores.viewerStore.getState().layerViewRanges[LAYER_ID].xRange).toEqual([0, 100]);

    stop();
  });

  it("skips store writes when the result is unchanged", async () => {
    const stores = makeStores();
    const stop = startVisibilityTracking(stores);
    stores.viewStore.setState({ viewProjectionMatrix: makeMatrix() });
    await settle();

    let notifications = 0;
    const unsubscribe = stores.viewerStore.subscribe(() => notifications++);

    // A layer edit that doesn't move anything (same content, new array —
    // e.g. a contrast tweak) must not ripple into visibility writes.
    stores.sceneStore.setState({ layers: [layer] });
    await settle();

    expect(notifications).toBe(0);
    unsubscribe();
    stop();
  });

  it("stops reacting after cleanup", async () => {
    const stores = makeStores();
    const stop = startVisibilityTracking(stores);
    stop();

    stores.viewStore.setState({ viewProjectionMatrix: makeMatrix() });
    await settle();

    expect(stores.viewerStore.getState().visibleLayers).toEqual([]);
  });
});
