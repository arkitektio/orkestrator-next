// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
  parseRenderNode,
  serializeRenderNode,
  toRgba,
  type ChannelRenderNode,
} from "./renderGraph";

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

describe("transfer stops", () => {
  const channelFragment = (stops: unknown) =>
    ({
      __typename: "ChannelSourceNode",
      kind: "channel",
      label: null,
      intensityAxis: "c",
      intensityIndex: 0,
      visible: true,
      transfer: { colormap: null, stops },
    }) as unknown as Parameters<typeof parseRenderNode>[0];

  it("parses stops sorted, RGBA-normalized and position-clamped", () => {
    const node = parseRenderNode(
      channelFragment([
        { position: 0.9, color: [0, 0, 255] }, // RGB → RGBA
        { position: -0.5, color: [255, 0, 0, 255] }, // clamped to 0
      ]),
    ) as ChannelRenderNode;
    expect(node.transfer.stops).toEqual([
      { position: 0, color: [255, 0, 0, 255] },
      { position: 0.9, color: [0, 0, 255, 255] },
    ]);
  });

  it("treats fewer than two stops — or garbage — as no custom gradient", () => {
    for (const raw of [null, undefined, [], [{ position: 0.5, color: [1, 2, 3] }], "nope", [{}]]) {
      const node = parseRenderNode(channelFragment(raw)) as ChannelRenderNode;
      expect(node.transfer.stops).toBeNull();
    }
  });

  it("NEVER serializes the color gradient into the server's `stops` field", () => {
    // The server's `stops` is a LookupStop intensity CURVE ({position, value}),
    // not color stops — writing the gradient there would corrupt the curve.
    const node = parseRenderNode(
      channelFragment([
        { position: 0, color: [10, 20, 30] },
        { position: 1, color: [200, 210, 220, 128] },
      ]),
    ) as ChannelRenderNode;
    expect(node.transfer.stops).toHaveLength(2); // parsed for local rendering…
    const input = serializeRenderNode(node) as { transfer?: Record<string, unknown> };
    expect(input.transfer && "stops" in input.transfer).toBe(false); // …never saved
  });

  it("ignores server LookupStop curve entries (no color array = not a gradient)", () => {
    const node = parseRenderNode(
      channelFragment([
        { position: 0, value: 0 },
        { position: 4000, value: 1 },
      ]),
    ) as ChannelRenderNode;
    expect(node.transfer.stops).toBeNull();
  });
});
