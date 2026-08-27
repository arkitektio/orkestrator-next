import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { AxisType, PreferredView, SceneFragment, SceneLayerFragment } from "@/mikro-next/api/graphql";
import { createScopedStoreHooks } from "@/lib/generic/createScopedStore";
import { isBrickLayer, type BrickLayerFragment } from "../model/layerGuards";
import { reconcileSceneLayers } from "../model/layerReconcile";
import { layerStructureKey } from "../model/sceneStructure";
import {
  normalizeBrickLayer,
  type LayerState,
  type SceneTransformContext,
} from "../model/layerModel";
import { planDefaultVolumeLods } from "../quality/lodPlanning";
import type { FabriksInstanceColormap } from "../gpu/instanceColormaps";

// Re-exported for the store's many consumers (the model lives in core/).
export type { LayerState };

/**
 * Session-local render state a MESH layer carries beyond its fragment. These
 * fields have nowhere to be stored — `updateMeshLayer` accepts the layer's
 * material, its pickers and their active indices, but none of the client-side
 * render presets below — so, exactly like the card's visibility toggle, they
 * live for the session and no longer.
 */
export type MeshLayerSessionState = {
  /** Which instance colormap the collection is colored by (default "hues"). */
  instanceColormap?: FabriksInstanceColormap;
  /** Color by instance id (the DEFAULT) vs the layer's uniform materialColor.
   * Explicit rather than inferred from materialColor's presence — a layer
   * with a stored color must still be instance-colorable. */
  colorByInstance?: boolean;
  /** Per-layer LOD preset: the planner's pixel-error budget (1 / 2 / 4 px). */
  detail?: "fine" | "balanced" | "fast";
  /** Flat derivative normals (the default) vs smooth per-cell normals. */
  flatNormals?: boolean;
  /** Double-sided surfaces (the default) vs front faces only. */
  doubleSided?: boolean;
  /** 2D cross-section thickness multiplier over the scene's z-step (1/3/5). */
  slabScale?: number;
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
  /**
   * Raw polymorphic layers (all __typenames), consumed by the render dispatch.
   *
   * NOT write-once: the layer set is dynamic (the server mints an
   * `AnnotationLayer` on a scene's first annotation, layers are added and
   * deleted), and `syncSceneLayers` folds those changes in while the scene
   * keeps rendering. Untouched layers keep their object identity across a
   * fold, so a subscription that reads one layer out of this list still
   * settles — see `platform/model/layerReconcile.ts`.
   */
  sceneLayers: SceneLayer[];
  /** Normalized BRICK-backed layers — images and label masks alike. */
  layers: LayerState[];
  updateLayer: (updatedLayer: LayerState) => void;
  /**
   * Fold a new layer set into the LIVE store, id-keyed — the alternative to
   * rebuilding the whole store scope (which unmounts the canvas and re-opens
   * every zarr array). Layers that did not structurally change keep their
   * exact objects, so session-only state and the layer-keyed caches downstream
   * survive. See `platform/model/layerReconcile.ts` for the contract.
   *
   * The world frame is deliberately NOT a parameter: it is scope-scoped (a
   * world change rebuilds the scope), so the fold composes affines against
   * this store's own `transformContext` and can never silently adopt a new
   * world.
   */
  syncSceneLayers: (
    nextLayers: readonly SceneLayerFragment[],
  ) => { addedLayerIds: string[]; removedLayerIds: string[] };
  /**
   * Republish `layers` with a NEW array reference and identical elements. The
   * only way to ask the trackers for a replan when nothing about the layers
   * changed but their zarr arrays did (a store that opened late).
   */
  touchImageLayers: () => void;
  /**
   * Patch one polymorphic scene layer in place.
   *
   * The image path has `updateLayer` because those layers are normalized into
   * `LayerState`; a mesh or annotation layer is consumed straight off the
   * fragment, so its view state is edited here.
   *
   * Two callers, two meanings. SESSION state (visibility, palette, detail) is
   * patched here and nowhere else — `updateLayer` the mutation is typed to
   * return `ImageLayer`, so it has no home on the server. STORED mesh state
   * (`colorBys`/`filterBys` and their active indices) goes through
   * `updateMeshLayer` and is folded back in here afterwards, because
   * `syncSceneLayers` keeps the previous raw object whenever a layer's
   * STRUCTURE key is unchanged — a re-emission that changed only a mesh
   * layer's content would otherwise be discarded.
   */
  /**
   * Per-track-layer tail length, in the track table's own time units.
   *
   * Session-local: `updateTrackLayer` carries the layer's line width, colouring
   * and compositing, but a tail window is a property of how you are LOOKING at
   * a trajectory rather than of the trajectory, and the server has no field for
   * it. Missing entry = `DEFAULT_TAIL_WINDOW`.
   */
  trackTailWindows: Record<string, number>;
  setTrackTailWindow: (layerId: string, window: number) => void;
  /**
   * The largest time index each track layer observed in its table, published by
   * the renderer once the read lands.
   *
   * This exists so a T slider can exist at all. `DimSliderPanel` folds its
   * scrubbers out of the normalized BRICK layers via `collapsibleDims`, which
   * reads a lens; a table-backed layer has none, so without this a scene of
   * only tracks offers nothing to scrub and the tail is frozen. Not derivable
   * from the fragment — the extent is a fact about the DATA, known only after
   * the parquet is read. Null clears the entry on unmount.
   */
  trackTimeExtents: Record<string, number>;
  setTrackTimeExtent: (layerId: string, maxIndex: number | null) => void;
  patchSceneLayer: (id: string, patch: Partial<SceneLayer>) => void;
}

