import { createStore } from "zustand/vanilla";
import { createScopedStoreHooks } from "./createScopedStore"
import { MikroClient } from "../zarr/zarr_stores/type";
import { RefObject } from "react";
import * as THREE from 'three';
import { SceneFragment } from "@/mikro-next/api/graphql";
import { createConfiguredSceneStores } from "../data/sceneStores";
import { openSceneArrays, type OpenedZarrArray } from "../data/arrayRegistry";
import { fitCameraToObject } from "../core/cameraFit";

/** The subset of the R3F root state we need for camera operations */
export interface CanvasContext {
  camera: THREE.Camera;
  controls: { target: THREE.Vector3; update: () => void } | null;
  size: { width: number; height: number };
  invalidate: () => void;
}


export interface TrackableObject {
  kind: "layer" | "gizmo" | "other";
  id: string;
  ref: RefObject<THREE.Object3D | undefined>;
}

// The range model lives with the visibility math in core/; re-exported here
// for the store's many consumers.
export type { LayerViewRange } from "../core/visibility";
import type { LayerViewRange } from "../core/visibility";
import type { LayerNodePlan } from "../core/octree/nodePlanning";
import type { BrickResidencyManager } from "../managers/brickResidency";

export interface ProbedCoordinate {
  layerId: string;
  localPos: [number, number, number];
  voxelIndex: [number, number, number];
}

/** Why layers were culled from display by the render-cost budget. */
export interface RenderBudgetInfo {
  budgetBytes: number;
  usedBytes: number;
  culledLayerIds: string[];
}

/** Why a layer cannot be planned/rendered in the current display mode: its
 * coarsest pyramid level's pinned atlas floor exceeds the GPU budget (a layer
 * without a multiscale pyramid — see OCTREE_RENDERER.md P18). */
export interface UnplannableLayerInfo {
  mode: "2D" | "3D";
  floorBytes: number;
  capBytes: number;
}


/** Per-scene viewer state: camera-derived facts, trackables, probes and the
 * declarative chunk plans the scene managers write. */
export interface ViewerState {
  debug: boolean;
  showScaleBar: boolean;
  showScaleGrid: boolean;
  worldUnitsPerPixel: number;
  getArrayForStoreId: (storeId: string) => OpenedZarrArray;
  currentZ: number;
  /**
   * Scene-wide selected index per COLLAPSIBLE dim NAME (t, tau, …) — the
   * dims folded to one index at pool creation. Missing entry = the lens
   * slice's collapsed default. Consumers clamp per layer. NOT for z: z is a
   * spatial brick axis (page table holds every slab, scrubbing never
   * refetches), whereas changing one of these selections changes the slice
   * SIGNATURE and flushes affected layers wholesale — by design, the data in
   * every brick is different.
   */
  dimSelections: Record<string, number>;
  setDimSelection: (dim: string, index: number) => void;
  frustumNear: number;
  frustumFar: number;
  canvas: CanvasContext | null;
  // We store the actual refs to perform math on them in the loop
  trackables: Set<TrackableObject>
  // We store strings (names/IDs) for the React UI to consume
  visibleLayers: string[]
  // Visible image-coordinate ranges per layer
  layerViewRanges: Record<string, LayerViewRange>
  probedCoordinate: ProbedCoordinate | null;
  savedProbes: ProbedCoordinate[];
  probeThreshold: number;

  lodBias: number;
  setLodBias: (bias: number) => void;
  /** Null while every layer fits the render-cost budget. */
  renderBudget: RenderBudgetInfo | null;
  setRenderBudget: (info: RenderBudgetInfo | null) => void;
  /** Layers refused by the pool-viability guard for the CURRENT display mode
   * (empty when all layers are plannable). Written by nodePlanTracker /
   * brickResidency; read by the layer panel badge and DebugPanel. */
  unplannableLayers: Record<string, UnplannableLayerInfo>;
  setUnplannableLayers: (layers: Record<string, UnplannableLayerInfo>) => void;

  /** Declarative per-layer octree node plans, written by the node-plan tracker. */
  nodePlans: Record<string, LayerNodePlan>;
  setNodePlans: (plans: Record<string, LayerNodePlan>) => void;
  /** Bumped by the brick residency manager whenever bricks become resident.
   * STREAMING-progress cadence — only debug consumers (DebugPanel,
   * BrickResidencyOverlay) may subscribe; layer components must use
   * `poolsVersion` instead (P17). Deliberately NOT a node-plan replan trigger. */
  residencyVersion: number;
  bumpResidencyVersion: () => void;
  /** Bumped only when a layer's brick POOL is created, rebuilt or disposed —
   * the rare lifecycle event layer components actually need to re-render on
   * (their memos key on pool identity). */
  poolsVersion: number;
  bumpPoolsVersion: () => void;
  /** Handle to the brick residency manager (owned by BrickSystemProvider). */
  brickSystem: BrickResidencyManager | null;
  registerBrickSystem: (manager: BrickResidencyManager | null) => void;

  register: (ref: TrackableObject) => void
  unregister: (ref: TrackableObject) => void
  setVisible: (visibleSet: Set<string>) => void
  setLayerViewRanges: (ranges: Record<string, LayerViewRange>) => void
  setProbedCoordinate: (coordinate: ProbedCoordinate | null) => void
  addSavedProbe: (coordinate: ProbedCoordinate) => void
  removeSavedProbe: (coordinate: ProbedCoordinate) => void
  clearSavedProbes: () => void
  setProbeThreshold: (threshold: number) => void

