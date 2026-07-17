import { describe, expect, it } from "vitest";
import { decodeEmptyValue, encodeEmptyValue } from "./brickEncoding";

/**
 * EMPTY (uniform-fill) bricks survive only as an 8-bit page-table byte, so the
 * value the GPU renders is the encode→decode round-trip — not the raw value.
 * `decodeEmptyValue` is the CPU mirror that keeps `sampleResident` in lockstep
 * with the shader (OCTREE_RENDERER.md P11).
 */
describe("EMPTY-brick encode/decode round-trip", () => {
  const range = { minValue: 0, maxValue: 65535 }; // uint16

  it("encodes the bounds to 0 and 255 and decodes them back exactly", () => {
    expect(encodeEmptyValue(0, range)).toBe(0);
    expect(encodeEmptyValue(65535, range)).toBe(255);
    expect(decodeEmptyValue(0, range)).toBe(0);
    expect(decodeEmptyValue(255, range)).toBe(65535);
  });

  it("is idempotent under a second round-trip (decode lands on the code grid)", () => {
    for (const raw of [100, 4000, 32000, 60000]) {
      const once = decodeEmptyValue(encodeEmptyValue(raw, range), range);
      const twice = decodeEmptyValue(encodeEmptyValue(once, range), range);
      expect(twice).toBeCloseTo(once, 6);
    }
  });

  it("quantizes uint16 to ~257-unit steps (the inherent P11 precision loss)", () => {
    // 4000 and 4100 are within one 8-bit code (~257 raw units) → same rendered value.
    const a = decodeEmptyValue(encodeEmptyValue(4000, range), range);
    const b = decodeEmptyValue(encodeEmptyValue(4100, range), range);
    expect(a).toBe(b);
    // The round-trip error stays within one code step.
    expect(Math.abs(a - 4000)).toBeLessThanOrEqual(65535 / 255);
  });

  it("returns min when the range is degenerate", () => {
    expect(encodeEmptyValue(500, { minValue: 7, maxValue: 7 })).toBe(0);
    expect(decodeEmptyValue(0, { minValue: 7, maxValue: 7 })).toBe(7);
  });
});
