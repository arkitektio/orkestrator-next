import { createStore } from "zustand/vanilla";
import { createScopedStoreHooks } from "./createScopedStore"
import { MikroClient, ZarrStore } from "../zarr/zarr_stores/type";
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
import type { LayerChunkPlan } from "../core/chunkPlanning";

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


/** Per-scene viewer state: camera-derived facts, trackables, probes and the
 * declarative chunk plans the scene managers write. */
export interface ViewerState {
  debug: boolean;
  showScaleBar: boolean;
  showScaleGrid: boolean;
  worldUnitsPerPixel: number;
  getArray: (store: ZarrStore) => OpenedZarrArray;
  getArrayForStoreId: (storeId: string) => OpenedZarrArray;
  currentZ: number;
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
  renderedChunks: Record<string, { layerId: string; chunkKey: string; level: number; status: 'loading' | 'rendered' }>;
  setChunkStatus: (chunkId: string, info: { layerId: string; chunkKey: string; level: number; status: 'loading' | 'rendered' } | null) => void;
  lodDebugInfo: Record<string, { currentLOD: number; targetResolution: number; renderedLevels?: number[] }>;
  setLodDebugInfo: (layerId: string, info: { currentLOD: number; targetResolution: number; renderedLevels?: number[] }) => void;
  /** Null while every layer fits the render-cost budget. */
  renderBudget: RenderBudgetInfo | null;
  setRenderBudget: (info: RenderBudgetInfo | null) => void;
  /** Declarative per-layer 2D chunk plans, written by the chunk-plan tracker. */
  chunkPlans: Record<string, LayerChunkPlan>;
  setChunkPlans: (plans: Record<string, LayerChunkPlan>) => void;

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
  setFrustum: (near: number, far: number) => void;
  registerCanvas: (ctx: CanvasContext) => void;
  /** Fit the camera so that the given layer fills the viewport */
  fitToLayer: (layerId: string) => void;
}


function createViewerStoreInternal(
  arraysByStoreId: Map<string, OpenedZarrArray>,
  arraysByStore: WeakMap<object, OpenedZarrArray>,
) {
  return createStore<ViewerState>((set, get) => ({
    trackables: new Set(),
    visibleLayers: [],
    layerViewRanges: {},
    probedCoordinate: null,
    savedProbes: [],
    probeThreshold: 0.01,
    lodBias: 1,
    setLodBias: (bias) => set({ lodBias: bias }),
    renderedChunks: {},
    setChunkStatus: (chunkId, info) => set((state) => {
      const next = { ...state.renderedChunks };
      if (!info) {
        delete next[chunkId];
      } else {
        next[chunkId] = info;
      }
      return { renderedChunks: next };
    }),
    lodDebugInfo: {},
    setLodDebugInfo: (layerId, info) => set((state) => ({ lodDebugInfo: { ...state.lodDebugInfo, [layerId]: info } })),
    renderBudget: null,
    setRenderBudget: (info) => set({ renderBudget: info }),
    chunkPlans: {},
    setChunkPlans: (plans) => set({ chunkPlans: plans }),
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
    getArray: (store) => {
      const key = store as object;
      const cachedByStore = arraysByStore.get(key);
      if (cachedByStore) {
        return cachedByStore;
      }

      if ("storeId" in store && typeof (store as { storeId?: unknown }).storeId === "string") {
        const cachedByStoreId = arraysByStoreId.get((store as { storeId: string }).storeId);
        if (cachedByStoreId) {
          arraysByStore.set(key, cachedByStoreId);
          return cachedByStoreId;
        }
      }

      throw new Error("Zarr array is not initialized for this store")
    },
    getArrayForStoreId: (storeId) => {
      const array = arraysByStoreId.get(storeId);
      if (!array) {
        throw new Error(`Zarr array for store ${storeId} is not initialized`);
      }
      return array;
    },
    setCurrentZ: (z) => set({ currentZ: z }),
    setFrustum: (near, far) => set({ frustumNear: near, frustumFar: far }),
    registerCanvas: (ctx) => set({ canvas: ctx }),
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
  const { arraysByStoreId, arraysByStore } = await openSceneArrays(storesById);
  return createViewerStoreInternal(arraysByStoreId, arraysByStore);
}

export function createViewerStoreSync() {
  return createViewerStoreInternal(
    new Map<string, OpenedZarrArray>(),
    new WeakMap<object, OpenedZarrArray>(),
  );
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