  setDebug: (debug: boolean) => void;
  setShowScaleBar: (show: boolean) => void;
  setShowScaleGrid: (show: boolean) => void;
  setWorldUnitsPerPixel: (v: number) => void;
  setCurrentZ: (z: number) => void;
  registerCanvas: (ctx: CanvasContext) => void;
  /**
   * Renders the current scene to an offscreen target and returns a PNG Blob.
   * Null until an in-Canvas component (SceneScreenshot) registers it; the
   * registered fn resolves to null if the capture itself fails. Registered from
   * inside <Canvas> because the renderer/scene live in R3F world, not the store.
   */
  captureScreenshot: (() => Promise<Blob | null>) | null;
  registerCapture: (fn: (() => Promise<Blob | null>) | null) => void;
  /** Fit the camera so that the given layer fills the viewport */
  fitToLayer: (layerId: string) => void;
}


function createViewerStoreInternal(arraysByStoreId: Map<string, OpenedZarrArray>) {
  return createStore<ViewerState>((set, get) => ({
    trackables: new Set(),
    visibleLayers: [],
    layerViewRanges: {},
    probedCoordinate: null,
    savedProbes: [],
    probeThreshold: 0.01,
    lodBias: 1,
    setLodBias: (bias) => set({ lodBias: bias }),
    renderBudget: null,
    setRenderBudget: (info) => set({ renderBudget: info }),
    unplannableLayers: {},
    setUnplannableLayers: (layers) => set({ unplannableLayers: layers }),
    nodePlans: {},
    setNodePlans: (plans) => set({ nodePlans: plans }),
    residencyVersion: 0,
    bumpResidencyVersion: () => set((state) => ({ residencyVersion: state.residencyVersion + 1 })),
    poolsVersion: 0,
    bumpPoolsVersion: () => set((state) => ({ poolsVersion: state.poolsVersion + 1 })),
    brickSystem: null,
    registerBrickSystem: (manager) => set({ brickSystem: manager }),
    register: (ref) => set((state) => ({
      trackables: new Set(state.trackables).add(ref),
    })),
    unregister: (ref) => set((state) => {
      const trackables = new Set(state.trackables);
      trackables.delete(ref);
      return { trackables };
    }),
    setVisible: (visibleSet) => set({ visibleLayers: Array.from(visibleSet) }),
    setLayerViewRanges: (ranges) => set({ layerViewRanges: ranges }),
    setProbedCoordinate: (coordinate) => set({ probedCoordinate: coordinate }),
    addSavedProbe: (coordinate) => set((state) => {
      if (state.savedProbes.some((probe) => isSameProbe(probe, coordinate))) {
        return state;
      }
      return { savedProbes: [...state.savedProbes, coordinate] };
    }),
    removeSavedProbe: (coordinate) => set((state) => ({
      savedProbes: state.savedProbes.filter((probe) => !isSameProbe(probe, coordinate)),
    })),
    clearSavedProbes: () => set({ savedProbes: [] }),
    setProbeThreshold: (threshold) => set({ probeThreshold: threshold }),
    currentZ: 0,
    debug: false,
    showScaleBar: true,
    showScaleGrid: false,
    worldUnitsPerPixel: 1,
    frustumNear: 0.1,
    frustumFar: 100000,
    canvas: null,
    getArrayForStoreId: (storeId) => {
      const array = arraysByStoreId.get(storeId);
      if (!array) {
        throw new Error(`Zarr array for store ${storeId} is not initialized`);
      }
      return array;
    },
    setCurrentZ: (z) => set({ currentZ: z }),
    dimSelections: {},
    setDimSelection: (dim, index) => {
      if (get().dimSelections[dim] === index) return; // skip no-op writes
      set((state) => ({ dimSelections: { ...state.dimSelections, [dim]: index } }));
    },
    registerCanvas: (ctx) => set({ canvas: ctx }),
    captureScreenshot: null,
    registerCapture: (fn) => set({ captureScreenshot: fn }),
    fitToLayer: (layerId) => {
      const { trackables, canvas } = get();

      if (!canvas) throw new Error("Canvas context is not registered in viewer store");

      // Find the trackable matching this layer
      let target: THREE.Object3D | undefined;
      for (const t of trackables) {
        if (t.kind === "layer" && t.id === layerId && t.ref.current) {
          target = t.ref.current;
          break;
        }
      }
      if (!target) throw new Error(`Target for layer ${layerId} not found`);

      fitCameraToObject(target, canvas);
    },
    setDebug: (debug) => set({ debug }),
    setShowScaleBar: (show) => set({ showScaleBar: show }),
    setShowScaleGrid: (show) => set({ showScaleGrid: show }),
    setWorldUnitsPerPixel: (v) => set({ worldUnitsPerPixel: v }),
  }));
}

export async function createViewerStore(
  scene: SceneFragment,
  client: MikroClient,
  datalayer: string,
) {
  const storesById = await createConfiguredSceneStores(scene, client, datalayer);
  const arraysByStoreId = await openSceneArrays(storesById);
  return createViewerStoreInternal(arraysByStoreId);
}

function isSameProbe(left: ProbedCoordinate, right: ProbedCoordinate): boolean {
  return (
    left.layerId === right.layerId &&
    left.voxelIndex[0] === right.voxelIndex[0] &&
    left.voxelIndex[1] === right.voxelIndex[1] &&
    left.voxelIndex[2] === right.voxelIndex[2]
  );
}

const {
  StoreContext: ViewerStoreContext,
  useScopedStore: useViewerStore,
  useStoreApi: useViewerStoreApi,
} = createScopedStoreHooks<ViewerState>("ViewerStore");

export { ViewerStoreContext, useViewerStore, useViewerStoreApi };
