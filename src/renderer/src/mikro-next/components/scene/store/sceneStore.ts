import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { AxisType, SceneFragment, SceneLayerFragment } from "@/mikro-next/api/graphql";
import { createScopedStoreHooks } from "./createScopedStore";
import { isImageLayer } from "../core/layerGuards";
import {
  normalizeLayer,
  type LayerState,
  type SceneTransformContext,
} from "../core/layerModel";
import { planDefaultVolumeLods } from "../core/lodPlanning";

// Re-exported for the store's many consumers (the model lives in core/).
export type { LayerState };

export interface SceneState {
  spatialUnit: string;
  /**
   * The scene's coordinate-system graph (world CS, reachable systems, edges) —
   * what non-image layers (meshes, ROIs) compose their transforms from.
   */
  transformContext: SceneTransformContext;
  /** Raw polymorphic layers (all __typenames), consumed by the render dispatch. */
  sceneLayers: SceneLayerFragment[];
  /** Normalized image layers only (carry zarr + transfer/render-graph state). */
  layers: LayerState[];
  originalLayers: LayerState[];
  updateLayer: (updatedLayer: LayerState) => void;
  markLayerClean: (layerId: string) => void;
}

export const createSceneStore = ({ scene }: { scene: SceneFragment }) => {
  const imageLayers = scene.layers.filter(isImageLayer);
  const defaultVolumeLods = planDefaultVolumeLods(imageLayers);

  // Units are per-axis on the world coordinate system now (the scene-level
  // `spatialUnit` enum is gone); the scale bar shows the first spatial axis'.
  const spaceAxis = scene.worldCoordinateSystem?.axes.find((axis) => axis.type === AxisType.Space);

  return createStore<SceneState>()(
    immer((set) => ({
      spatialUnit: spaceAxis?.unit ? String(spaceAxis.unit) : "px",
      transformContext: {
        worldCoordinateSystem: scene.worldCoordinateSystem,
        coordinateSystems: scene.coordinateSystems,
        coordinateTransformations: scene.coordinateTransformations,
      },
      sceneLayers: scene.layers,
      layers: imageLayers.map((layer) => normalizeLayer(layer, defaultVolumeLods.get(layer.id) ?? null, scene)),
      originalLayers: imageLayers.map((layer) => normalizeLayer(layer, defaultVolumeLods.get(layer.id) ?? null, scene)),
      // The render graph is the single rendering truth: transfer edits flow
      // graph → store (RenderGraphSection derives the flat clim/colormap
      // fields from the primary channel). No caller writes flat fields
      // directly, so no fold-back is needed here.
      updateLayer: (updatedLayer) =>
        set((state) => {
          const index = state.layers.findIndex((layer) => layer.id === updatedLayer.id);
          if (index !== -1) {
            state.layers[index] = updatedLayer;
          }
        }),
      markLayerClean: (layerId) =>
        set((state) => {
          const layer = state.layers.find((l) => l.id === layerId);
          const origIndex = state.originalLayers.findIndex((l) => l.id === layerId);
          if (layer && origIndex !== -1) {
            state.originalLayers[origIndex] = { ...layer };
          }
        }),
    })),
  );
};

const {
  StoreContext: SceneStoreContext,
  useScopedStore: useSceneStore,
  useStoreApi: useSceneStoreApi,
} = createScopedStoreHooks<SceneState>("SceneStore");

export { SceneStoreContext, useSceneStore, useSceneStoreApi };
