import * as THREE from "three";
import type { StoreApi } from "zustand/vanilla";
import { MAX_LAYER_POOL_BYTES, getInitialVolumeTextureBudgetBytes } from "../core/lodPlanning";
import { resolveBrickSpec } from "../core/octree/brickSpec";
import { buildLayerLevelGeometry, type LevelSource } from "../core/octree/levelGeometry";
import {
  planLayerNodes,
  sameNodePlan,
  type LayerNodePlan,
  type NodeCamera,
} from "../core/octree/nodePlanning";
import { buildVolumeVoxelToWorld } from "../core/octree/voxelFrame";
import type { ModeState } from "../store/modeStore";
import type { SceneState } from "../store/sceneStore";
import type { ViewerState } from "../store/viewerStore";
import type { ViewState } from "../store/viewStore";

/**
 * Store-level driver for the octree node planner (`core/octree/nodePlanning`),
 * mirroring `chunkPlanTracker.ts`: subscribe to the planning inputs, coalesce
 * bursts into one recompute per animation frame, and write plans back only
 * when they changed (per-layer identity preserved via `sameNodePlan`).
 *
 * Unlike the 2D chunk planner there is no rendered-chunk feedback loop at
 * all — the shader falls back to coarser resident bricks per sample, and
 * plans are a pure function of view/z/mode/layers.
 *
 * Gated on `viewerStore.useOctreeRenderer` so the legacy planners keep sole
 * ownership until the flag flips (shadow-mode: toggle it in the DebugPanel).
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

export function startNodePlanTracking({
  viewerStore,
  sceneStore,
  viewStore,
  modeStore,
}: NodePlanStores): () => void {
  let stopped = false;
  let scheduled = false;

  const recompute = () => {
    const viewerState = viewerStore.getState();

    if (!viewerState.useOctreeRenderer) {
      if (Object.keys(viewerState.nodePlans).length > 0) viewerState.setNodePlans({});
      return;
    }

    const layers = sceneStore.getState().layers;
    const mode = modeStore.getState().displayMode;
    const { viewProjectionMatrix, viewportSize, cameraPose } = viewStore.getState();

    const prevPlans = viewerState.nodePlans;
    const nextPlans: Record<string, LayerNodePlan> = {};
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
        levels = layer.lens.dataset.dataArrays.map((dataArray) => {
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

      const geometry = buildLayerLevelGeometry(layer.lens.dataset.dims, layer, levels);
      if (!geometry) continue;
      const spec = resolveBrickSpec(geometry, mode);

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
  };

  const schedule = () => {
    if (stopped || scheduled) return;
    scheduled = true;
    scheduleFrame(() => {
      scheduled = false;
      if (!stopped) recompute();
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
  let lastFlag = initialViewer.useOctreeRenderer;
  const unsubscribeViewer = viewerStore.subscribe((state) => {
    if (
      state.layerViewRanges !== lastViewRanges ||
      state.lodBias !== lastLodBias ||
      state.currentZ !== lastCurrentZ ||
      state.useOctreeRenderer !== lastFlag
    ) {
      lastViewRanges = state.layerViewRanges;
      lastLodBias = state.lodBias;
      lastCurrentZ = state.currentZ;
      lastFlag = state.useOctreeRenderer;
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
    unsubscribeViewer();
    unsubscribeScene();
    unsubscribeView();
    unsubscribeMode();
  };
}
