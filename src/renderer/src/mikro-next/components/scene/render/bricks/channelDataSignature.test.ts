import { describe, expect, it } from "vitest";
import type { LayerState } from "../../core/layerModel";
import { buildChannelDataSignature } from "./channelDataSignature";

const layer = (over: Record<string, unknown> = {}): LayerState =>
  ({
    id: "a",
    blend: "ADDITIVE",
    colormap: "VIRIDIS",
    color: null,
    projection: "MAXIMUM",
    lens: { phasor: undefined },
    sources: [
      {
        type: "channel",
        visible: true,
        intensityIndex: 0,
        transfer: { colormap: "VIRIDIS", climMin: 0, climMax: 255, gamma: 1 },
      },
    ],
    // Fields the uniform builders never read — edits here must NOT invalidate.
    name: "layer a",
    opacity3D: 1,
    ...over,
  }) as unknown as LayerState;

describe("buildChannelDataSignature", () => {
  it("is stable across object identity for equal values", () => {
    expect(buildChannelDataSignature(layer())).toBe(buildChannelDataSignature(layer()));
  });

  it("changes when a transfer field changes (clim drag reaches the GPU)", () => {
    const a = buildChannelDataSignature(layer());
    const b = buildChannelDataSignature(
      layer({
        sources: [
          {
            type: "channel",
            visible: true,
            intensityIndex: 0,
            transfer: { colormap: "VIRIDIS", climMin: 10, climMax: 255, gamma: 1 },
          },
        ],
      }),
    );
    expect(a).not.toBe(b);
  });

  it("changes on blend / projection / colormap / phasor-lens edits", () => {
    const base = buildChannelDataSignature(layer());
    expect(buildChannelDataSignature(layer({ blend: "MULTIPLICATIVE" }))).not.toBe(base);
    expect(buildChannelDataSignature(layer({ projection: "VOLUME" }))).not.toBe(base);
    expect(buildChannelDataSignature(layer({ colormap: "MAGMA" }))).not.toBe(base);
    expect(
      buildChannelDataSignature(layer({ lens: { phasor: { axisType: "lifetime" } } })),
    ).not.toBe(base);
  });

  it("ignores fields the uniform builders never read", () => {
    expect(buildChannelDataSignature(layer({ name: "renamed" }))).toBe(
      buildChannelDataSignature(layer()),
    );
  });

  it("a missing layer has a distinct stable signature", () => {
    expect(buildChannelDataSignature(undefined)).toBe(buildChannelDataSignature(undefined));
    expect(buildChannelDataSignature(undefined)).not.toBe(buildChannelDataSignature(layer()));
  });
});
