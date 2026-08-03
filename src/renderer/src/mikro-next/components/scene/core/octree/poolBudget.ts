import { MAX_LAYER_POOL_BYTES } from "../lodPlanning";

/**
 * The single source of truth for how a brick pool's memory is split between
 * PLANNED bricks and CACHE HEADROOM.
 *
 * Two call sites derive from this and they MUST agree, or the planner asks for
 * more slots than the atlas holds:
 *  - `nodePlanTracker` — the slot budget the plan DFS is allowed to spend.
 *  - `brickResidency.ensurePool` — the bytes the atlas is actually allocated at.
 *
 * ## Why headroom is not optional
 *
 * Eviction in `BrickPoolState` is lazy: it fires only from inside `acquire()`
 * once free slots run out. If the plan is allowed to consume the whole atlas,
 * the pool sits permanently at zero free slots, so every newly planned brick
 * costs an eviction and every out-of-plan brick that finishes fetching is
 * dropped for want of a slot. A recorded session in exactly that state showed
 * 183 planned nodes against a 200-slot atlas — 17 free — producing 4681
 * evictions and 199 dropped uploads over ten seconds.
 *
 * ## Why the atlas grows instead of the plan shrinking
 *
 * That state arose from a GOOD change: once layers began sharing a pool by
 * content, the per-pool budget stopped being divided by the layer count, which
 * let the planner reach full resolution (target level 0). Reserving headroom by
 * capping the plan would hand part of that resolution straight back.
 *
 * The budget share is per POOL, and sharing collapsed four pools into one — so
 * there is normally slack between the per-pool cap (`MAX_LAYER_POOL_BYTES`) and
 * the device share. Spend that slack on headroom and the plan keeps its
 * resolution. Only when the device share genuinely cannot cover
 * `planCap + headroom` does the plan shrink, which is the correct order of
 * sacrifice on a memory-poor machine.
 */

/**
 * Free slots a pool aims to keep for out-of-plan bricks: fallback data that
 * survives a replan, and room for the next plan's targets to land without
 * evicting the current one.
 */
export const MIN_POOL_HEADROOM_SLOTS = 64;

export type PoolBudget = {
  /** Bytes to allocate the atlas at. */
  atlasBytes: number;
  /** Bytes the node plan may spend on slots. */
  maxPlanBytes: number;
  /** Slots of headroom this split is aiming for (0 = whole pyramid fits). */
  headroomSlots: number;
};

export function resolvePoolBudget(input: {
  /** `getInitialVolumeTextureBudgetBytes()` — the whole-device estimate. */
  deviceBudgetBytes: number;
  /** Number of DISTINCT POOLS (not layers) sharing that device budget. */
  poolCount: number;
  /** Bytes one atlas slot occupies — `brickSlotBytes(spec, bytesPerVoxel)`. */
  slotBytes: number;
  /** Bytes the ENTIRE pyramid would need if fully resident. */
  totalBrickBytes: number;
}): PoolBudget {
  const { deviceBudgetBytes, poolCount, slotBytes, totalBrickBytes } = input;
  const share = deviceBudgetBytes / Math.max(1, poolCount);
  const planCap = Math.min(MAX_LAYER_POOL_BYTES, share);

  // The whole pyramid fits: every brick can be resident, so there is nothing
  // out-of-plan to keep and nothing to evict. Headroom would be dead memory.
  if (totalBrickBytes <= planCap) {
    return { atlasBytes: totalBrickBytes, maxPlanBytes: planCap, headroomSlots: 0 };
  }

  const headroomBytes = MIN_POOL_HEADROOM_SLOTS * slotBytes;
  const share_ = Math.min(share, planCap + headroomBytes);
  // Never let the plan reach zero slots: a pool that can hold nothing renders
  // nothing. The coarsest-level floor in `ensurePool` overrides from there.
  const maxPlanBytes = Math.max(slotBytes, share_ - headroomBytes);
  // ...but that floor must not push the plan PAST the atlas, which is exactly
  // the "plan bigger than its pool" failure this module exists to prevent. It
  // happens when one slot is a large fraction of the share (a huge brick spec,
  // or many pools on a small device): the atlas grows to meet the floor and
  // headroom degrades to whatever is left, possibly zero.
  const atlasBytes = Math.max(share_, maxPlanBytes);
  return {
    atlasBytes,
    maxPlanBytes,
    headroomSlots: Math.floor((atlasBytes - maxPlanBytes) / Math.max(1, slotBytes)),
  };
}
