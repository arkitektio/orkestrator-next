import { describe, expect, it } from "vitest";

import {
  STATUS_EMPTY,
  STATUS_RESIDENT,
  STATUS_UNMAPPED,
  attenuatedMipDone,
  attenuationAt,
  emptyStepMaxNorm,
  normalizeSlotValue,
  occupancyUpperNorm,
  residentBrickSkippable,
  shouldSkipStep,
  type MemberSkipState,
  type SlotTransfer,
} from "./raymarchStep";

const slot = (overrides: Partial<SlotTransfer> = {}): SlotTransfer => ({
  climMin: 0,
  climMax: 1,
  gamma: 1,
  invert: false,
  visible: true,
  ...overrides,
});

describe("shouldSkipStep", () => {
  it("always skips an unmapped chain", () => {
    expect(shouldSkipStep(STATUS_UNMAPPED, 0)).toBe(true);
    expect(shouldSkipStep(STATUS_UNMAPPED, 1)).toBe(true);
  });

  it("never skips a resident brick", () => {
    expect(shouldSkipStep(STATUS_RESIDENT, 0)).toBe(false);
    expect(shouldSkipStep(STATUS_RESIDENT, 1)).toBe(false);
  });

  it("skips an EMPTY brick only when nothing contributes", () => {
    expect(shouldSkipStep(STATUS_EMPTY, 0.001)).toBe(true);
    expect(shouldSkipStep(STATUS_EMPTY, 0.0011)).toBe(false);
  });
});

