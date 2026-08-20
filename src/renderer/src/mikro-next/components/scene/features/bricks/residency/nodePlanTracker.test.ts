import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { createStore, type StoreApi } from "zustand/vanilla";
import { startNodePlanTracking } from "./nodePlanTracker";
import type { LayerNodePlan } from "../octree/nodePlanning";
import type { LayerState } from "../../../platform/model/layerModel";
import type { ModeState } from "../../../platform/stores/modeStore";
import type { SceneState } from "../../../platform/stores/sceneStore";
import type { ViewerState, LayerViewRange } from "../../../platform/stores/viewerStore";
import type { ViewState } from "../../../platform/stores/viewStore";
import type { BrickSlice } from "../store/brickSlice";

const LAYER_ID = "layer-1";

const layer = {
  id: LAYER_ID,
  visible: true,
  affineMatrix: null,
  xAxis: "x",
  yAxis: "y",
  zAxis: null,
  intensityAxis: "c",
  fixedLOD: null,
  lens: {
    slices: [],
    axisNames: ["y", "x", "c"],
    shape: [512, 512, 1],
    dataset: {
      axisNames: ["y", "x", "c"],
      dataArrays: [
        { level: 0, scaleFactors: null, store: { id: "store-0" } },
        { level: 1, scaleFactors: [2, 2, 1], store: { id: "store-1" } },
      ],
    },
  },
} as unknown as LayerState;

const ARRAYS: Record<string, { shape: number[]; chunks: number[]; dtype: string }> = {
  "store-0": { shape: [512, 512, 1], chunks: [256, 256, 1], dtype: "float32" },
  "store-1": { shape: [256, 256, 1], chunks: [256, 256, 1], dtype: "float32" },
};

const FULL_VIEW: LayerViewRange = { xRange: [0, 512], yRange: [0, 512], zRange: null, scale: 2 };

type ViewerSubset = Pick<
  ViewerState,
  | "layerViewRanges"
  | "lodBias"
  | "currentZ"
  | "residencyVersion"
  | "nodePlans"
  | "unplannableLayers"
  | "getArrayForStoreId"
  | "setNodePlans"
  | "setUnplannableLayers"
>;

const makeStores = (layers: LayerState[] = [layer]) => {
  const viewerStore = createStore<ViewerSubset>((set) => ({
    layerViewRanges: {},
    lodBias: 1,
    currentZ: 0,
    residencyVersion: 0,
    nodePlans: {},
    unplannableLayers: {},
    getArrayForStoreId: ((storeId: string) => {
      const arr = ARRAYS[storeId];
      if (!arr) throw new Error(`unknown store ${storeId}`);
      return arr;
    }) as ViewerSubset["getArrayForStoreId"],
    setNodePlans: (plans: Record<string, LayerNodePlan>) => set({ nodePlans: plans }),
    setUnplannableLayers: (unplannable) => set({ unplannableLayers: unplannable }),
  })) as unknown as StoreApi<ViewerState & BrickSlice>;

  const sceneStore = createStore<Pick<SceneState, "layers">>(() => ({
    layers,
  })) as unknown as StoreApi<SceneState>;

  const viewStore = createStore<Pick<ViewState, "viewProjectionMatrix" | "viewportSize" | "cameraPose">>(
    () => ({
      viewProjectionMatrix: null,
      viewportSize: { width: 800, height: 600 },
      cameraPose: null,
    }),
  ) as unknown as StoreApi<ViewState>;

  const modeStore = createStore<Pick<ModeState, "displayMode">>(() => ({
    displayMode: "2D" as const,
  })) as unknown as StoreApi<ModeState>;

  return { viewerStore, sceneStore, viewStore, modeStore };
};

// Long enough to cross the tracker's MIN_REPLAN_INTERVAL_MS debounce.
const settle = () => new Promise((resolve) => setTimeout(resolve, 280));

