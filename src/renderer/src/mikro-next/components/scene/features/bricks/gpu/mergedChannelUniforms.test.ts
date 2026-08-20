// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Blending, ColorMap, ProjectionMode } from "@/mikro-next/api/graphql";
import type { LayerState } from "../../../platform/model/layerModel";
import type { ChannelRenderNode } from "../../../platform/model/renderGraph";
import { buildChannelUniformData, MAX_CHANNELS } from "./channelUniforms";
import { buildMergedChannelUniformData } from "./mergedChannelUniforms";

const channel = (over: Partial<ChannelRenderNode> = {}): ChannelRenderNode => ({
  type: "channel",
  kind: "channel",
  label: null,
  intensityAxis: "c",
  intensityIndex: 0,
  visible: true,
  transfer: {
    colormap: ColorMap.Viridis,
    color: null,
    climMin: 0,
    climMax: 255,
    gamma: 1,
    opacity: 1,
    invert: false,
  } as ChannelRenderNode["transfer"],
  ...over,
});

/** Only the fields the uniform builder reads. */
const layer = (channels: ChannelRenderNode[], over: Partial<LayerState> = {}) =>
  ({
    sources: channels,
    channels,
    phasors: [],
    blend: Blending.Additive,
    projection: ProjectionMode.Maximum,
    colormap: ColorMap.Viridis,
    color: null,
    lens: { phasor: undefined },
    ...over,
  }) as unknown as LayerState;

const projectionModeOf = () => 0;
const build = (
  members: { layerId: string; layer: LayerState; slotOffset: number }[],
) =>
  buildMergedChannelUniformData(members, 3, 0, 255, undefined, projectionModeOf);

describe("buildMergedChannelUniformData — the golden invariant", () => {
  it("reproduces buildChannelUniformData exactly for a single member", () => {
    // The regression gate for the whole merge: the merged path must be a
    // superset of the single-layer path, not a parallel reimplementation that
    // can drift. If this breaks, every layer's appearance is suspect.
    const only = layer([
      channel({ intensityIndex: 1 }),
      channel({ intensityIndex: 2, visible: false }),
    ]);
    const single = buildChannelUniformData(only, 3, 0, 255, undefined);
    const merged = build([{ layerId: "a", layer: only, slotOffset: 0 }]);

    expect(merged.numChannels).toBe(single.numChannels);
    expect(merged.channelIndex).toEqual(single.channelIndex);
    expect(merged.climMin).toEqual(single.climMin);
    expect(merged.climMax).toEqual(single.climMax);
    expect(merged.gamma).toEqual(single.gamma);
    expect(merged.opacity).toEqual(single.opacity);
    expect(merged.visible).toEqual(single.visible);
    expect(merged.invert).toEqual(single.invert);
    expect(merged.row).toEqual(single.row);
    expect(merged.cursorCount).toBe(single.cursorCount);
    expect([...(merged.sourceParams.image.data as Float32Array)]).toEqual([
      ...(single.sourceParams.image.data as Float32Array),
    ]);
    expect([...(merged.cursors.image.data as Float32Array)]).toEqual([
      ...(single.cursors.image.data as Float32Array),
    ]);
    // Same colormap atlas geometry, so `row` indexes the same texels.
    expect(merged.atlas.image.height).toBe(single.atlas.image.height);
    expect([...(merged.atlas.image.data as Uint8Array)]).toEqual([
      ...(single.atlas.image.data as Uint8Array),
    ]);
  });

  it("describes the single member as owning the whole slot range", () => {
    const only = layer([channel(), channel()]);
    const merged = build([{ layerId: "a", layer: only, slotOffset: 0 }]);
    expect(merged.members).toEqual([
      {
        layerId: "a",
        slotFirst: 0,
        slotCount: 2,
        blendMode: 0,
        projectionMode: 0,
        hasPhasorSources: false,
      },
    ]);
  });
});

