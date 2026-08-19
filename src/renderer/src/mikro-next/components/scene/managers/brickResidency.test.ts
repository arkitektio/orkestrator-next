import { describe, expect, it } from "vitest";
import { hasPendingEncodeWork } from "./brickResidency";

describe("hasPendingEncodeWork (the drain idle-latch guard)", () => {
  // The drain's idle latch (`drainNeeded = false`) must never clear while a
  // pool still owes encode work: the occupancy-range promotion is a
  // TWO-drain protocol, and clearing the latch between its drains stranded
  // every occupancy/aggregate texel at the "never skip" sentinel for the
  // whole idle period (the 2026-08-19 audit's critical finding).
  const pool = (
    overrides: Partial<{
      occRangePromotePending: boolean;
      occReencodePending: boolean;
      autoRangeEncodeDirty: boolean;
    }> = {},
  ) => ({
    occRangePromotePending: false,
    occReencodePending: false,
    autoRangeEncodeDirty: false,
    ...overrides,
  });

  it("is false only when NO encode work is pending", () => {
    expect(hasPendingEncodeWork(pool())).toBe(false);
  });

  it("is true for each pending flag individually", () => {
    expect(hasPendingEncodeWork(pool({ occRangePromotePending: true }))).toBe(true);
    expect(hasPendingEncodeWork(pool({ occReencodePending: true }))).toBe(true);
    expect(hasPendingEncodeWork(pool({ autoRangeEncodeDirty: true }))).toBe(true);
  });

  it("covers the promotion mid-state (promote consumed, re-encode owed)", () => {
    // Exactly the state after drain N of the two-drain protocol.
    expect(
      hasPendingEncodeWork(pool({ occRangePromotePending: false, occReencodePending: true })),
    ).toBe(true);
  });
});
