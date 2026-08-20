// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { LAYER_RENDERERS } from "../../../shell/layerRegistry";

/**
 * The label render path's SHAPE, asserted where a unit test can reach it.
 *
 * The materials themselves are TSL node graphs that need a GPU adapter to build,
 * so nothing here compiles a shader. What it does pin is the wiring that has
 * silently regressed before in this codebase: which component the registry hands
 * each display mode, and that a mask never falls back to a stub or to the image
 * renderers (whose `channelNormalize` is exactly what would paint the whole mask
 * one flat colour — the reason label was stubbed for so long).
 */

describe("label layer registry wiring", () => {
  it("draws a mask in BOTH display modes", () => {
    const entry = LAYER_RENDERERS.LabelLayer;
    expect(entry.Layer2D).toBeTruthy();
    expect(entry.Layer3D).toBeTruthy();
  });

  it("uses its OWN components, never the image ones", () => {
    // Pointing a mask at the image renderers would normalize an int32 id against
    // the dtype range and land every id within ~2e-5 of 0.5.
    const label = LAYER_RENDERERS.LabelLayer;
    const image = LAYER_RENDERERS.ImageLayer;
    expect(label.Layer2D).not.toBe(image.Layer2D);
    expect(label.Layer3D).not.toBe(image.Layer3D);
  });

  it("gives 2D and 3D DIFFERENT components", () => {
    // They are genuinely different renderings — a filled/outlined plane versus a
    // first-hit surface — not one component branching internally.
    const label = LAYER_RENDERERS.LabelLayer;
    expect(label.Layer2D).not.toBe(label.Layer3D);
  });

  it("still stubs the types that really are unimplemented", () => {
    // Point/Track are the remaining stubs; label graduated out of that file, and
    // this is what catches it being quietly put back.
    expect(LAYER_RENDERERS.PointLayer.Layer2D).toBe(LAYER_RENDERERS.PointLayer.Layer3D);
    expect(LAYER_RENDERERS.TrackLayer.Layer2D).toBe(LAYER_RENDERERS.TrackLayer.Layer3D);
    expect(LAYER_RENDERERS.LabelLayer.Layer2D).not.toBe(LAYER_RENDERERS.PointLayer.Layer2D);
    expect(LAYER_RENDERERS.LabelLayer.Layer3D).not.toBe(LAYER_RENDERERS.PointLayer.Layer3D);
  });
});
