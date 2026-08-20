import { describe, expect, it } from "vitest";
import { hasPendingEncodeWork, occPromotionWorthwhile } from "./brickResidency";

describe("hasPendingEncodeWork (the drain idle-latch guard)", () => {
  // The drain's idle latch (`drainNeeded = false`) must never clear while a
  // pool still owes encode work: the occupancy-range promotion is a
  // TWO-drain protocol, and clearing the latch between its drains stranded
  // every occupancy/aggregate texel at the "never skip" sentinel for the
  // whole idle period (the 2026-08-19 audit's critical finding).
  const pool = (
    overrides: Partial<{
      occReencodePending: boolean;
      autoRangeEncodeDirty: boolean;
    }> = {},
  ) => ({
    occReencodePending: false,
    autoRangeEncodeDirty: false,
    ...overrides,
  });

  it("is false only when NO encode work is pending", () => {
    expect(hasPendingEncodeWork(pool())).toBe(false);
  });

  it("is true for each pending flag individually", () => {
    expect(hasPendingEncodeWork(pool({ occReencodePending: true }))).toBe(true);
    expect(hasPendingEncodeWork(pool({ autoRangeEncodeDirty: true }))).toBe(true);
  });
});

describe("occPromotionWorthwhile (drained-edge promotion decision)", () => {
  const pool = (
    overrides: Partial<{
      occObservedInitialized: boolean;
      occObservedMin: number;
      occObservedMax: number;
      occEncodeMin: number;
      occEncodeMax: number;
    }> = {},
  ) => ({
    occObservedInitialized: true,
    occObservedMin: 0,
    occObservedMax: 2000,
    occEncodeMin: 0,
    occEncodeMax: 65535,
    ...overrides,
  });

  it("promotes when the observed range TIGHTENS the encode range", () => {
    // Dim uint16: observed [0, 2000] against the dtype encode [0, 65535].
    expect(occPromotionWorthwhile(pool())).toBe(true);
  });

  it("does not promote after the promotion (encode ≡ observed)", () => {
    expect(occPromotionWorthwhile(pool({ occEncodeMin: 0, occEncodeMax: 2000 }))).toBe(false);
  });

  it("the escape epsilon is relative to the OBSERVED span — no cold-load cascade", () => {
    // The cascade: encode was promoted to a tiny first-brick span [0, 200];
    // the union then grows brick by brick. With the old encode-span epsilon
    // (±2 raw units) EVERY growth escaped; with the observed-span epsilon a
    // growth must exceed 1% of the CURRENT union to count — and since any
    // union that grew past the encode max by more than 1% of itself is a
    // real escape, it promotes ONCE at the drained edge, not per drain.
    // Sub-epsilon drift does not promote:
    expect(
      occPromotionWorthwhile(
        pool({ occObservedMax: 2010, occEncodeMin: 0, occEncodeMax: 2000 }),
      ),
    ).toBe(false); // 10 < 1% of 2010
    // Real growth does:
    expect(
      occPromotionWorthwhile(
        pool({ occObservedMax: 2500, occEncodeMin: 0, occEncodeMax: 2000 }),
      ),
    ).toBe(true);
    // The old failure shape — union 200→220 against encode [0,200] — is a
    // 10% growth of the union and legitimately promotes; but 200→201.5
    // (sub-1%) does not, which is what breaks the per-drain cascade.
    expect(
      occPromotionWorthwhile(
        pool({ occObservedMax: 201.5, occEncodeMin: 0, occEncodeMax: 200 }),
      ),
    ).toBe(false);
  });

  it("escapes below the encode min promote too", () => {
    expect(
      occPromotionWorthwhile(
        pool({ occObservedMin: -500, occObservedMax: 2000, occEncodeMin: 0, occEncodeMax: 2000 }),
      ),
    ).toBe(true);
  });

  it("degenerate unions never promote", () => {
    expect(occPromotionWorthwhile(pool({ occObservedInitialized: false }))).toBe(false);
    expect(
      occPromotionWorthwhile(pool({ occObservedMin: 5, occObservedMax: 5 })),
    ).toBe(false);
  });
});
