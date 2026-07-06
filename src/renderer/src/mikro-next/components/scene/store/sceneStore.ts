import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { SceneFragment, SceneLayerFragment } from "@/mikro-next/api/graphql";
import { createScopedStoreHooks } from "./createScopedStore";
import { isImageLayer } from "../core/layerGuards";
import { normalizeLayer, type LayerState, type ReportedContrast } from "../core/layerModel";
import { planDefaultVolumeLods } from "../core/lodPlanning";

// Re-exported for the store's many consumers (the model lives in core/).
export type { LayerState, ReportedContrast };

// Value comparison — inside immer's set() the stored layer is a draft proxy,
// so reference equality against the incoming (raw) array is meaningless.
const sameColor = (
  left: readonly number[] | null | undefined,
  right: readonly number[] | null | undefined,
): boolean =>
  left === right ||
  (Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, i) => value === right[i]));

export interface SceneState {
  spatialUnit: string;
  /** Raw polymorphic layers (all __typenames), consumed by the render dispatch. */
  sceneLayers: SceneLayerFragment[];
  /** Normalized image layers only (carry zarr + transfer/render-graph state). */
  layers: LayerState[];
  originalLayers: LayerState[];
  updateLayer: (updatedLayer: LayerState) => void;
  markLayerClean: (layerId: string) => void;
  reportContrast: (contrast: ReportedContrast) => void;
  reportedContrasts: Record<string, ReportedContrast>;
}

export const createSceneStore = ({ scene }: { scene: SceneFragment }) => {
  const imageLayers = scene.layers.filter(isImageLayer);
  const defaultVolumeLods = planDefaultVolumeLods(imageLayers);

  return createStore<SceneState>()(
    immer((set) => ({
      spatialUnit: scene.spatialUnit ?? "px",
      sceneLayers: scene.layers,
      layers: imageLayers.map((layer) => normalizeLayer(layer, defaultVolumeLods.get(layer.id) ?? null)),
      originalLayers: imageLayers.map((layer) => normalizeLayer(layer, defaultVolumeLods.get(layer.id) ?? null)),
      updateLayer: (updatedLayer) =>
        set((state) => {
          const index = state.layers.findIndex((layer) => layer.id === updatedLayer.id);
          if (index === -1) return;

          // The contrast/color UI edits the flat fields, but the multi-channel
          // 2D shader reads `channels[i].transfer` (baked by normalizeLayer).
          // Fold flat-field edits into the primary channel so both render
          // paths stay in lockstep.
          const previous = state.layers[index];
          const primary = updatedLayer.channels[0];
          const flatFieldsChanged =
            updatedLayer.climMin !== previous.climMin ||
            updatedLayer.climMax !== previous.climMax ||
            updatedLayer.colormap !== previous.colormap ||
            !sameColor(updatedLayer.color, previous.color) ||
            updatedLayer.gamma !== previous.gamma;

          if (primary && flatFieldsChanged) {
            const channels = [...updatedLayer.channels];
            channels[0] = {
              ...primary,
              transfer: {
                ...primary.transfer,
                climMin: updatedLayer.climMin ?? primary.transfer.climMin,
                climMax: updatedLayer.climMax ?? primary.transfer.climMax,
                colormap: updatedLayer.colormap ?? primary.transfer.colormap,
                color: updatedLayer.color ?? primary.transfer.color,
                gamma: updatedLayer.gamma ?? primary.transfer.gamma,
              },
            };
            state.layers[index] = { ...updatedLayer, channels };
          } else {
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
      reportContrast: (contrast: ReportedContrast) =>
        set((state) => {
          state.reportedContrasts[contrast.id] = contrast;
        }),
      reportedContrasts: {},
    })),
  );
};

const {
  StoreContext: SceneStoreContext,
  useScopedStore: useSceneStore,
  useStoreApi: useSceneStoreApi,
} = createScopedStoreHooks<SceneState>("SceneStore");

export { SceneStoreContext, useSceneStore, useSceneStoreApi };
