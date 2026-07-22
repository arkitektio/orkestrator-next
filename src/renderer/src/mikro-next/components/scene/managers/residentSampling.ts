import type { AttributePlanLike } from "@/mikro-next/lib/attributes/attributeTypes";
import type { HeldValue } from "@/mikro-next/lib/attributes/planExec";
import type { LayerState } from "../core/layerModel";
import type { BrickResidencyManager } from "./brickResidency";

/**
 * The scene-only RESIDENT fast path for attribute sampling: an optimistic
 * sync pre-read from the brick atlas's CPU mirror, bound only when it is
 * provably reading the same slice — the plan must be locally rooted (empty
 * path: its non-spatial coordinates then come from the SAME scene-wide
 * `dimSelections` the layer's pool collapsed on) and the plan's array must be
 * some rendered layer's level-0 store. Coarser-LOD reads can misattribute a
 * label at object boundaries, which is why the shared executor upgrades every
 * miss through the service's exact chunk read.
 *
 * The exact path itself lives in the scene-free service
 * (`@/mikro-next/lib/attributes/exactSampleSource`).
 */

export type ResidentSampleContext = {
  getBrickSystem: () => BrickResidencyManager | null;
  getLayers: () => readonly LayerState[];
};

type ResidentBinding = {
  layerId: string;
  /** Positions of the render axes in the sample system's axis order. */
  xPos: number;
  yPos: number;
  zPos: number;
};

const level0Of = (layer: LayerState) =>
  layer.lens.dataset.dataArrays.reduce<
    LayerState["lens"]["dataset"]["dataArrays"][number] | null
  >((best, da) => (best === null || da.level < best.level ? da : best), null);

const findResidentBinding = (
  layers: readonly LayerState[],
  plan: AttributePlanLike,
): ResidentBinding | null => {
  for (const layer of layers) {
    const level0 = level0Of(layer);
    if (!level0 || level0.store.id !== plan.sample.store.id) continue;
    const axisNames = [...plan.sample.system.axes]
      .sort((a, b) => a.order - b.order)
      .map((axis) => axis.name);
    const ra = layer.lens.renderAxes;
    const xPos = axisNames.indexOf(ra.x);
    const yPos = axisNames.indexOf(ra.y);
    if (xPos === -1 || yPos === -1) return null;
    return {
      layerId: layer.id,
      xPos,
      yPos,
      zPos: ra.z ? axisNames.indexOf(ra.z) : -1,
    };
  }
  return null;
};

/**
 * Per-plan resident sampler: null when the plan cannot be resident-sampled
 * (path-mapped, or its array is not on screen) — the executor then goes
 * straight to the exact read.
 */
export function createResidentSampler(ctx: ResidentSampleContext) {
  return (
    plan: AttributePlanLike,
  ): ((index: readonly number[]) => HeldValue | null) | null => {
    const resident =
      plan.path.length === 0 ? findResidentBinding(ctx.getLayers(), plan) : null;
    if (!resident) return null;
    return (index) => {
      const brickSystem = ctx.getBrickSystem();
      if (!brickSystem) return null;
      return brickSystem.sampleResident(
        resident.layerId,
        [
          index[resident.xPos] ?? 0,
          index[resident.yPos] ?? 0,
          resident.zPos !== -1 ? index[resident.zPos] ?? 0 : 0,
        ],
        0,
        0,
      );
    };
  };
}

export type ResidentSampler = ReturnType<typeof createResidentSampler>;
