import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { SceneFragment, SceneLayerFragment } from "@/mikro-next/api/graphql";
import { createScopedStoreHooks } from "./createScopedStore";




export type ReportedContrast = {
  id: string;
  minValue: number;
  maxValue: number;
};



interface SceneState {
  layers: SceneLayerFragment[];
  updateLayer: (updatedLayer: SceneLayerFragment) => void;
  reportContrast: (contrast: ReportedContrast) => void;
  reportedContrasts: Record<string, ReportedContrast>;
}

const normalizeLayer = (layer: SceneLayerFragment): SceneLayerFragment => ({
  ...layer,
  climMin: layer.climMin ?? 0,
  climMax: layer.climMax ?? 1,
});

export const createSceneStore = ({ scene }: { scene: SceneFragment }) =>
  createStore<SceneState>()(
  immer((set) => ({
    layers: scene.layers.map(normalizeLayer),
    updateLayer: (updatedLayer) =>
      set((state) => {
        const index = state.layers.findIndex((layer) => layer.id === updatedLayer.id);
        if (index !== -1) {
          state.layers[index] = updatedLayer;
        }
      }),
    reportContrast: (contrast: ReportedContrast) =>
      set((state) => {
        state.reportedContrasts[contrast.id] = contrast;
      }),
    reportedContrasts: {},
  })),
);

const {
  StoreContext: SceneStoreContext,
  useScopedStore: useSceneStore,
  useStoreApi: useSceneStoreApi,
} = createScopedStoreHooks<SceneState>("SceneStore");

export { SceneStoreContext, useSceneStore, useSceneStoreApi };