describe("startNodePlanTracking", () => {
  it("plans coarsest immediately, then refines when a view range arrives", async () => {
    const stores = makeStores();
    const stop = startNodePlanTracking(stores);

    await settle();
    let plan = stores.viewerStore.getState().nodePlans[LAYER_ID];
    expect(plan.targetLevel).toBe(1);
    expect(plan.nodes.map((n) => n.key)).toEqual(["1:0:0:0"]);

    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: FULL_VIEW } });
    await settle();

    plan = stores.viewerStore.getState().nodePlans[LAYER_ID];
    expect(plan.targetLevel).toBe(0);
    expect(plan.nodes.filter((n) => n.role === "target")).toHaveLength(4);
    expect(plan.nodes.filter((n) => n.role === "keep").map((n) => n.key)).toEqual(["1:0:0:0"]);

    stop();
  });

  it("preserves plan identity when a replan is value-equal", async () => {
    const stores = makeStores();
    const stop = startNodePlanTracking(stores);
    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: FULL_VIEW } });
    await settle();

    const planBefore = stores.viewerStore.getState().nodePlans[LAYER_ID];
    let notifications = 0;
    const unsubscribe = stores.viewerStore.subscribe(() => notifications++);

    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: { ...FULL_VIEW } } });
    await settle();

    expect(notifications).toBe(1); // only the input write itself
    expect(stores.viewerStore.getState().nodePlans[LAYER_ID]).toBe(planBefore);
    unsubscribe();
    stop();
  });

  it("replans when the display mode flips", async () => {
    const stores = makeStores();
    const stop = startNodePlanTracking(stores);
    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: FULL_VIEW } });
    await settle();
    expect(stores.viewerStore.getState().nodePlans[LAYER_ID].mode).toBe("2D");

    stores.modeStore.setState({ displayMode: "3D" });
    await settle();
    expect(stores.viewerStore.getState().nodePlans[LAYER_ID].mode).toBe("3D");

    stop();
  });

  it("refuses a layer whose coarsest-level pool floor exceeds the budget (P18)", async () => {
    // Single-level 16384² float32 image: 2D brick grid 64×64 → (4096+64)
    // slots × 256·256·4 B ≈ 1.09 GB floor > the 512 MB default budget.
    const hugeLayer = {
      ...layer,
      id: "huge-single-level",
      lens: {
        ...layer.lens,
        shape: [16384, 16384, 1],
        dataset: {
          axisNames: ["y", "x", "c"],
          dataArrays: [{ level: 0, scaleFactors: null, store: { id: "store-huge" } }],
        },
      },
    } as unknown as LayerState;
    ARRAYS["store-huge"] = {
      shape: [16384, 16384, 1],
      chunks: [256, 256, 1],
      dtype: "float32",
    };

    const stores = makeStores([layer, hugeLayer]);
    const stop = startNodePlanTracking(stores);
    await settle();

    const state = stores.viewerStore.getState();
    // No plan, no fetch, no pool for the oversized layer…
    expect(state.nodePlans["huge-single-level"]).toBeUndefined();
    // …with the reason surfaced for the UI badge…
    const info = state.unplannableLayers["huge-single-level"];
    expect(info).toBeDefined();
    expect(info.mode).toBe("2D");
    expect(info.floorBytes).toBeGreaterThan(info.capBytes);
    // …while the viable layer alongside still plans normally.
    expect(state.nodePlans[LAYER_ID]).toBeDefined();
    expect(state.unplannableLayers[LAYER_ID]).toBeUndefined();

    stop();
    delete ARRAYS["store-huge"];
  });

  it("plans co-pool layers with identical placement ONCE, sharing plan identity", async () => {
    // The per-channel-layer case: same dataset, same affine, same view range →
    // one equivalence class → one DFS, every member handed the same object.
    const twin = { ...layer, id: "layer-2" } as unknown as LayerState;
    const stores = makeStores([layer, twin]);
    const stop = startNodePlanTracking(stores);
    stores.viewerStore.setState({
      layerViewRanges: { [LAYER_ID]: FULL_VIEW, "layer-2": { ...FULL_VIEW } },
    });
    await settle();

    const plans = stores.viewerStore.getState().nodePlans;
    expect(plans[LAYER_ID]).toBeDefined();
    expect(plans["layer-2"]).toBe(plans[LAYER_ID]);

    stop();
  });

  it("a co-pool member with a different affine plans separately", async () => {
    const moved = {
      ...layer,
      id: "layer-moved",
      affineMatrix: [
        [1, 0, 0, 128],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
    } as unknown as LayerState;
    const stores = makeStores([layer, moved]);
    const stop = startNodePlanTracking(stores);
    stores.viewerStore.setState({
      layerViewRanges: { [LAYER_ID]: FULL_VIEW, "layer-moved": { ...FULL_VIEW } },
    });
    await settle();

    const plans = stores.viewerStore.getState().nodePlans;
    expect(plans[LAYER_ID]).toBeDefined();
    expect(plans["layer-moved"]).toBeDefined();
    expect(plans["layer-moved"]).not.toBe(plans[LAYER_ID]);

    stop();
  });

  it("throttles replans while the camera is moving, catches up on settle", async () => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const stores = makeStores();
    const stop = startNodePlanTracking(stores);
    await settle(); // initial coarsest plan lands (~t=0)

    // Gesture: the MOTION interval (500 ms) governs. Under the idle interval
    // (200 ms, already elapsed) this view-range change would replan on the
    // next animation frame — 150 ms later it must still be pending. On an
    // overloaded runner the wait itself can overshoot the motion window, so
    // the still-pending claim is only asserted when the clock stayed honest.
    stores.viewStore.setState({ cameraMoving: true });
    const changedAt = performance.now();
    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: FULL_VIEW } });
    await wait(150);
    if (performance.now() - changedAt < 400) {
      expect(stores.viewerStore.getState().nodePlans[LAYER_ID].targetLevel).toBe(1);
    }

    // Settle edge: the deferred sharp replan lands promptly (well before the
    // motion timer would have fired).
    stores.viewStore.setState({ cameraMoving: false });
    await wait(100);
    expect(stores.viewerStore.getState().nodePlans[LAYER_ID].targetLevel).toBe(0);

    stop();
  });

  it("REMOVES the plan when a layer turns invisible (visibility must reach the renderer)", async () => {
    const stores = makeStores();
    const stop = startNodePlanTracking(stores);
    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: FULL_VIEW } });
    await settle();
    expect(stores.viewerStore.getState().nodePlans[LAYER_ID]).toBeDefined();

    // Same layer, now hidden: it is filtered from planning, and the stale plan
    // must be PUBLISHED away — residency reconciles pools (and merged passes
    // drop the member) off the nodePlans identity change.
    stores.sceneStore.setState({
      layers: [{ ...layer, visible: false } as unknown as LayerState],
    } as never);
    await settle();
    expect(stores.viewerStore.getState().nodePlans[LAYER_ID]).toBeUndefined();

    stop();
  });

  it("builds the NodeCamera from the published viewSnapshot, not the live view", async () => {
    // W3 coherence: the planner's camera must come from viewerStore's
    // viewSnapshot (published atomically with the ranges) — a live viewStore
    // read paired a fresh camera with one-visibility-hop-stale boxes.
    const makeView = (position: [number, number, number]) => {
      const cam = new THREE.PerspectiveCamera(60, 800 / 600, 1, 100000);
      cam.position.set(...position);
      cam.lookAt(256, 256, 0.5);
      cam.updateMatrixWorld(true);
      cam.updateProjectionMatrix();
      return {
        viewProjectionMatrix: new THREE.Matrix4().multiplyMatrices(
          cam.projectionMatrix,
          cam.matrixWorldInverse,
        ),
        viewportSize: { width: 800, height: 600 },
        cameraPose: {
          position,
          isPerspective: true,
          fovY: THREE.MathUtils.degToRad(60),
          coordinateSystem: THREE.WebGLCoordinateSystem,
        },
      };
    };
    const near = makeView([-100, 256, 0.5]); // 100 voxels off the x face → refines
    const far = makeView([20000, 256, 0.5]); // footprint ≪ 1 px → stays coarse

    const planFor = async (
      live: ReturnType<typeof makeView>,
      snapshot: ReturnType<typeof makeView> | null,
    ) => {
      const stores = makeStores();
      stores.modeStore.setState({ displayMode: "3D" } as never);
      stores.viewStore.setState(live as never);
      stores.viewerStore.setState({
        layerViewRanges: { [LAYER_ID]: FULL_VIEW },
        ...(snapshot ? { viewSnapshot: snapshot } : {}),
      } as never);
      const stop = startNodePlanTracking(stores);
      await settle();
      stop();
      return stores.viewerStore.getState().nodePlans[LAYER_ID];
    };

    const nearLive = await planFor(near, null);
    const farLive = await planFor(far, null);
    expect(nearLive.targetLevel).not.toBe(farLive.targetLevel); // the two views are distinguishable
    // Live view says FAR, snapshot says NEAR: the snapshot must win.
    const snapshotWins = await planFor(far, near);
    expect(snapshotWins.targetLevel).toBe(nearLive.targetLevel);
    expect(snapshotWins.nodes.map((n) => n.key)).toEqual(nearLive.nodes.map((n) => n.key));
  });

  it("stops reacting after cleanup", async () => {
    const stores = makeStores();
    const stop = startNodePlanTracking(stores);
    await settle();
    stop();

    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: FULL_VIEW } });
    await settle();

    expect(stores.viewerStore.getState().nodePlans[LAYER_ID].targetLevel).toBe(1);
  });
});
