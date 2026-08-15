import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { AxisType, PreferredView, SceneFragment, SceneLayerFragment } from "@/mikro-next/api/graphql";
import { createScopedStoreHooks } from "@/lib/generic/createScopedStore";
import { isImageLayer } from "../core/layerGuards";
import {
  normalizeLayer,
  type LayerState,
  type SceneTransformContext,
} from "../core/layerModel";
import { planDefaultVolumeLods } from "../core/lodPlanning";
import type { FabriksInstanceColormap } from "../render/fabriks/instanceColormaps";

// Re-exported for the store's many consumers (the model lives in core/).
export type { LayerState };

/**
 * Session-local render state a MESH layer carries beyond its fragment. There
 * is no `updateMeshLayer` mutation, so — exactly like the card's visibility
 * toggle — these live for the session and no longer.
 */
export type MeshLayerSessionState = {
  /** Which instance colormap the collection is colored by (default "hues"). */
  instanceColormap?: FabriksInstanceColormap;
};

/** A polymorphic scene layer plus its session-local render state. */
export type SceneLayer = SceneLayerFragment & MeshLayerSessionState;

export interface SceneState {
  /**
   * The scene's id. Here so a composed panel can reach it from context instead
   * of having it threaded down as a prop — the store is already the scene's
   * identity everywhere else.
   */
  id: string;
  /**
   * How the scene asks to be opened. Read only by the preference control (the
   * opening view is decided once, at mount, in `Scene.tsx`) — held here so the
   * control shows what the scene ACTUALLY says rather than only what this
   * session saved, and so a save reflects without a refetch.
   */
  preferredView: PreferredView;
  setPreferredView: (view: PreferredView) => void;
  spatialUnit: string;
  /**
   * The scene's coordinate-system graph (world CS, reachable systems, edges) —
   * what non-image layers (meshes, ROIs) compose their transforms from.
   */
  transformContext: SceneTransformContext;
  /** Raw polymorphic layers (all __typenames), consumed by the render dispatch. */
  sceneLayers: SceneLayer[];
  /** Normalized image layers only (carry zarr + transfer/render-graph state). */
  layers: LayerState[];
  updateLayer: (updatedLayer: LayerState) => void;
  /**
   * Patch one polymorphic scene layer in place.
   *
   * The image path has `updateLayer` because those layers are normalized into
   * `LayerState`; a mesh or annotation layer is consumed straight off the
   * fragment, so its view state is edited here. Local only: `updateLayer` (the
   * mutation) is typed to return `ImageLayer` and there is no `updateMeshLayer`,
   * so a mesh layer's visibility lives for the session and no longer.
   */
  patchSceneLayer: (id: string, patch: Partial<SceneLayer>) => void;
}

export const createSceneStore = ({ scene }: { scene: SceneFragment }) => {
  const imageLayers = scene.layers.filter(isImageLayer);
  const defaultVolumeLods = planDefaultVolumeLods(imageLayers);

  // Units are per-axis on the world coordinate system now (the scene-level
  // `spatialUnit` enum is gone); the scale bar shows the first spatial axis'.
  const spaceAxis = scene.worldCoordinateSystem?.axes.find((axis) => axis.type === AxisType.Space);

  return createStore<SceneState>()(
    immer((set) => ({
      id: scene.id,
      preferredView: scene.preferredView,
      setPreferredView: (view) =>
        set((state) => {
          state.preferredView = view;
        }),
      // A pixel-grid world has NO unit on its axes (`Axis.unit` is null there
      // by contract), so everything downstream (scale bar, draw readouts)
      // shows "px" rather than claiming a physical unit that was never
      // measured.
      spatialUnit: String(spaceAxis?.unit ?? "").trim() || "px",
      // No `coordinateSystems` or `registrations`: edges self-describe their
      // axis order (inputAxes/outputAxes) and placement comes from each
      // layer's pathToWorld, so the fragment ships neither global list.
      transformContext: {
        worldCoordinateSystem: scene.worldCoordinateSystem,
      },
      sceneLayers: scene.layers,
      layers: imageLayers.map((layer) => normalizeLayer(layer, defaultVolumeLods.get(layer.id) ?? null, scene)),
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
      patchSceneLayer: (id, patch) =>
        set((state) => {
          const index = state.sceneLayers.findIndex((layer) => layer.id === id);
          if (index !== -1) {
            Object.assign(state.sceneLayers[index], patch);
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
