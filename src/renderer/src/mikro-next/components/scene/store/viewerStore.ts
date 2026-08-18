import { createStore } from "zustand/vanilla";
import { createScopedStoreHooks } from "@/lib/generic/createScopedStore"
import { MikroClient } from "@/lib/zarr/store/types";
import { RefObject } from "react";
import * as THREE from 'three';
import { SceneFragment } from "@/mikro-next/api/graphql";
import type { BrandTarget } from "@/providers/settings/brandTheme";
import { createConfiguredSceneStores } from "../sources/zarrSources";
import { openSceneArrays, type OpenedZarrArray } from "../sources/arrayRegistry";
import { fitCameraToObject } from "../core/cameraFit";

/** The subset of the R3F root state we need for camera operations */
export interface CanvasContext {
  camera: THREE.Camera;
  controls: { target: THREE.Vector3; update: () => void } | null;
  /** CSS pixels. */
  size: { width: number; height: number };
  /** Active device-pixel ratio — the quality governor modulates this per tier,
   * so it is NOT `window.devicePixelRatio`. `size * dpr` is the real fragment
   * count the raymarch pays; the debug report needs it to stop guessing. */
  dpr: number;
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
import type { FabriksCollectionManager } from "../render/fabriks/fabriksManager";

import { probeAfterPinChange } from "../core/probe/probeTargeting";
import { applyExactValues, type ProbeFetchKey, type ProbeMode, type ProbeResult } from "../core/probe/probeTypes";
import {
  applyAttributeRows,
  buildProbedAttributes,
  planIdentity,
  type AttributeColumnLike,
  type AttributeFetchKey,
  type AttributePlanLike,
  type AttributeRow,
  type PlanRowsState,
  type ProbedAttributes,
} from "@/mikro-next/lib/attributes/attributeTypes";

/**
 * The scene's concrete attribute key: the generic `(systemId, pointId)`
 * identity PLUS the probe fields the panels compare against
 * (`isSameProbeKey`) and the tracker needs to rebuild coordinates.
 */
export type SceneAttributeKey = AttributeFetchKey &
  ProbeFetchKey & {
    /** Mesh probes only: the instance's objectId — the tracker's value-known
     * lookup key (no field-array sample needed). */
    instanceValue?: number;
  };

/** Build the scene key for a probed point: `pointId` encodes the probe identity. */
export const sceneAttributeKey = (
  probe: ProbeFetchKey & { strategy?: string; values?: readonly { value: number | null }[] },
  systemId: string,
): SceneAttributeKey => {
  const instanceValue =
    probe.strategy === "mesh" && probe.values?.[0]?.value != null
      ? probe.values[0].value
      : undefined;
  return {
    layerId: probe.layerId,
    voxelIndex: probe.voxelIndex,
    sliceSignature: probe.sliceSignature,
    systemId,
    pointId: `${probe.layerId}:${probe.voxelIndex.join(",")}:${probe.sliceSignature}`,
    ...(instanceValue !== undefined ? { instanceValue } : {}),
  };
};

/** Historical name for the probe result; kept so the markers / probe-orbit
 * consumers (`layerId`/`localPos`/`voxelIndex`) compile untouched. */
export type ProbedCoordinate = ProbeResult;
export type { ProbeMode, ProbeResult } from "../core/probe/probeTypes";

/** One picked mesh instance (`FabriksCollectionLayer` click / card input). */
export interface MeshSelectionState {
  layerId: string;
  /** The dense per-vertex ordinal — what the shader highlights/isolates. */
  ordinal: number;
  /** Resolved asynchronously from the collection's object catalog. */
  objectId: number | null;
  /** Catalog stats, resolved alongside `objectId`. */
  stats: { vertices: number; indices: number } | null;
  isolate: boolean;
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
  /** The red-X/green-Y origin crosshair (`layers/SceneAxis.tsx`). */
  showSceneAxis: boolean;
  worldUnitsPerPixel: number;
  getArrayForStoreId: (storeId: string) => OpenedZarrArray;
  /** Whether this store's array is already open — the reconcile's diff input. */
  hasArrayForStoreId: (storeId: string) => boolean;
  /**
   * Register arrays opened AFTER the scope was built, for layers that arrived
   * into a running scene.
   *
   * Deliberately not a `set`: the registry is not reactive state, and nothing
   * subscribes to it. The LAYER fold that follows is what wakes the trackers —
   * so callers MUST register arrays BEFORE folding the layers. Folding first
   * produces one replan that skips the new layer (`buildLevelSources` throws
   * on the missing array and the planner continues past it) with nothing left
   * to retry it.
   */
  registerArrays: (arrays: ReadonlyMap<string, OpenedZarrArray>) => void;
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
  /**
   * The live probe. **A HOT field: vanilla subscribers only.**
   *
   * It changes once per voxel crossing, which while the cursor sweeps is
   * effectively once per rendered frame. Under P17 that bars React from
   * subscribing to it — the canvas-side consumers that genuinely need this
   * latency (the markers, the axis guides, the RoiDrawer's rubber band) bind
   * to it imperatively through `subscribe`/`getState`. React reads
   * `probeReadout`.
   */
  probedCoordinate: ProbedCoordinate | null;
  /**
   * UI-cadence mirror of `probedCoordinate` — the only probe field React may
   * subscribe to. Published by `managers/ProbeReadoutSettler.tsx` once the
   * cursor rests, with retractions, clicks and target changes bypassing the
   * wait (`core/probe/probeReadout.ts`).
   */
  probeReadout: ProbedCoordinate | null;
  probeThreshold: number;
  /** User-selected probe strategy; "auto" follows the layer's projection. */
  probeMode: ProbeMode;
  /**
   * Which layer the probe reads, or null for the DEFAULT: the first visible
   * layer (see `effectiveProbeLayerId`). Exactly one layer ever answers —
   * every other layer declines the pointer event (without stopping
   * propagation) so it falls through to the target layer's mesh.
   */
  probeLayerId: string | null;

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
  /** Per-MeshLayer fabriks managers (owned by FabriksCollectionLayer), for
   * debug consumers — the mesh twin of `brickSystem`. */
  meshSystems: Record<string, FabriksCollectionManager>;
  registerMeshSystem: (layerId: string, manager: FabriksCollectionManager | null) => void;
  /** Bumped (throttled by the layer) as mesh cells plan/stream. STREAMING
   * cadence — only debug consumers may subscribe (P17), like `residencyVersion`. */
  meshVersion: number;
  bumpMeshVersion: () => void;
  /** The picked mesh instance (one scene-wide, like the probe): set by a
   * click on a mesh layer, consumed by that layer's manager (highlight /
   * isolate) and the MeshLayerCard. `objectId` resolves asynchronously from
   * the collection's object catalog — null while in flight. */
  meshSelection: MeshSelectionState | null;
  setMeshSelection: (selection: MeshSelectionState | null) => void;
  /** Debug-page opt-in: probing a voxel whose attribute plans name a mesh
   * collection (a MeshSample plan) MARKS that instance — highlight + hull. */
  markProbedInstances: boolean;
  setMarkProbedInstances: (mark: boolean) => void;