export const createSceneStore = ({ scene }: { scene: SceneFragment }) => {
  // Every LENS-backed layer — images, label masks and the three fixed-shape
  // kinds alike: all are a Lens over an array, so all plan, pool and stream
  // through the same path (see `isBrickLayer`).
  const brickLayers = scene.layers.filter(isBrickLayer);
  const defaultVolumeLods = planDefaultVolumeLods(brickLayers);

  // Units are per-axis on the world coordinate system now (the scene-level
  // `spatialUnit` enum is gone); the scale bar shows the first spatial axis'.
  const spaceAxis = scene.worldCoordinateSystem?.axes.find((axis) => axis.type === AxisType.Space);

  return createStore<SceneState>()(
    immer((set, get) => ({
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
      trackTailWindows: {},
      trackTimeExtents: {},
      sceneLayers: scene.layers,
      layers: brickLayers.map((layer) =>
        normalizeBrickLayer(layer, defaultVolumeLods.get(layer.id) ?? null, scene),
      ),
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
      setTrackTailWindow: (layerId, window) =>
        set((state) => {
          state.trackTailWindows[layerId] = window;
        }),
      setTrackTimeExtent: (layerId, maxIndex) =>
        set((state) => {
          // Guard the no-op: this is written from an effect on every geometry
          // reload, and a fresh object identity for an unchanged extent would
          // re-run every selector reading it.
          if (maxIndex === null) {
            if (layerId in state.trackTimeExtents) delete state.trackTimeExtents[layerId];
            return;
          }
          if (state.trackTimeExtents[layerId] === maxIndex) return;
          state.trackTimeExtents[layerId] = maxIndex;
        }),
      patchSceneLayer: (id, patch) =>
        set((state) => {
          const index = state.sceneLayers.findIndex((layer) => layer.id === id);
          if (index !== -1) {
            Object.assign(state.sceneLayers[index], patch);
          }
        }),
      syncSceneLayers: (nextLayers) => {
        const { sceneLayers, layers, transformContext } = get();
        const result = reconcileSceneLayers<SceneLayer, SceneLayer & BrickLayerFragment, LayerState>({
          previousSceneLayers: sceneLayers,
          previousLayers: layers,
          nextLayers: nextLayers as readonly SceneLayer[],
          // Named `isImage` by the generic; what it MEANS is "normalize this
          // one into `layers`", which is every brick-backed layer.
          isImage: (layer): layer is SceneLayer & BrickLayerFragment => isBrickLayer(layer),
          structureKey: layerStructureKey,
          planDefaultLods: (bricks) => planDefaultVolumeLods(bricks as BrickLayerFragment[]),
          normalize: (layer, defaultVolumeLod) =>
            normalizeBrickLayer(layer, defaultVolumeLod, transformContext),
          // New objects, never a mutation of the stored one: after any earlier
          // `updateLayer`/`patchSceneLayer` the stored objects are immer-frozen.
          carryImageSession: (previous, next) => ({
            ...next,
            fixedLOD: previous.fixedLOD,
            defaultVolumeLOD: previous.defaultVolumeLOD,
            visible: previous.visible,
          }),
          carryRawSession: (previous, next) => ({
            ...next,
            instanceColormap: previous.instanceColormap,
            colorByInstance: previous.colorByInstance,
            detail: previous.detail,
            flatNormals: previous.flatNormals,
            doubleSided: previous.doubleSided,
            slabScale: previous.slabScale,
          }),
        });

        const summary = {
          addedLayerIds: result.addedLayerIds,
          removedLayerIds: result.removedLayerIds,
        };
        if (!result.sceneLayersChanged && !result.layersChanged) return summary;

        // The PLAIN-OBJECT form on purpose: the immer middleware only runs
        // `produce` for function updaters, so this bypasses the finalizer.
        // Going through it would freeze/clone the reused elements and break
        // the identity preservation the reconcile exists for.
        set({ sceneLayers: result.sceneLayers, layers: result.layers });
        return summary;
      },
      touchImageLayers: () => set({ layers: [...get().layers] }),
    })),
  );
};

const {
  StoreContext: SceneStoreContext,
  useScopedStore: useSceneStore,
  useStoreApi: useSceneStoreApi,
} = createScopedStoreHooks<SceneState>("SceneStore");

export { SceneStoreContext, useSceneStore, useSceneStoreApi };
