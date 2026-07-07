import type { StoreApi } from "zustand/vanilla";
import {
  planLayerChunks,
  sameChunkPlan,
  type LayerChunkPlan,
  type PlanLevel,
} from "../core/chunkPlanning";
import { getInitialVolumeTextureBudgetBytes } from "../core/lodPlanning";
import type { SceneState } from "../store/sceneStore";
import type { ViewerState } from "../store/viewerStore";

/**
 * Store-level driver for the 2D chunk planner (`core/chunkPlanning.ts`),
 * mirroring `visibilityTracker.ts`: subscribe to the planning inputs, coalesce
 * bursts into one recompute per animation frame, and write plans back only
 * when they changed — preserving per-layer plan object identity so
 * `PlaneLayer` selectors stay referentially stable.
 *
 * The feedback loop the planner needs — "a chunk finished rendering, so a
 * cover can retire / a LOD swap can complete" — comes from watching
 * `renderedChunks` (reported by ChunkPlane). The planner is a converging
 * reducer, so plan-induced unmounts do not re-trigger plan changes.
 */

type ChunkPlanStores = {
  viewerStore: StoreApi<ViewerState>;
  sceneStore: StoreApi<SceneState>;
};

const scheduleFrame: (callback: () => void) => void =
  typeof requestAnimationFrame !== "undefined"
    ? (callback) => requestAnimationFrame(callback)
    : (callback) => setTimeout(callback, 0);

export function startChunkPlanTracking({ viewerStore, sceneStore }: ChunkPlanStores): () => void {
  let stopped = false;
  let scheduled = false;

  const recompute = () => {
    const viewerState = viewerStore.getState();
    const layers = sceneStore.getState().layers;

    const renderedChunkKeys = new Set(
      Object.values(viewerState.renderedChunks)
        .filter((chunk) => chunk.status === "rendered")
        .map((chunk) => chunk.chunkKey),
    );

    const prevPlans = viewerState.chunkPlans;
    const nextPlans: Record<string, LayerChunkPlan> = {};
    let changed = Object.keys(prevPlans).some((layerId) => !layers.find((l) => l.id === layerId));

    const plannableLayers = layers.filter(
      (layer) => layer.visible !== false && (layer.lens.dataset.dataArrays?.length ?? 0) > 0,
    );
    // Even per-layer share of the device texture budget — bounds how much the
    // substitution rule may keep resident per layer.
    const maxPlanBytes = getInitialVolumeTextureBudgetBytes() / Math.max(1, plannableLayers.length);

    for (const layer of plannableLayers) {
      const dataArrays = layer.lens.dataset.dataArrays;

      let levels: PlanLevel[];
      try {
        levels = dataArrays.map((dataArray) => {
          const arr = viewerState.getArrayForStoreId(dataArray.store.id);
          return {
            shape: arr.shape,
            chunks: arr.chunks,
            dtype: String(arr.dtype),
            storeId: dataArray.store.id,
            scaleFactors: dataArray.scaleFactors ?? undefined,
          };
        });
      } catch {
        // Arrays not opened for this layer (e.g. store still initializing).
        continue;
      }

      const prev = prevPlans[layer.id] ?? null;
      const next = planLayerChunks({
        layer,
        levels,
        viewRange: viewerState.layerViewRanges[layer.id],
        lodBias: viewerState.lodBias,
        currentZ: viewerState.currentZ,
        renderedChunkKeys,
        prevPlan: prev,
        maxPlanBytes,
      });

      if (prev && sameChunkPlan(prev, next)) {
        nextPlans[layer.id] = prev; // keep identity → no downstream re-render
      } else {
        nextPlans[layer.id] = next;
        changed = true;
        viewerState.setLodDebugInfo(layer.id, {
          currentLOD: next.targetLod,
          targetResolution: levels[next.targetLod]?.shape[0] ?? 0,
          renderedLevels: [...new Set(next.chunks.map((chunk) => chunk.level))],
        });
      }
    }

    if (changed) {
      viewerState.setChunkPlans(nextPlans);
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

  // Trigger only on the planner's inputs; our own setChunkPlans/setLodDebugInfo
  // writes don't touch these references and thus don't reschedule.
  const initialViewer = viewerStore.getState();
  let lastViewRanges = initialViewer.layerViewRanges;
  let lastRenderedChunks = initialViewer.renderedChunks;
  let lastLodBias = initialViewer.lodBias;
  let lastCurrentZ = initialViewer.currentZ;
  const unsubscribeViewer = viewerStore.subscribe((state) => {
    if (
      state.layerViewRanges !== lastViewRanges ||
      state.renderedChunks !== lastRenderedChunks ||
      state.lodBias !== lastLodBias ||
      state.currentZ !== lastCurrentZ
    ) {
      lastViewRanges = state.layerViewRanges;
      lastRenderedChunks = state.renderedChunks;
      lastLodBias = state.lodBias;
      lastCurrentZ = state.currentZ;
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
    unsubscribeViewer();
    unsubscribeScene();
  };
}