describe("buildMergedChannelUniformData — phasor specialization input", () => {
  const phasorSource = () =>
    ({
      type: "phasor",
      kind: "phasor",
      label: null,
      visible: true,
      harmonic: 1,
      transfer: {
        colormap: ColorMap.Viridis,
        mode: "phase",
        cursors: [],
        intensity: {
          colormap: ColorMap.Viridis,
          color: null,
          climMin: 0,
          climMax: 255,
          gamma: 1,
          opacity: 1,
          invert: false,
        },
      },
    }) as unknown as ChannelRenderNode;

  it("flags only the members whose used slots hold phasor sources", () => {
    const merged = build([
      { layerId: "plain", layer: layer([channel()]), slotOffset: 0 },
      {
        layerId: "flim",
        layer: layer([channel(), phasorSource()]),
        slotOffset: 1,
      },
    ]);
    expect(merged.members.map((m) => m.hasPhasorSources)).toEqual([false, true]);
  });

  it("a phasor source truncated away by the slot budget does not flag its member", () => {
    const fifteen = Array.from({ length: 15 }, (_, i) => ({
      layerId: `c${i}`,
      layer: layer([channel({ intensityIndex: i })]),
      slotOffset: i,
    }));
    // 15 slots used; this member's channel takes the 16th and its phasor
    // overflows MAX_CHANNELS — the compiled shader will never sample it.
    const merged = build([
      ...fifteen,
      {
        layerId: "overflow",
        layer: layer([channel(), phasorSource()]),
        slotOffset: 15,
      },
    ]);
    const overflow = merged.members.find((m) => m.layerId === "overflow");
    expect(overflow?.slotCount).toBe(1);
    expect(overflow?.hasPhasorSources).toBe(false);
  });
});

describe("buildMergedChannelUniformData — concatenation", () => {
  const four = () =>
    ["139", "140", "141", "142"].map((layerId, i) => ({
      layerId,
      layer: layer([channel({ intensityIndex: i })]),
      slotOffset: i,
    }));

  it("gives each member a contiguous, non-overlapping slot range", () => {
    const merged = build(four());
    expect(merged.numChannels).toBe(4);
    expect(merged.members.map((m) => [m.slotFirst, m.slotCount])).toEqual([
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ]);
  });

  it("keeps each member's own channel index at its merged slot", () => {
    const merged = build(four());
    expect(merged.channelIndex.slice(0, 4)).toEqual([0, 1, 2, 3]);
  });

  it("indexes colormap rows against the MERGED atlas height", () => {
    const merged = build(four());
    expect(merged.atlas.image.height).toBe(4);
    for (let i = 0; i < 4; i++) {
      expect(merged.row[i]).toBeCloseTo((i + 0.5) / 4, 10);
    }
  });

  it("carries each member's own blend mode rather than collapsing them", () => {
    const merged = build([
      { layerId: "a", layer: layer([channel()]), slotOffset: 0 },
      {
        layerId: "b",
        layer: layer([channel()], { blend: Blending.Multiplicative }),
        slotOffset: 1,
      },
    ]);
    expect(merged.members.map((m) => m.blendMode)).toEqual([0, 1]);
  });

  it("carries per-member projection modes", () => {
    const merged = buildMergedChannelUniformData(
      [
        { layerId: "a", layer: layer([channel()]), slotOffset: 0 },
        { layerId: "b", layer: layer([channel()]), slotOffset: 1 },
      ],
      3,
      0,
      255,
      undefined,
      (l) => (l === undefined ? 0 : 7),
    );
    expect(merged.members.map((m) => m.projectionMode)).toEqual([7, 7]);
  });
});

describe("buildMergedChannelUniformData — overflow", () => {
  it("truncates past the slot budget rather than corrupting neighbours", () => {
    const big = layer(Array.from({ length: 12 }, () => channel()));
    const merged = build([
      { layerId: "a", layer: big, slotOffset: 0 },
      { layerId: "b", layer: big, slotOffset: 12 },
    ]);
    expect(merged.numChannels).toBe(MAX_CHANNELS);
    expect(merged.members[0]).toMatchObject({ slotFirst: 0, slotCount: 12 });
    // The second member gets what is left, not a wrap-around.
    expect(merged.members[1]).toMatchObject({ slotFirst: 12, slotCount: 4 });
  });

  it("gives a fully-truncated member zero slots rather than a negative count", () => {
    const big = layer(Array.from({ length: MAX_CHANNELS }, () => channel()));
    const merged = build([
      { layerId: "a", layer: big, slotOffset: 0 },
      { layerId: "b", layer: layer([channel()]), slotOffset: MAX_CHANNELS },
    ]);
    expect(merged.members[1]).toMatchObject({ slotCount: 0 });
    expect(merged.numChannels).toBe(MAX_CHANNELS);
  });
});
