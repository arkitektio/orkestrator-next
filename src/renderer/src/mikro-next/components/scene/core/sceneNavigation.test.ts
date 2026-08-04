import { describe, expect, it } from "vitest";
import {
  PAN_VIEWPORT_FRACTION,
  navigationActionForKey,
  panDistance,
  stepSceneZ,
  worldUnitsPerPixelAt,
} from "./sceneNavigation";

describe("navigationActionForKey", () => {
  it("pans along the screen basis with a bare arrow", () => {
    expect(navigationActionForKey("ArrowLeft", false)).toEqual({ kind: "pan", dx: -1, dy: 0 });
    expect(navigationActionForKey("ArrowRight", false)).toEqual({ kind: "pan", dx: 1, dy: 0 });
    expect(navigationActionForKey("ArrowUp", false)).toEqual({ kind: "pan", dx: 0, dy: 1 });
    expect(navigationActionForKey("ArrowDown", false)).toEqual({ kind: "pan", dx: 0, dy: -1 });
  });

  it("puts the data axes on the shifted arrows", () => {
    expect(navigationActionForKey("ArrowLeft", true)).toEqual({ kind: "z", direction: -1 });
    expect(navigationActionForKey("ArrowRight", true)).toEqual({ kind: "z", direction: 1 });
  });

  it("zooms in on shift+up, out on shift+down", () => {
    expect(navigationActionForKey("ArrowUp", true)).toEqual({ kind: "zoom", direction: 1 });
    expect(navigationActionForKey("ArrowDown", true)).toEqual({ kind: "zoom", direction: -1 });
  });

  it("leaves every other key alone", () => {
    // The digit row belongs to the layer-visibility binding, and the numpad
    // arrows report their own codes — neither is claimed here.
    expect(navigationActionForKey("Digit1", true)).toBeNull();
    expect(navigationActionForKey("Numpad4", false)).toBeNull();
    expect(navigationActionForKey("KeyD", false)).toBeNull();
    expect(navigationActionForKey("", true)).toBeNull();
  });
});

describe("worldUnitsPerPixelAt", () => {
  it("reads magnification straight off an orthographic camera", () => {
    expect(worldUnitsPerPixelAt({ isOrthographicCamera: true, zoom: 4 }, 999, 800)).toBe(0.25);
  });

  it("ignores distance for an orthographic camera", () => {
    const near = worldUnitsPerPixelAt({ isOrthographicCamera: true, zoom: 2 }, 1, 800);
    const far = worldUnitsPerPixelAt({ isOrthographicCamera: true, zoom: 2 }, 10_000, 800);
    expect(near).toBe(far);
  });

  it("scales with distance for a perspective camera", () => {
    const near = worldUnitsPerPixelAt({ fov: 45 }, 100, 800);
    const far = worldUnitsPerPixelAt({ fov: 45 }, 200, 800);
    expect(far).toBeCloseTo(near * 2, 10);
  });

  it("survives a zero-height viewport and a zero zoom", () => {
    expect(Number.isFinite(worldUnitsPerPixelAt({ fov: 45 }, 100, 0))).toBe(true);
    expect(Number.isFinite(worldUnitsPerPixelAt({ isOrthographicCamera: true, zoom: 0 }, 1, 800))).toBe(
      true,
    );
  });
});

describe("panDistance", () => {
  it("moves a fixed fraction of the viewport, whatever the zoom", () => {
    // At zoom 4 the viewport spans 800/4 = 200 world units, so 8% is 16.
    expect(panDistance({ isOrthographicCamera: true, zoom: 4 }, 0, 800)).toBeCloseTo(
      200 * PAN_VIEWPORT_FRACTION,
      10,
    );
  });
});

describe("stepSceneZ", () => {
  const extent = { min: 0, max: 10, step: 1 }; // 11 slices

  it("walks one slice at a time in both directions", () => {
    expect(stepSceneZ(extent, 4, 1)).toBe(5);
    expect(stepSceneZ(extent, 4, -1)).toBe(3);
  });

  it("clamps at both ends instead of running off the stack", () => {
    expect(stepSceneZ(extent, 10, 1)).toBe(10);
    expect(stepSceneZ(extent, 0, -1)).toBe(0);
  });

  it("snaps a drifted position back onto the grid", () => {
    // The whole reason this rounds rather than adding: 4.4 is not a slice, and
    // stepping from it must land on one rather than carry the error forward.
    expect(stepSceneZ(extent, 4.4, 1)).toBe(5);
    expect(stepSceneZ(extent, 4.6, -1)).toBe(4);
  });

  it("does not accumulate drift over a long walk", () => {
    let z = 0;
    for (let i = 0; i < 10; i++) z = stepSceneZ(extent, z, 1);
    expect(z).toBe(10);
  });

  it("handles an offset, non-integer grid", () => {
    const offset = { min: -2.5, max: 2.5, step: 0.5 }; // 11 slices
    expect(stepSceneZ(offset, -2.5, 1)).toBeCloseTo(-2, 10);
    expect(stepSceneZ(offset, 2.5, 1)).toBeCloseTo(2.5, 10);
  });

  it("stays put when the extent has no thickness to step through", () => {
    expect(stepSceneZ({ min: 3, max: 3, step: 0 }, 3, 1)).toBe(3);
    expect(stepSceneZ({ min: 0, max: 0, step: 1 }, 0, 1)).toBe(0);
  });
});