describe("normalizeSlotValue", () => {
  it("windows into the clim range", () => {
    expect(normalizeSlotValue(50, 0, 100, slot())).toBeCloseTo(0.5, 5);
    expect(normalizeSlotValue(25, 0, 100, slot({ climMin: 0.25, climMax: 0.75 }))).toBe(0);
    expect(normalizeSlotValue(75, 0, 100, slot({ climMin: 0.25, climMax: 0.75 }))).toBeCloseTo(
      0.999,
      5,
    );
  });

  it("clamps to 0.999 before gamma so only invert reaches 1", () => {
    expect(normalizeSlotValue(1e9, 0, 100, slot())).toBeCloseTo(0.999, 6);
    expect(normalizeSlotValue(-1e9, 0, 100, slot({ invert: true }))).toBe(1);
  });

  it("applies gamma to the windowed norm", () => {
    expect(normalizeSlotValue(25, 0, 100, slot({ gamma: 2 }))).toBeCloseTo(0.0625, 5);
  });

  it("never exceeds 1 for any input (the ATTENUATED_MIP bound relies on it)", () => {
    for (const raw of [-1e12, 0, 1e-9, 42, 1e12]) {
      for (const s of [slot(), slot({ invert: true }), slot({ gamma: 0.1 })]) {
        const norm = normalizeSlotValue(raw, 0, 100, s);
        expect(norm).toBeGreaterThanOrEqual(0);
        expect(norm).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe("emptyStepMaxNorm", () => {
  it("takes the max over visible slots only", () => {
    const slots = [
      slot({ visible: false, invert: true }), // would be ~1 if visible
      slot({ climMin: 0.4, climMax: 0.6 }),
    ];
    // emptyValue 0 → windowed norm 0 for the visible slot.
    expect(emptyStepMaxNorm(0, 0, 100, slots)).toBe(0);
  });

  it("a contributing empty value defeats the skip", () => {
    expect(emptyStepMaxNorm(50, 0, 100, [slot()])).toBeCloseTo(0.5, 5);
  });

  it("an inverted slot makes a zero empty value contribute", () => {
    expect(emptyStepMaxNorm(0, 0, 100, [slot({ invert: true })])).toBe(1);
  });

  it("no visible slots → zero (skippable)", () => {
    expect(emptyStepMaxNorm(50, 0, 100, [slot({ visible: false })])).toBe(0);
  });
});

describe("attenuatedMipDone", () => {
  it("terminates once the best reaches the depth ceiling", () => {
    expect(attenuatedMipDone(1.0, 0)).toBe(true);
    expect(attenuatedMipDone(0.99, 0)).toBe(false);
    expect(attenuatedMipDone(0.3, 1)).toBe(true); // exp(-1.5) ≈ 0.223
  });

  it("no reachable future contribution can exceed the bound", () => {
    // Property: for any state where done fires at depth d, every later sample
    // (norm ≤ 1, depth > d) produces a weighted value strictly below the
    // accumulated max, so the image is unchanged by termination.
    for (const d of [0, 0.1, 0.5, 0.9]) {
      const bound = attenuationAt(d);
      const accumulated = bound; // the smallest max that triggers done
      for (const futureDepth of [d + 1e-6, d + 0.1, 1]) {
        for (const norm of [0, 0.5, 0.999, 1]) {
          const future = norm * attenuationAt(futureDepth);
          expect(future).toBeLessThan(accumulated);
        }
      }
    }
  });

  it("monotone: attenuation strictly decreases with depth", () => {
    let previous = attenuationAt(0);
    for (let d = 0.05; d <= 1; d += 0.05) {
      const current = attenuationAt(d);
      expect(current).toBeLessThan(previous);
      previous = current;
    }
  });
});

describe("occupancyUpperNorm", () => {
  it("bounds every raw value in the bracket for a monotone window", () => {
    const s = slot({ climMin: 0.2, climMax: 0.8 });
    const upper = occupancyUpperNorm(10, 40, 0, 100, [s]);
    for (let raw = 10; raw <= 40; raw += 1) {
      expect(normalizeSlotValue(raw, 0, 100, s)).toBeLessThanOrEqual(upper + 1e-9);
    }
  });

  it("bounds inverted channels via the MIN endpoint", () => {
    const s = slot({ invert: true });
    // Low raw values are BRIGHT under inversion: the bound must come from
    // brickMin, not brickMax.
    const upper = occupancyUpperNorm(10, 40, 0, 100, [s]);
    expect(upper).toBeCloseTo(normalizeSlotValue(10, 0, 100, s), 9);
    for (let raw = 10; raw <= 40; raw += 1) {
      expect(normalizeSlotValue(raw, 0, 100, s)).toBeLessThanOrEqual(upper + 1e-9);
    }
  });

  it("ignores invisible slots and maxes across visible ones", () => {
    const dim = slot({ climMin: 0.9, climMax: 1 });
    const hot = slot({ climMin: 0, climMax: 0.1 });
    expect(occupancyUpperNorm(5, 8, 0, 100, [dim, slot({ visible: false })])).toBe(0);
    // hot: baseNorm(8) = 0.08 → windowed over [0, 0.1] = 0.8.
    expect(occupancyUpperNorm(5, 8, 0, 100, [dim, hot])).toBeCloseTo(0.8, 5);
  });
});

describe("residentBrickSkippable", () => {
  const member = (overrides: Partial<MemberSkipState> = {}): MemberSkipState => ({
    projectionMode: 0,
    upperNorm: 0.5,
    bestNorm: 0,
    isoThreshold: 0.5,
    done: false,
    ...overrides,
  });

  it("skips a brick invisible under the clim window in any mode", () => {
    for (const projectionMode of [0, 1, 2, 3]) {
      expect(residentBrickSkippable([member({ projectionMode, upperNorm: 0.001 })])).toBe(true);
      expect(residentBrickSkippable([member({ projectionMode: 1, upperNorm: 0.1 })])).toBe(
        false,
      );
    }
  });

  it("MIP skips bricks that cannot beat the accumulated max", () => {
    expect(residentBrickSkippable([member({ upperNorm: 0.4, bestNorm: 0.4 })])).toBe(true);
    expect(residentBrickSkippable([member({ upperNorm: 0.41, bestNorm: 0.4 })])).toBe(false);
    // Fresh ray (bestNorm 0): only invisible bricks skip.
    expect(residentBrickSkippable([member({ upperNorm: 0.1, bestNorm: 0 })])).toBe(false);
  });

  it("ISO skips bricks that never reach the threshold", () => {
    expect(
      residentBrickSkippable([member({ projectionMode: 3, upperNorm: 0.49, isoThreshold: 0.5 })]),
    ).toBe(true);
    expect(
      residentBrickSkippable([member({ projectionMode: 3, upperNorm: 0.5, isoThreshold: 0.5 })]),
    ).toBe(false);
  });

  it("hops only when EVERY member is satisfied", () => {
    const beaten = member({ upperNorm: 0.3, bestNorm: 0.4 });
    const hungry = member({ upperNorm: 0.3, bestNorm: 0.2 });
    expect(residentBrickSkippable([beaten, hungry])).toBe(false);
    expect(residentBrickSkippable([beaten, member({ ...hungry, done: true })])).toBe(true);
    expect(residentBrickSkippable([beaten, beaten])).toBe(true);
  });

  it("a skipped brick provably cannot change a MIP accumulator", () => {
    // Property over random states: when a MIP member is skippable, every
    // reachable sample norm in the brick (≤ upperNorm) stays within the
    // accumulated max, up to the shared invisible threshold (0.001).
    for (let i = 0; i < 200; i++) {
      const best = Math.random();
      const upper = Math.random();
      const m = member({ upperNorm: upper, bestNorm: best });
      if (!residentBrickSkippable([m])) continue;
      expect(upper).toBeLessThanOrEqual(Math.max(best, 0.001));
    }
  });
});
