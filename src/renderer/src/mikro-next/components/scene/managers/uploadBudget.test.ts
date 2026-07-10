import { describe, expect, it } from "vitest";
import { shouldContinueDrain, type DrainBudget } from "./uploadBudget";

const BUDGET: DrainBudget = { maxBytes: 1000, maxBricks: 4, maxMs: 4 };

describe("shouldContinueDrain", () => {
  it("always allows the first brick, even past every cap", () => {
    // A single slow upload (or a slow prior frame) must not stall streaming.
    expect(
      shouldContinueDrain({ bytes: 0, bricks: 0, elapsedMs: 999 }, BUDGET),
    ).toBe(true);
  });

  it("each cap binds independently once progress was made", () => {
    const ok = { bytes: 500, bricks: 2, elapsedMs: 2 };
    expect(shouldContinueDrain(ok, BUDGET)).toBe(true);
    expect(shouldContinueDrain({ ...ok, bytes: 1000 }, BUDGET)).toBe(false);
    expect(shouldContinueDrain({ ...ok, bricks: 4 }, BUDGET)).toBe(false);
    expect(shouldContinueDrain({ ...ok, elapsedMs: 4 }, BUDGET)).toBe(false);
  });

  it("the time cap binds when bytes/bricks would still allow more (the P19 case)", () => {
    // Integrated GPU: one brick took 17 ms — stop after it despite tiny bytes.
    expect(
      shouldContinueDrain({ bytes: 100, bricks: 1, elapsedMs: 17 }, BUDGET),
    ).toBe(false);
  });
});
