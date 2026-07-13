import * as THREE from "three";
import type { StoreApi } from "zustand/vanilla";
import { perfMonitor } from "./perfMonitor";
import { MAX_LAYER_POOL_BYTES, getInitialVolumeTextureBudgetBytes } from "../core/lodPlanning";
import { resolveBrickSpec } from "../core/octree/brickSpec";
import { assessPoolViability } from "../core/octree/poolViability";
import {
  buildLayerLevelGeometry,
  buildLevelSources,
  type LevelSource,
} from "../core/octree/levelGeometry";
import {
  planLayerNodes,
  sameNodePlan,
  type LayerNodePlan,
  type NodeCamera,
} from "../core/octree/nodePlanning";
import { buildVolumeVoxelToWorld } from "../core/octree/voxelFrame";
import type { ModeState } from "../store/modeStore";
import type { SceneState } from "../store/sceneStore";
import type { UnplannableLayerInfo, ViewerState } from "../store/viewerStore";
import type { ViewState } from "../store/viewStore";

/** Value equality for the unplannable-layers map (skip no-op store writes). */
const sameUnplannable = (
  previous: Record<string, UnplannableLayerInfo>,
  next: Record<string, UnplannableLayerInfo>,
): boolean => {
  const previousKeys = Object.keys(previous);
  if (previousKeys.length !== Object.keys(next).length) return false;
  return previousKeys.every((key) => {
    const a = previous[key];
    const b = next[key];
    return (
      !!b &&
      a.mode === b.mode &&
      a.floorBytes === b.floorBytes &&
      a.capBytes === b.capBytes
    );
  });
};

/**
 * Store-level driver for the octree node planner (`core/octree/nodePlanning`):
 * subscribe to the planning inputs, coalesce bursts into one recompute per
 * animation frame (debounced), and write plans back only when they changed
 * (per-layer identity preserved via `sameNodePlan`).
 *
 * There is no rendered-feedback loop — the shader falls back to coarser
 * resident bricks per sample, so plans are a pure function of
 * view/z/mode/layers.
 */

type NodePlanStores = {
  viewerStore: StoreApi<ViewerState>;
  sceneStore: StoreApi<SceneState>;
  viewStore: StoreApi<ViewState>;
  modeStore: StoreApi<ModeState>;
};

const scheduleFrame: (callback: () => void) => void =
  typeof requestAnimationFrame !== "undefined"
    ? (callback) => requestAnimationFrame(callback)
    : (callback) => setTimeout(callback, 0);

/**
 * Min interval between replans. During a 3D orbit the camera stream fires
 * every ~60ms; replanning (and the fetch/abort churn each new plan causes)
 * at that cadence fights the interaction for the main thread. Bricks keep
 * rendering from the previous plan meanwhile — the shader's coarse fallback
 * covers newly exposed regions until the next replan lands.
 */
const MIN_REPLAN_INTERVAL_MS = 200;

