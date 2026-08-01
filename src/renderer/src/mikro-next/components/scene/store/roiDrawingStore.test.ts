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

// Same contract for the volumetric anchor: a probe click seeds it, RoiDrawer
// consumes+clears it and raises `primitiveSessionActive` while sizing — the
// flag is what stops the commit click (which may also hit the volume mesh)
// from re-anchoring.
describe("pendingPrimitiveAnchor / primitiveSessionActive", () => {
  it("round-trips the anchor and the session flag", () => {
    const store = createRoiDrawingStore();
    expect(store.getState().pendingPrimitiveAnchor).toBeNull();
    expect(store.getState().primitiveSessionActive).toBe(false);

    store.getState().setPendingPrimitiveAnchor([4, 5, 6]);
    expect(store.getState().pendingPrimitiveAnchor).toEqual([4, 5, 6]);

    store.getState().setPrimitiveSessionActive(true);
    store.getState().setPendingPrimitiveAnchor(null);
    expect(store.getState().primitiveSessionActive).toBe(true);
    expect(store.getState().pendingPrimitiveAnchor).toBeNull();

    store.getState().setPrimitiveSessionActive(false);
    expect(store.getState().primitiveSessionActive).toBe(false);
  });
});
