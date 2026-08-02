import { describe, expect, it } from "vitest";
import { chooseSlotGrid } from "./brickAtlas";
import type { Vec3 } from "../../core/octree/levelGeometry";

describe("chooseSlotGrid", () => {
  it("never exceeds the requested slot count", () => {
    // The reported regression, with its real numbers: a 66x66x38x4ch uint8
    // brick is 662,112 B, so a 128 MiB pool budget asks for
    // floor(134217728 / 662112) = 202 slots, and the extent caps allow at most
    // [31, 7, 1] slots. The old ceil-based factorization rounded that UP to
    // 31x7x1 = 217 slots = 143,678,304 B — 7.4% over the budget it came from,
    // per pool, with nothing re-checking. desiredSlots is floor(budget /
    // slotBytes), so "product <= desiredSlots" IS "capacity * slotBytes <=
    // budget".
    const SLOT_BYTES = 66 * 66 * 38 * 4;
    const BUDGET = 128 * 1024 * 1024;
    const { slotGrid, capacity } = chooseSlotGrid(202, [31, 7, 1]);
    expect(slotGrid[0] * slotGrid[1] * slotGrid[2]).toBe(capacity);
    expect(capacity).toBeLessThanOrEqual(202);
    expect(capacity * SLOT_BYTES).toBeLessThanOrEqual(BUDGET);
    // 28 x 7 x 1 = 196 is the largest in-budget grid under those caps.
    expect(capacity).toBe(196);
    expect(slotGrid).toEqual([28, 7, 1]);
  });

  it("holds the invariant across a spread of budgets and caps", () => {
    const caps: Vec3[] = [
      [31, 7, 1],
      [31, 31, 13],
      [8, 8, 8],
      [1, 1, 64],
      [64, 1, 1],
    ];
    for (const maxSlots of caps) {
      for (const wanted of [1, 2, 7, 13, 64, 101, 202, 512, 4096]) {
        const { slotGrid, capacity } = chooseSlotGrid(wanted, maxSlots);
        expect(capacity).toBeLessThanOrEqual(wanted);
        expect(capacity).toBeGreaterThanOrEqual(1);
        expect(slotGrid[0]).toBeLessThanOrEqual(maxSlots[0]);
        expect(slotGrid[1]).toBeLessThanOrEqual(maxSlots[1]);
        expect(slotGrid[2]).toBeLessThanOrEqual(maxSlots[2]);
        expect(slotGrid[0] * slotGrid[1] * slotGrid[2]).toBe(capacity);
      }
    }
  });

  it("uses an exact factorization when one exists", () => {
    expect(chooseSlotGrid(64, [31, 31, 13]).capacity).toBe(64);
    expect(chooseSlotGrid(196, [31, 31, 13]).capacity).toBe(196);
  });

  it("is clamped by the texture-extent caps, not just the budget", () => {
    // Plenty of budget, almost no room: the caps bind.
    const { capacity } = chooseSlotGrid(10_000, [4, 4, 2]);
    expect(capacity).toBe(32);
  });

  it("honours the P16 coarsest-level floor even when it overshoots the budget", () => {
    // A pool that cannot hold its own coarsest level has no fallback chain and
    // renders nothing, so the floor deliberately beats the byte budget.
    const { capacity } = chooseSlotGrid(4, [31, 31, 13], 70);
    expect(capacity).toBeGreaterThanOrEqual(70);
  });

  it("does not invoke the floor fallback when the budget already satisfies it", () => {
    const { capacity } = chooseSlotGrid(196, [31, 31, 13], 70);
    expect(capacity).toBe(196);
    expect(capacity).toBeLessThanOrEqual(196);
  });

  it("degrades to a single slot rather than returning an empty grid", () => {
    const { slotGrid, capacity } = chooseSlotGrid(0, [31, 31, 13]);
    expect(capacity).toBe(1);
    expect(slotGrid).toEqual([1, 1, 1]);
  });
});
