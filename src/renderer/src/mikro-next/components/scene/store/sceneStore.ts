import type { DataType } from "zarrita";
import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { SceneFragment } from "@/mikro-next/api/graphql";
import { createScopedStoreHooks } from "./createScopedStore";
import { mapDTypeToTextureBytes } from "../stores/utils";
import { Blending, ProjectionMode } from "@/mikro-next/api/graphql";
import { ImageLayerFragment, isImageLayer } from "../layers/layerGuards";
import {
  ChannelRenderNode,
  flattenChannels,
  primaryChannelRenderFields,
  resolveLayerGraph,
  resolveProjectionMode,
} from "../lib/renderGraph";




export type ReportedContrast = {
  id: string;
  minValue: number;
  maxValue: number;
};



// The scene renderer's store only tracks image layers (they carry the zarr
// data + transfer/render-graph state). Non-image layers (Shape/Point/Track/Mesh)
// are rendered through a separate path.
export type LayerState = ImageLayerFragment & {
  fixedLOD?: number | null;
  defaultVolumeLOD?: number | null;
  visible?: boolean;
  /** Channel sources flattened from the layer's render graph (tree order). */
  channels: ChannelRenderNode[];
  /** Blend mode of the render graph's root, used to composite channels. */
  blend: Blending;
  /** Projection mode (from a ProjectionNode in the graph, else MIP) for 3D. */
  projection: ProjectionMode;
};

interface SceneState {
  spatialUnit: string;
  layers: LayerState[];
  originalLayers: LayerState[];
  updateLayer: (updatedLayer: LayerState) => void;
  markLayerClean: (layerId: string) => void;
  reportContrast: (contrast: ReportedContrast) => void;
  reportedContrasts: Record<string, ReportedContrast>;
}

const DEFAULT_VOLUME_TEXTURE_BUDGET_BYTES = 512 * 1024 * 1024;
const MIN_VOLUME_TEXTURE_BUDGET_BYTES = 256 * 1024 * 1024;
const MAX_VOLUME_TEXTURE_BUDGET_BYTES = 2 * 1024 * 1024 * 1024;
const DEVICE_MEMORY_TEXTURE_FRACTION = 0.18;

function getInitialVolumeTextureBudgetBytes(): number {
  const nav = typeof navigator !== "undefined"
    ? (navigator as Navigator & { deviceMemory?: number })
    : undefined;
  const memoryGiB = nav?.deviceMemory;

  if (typeof memoryGiB !== "number" || !Number.isFinite(memoryGiB) || memoryGiB <= 0) {
    return DEFAULT_VOLUME_TEXTURE_BUDGET_BYTES;
  }

  const estimatedBudget = memoryGiB * 1024 * 1024 * 1024 * DEVICE_MEMORY_TEXTURE_FRACTION;
  return Math.min(
    Math.max(estimatedBudget, MIN_VOLUME_TEXTURE_BUDGET_BYTES),
    MAX_VOLUME_TEXTURE_BUDGET_BYTES,
  );
}

function getSliceLength(
  axisLength: number,
  slice: ImageLayerFragment["lens"]["slices"][number] | undefined,
): number {
  const step = Math.max(1, slice?.step ?? 1);
  const start = Math.max(0, Math.min(axisLength, slice?.start ?? 0));
  const stop = Math.max(start, Math.min(axisLength, slice?.stop ?? axisLength));

  if (stop <= start) return 0;
  return Math.max(1, Math.ceil((stop - start) / step));
}

function estimateLayerVolumeBytes(layer: ImageLayerFragment, lodIndex: number): number {
  const dataArray = layer.lens.dataset.dataArrays[lodIndex];
  if (!dataArray) return Number.POSITIVE_INFINITY;

  const dtype = dataArray.store.dtype;
  const bytesPerVoxel = dtype ? mapDTypeToTextureBytes(dtype as DataType) : 4;
  const sliceMap = layer.lens.slices.reduce<Record<string, ImageLayerFragment["lens"]["slices"][number]>>((acc, slice) => {
    acc[slice.dim] = slice;
    return acc;
  }, {});

  const selectedVoxelCount = dataArray.store.shape.reduce((total, axisLength, axisIndex) => {
    const dim = layer.lens.dataset.dims[axisIndex];
    const nextLength = dim ? getSliceLength(axisLength, sliceMap[dim]) : axisLength;
    return total * Math.max(nextLength, 1);
  }, 1);

  return selectedVoxelCount * bytesPerVoxel;
}

