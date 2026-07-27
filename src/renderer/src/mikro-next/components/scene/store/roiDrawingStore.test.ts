// @vitest-environment jsdom
// (the generated `graphql.ts` enums are runtime values, and importing that
// module pulls in the Apollo hooks barrel, which touches `window` on load)
import { describe, expect, it } from "vitest";

import { createRoiDrawingStore } from "./roiDrawingStore";

// RoiDrawer consumes the seed in an effect and clears it afterwards; this pins
// the set/clear contract that "draw path from probe" relies on.
describe("pendingPathSeed", () => {
  it("starts empty, holds a seed, and clears back to null", () => {
    const store = createRoiDrawingStore();
    expect(store.getState().pendingPathSeed).toBeNull();

    store.getState().setPendingPathSeed([1, 2, 3]);
    expect(store.getState().pendingPathSeed).toEqual([1, 2, 3]);

    store.getState().setPendingPathSeed(null);
    expect(store.getState().pendingPathSeed).toBeNull();
  });
});
