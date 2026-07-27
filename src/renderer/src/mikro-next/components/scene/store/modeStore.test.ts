import { describe, expect, it } from "vitest";
import { createModeStore } from "./modeStore";

describe("createModeStore", () => {
  it("starts in NAVIGATE with every camera setting off", () => {
    const state = createModeStore().getState();
    expect(state.interactionMode).toBe("NAVIGATE");
    expect(state.displayMode).toBe("2D");
    expect(state.zoomToCursor).toBe(false);
    expect(state.pivotOnProbe).toBe(false);
    expect(state.probeFollowsCursor).toBe(false);
  });

  it("seeds the display mode from the scene's preferred view", () => {
    expect(createModeStore({ displayMode: "3D" }).getState().displayMode).toBe("3D");
  });

  // Three near-identical boolean setters is exactly the shape a copy-paste slip
  // hides in.
  it.each([
    ["setZoomToCursor", "zoomToCursor"],
    ["setPivotOnProbe", "pivotOnProbe"],
    ["setProbeFollowsCursor", "probeFollowsCursor"],
  ] as const)("%s flips only %s", (setter, field) => {
    const store = createModeStore();
    store.getState()[setter](true);

    const state = store.getState();
    expect(state[field]).toBe(true);
    for (const other of ["zoomToCursor", "pivotOnProbe", "probeFollowsCursor"] as const) {
      if (other !== field) expect(state[other]).toBe(false);
    }
  });

  it("sets the interaction and display modes", () => {
    const store = createModeStore();
    store.getState().setInteractionMode("PROBE");
    store.getState().setDisplayMode("3D");
    expect(store.getState().interactionMode).toBe("PROBE");
    expect(store.getState().displayMode).toBe("3D");
  });
});