  register: (ref: TrackableObject) => void
  unregister: (ref: TrackableObject) => void
  setVisible: (visibleSet: Set<string>) => void
  setLayerViewRanges: (ranges: Record<string, LayerViewRange>) => void
  setProbedCoordinate: (coordinate: ProbedCoordinate | null) => void
  /** Written ONLY by `ProbeReadoutSettler`; everything else writes the hot
   * field and lets the settler decide when the HUD sees it. */
  setProbeReadout: (coordinate: ProbedCoordinate | null) => void
  setProbeThreshold: (threshold: number) => void
  setProbeMode: (mode: ProbeMode) => void
  /** Pin the probe to one layer, or null for the default (first visible
   * layer). Clears a probe belonging to a different layer, so the readout
   * never keeps showing values from a layer the probe no longer reads; the
   * probe panel reconciles the default-target cases this setter cannot see. */
  setProbeLayerId: (layerId: string | null) => void
  /** Async exact-value upgrade: patches the active probe when the fetched key
   * still matches (no-op set otherwise, so late arrivals never cause
   * renders). Currently unwired on the hover path — the hover readout
   * deliberately stays at resident-LOD values (no per-hover chunk reads);
   * retained for a future save-time upgrade. */
  mergeExactProbeValues: (key: ProbeFetchKey, values: number[]) => void

  /** "What is under this pixel?" — per-table lookup results for the active
   * probe, written by AttributeProbeTracker executing the probed system's
   * attribute plans locally (zarr sample + DuckDB lookup). */
  probedAttributes: ProbedAttributes<SceneAttributeKey> | null;
  /** A new probed point's plans are known: reset the slice to all-pending. */
  beginProbedAttributes: (key: SceneAttributeKey, plans: readonly AttributePlanLike[]) => void;
  /** Async per-plan settlement: no-op set when the key went stale (same
   * late-arrival contract as mergeExactProbeValues). */
  mergeAttributeRows: (key: SceneAttributeKey, planKey: string, state: PlanRowsState) => void;
  /** Whole-slice commit for the SYNCHRONOUS all-cached path — one set for N
   * plans instead of `begin` plus a `merge` each, and no set at all when the
   * result is value-equal to what is already up. */
  commitProbedAttributes: (
    key: SceneAttributeKey,
    planMeta: NonNullable<ViewerState["probedAttributes"]>["planMeta"],
    states: readonly (readonly [string, PlanRowsState])[],
  ) => void;
  clearProbedAttributes: () => void;
  /** The lazy one-hop FK follow (`references`), registered by the tracker so
   * the HUD can expand a referencing attribute without owning the engine —
   * the captureScreenshot registration pattern. */
  followAttributeReference:
    | ((column: AttributeColumnLike, value: number | bigint) => Promise<readonly AttributeRow[] | null>)
    | null;
  registerFollowAttributeReference: (
    fn:
      | ((column: AttributeColumnLike, value: number | bigint) => Promise<readonly AttributeRow[] | null>)
      | null,
  ) => void;

