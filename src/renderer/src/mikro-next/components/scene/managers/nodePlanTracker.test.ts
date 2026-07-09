import { describe, expect, it } from "vitest";
import { createStore, type StoreApi } from "zustand/vanilla";
import { startNodePlanTracking } from "./nodePlanTracker";
import type { LayerNodePlan } from "../core/octree/nodePlanning";
import type { LayerState } from "../core/layerModel";
import type { ModeState } from "../store/modeStore";
import type { SceneState } from "../store/sceneStore";
import type { ViewerState, LayerViewRange } from "../store/viewerStore";
import type { ViewState } from "../store/viewStore";

const LAYER_ID = "layer-1";

const layer = {
  id: LAYER_ID,
  visible: true,
  affineMatrix: null,
  xDim: "x",
  yDim: "y",
  zDim: null,
  intensityDim: "c",
  fixedLOD: null,
  lens: {
    slices: [],
    dims: ["y", "x", "c"],
    shape: [512, 512, 1],
    dataset: {
      dims: ["y", "x", "c"],
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
  | "getArrayForStoreId"
  | "setNodePlans"
>;

const makeStores = () => {
  const viewerStore = createStore<ViewerSubset>((set) => ({
    layerViewRanges: {},
    lodBias: 1,
    currentZ: 0,
    residencyVersion: 0,
    nodePlans: {},
    getArrayForStoreId: ((storeId: string) => {
      const arr = ARRAYS[storeId];
      if (!arr) throw new Error(`unknown store ${storeId}`);
      return arr;
    }) as ViewerSubset["getArrayForStoreId"],
    setNodePlans: (plans: Record<string, LayerNodePlan>) => set({ nodePlans: plans }),
  })) as unknown as StoreApi<ViewerState>;

  const sceneStore = createStore<Pick<SceneState, "layers">>(() => ({
    layers: [layer],
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
