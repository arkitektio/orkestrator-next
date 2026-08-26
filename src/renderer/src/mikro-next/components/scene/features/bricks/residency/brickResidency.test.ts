import { describe, expect, it } from "vitest";
import { hasPendingEncodeWork, occPromotionWorthwhile, resolveReusedAutoRange } from "./brickResidency";

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

describe("resolveReusedAutoRange (movable-path auto-range carry-over)", () => {
  const pool = (autoRange: boolean, autoRangeInitialized: boolean) => ({
    autoRange,
    autoRangeInitialized,
  });

  it("keeps the measured range when the pool was and stays auto-ranging", () => {
    // The T/dim-slider case. `derivation.dataRange` is the DTYPE range here, so
    // taking it would reset an int16 pool to [-32768, 32767] — mid-gray fog
    // with empty-space skipping off — until the first brick lands again.
    expect(resolveReusedAutoRange(pool(true, true), true, true).keepRange).toBe(true);
    expect(resolveReusedAutoRange(pool(true, true), true, false).keepRange).toBe(true);
  });

  it("keeps a FLUSHED pool's range as a seed but re-fits it per slice", () => {
    // The load-bearing half. accumulateAutoRange only WIDENS while initialized,
    // and this branch is the only thing that ever clears the flag — so carrying
    // it across a flush would let one hot timepoint (a 30000 spike on otherwise
    // 0..4000 data) permanently dim every other timepoint in the series.
    expect(resolveReusedAutoRange(pool(true, true), true, true)).toEqual({
      keepRange: true,
      autoRangeInitialized: false,
    });
  });

  it("keeps the range AND the fit when nothing was flushed", () => {
    // Same data, key moved for another reason — there is nothing to re-fit.
    expect(resolveReusedAutoRange(pool(true, true), true, false)).toEqual({
      keepRange: true,
      autoRangeInitialized: true,
    });
  });

  it("takes the derived range when a late histogram turns auto-range OFF", () => {
    // The policy genuinely changed: the histogram range is the better one and
    // the pool must adopt it (and re-encode its EMPTY entries against it).
    expect(resolveReusedAutoRange(pool(true, true), false, true).keepRange).toBe(false);
  });

  it("takes the derived range when there is no measured range to keep", () => {
    // Seeded at the dtype range, no brick has landed — the seed is provisional.
    expect(resolveReusedAutoRange(pool(true, false), true, true).keepRange).toBe(false);
  });

  it("takes the derived range for a pool that was never auto-ranging", () => {
    // A histogram-backed pool (or a label pool) has an authoritative range;
    // preserving a stale one would decouple it from its own pool key.
    expect(resolveReusedAutoRange(pool(false, false), true, false).keepRange).toBe(false);
    expect(resolveReusedAutoRange(pool(false, true), false, true).keepRange).toBe(false);
  });
});
