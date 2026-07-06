import { describe, expect, it } from "vitest";
import { createStore, type StoreApi } from "zustand/vanilla";
import { startChunkPlanTracking } from "./chunkPlanTracker";
import type { LayerChunkPlan } from "../core/chunkPlanning";
import type { LayerState } from "../core/layerModel";
import type { SceneState } from "../store/sceneStore";
import type { ViewerState, LayerViewRange } from "../store/viewerStore";
import type { ZarrStore } from "../zarr/zarr_stores/type";

const LAYER_ID = "layer-1";

const layer = {
  id: LAYER_ID,
  visible: true,
  affineMatrix: null,
  xDim: "x",
  yDim: "y",
  zDim: null,
  intensityDim: "c",
  colormap: null,
  color: null,
  fixedLOD: null,
  lens: {
    slices: [],
    dataset: {
      dims: ["y", "x", "c"],
      dataArrays: [
        { level: 0, scaleFactors: null, store: { id: "store-0" } },
        { level: 1, scaleFactors: [2, 2, 1], store: { id: "store-1" } },
      ],
    },
  },
} as unknown as LayerState;

// Fake opened zarr arrays matching the 2-level pyramid fixture.
const ARRAYS: Record<string, { shape: number[]; chunks: number[]; dtype: string; store: ZarrStore }> = {
  "store-0": { shape: [512, 512, 1], chunks: [256, 256, 1], dtype: "float32", store: {} as ZarrStore },
  "store-1": { shape: [256, 256, 1], chunks: [256, 256, 1], dtype: "float32", store: {} as ZarrStore },
};

const FULL_VIEW: LayerViewRange = { xRange: [0, 512], yRange: [0, 512], zRange: null, scale: 2 };

type ViewerSubset = Pick<
  ViewerState,
  | "layerViewRanges"
  | "renderedChunks"
  | "lodBias"
  | "currentZ"
  | "chunkPlans"
  | "lodDebugInfo"
  | "getArrayForStoreId"
  | "setChunkPlans"
  | "setLodDebugInfo"
>;

const makeStores = () => {
  const viewerStore = createStore<ViewerSubset>((set) => ({
    layerViewRanges: {},
    renderedChunks: {},
    lodBias: 1,
    currentZ: 0,
    chunkPlans: {},
    lodDebugInfo: {},
    getArrayForStoreId: ((storeId: string) => {
      const arr = ARRAYS[storeId];
      if (!arr) throw new Error(`unknown store ${storeId}`);
      return arr;
    }) as ViewerSubset["getArrayForStoreId"],
    setChunkPlans: (plans: Record<string, LayerChunkPlan>) => set({ chunkPlans: plans }),
    setLodDebugInfo: (layerId, info) =>
      set((state) => ({ lodDebugInfo: { ...state.lodDebugInfo, [layerId]: info } })),
  })) as unknown as StoreApi<ViewerState>;

  const sceneStore = createStore<Pick<SceneState, "layers">>(() => ({
    layers: [layer],
  })) as unknown as StoreApi<SceneState>;

  return { viewerStore, sceneStore };
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 20));

describe("startChunkPlanTracking", () => {
  it("plans the coarsest level immediately, then replans when a view range arrives", async () => {
    const stores = makeStores();
    const stop = startChunkPlanTracking(stores);

    await settle();
    let plan = stores.viewerStore.getState().chunkPlans[LAYER_ID];
    expect(plan.targetLod).toBe(1);
    expect(plan.chunks.map((c) => c.chunkKey)).toEqual(["1-0/0/0"]);

    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: FULL_VIEW } });
    await settle();

    plan = stores.viewerStore.getState().chunkPlans[LAYER_ID];
    expect(plan.targetLod).toBe(0);
    expect(plan.chunks.filter((c) => c.role === "target")).toHaveLength(4);
    expect(plan.chunks.filter((c) => c.role === "cover").map((c) => c.chunkKey)).toEqual(["1-0/0/0"]);

    stop();
  });

  it("retires covers when renderedChunks reports the targets done", async () => {
    const stores = makeStores();
    const stop = startChunkPlanTracking(stores);
    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: FULL_VIEW } });
    await settle();

    const targetKeys = stores.viewerStore
      .getState()
      .chunkPlans[LAYER_ID].chunks.filter((c) => c.role === "target")
      .map((c) => c.chunkKey);

    stores.viewerStore.setState({
      renderedChunks: Object.fromEntries(
        targetKeys.map((key) => [key, { layerId: LAYER_ID, chunkKey: key, level: 0, status: "rendered" as const }]),
      ),
    });
    await settle();

    const plan = stores.viewerStore.getState().chunkPlans[LAYER_ID];
    expect(plan.chunks.filter((c) => c.role === "cover")).toHaveLength(0);
    stop();
  });

  it("writes nothing when a replan produces an identical plan", async () => {
    const stores = makeStores();
    const stop = startChunkPlanTracking(stores);
    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: FULL_VIEW } });
    await settle();

    const planBefore = stores.viewerStore.getState().chunkPlans[LAYER_ID];
    let notifications = 0;
    const unsubscribe = stores.viewerStore.subscribe(() => notifications++);

    // A no-op input change: replacing the ranges record with equal content.
    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: { ...FULL_VIEW } } });
    await settle();

    // Exactly the input write itself — no plan or debug writes follow.
    expect(notifications).toBe(1);
    expect(stores.viewerStore.getState().chunkPlans[LAYER_ID]).toBe(planBefore);
    unsubscribe();
    stop();
  });

  it("stops reacting after cleanup", async () => {
    const stores = makeStores();
    const stop = startChunkPlanTracking(stores);
    await settle();
    stop();

    stores.viewerStore.setState({ layerViewRanges: { [LAYER_ID]: FULL_VIEW } });
    await settle();

    expect(stores.viewerStore.getState().chunkPlans[LAYER_ID].targetLod).toBe(1);
  });
});