export function startNodePlanTracking({
  viewerStore,
  sceneStore,
  viewStore,
  modeStore,
}: NodePlanStores): () => void {
  let stopped = false;
  let scheduled = false;
  let lastRecomputeAt = 0;
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;

  const recompute = () => {
    const viewerState = viewerStore.getState();
    const layers = sceneStore.getState().layers;
    const mode = modeStore.getState().displayMode;
    const { viewProjectionMatrix, viewportSize, cameraPose } = viewStore.getState();

    const prevPlans = viewerState.nodePlans;
    const nextPlans: Record<string, LayerNodePlan> = {};
    const nextUnplannable: Record<string, UnplannableLayerInfo> = {};
    let changed = Object.keys(prevPlans).some((layerId) => !layers.find((l) => l.id === layerId));

    const plannableLayers = layers.filter(
      (layer) => layer.visible !== false && (layer.lens.dataset.dataArrays?.length ?? 0) > 0,
    );
    const maxPlanBytes = Math.min(
      MAX_LAYER_POOL_BYTES,
      getInitialVolumeTextureBudgetBytes() / Math.max(1, plannableLayers.length),
    );

    for (const layer of plannableLayers) {
      let levels: LevelSource[];
      try {
        levels = buildLevelSources(
          layer.lens.dataset.dataArrays,
          layer.lens.dataset.dims.length,
          viewerState.getArrayForStoreId,
        );
      } catch {
        // Arrays not opened for this layer (e.g. store still initializing).
        continue;
      }

      const geometry = buildLayerLevelGeometry(layer.lens.dataset.dims, layer, levels);
      if (!geometry) continue;
      const spec = resolveBrickSpec(geometry, mode);

      // Pool-viability guard (P18): a layer whose coarsest level's pinned
      // atlas floor exceeds the GPU budget (typically a single-level dataset,
      // where "coarsest" IS full resolution) must never be planned — the
      // planner would emit its entire full-res grid as unconditional root
      // targets and the pool would attempt a multi-GB atlas allocation. No
      // plan → the brick layers render nothing, no pool, no fetch.
      const viability = assessPoolViability(geometry, spec);
      if (!viability.viable) {
        nextUnplannable[layer.id] = {
          mode,
          floorBytes: viability.floorBytes,
          capBytes: viability.capBytes,
        };
        continue;
      }

      let camera: NodeCamera | null = null;
      if (mode === "3D" && viewProjectionMatrix) {
        const voxelToWorld = buildVolumeVoxelToWorld(layer);
        const voxelFrustum = new THREE.Frustum().setFromProjectionMatrix(
          viewProjectionMatrix.clone().multiply(voxelToWorld),
        );
        let voxelPosition: [number, number, number] | null = null;
        let pxPerVoxelAtUnitDistance = 0;
        if (cameraPose?.isPerspective && cameraPose.fovY > 0) {
          const p = new THREE.Vector3(...cameraPose.position).applyMatrix4(
            voxelToWorld.clone().invert(),
          );
          voxelPosition = [p.x, p.y, p.z];
          pxPerVoxelAtUnitDistance =
            viewportSize.height / (2 * Math.tan(cameraPose.fovY / 2));
        }
        camera = { voxelFrustum, voxelPosition, pxPerVoxelAtUnitDistance };
      }

      const prev = prevPlans[layer.id] ?? null;
      const next = planLayerNodes({
        layer,
        geometry,
        spec,
        mode,
        viewRange: viewerState.layerViewRanges[layer.id],
        camera,
        lodBias: viewerState.lodBias,
        currentZ: viewerState.currentZ,
        maxPlanBytes,
      });

      if (prev && sameNodePlan(prev, next)) {
        nextPlans[layer.id] = prev; // keep identity → no downstream re-render
      } else {
        nextPlans[layer.id] = next;
        changed = true;
      }
    }

    if (changed) {
      viewerState.setNodePlans(nextPlans);
    }

    // Value-compared write (rarely changes — P17-clean): entries clear
    // automatically when a layer becomes viable (e.g. after a mode switch).
    if (!sameUnplannable(viewerState.unplannableLayers, nextUnplannable)) {
      viewerState.setUnplannableLayers(nextUnplannable);
    }
  };

  const schedule = () => {
    if (stopped || scheduled) return;
    const sinceLast = performance.now() - lastRecomputeAt;
    if (sinceLast < MIN_REPLAN_INTERVAL_MS) {
      if (pendingTimer === null) {
        pendingTimer = setTimeout(() => {
          pendingTimer = null;
          schedule();
        }, MIN_REPLAN_INTERVAL_MS - sinceLast);
      }
      return;
    }
    scheduled = true;
    scheduleFrame(() => {
      scheduled = false;
      if (!stopped) {
        lastRecomputeAt = performance.now();
        perfMonitor.markReplan(); // no-op unless a perf recording is armed
        recompute();
      }
    });
  };

  // Trigger only on the planner's inputs; our own setNodePlans writes don't
  // touch these references and thus don't reschedule.
  // NOTE: residencyVersion is deliberately NOT a trigger — plans are a pure
  // function of view/z/mode/layers, so replanning per upload batch would just
  // churn the main thread while bricks stream in.
  const initialViewer = viewerStore.getState();
  let lastViewRanges = initialViewer.layerViewRanges;
  let lastLodBias = initialViewer.lodBias;
  let lastCurrentZ = initialViewer.currentZ;
  const unsubscribeViewer = viewerStore.subscribe((state) => {
    if (
      state.layerViewRanges !== lastViewRanges ||
      state.lodBias !== lastLodBias ||
      state.currentZ !== lastCurrentZ
    ) {
      lastViewRanges = state.layerViewRanges;
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

  let lastMatrix = viewStore.getState().viewProjectionMatrix;
  const unsubscribeView = viewStore.subscribe((state) => {
    if (state.viewProjectionMatrix !== lastMatrix) {
      lastMatrix = state.viewProjectionMatrix;
      schedule();
    }
  });

  let lastDisplayMode = modeStore.getState().displayMode;
  const unsubscribeMode = modeStore.subscribe((state) => {
    if (state.displayMode !== lastDisplayMode) {
      lastDisplayMode = state.displayMode;
      schedule();
    }
  });

  schedule();

  return () => {
    stopped = true;
    if (pendingTimer !== null) clearTimeout(pendingTimer);
    unsubscribeViewer();
    unsubscribeScene();
    unsubscribeView();
    unsubscribeMode();
  };
}