function planDefaultVolumeLods(imageLayers: ImageLayerFragment[]): Map<string, number> {
  const budgetBytes = getInitialVolumeTextureBudgetBytes();
  const candidates = imageLayers
    .filter((layer) => layer.lens.dataset.dataArrays.length > 0)
    .map((layer) => ({
      layerId: layer.id,
      bytesByLod: layer.lens.dataset.dataArrays.map((_, lodIndex) =>
        estimateLayerVolumeBytes(layer, lodIndex),
      ),
    }));

  const chosenLods = new Map<string, number>();
  let usedBytes = 0;

  for (const candidate of candidates) {
    const coarsestLod = Math.max(0, candidate.bytesByLod.length - 1);
    chosenLods.set(candidate.layerId, coarsestLod);
    usedBytes += candidate.bytesByLod[coarsestLod] ?? 0;
  }

  while (true) {
    let bestUpgrade: { layerId: string; nextLod: number; addedBytes: number } | null = null;

    for (const candidate of candidates) {
      const currentLod = chosenLods.get(candidate.layerId);
      if (currentLod == null || currentLod <= 0) continue;

      const nextLod = currentLod - 1;
      const addedBytes = (candidate.bytesByLod[nextLod] ?? Number.POSITIVE_INFINITY) - (candidate.bytesByLod[currentLod] ?? 0);
      if (!Number.isFinite(addedBytes)) continue;
      if (usedBytes + addedBytes > budgetBytes) continue;

      if (!bestUpgrade || addedBytes < bestUpgrade.addedBytes) {
        bestUpgrade = { layerId: candidate.layerId, nextLod, addedBytes };
      }
    }

    if (!bestUpgrade) {
      break;
    }

    chosenLods.set(bestUpgrade.layerId, bestUpgrade.nextLod);
    usedBytes += bestUpgrade.addedBytes;
  }

  return chosenLods;
}

const normalizeLayer = (layer: ImageLayerFragment, defaultVolumeLod: number | null): LayerState => {
  // Resolve the layer's render graph (or a single-channel fallback from the
  // flat fields) into a flat channel list for the renderer, plus the primary
  // channel's transfer for the single-channel path.
  const graph = resolveLayerGraph(layer);
  const channels = flattenChannels(graph);
  const primary = primaryChannelRenderFields(layer.renderGraph);
  return {
    ...layer,
    climMin: primary?.climMin ?? layer.climMin ?? 0,
    climMax: primary?.climMax ?? layer.climMax ?? 1,
    colormap: primary?.colormap ?? layer.colormap,
    color: primary?.color ?? layer.color,
    gamma: primary?.gamma ?? layer.gamma,
    intensityDim: primary?.intensityDim ?? layer.intensityDim,
    channels,
    blend: graph.blending,
    projection: resolveProjectionMode(graph),
    fixedLOD: null,
    defaultVolumeLOD: defaultVolumeLod,
    visible: true,
  };
};

export const createSceneStore = ({ scene }: { scene: SceneFragment }) => {
  const imageLayers = scene.layers.filter(isImageLayer);
  const defaultVolumeLods = planDefaultVolumeLods(imageLayers);

  return createStore<SceneState>()(
    immer((set) => ({
      spatialUnit: scene.spatialUnit ?? "px",
      layers: imageLayers.map((layer) => normalizeLayer(layer, defaultVolumeLods.get(layer.id) ?? null)),
      originalLayers: imageLayers.map((layer) => normalizeLayer(layer, defaultVolumeLods.get(layer.id) ?? null)),
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
