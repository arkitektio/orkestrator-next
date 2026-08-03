import { describe, expect, it } from "vitest";
import { MIN_POOL_HEADROOM_SLOTS, resolvePoolBudget } from "./poolBudget";
import { MAX_LAYER_POOL_BYTES } from "../lodPlanning";

/** A 66x66x38 uint8 brick over 4 channel slabs — the shape from the report. */
const SLOT_BYTES = 66 * 66 * 38 * 4;
const MiB = 1024 * 1024;

/** Big enough that the whole pyramid never fits, so headroom always applies. */
const HUGE_PYRAMID = 8 * 1024 * MiB;

const budget = (over: Partial<Parameters<typeof resolvePoolBudget>[0]> = {}) =>
  resolvePoolBudget({
    deviceBudgetBytes: 512 * MiB,
    poolCount: 1,
    slotBytes: SLOT_BYTES,
    totalBrickBytes: HUGE_PYRAMID,
    ...over,
  });

describe("resolvePoolBudget — the headroom invariant", () => {
  it("leaves at least MIN_POOL_HEADROOM_SLOTS between the plan and the atlas", () => {
    const { atlasBytes, maxPlanBytes } = budget();
    const atlasSlots = Math.floor(atlasBytes / SLOT_BYTES);
    const planSlots = Math.floor(maxPlanBytes / SLOT_BYTES);
    expect(atlasSlots - planSlots).toBeGreaterThanOrEqual(MIN_POOL_HEADROOM_SLOTS);
  });

  it("holds the invariant across a spread of budgets, pool counts and slot sizes", () => {
    for (const deviceBudgetBytes of [256 * MiB, 512 * MiB, 1536 * MiB, 2048 * MiB]) {
      for (const poolCount of [1, 2, 4, 8, 16, 32]) {
        for (const slotBytes of [SLOT_BYTES, 4096, 66 * 66 * 38 * 4 * 4, 32 * MiB]) {
          const { atlasBytes, maxPlanBytes, headroomSlots } = resolvePoolBudget({
            deviceBudgetBytes,
            poolCount,
            slotBytes,
            totalBrickBytes: HUGE_PYRAMID,
          });
          expect(atlasBytes).toBeGreaterThan(0);
          expect(maxPlanBytes).toBeGreaterThan(0);
          // THE invariant: the plan must always fit the atlas it will land in.
          expect(maxPlanBytes).toBeLessThanOrEqual(atlasBytes);
          expect(headroomSlots).toBeGreaterThanOrEqual(0);

          const share = deviceBudgetBytes / poolCount;
          const planCap = Math.min(MAX_LAYER_POOL_BYTES, share);
          if (planCap + MIN_POOL_HEADROOM_SLOTS * slotBytes <= share) {
            // The normal case: the share covers a full plan AND a full
            // headroom, so both get exactly what they asked for.
            expect(maxPlanBytes).toBe(planCap);
            expect(headroomSlots).toBe(MIN_POOL_HEADROOM_SLOTS);
            expect(atlasBytes).toBeLessThanOrEqual(share + 1);
          } else if (slotBytes > share) {
            // One slot exceeds the whole share: the single-slot floor wins and
            // the atlas grows to meet it rather than the plan overrunning.
            expect(atlasBytes).toBe(slotBytes);
            expect(maxPlanBytes).toBe(slotBytes);
          } else {
            // Squeezed: the plan is sacrificed first, the atlas stays in share.
            expect(atlasBytes).toBeLessThanOrEqual(share + 1);
            expect(maxPlanBytes).toBeLessThanOrEqual(planCap);
          }
        }
      }
    }
  });

  it("never lets the plan reach zero slots, even on a starved share", () => {
    // A share far below one slot: the plan still gets a slot, and the
    // coarsest-level floor in ensurePool overrides from there.
    const { maxPlanBytes } = budget({ deviceBudgetBytes: 1024, poolCount: 32 });
    expect(maxPlanBytes).toBeGreaterThanOrEqual(SLOT_BYTES);
  });
});

describe("resolvePoolBudget — whole pyramid fits", () => {
  it("skips headroom entirely and sizes the atlas to the pyramid", () => {
    // Everything can be resident, so nothing is ever out-of-plan or evicted.
    // Headroom here would be dead memory.
    const totalBrickBytes = 8 * MiB;
    const { atlasBytes, maxPlanBytes, headroomSlots } = budget({ totalBrickBytes });
    expect(atlasBytes).toBe(totalBrickBytes);
    expect(headroomSlots).toBe(0);
    expect(maxPlanBytes).toBe(MAX_LAYER_POOL_BYTES);
  });
});

describe("resolvePoolBudget — monotonicity", () => {
  it("never grows either number as pools are added", () => {
    let previous = budget({ poolCount: 1 });
    for (const poolCount of [2, 4, 8, 16, 32]) {
      const next = budget({ poolCount });
      expect(next.atlasBytes).toBeLessThanOrEqual(previous.atlasBytes);
      expect(next.maxPlanBytes).toBeLessThanOrEqual(previous.maxPlanBytes);
      previous = next;
    }
  });
});

describe("resolvePoolBudget — the reported regression", () => {
  // The dump: one shared pool, 4 layers, 66x66x38x4ch uint8 bricks. The plan
  // reached targetLevel 0 at 121,166,496 B / 183 nodes, and the atlas was sized
  // at 200 slots — leaving 17 free against a 64-slot target, which produced
  // 4681 evictions and 199 dropped uploads.
  const OBSERVED_PLAN_BYTES = 121_166_496;

  it("does NOT shrink the plan below what reached full resolution", () => {
    const { maxPlanBytes } = budget();
    expect(maxPlanBytes).toBeGreaterThanOrEqual(OBSERVED_PLAN_BYTES);
  });

  it("grows the atlas to cover the plan plus a full headroom", () => {
    const { atlasBytes, maxPlanBytes } = budget();
    expect(atlasBytes).toBeGreaterThanOrEqual(
      maxPlanBytes + MIN_POOL_HEADROOM_SLOTS * SLOT_BYTES,
    );
    // ~170 MB, up from the 132 MB that thrashed — the intended cost.
    expect(atlasBytes).toBeGreaterThan(160 * MiB);
    expect(atlasBytes).toBeLessThan(180 * MiB);
  });

  it("falls back to shrinking the plan when the device share cannot cover both", () => {
    // A share below planCap + headroom: resolution is the correct sacrifice on
    // a memory-poor machine, and the headroom invariant still holds.
    const { atlasBytes, maxPlanBytes } = budget({ deviceBudgetBytes: 150 * MiB });
    expect(atlasBytes).toBeLessThanOrEqual(150 * MiB);
    expect(maxPlanBytes).toBeLessThan(MAX_LAYER_POOL_BYTES);
    expect(atlasBytes - maxPlanBytes).toBeGreaterThanOrEqual(
      MIN_POOL_HEADROOM_SLOTS * SLOT_BYTES,
    );
  });
});
