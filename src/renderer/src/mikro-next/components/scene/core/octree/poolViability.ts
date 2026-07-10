import { getInitialVolumeTextureBudgetBytes } from "../lodPlanning";
import { atlasKindForDtype } from "../../render/bricks/gpu/brickAtlas";
import type { LayerState } from "../layerModel";
import { brickSlotBytes, resolveBrickSpec, type BrickSpec } from "./brickSpec";
import { brickGridForLevel } from "./nodeAddress";
import {
  buildLayerLevelGeometry,
  type LayerLevelGeometry,
  type LevelSource,
} from "./levelGeometry";

/**
 * Guard against the "cheap pinned coarsest level" assumption going
 * catastrophically wrong (OCTREE_RENDERER.md P18).
 *
 * The pool design pins every coarsest-level brick as the shader's fallback of
 * last resort, and `ensurePool` floors the atlas slot count at the coarsest
 * grid — deliberately overriding the per-layer byte budget (P16), because for
 * a real pyramid that floor is tiny. A layer WITHOUT a multiscale pyramid
 * breaks the premise: its "coarsest level" is the full-resolution data, so the
 * floor can demand a multi-GB atlas (GPU overload) while the planner emits the
 * entire dataset as unconditional root targets (fetch overload).
 *
 * `assessPoolViability` computes that floor with the SAME helpers `ensurePool`
 * uses and compares it against the device-scaled global volume budget — NOT
 * `MAX_LAYER_POOL_BYTES` (128 MB), which known-good deep 2D stacks legitimately
 * exceed (a 3000-slice SPIM stack floors at ~197 MB after P1's z-payload
 * doubling). Multi-level pyramids pass trivially; affordable single-level
 * cubes pass; oversized ones are refused upstream (nodePlanTracker) before any
 * plan, pool, or fetch exists.
 */

/** Mirror of ensurePool's headroom so floorBytes matches the real allocation. */
const HEADROOM_SLOTS = 64;

export type PoolViability =
  | { viable: true }
  | { viable: false; floorBytes: number; capBytes: number };

export function assessPoolViability(
  geometry: LayerLevelGeometry,
  spec: BrickSpec,
): PoolViability {
  const coarsest = geometry.levels.length - 1;
  const grid = brickGridForLevel(geometry, spec, coarsest);
  const bytesPerVoxel =
    atlasKindForDtype(geometry.levels[0].dtype) === "r8" ? 1 : 4;
  const floorBytes =
    (grid[0] * grid[1] * grid[2] + HEADROOM_SLOTS) *
    brickSlotBytes(spec, bytesPerVoxel);
  const capBytes = getInitialVolumeTextureBudgetBytes();

  return floorBytes <= capBytes
    ? { viable: true }
    : { viable: false, floorBytes, capBytes };
}

/**
 * Layer-level convenience for UI code (e.g. the "switch to 2D" hint needs the
 * OTHER mode's verdict): builds geometry + spec from the layer's opened zarr
 * arrays, then assesses. Returns null when the arrays aren't available or the
 * geometry can't be built (treat as "unknown", not as a refusal).
 */
export function assessLayerPoolViability(
  layer: LayerState,
  getArrayForStoreId: (storeId: string) => {
    shape: readonly number[];
    chunks: readonly number[];
    dtype: unknown;
  },
  mode: "2D" | "3D",
): PoolViability | null {
  let levels: LevelSource[];
  try {
    levels = layer.lens.dataset.dataArrays.map((dataArray) => {
      const arr = getArrayForStoreId(dataArray.store.id);
      return {
        shape: arr.shape,
        chunks: arr.chunks,
        dtype: String(arr.dtype),
        storeId: dataArray.store.id,
        scaleFactors: dataArray.scaleFactors ?? undefined,
      };
    });
  } catch {
    return null;
  }
  const geometry = buildLayerLevelGeometry(layer.lens.dataset.dims, layer, levels);
  if (!geometry) return null;
  return assessPoolViability(geometry, resolveBrickSpec(geometry, mode));
}
