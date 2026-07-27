import { describe, expect, it } from "vitest";
import {
  availableAnnotateTools,
  availableInteractionModes,
  coerceModeState,
  hasProbeableLayer,
  isAnnotateToolAvailable,
  isInteractionModeAvailable,
} from "./modeCompat";

const ctx2D = { displayMode: "2D" as const, hasProbeableLayer: true };
const ctx3D = { displayMode: "3D" as const, hasProbeableLayer: true };
const noLayers2D = { displayMode: "2D" as const, hasProbeableLayer: false };
const noLayers3D = { displayMode: "3D" as const, hasProbeableLayer: false };

describe("hasProbeableLayer", () => {
  it("is false with no layers at all", () => {
    expect(hasProbeableLayer([])).toBe(false);
  });

  it("is false when every layer is hidden", () => {
    expect(hasProbeableLayer([{ visible: false }, { visible: false }])).toBe(false);
  });

  it("is true when at least one layer is visible", () => {
    expect(hasProbeableLayer([{ visible: false }, { visible: true }])).toBe(true);
  });

  // `visible` is optional on the layer model; absent means shown.
  it("treats an undefined visible flag as visible", () => {
    expect(hasProbeableLayer([{}])).toBe(true);
  });
});

describe("availableInteractionModes", () => {
  // The overlay renders this array directly, so the order is part of the
  // contract, not an implementation detail.
  it("offers all three in canonical order when a layer can be probed", () => {
    expect(availableInteractionModes(ctx2D)).toEqual([
      "NAVIGATE",
      "ANNOTATE",
      "PROBE",
    ]);
    expect(availableInteractionModes(ctx3D)).toEqual([
      "NAVIGATE",
      "ANNOTATE",
      "PROBE",
    ]);
  });

  it("drops PROBE when nothing can answer a probe, in either view", () => {
    expect(availableInteractionModes(noLayers2D)).toEqual(["NAVIGATE", "ANNOTATE"]);
    expect(availableInteractionModes(noLayers3D)).toEqual(["NAVIGATE", "ANNOTATE"]);
  });

  it("agrees with the single-mode predicate", () => {
    expect(isInteractionModeAvailable("PROBE", noLayers2D)).toBe(false);
    expect(isInteractionModeAvailable("ANNOTATE", noLayers2D)).toBe(true);
    expect(isInteractionModeAvailable("NAVIGATE", noLayers2D)).toBe(true);
  });
});

describe("availableAnnotateTools", () => {
  it("leads with Select in 2D and offers all seven", () => {
    const tools = availableAnnotateTools(ctx2D);
    expect(tools[0]).toBe("SELECT");
    expect(tools).toHaveLength(7);
  });

  it("hides Select in 3D but keeps every shape", () => {
    const tools = availableAnnotateTools(ctx3D);
    expect(tools).not.toContain("SELECT");
    expect(tools).toEqual([
      "RECTANGLE",
      "ELLIPSIS",
      "POINT",
      "LINE",
      "POLYGON",
      "PATH",
    ]);
  });

  it("agrees with the single-tool predicate", () => {
    expect(isAnnotateToolAvailable("SELECT", ctx3D)).toBe(false);
    expect(isAnnotateToolAvailable("SELECT", ctx2D)).toBe(true);
    expect(isAnnotateToolAvailable("POLYGON", ctx3D)).toBe(true);
  });
});

describe("coerceModeState", () => {
  // The guard identity-compares to decide whether to write to the store. If
  // this ever returned fresh values, it would loop.
  it("returns the same values when nothing needs to change", () => {
    const requested = { interactionMode: "PROBE" as const, activeTool: "SELECT" as const };
    const next = coerceModeState(requested, ctx2D);
    expect(next.interactionMode).toBe(requested.interactionMode);
    expect(next.activeTool).toBe(requested.activeTool);
  });

  it("falls back to NAVIGATE when PROBE has nothing to probe", () => {
    const next = coerceModeState(
      { interactionMode: "PROBE", activeTool: "RECTANGLE" },
      noLayers2D,
    );
    expect(next.interactionMode).toBe("NAVIGATE");
    expect(next.activeTool).toBe("RECTANGLE");
  });

  it("keeps ANNOTATE but swaps the marquee for a shape when moving to 3D", () => {
    const next = coerceModeState(
      { interactionMode: "ANNOTATE", activeTool: "SELECT" },
      ctx3D,
    );
    expect(next.interactionMode).toBe("ANNOTATE");
    expect(next.activeTool).toBe("RECTANGLE");
  });

  // Coercing the tool even outside ANNOTATE is what stops the user landing on
  // a dead tool when they switch back into it later.
  it("coerces a dead tool even while another mode is active", () => {
    const next = coerceModeState(
      { interactionMode: "NAVIGATE", activeTool: "SELECT" },
      ctx3D,
    );
    expect(next.activeTool).toBe("RECTANGLE");
  });

  it("leaves a null tool null", () => {
    expect(coerceModeState({ interactionMode: "NAVIGATE", activeTool: null }, ctx2D).activeTool)
      .toBeNull();
    expect(coerceModeState({ interactionMode: "NAVIGATE", activeTool: null }, ctx3D).activeTool)
      .toBeNull();
  });

  it("is idempotent for every context", () => {
    const requested = { interactionMode: "PROBE" as const, activeTool: "SELECT" as const };
    for (const ctx of [ctx2D, ctx3D, noLayers2D, noLayers3D]) {
      const once = coerceModeState(requested, ctx);
      expect(coerceModeState(once, ctx)).toEqual(once);
    }
  });
});