  setDebug: (debug: boolean) => void;
  setShowScaleBar: (show: boolean) => void;
  setShowScaleGrid: (show: boolean) => void;
  setShowSceneAxis: (show: boolean) => void;
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
  /**
   * The majority hue actually ON SCREEN, sampled from rendered canvas pixels
   * by `CanvasHueProbe`. Null until a frame with content has been sampled
   * (and again when the canvas unmounts) — `SceneBrandTheme` then falls back
   * to the colormap-derived estimate.
   */
  sampledBrandTarget: BrandTarget | null;
  setSampledBrandTarget: (target: BrandTarget | null) => void;
  /** Fit the camera so that the given layer fills the viewport */
  fitToLayer: (layerId: string) => void;
}


function createViewerStoreInternal(arraysByStoreId: Map<string, OpenedZarrArray>) {
  return createStore<ViewerState>((set, get) => ({
    trackables: new Set(),
    visibleLayers: [],
    layerViewRanges: {},
    probedCoordinate: null,
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
    meshSystems: {},
    registerMeshSystem: (layerId, manager) =>
      set((state) => {
        const meshSystems = { ...state.meshSystems };
        if (manager) meshSystems[layerId] = manager;
        else delete meshSystems[layerId];
        return { meshSystems };
      }),
    meshVersion: 0,
    bumpMeshVersion: () => set((state) => ({ meshVersion: state.meshVersion + 1 })),
    meshSelection: null,
    setMeshSelection: (selection) => set({ meshSelection: selection }),
    markProbedInstances: false,
    setMarkProbedInstances: (mark) => set({ markProbedInstances: mark }),
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
    probeReadout: null,
    setProbeReadout: (coordinate) =>
      set((state) =>
        state.probeReadout === coordinate ? state : { probeReadout: coordinate },
      ),
    setProbeThreshold: (threshold) => set({ probeThreshold: threshold }),
    probeMode: "auto",
    setProbeMode: (mode) => set({ probeMode: mode }),
    probeLayerId: null,
    setProbeLayerId: (layerId) =>
      set((state) => ({
        probeLayerId: layerId,
        probedCoordinate: probeAfterPinChange(state.probedCoordinate, layerId),
      })),
    mergeExactProbeValues: (key, values) =>
      set((state) => applyExactValues(state, key, values) ?? state),
    probedAttributes: null,
    beginProbedAttributes: (key, plans) =>
      set({
        probedAttributes: {
          key,
          byPlan: Object.fromEntries(
            plans.map((plan) => [planIdentity(plan), { status: "pending", rows: [] } as PlanRowsState]),
          ),
          planMeta: Object.fromEntries(
            plans.map((plan) => [
              planIdentity(plan),
              {
                tableName: plan.table.name,
                tableId: plan.table.id,
                attributes: plan.lookup.attributes,
              },
            ]),
          ),
        },
      }),
    mergeAttributeRows: (key, planKey, planState) =>
      set((state) => {
        const next = applyAttributeRows(state.probedAttributes, key, planKey, planState);
        return next ? { probedAttributes: next } : state;
      }),
    commitProbedAttributes: (key, planMeta, states) =>
      set((state) => {
        const next = buildProbedAttributes(state.probedAttributes, key, planMeta, states);
        return next ? { probedAttributes: next } : state;
      }),
    clearProbedAttributes: () =>
      set((state) => (state.probedAttributes === null ? state : { probedAttributes: null })),
    followAttributeReference: null,
    registerFollowAttributeReference: (fn) => set({ followAttributeReference: fn }),
    currentZ: 0,
    debug: false,
    showScaleBar: true,
    showScaleGrid: false,
    showSceneAxis: true,
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
    hasArrayForStoreId: (storeId) => arraysByStoreId.has(storeId),
    registerArrays: (arrays) => {
      for (const [storeId, array] of arrays) arraysByStoreId.set(storeId, array);
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
    sampledBrandTarget: null,
    setSampledBrandTarget: (target) => {
      if (get().sampledBrandTarget === target) return; // skip no-op writes
      set({ sampledBrandTarget: target });
    },
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
    setShowSceneAxis: (show) => set({ showSceneAxis: show }),
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

const {
  StoreContext: ViewerStoreContext,
  useScopedStore: useViewerStore,
  useStoreApi: useViewerStoreApi,
} = createScopedStoreHooks<ViewerState>("ViewerStore");

export { ViewerStoreContext, useViewerStore, useViewerStoreApi };
