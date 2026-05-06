import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { SceneFragment, SceneLayerFragment } from "@/mikro-next/api/graphql";
import { createScopedStoreHooks } from "./createScopedStore";
import { mapDTypeToTextureBytes } from "../stores/utils";




export type ReportedContrast = {
  id: string;
  minValue: number;
  maxValue: number;
};



export type LayerState = SceneLayerFragment & {
  fixedLOD?: number | null;
  defaultVolumeLOD?: number | null;
  visible?: boolean;
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
  slice: SceneLayerFragment["lens"]["slices"][number] | undefined,
): number {
  const step = Math.max(1, slice?.step ?? 1);
  const start = Math.max(0, Math.min(axisLength, slice?.start ?? 0));
  const stop = Math.max(start, Math.min(axisLength, slice?.stop ?? axisLength));

  if (stop <= start) return 0;
  return Math.max(1, Math.ceil((stop - start) / step));
}

function estimateLayerVolumeBytes(layer: SceneLayerFragment, lodIndex: number): number {
  const dataArray = layer.lens.dataset.dataArrays[lodIndex];
  if (!dataArray) return Number.POSITIVE_INFINITY;

  const dtype = dataArray.store.dtype;
  const bytesPerVoxel = dtype ? mapDTypeToTextureBytes(dtype) : 4;
  const sliceMap = layer.lens.slices.reduce<Record<string, SceneLayerFragment["lens"]["slices"][number]>>((acc, slice) => {
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

function planDefaultVolumeLods(scene: SceneFragment): Map<string, number> {
  const budgetBytes = getInitialVolumeTextureBudgetBytes();
  const candidates = scene.layers
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

const normalizeLayer = (layer: SceneLayerFragment, defaultVolumeLod: number | null): LayerState => ({
  ...layer,
  climMin: layer.climMin ?? 0,
  climMax: layer.climMax ?? 1,
  fixedLOD: null,
  defaultVolumeLOD: defaultVolumeLod,
  visible: true,
});

export const createSceneStore = ({ scene }: { scene: SceneFragment }) => {
  const defaultVolumeLods = planDefaultVolumeLods(scene);

  return createStore<SceneState>()(
    immer((set) => ({
      spatialUnit: scene.spatialUnit ?? "px",
      layers: scene.layers.map((layer) => normalizeLayer(layer, defaultVolumeLods.get(layer.id) ?? null)),
      originalLayers: scene.layers.map((layer) => normalizeLayer(layer, defaultVolumeLods.get(layer.id) ?? null)),
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
