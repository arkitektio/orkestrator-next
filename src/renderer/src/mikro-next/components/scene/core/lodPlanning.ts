import type { DataType } from "zarrita";
import { mapDTypeToTextureBytes } from "../stores/utils";
import { ImageLayerFragment } from "./layerGuards";

/**
 * GPU volume-texture memory budgeting and default per-layer LOD assignment.
 * Extracted from `store/sceneStore.ts` so the store no longer owns this
 * concern — it just calls `planDefaultVolumeLods(imageLayers)` at construction.
 */

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

/**
 * Assign each image layer a default volume LOD that keeps the total volume
 * texture memory within a device-derived budget (coarsest first, then greedily
 * upgrade the cheapest layers).
 */
export function planDefaultVolumeLods(imageLayers: ImageLayerFragment[]): Map<string, number> {
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
