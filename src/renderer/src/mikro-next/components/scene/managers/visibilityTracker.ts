import type { StoreApi } from "zustand/vanilla";
import { perfMonitor } from "./perfMonitor";
import {
  computeSceneVisibility,
  sameViewRanges,
  sameVisibleIds,
} from "../core/visibility";
import type { SceneState } from "../store/sceneStore";
import type { ViewerState } from "../store/viewerStore";
import type { ViewState } from "../store/viewStore";

/**
 * Store-level driver for the visibility computation (`core/visibility.ts`).
 * Subscribes to the camera matrix (viewStore), the registered trackables
 * (viewerStore) and the layer list (sceneStore), coalesces any burst of
 * changes into ONE recompute per animation frame, and writes results back to
 * the viewer store only when they actually changed — so consumers like
 * `PlaneLayer.updateChunks` don't re-run on camera settles that didn't move
 * the visible ranges.
 *
 * Deliberately synchronous compute: it is a handful of matrix ops per layer,
 * runs only after the camera-settle debounce, and THREE scene-graph objects
 * cannot cheaply cross a worker boundary. The async part is the coalescing.
 */

type VisibilityStores = {
  viewStore: StoreApi<ViewState>;
  viewerStore: StoreApi<ViewerState>;
  sceneStore: StoreApi<SceneState>;
};

const scheduleFrame: (callback: () => void) => void =
  typeof requestAnimationFrame !== "undefined"
    ? (callback) => requestAnimationFrame(callback)
    : (callback) => setTimeout(callback, 0);

export function startVisibilityTracking({
  viewStore,
  viewerStore,
  sceneStore,
}: VisibilityStores): () => void {
  let stopped = false;
  let scheduled = false;

  const recompute = () => {
    const { viewProjectionMatrix, viewportSize } = viewStore.getState();
    if (!viewProjectionMatrix) return;

    perfMonitor.markVisibilityRecompute(); // no-op unless a perf recording is armed
    const viewerState = viewerStore.getState();
    const { visibleIds, ranges } = computeSceneVisibility({
      projScreenMatrix: viewProjectionMatrix,
      viewportSize,
      trackables: viewerState.trackables,
      layers: sceneStore.getState().layers,
    });

    // Write-if-changed: skipping no-op writes keeps every subscriber of
    // visibleLayers / layerViewRanges quiet when nothing moved.
    if (!sameVisibleIds(viewerState.visibleLayers, visibleIds)) {
      viewerState.setVisible(visibleIds);
    }
    if (!sameViewRanges(viewerState.layerViewRanges, ranges)) {
      viewerState.setLayerViewRanges(ranges);
    }
  };

  const schedule = () => {
    if (stopped || scheduled) return;
    scheduled = true;
    scheduleFrame(() => {
      scheduled = false;
      if (!stopped) recompute();
    });
  };

  // Only the inputs trigger a recompute; our own result writes to the viewer
  // store don't change `trackables` and thus don't reschedule.
  let lastMatrix = viewStore.getState().viewProjectionMatrix;
  let lastSize = viewStore.getState().viewportSize;
  const unsubscribeView = viewStore.subscribe((state) => {
    if (state.viewProjectionMatrix !== lastMatrix || state.viewportSize !== lastSize) {
      lastMatrix = state.viewProjectionMatrix;
      lastSize = state.viewportSize;
      schedule();
    }
  });

  let lastTrackables = viewerStore.getState().trackables;
  const unsubscribeViewer = viewerStore.subscribe((state) => {
    if (state.trackables !== lastTrackables) {
      lastTrackables = state.trackables;
      schedule();
    }
  });

  let lastLayers = sceneStore.getState().layers;
  const unsubscribeScene = sceneStore.subscribe((state) => {
    if (state.layers !== lastLayers) {
      lastLayers = state.layers;
      schedule();
    }
  });

  schedule();

  return () => {
    stopped = true;
    unsubscribeView();
    unsubscribeViewer();
    unsubscribeScene();
  };
}
