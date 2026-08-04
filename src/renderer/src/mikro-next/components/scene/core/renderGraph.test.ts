// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { toRgba } from "./renderGraph";

describe("toRgba", () => {
  it("null passes through (no explicit color)", () => {
    expect(toRgba(null)).toBeNull();
  });

  it("appends an opaque alpha to an RGB triple (the save-rejection case)", () => {
    expect(toRgba([255, 168, 0])).toEqual([255, 168, 0, 255]);
  });

  it("RGBA passes through unchanged", () => {
    const rgba = [10, 20, 30, 128];
    expect(toRgba(rgba)).toBe(rgba);
  });

  it("over-long arrays are truncated to 4 defensively", () => {
    expect(toRgba([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4]);
  });
});
