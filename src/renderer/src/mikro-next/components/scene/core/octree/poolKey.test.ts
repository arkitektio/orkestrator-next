import { describe, expect, it } from "vitest";
import { buildPoolKey, buildStructureSignature, type PoolKeyInput } from "./poolKey";
import type { BrickSpec } from "./brickSpec";
import type { LayerLevelGeometry, LevelSource, SlabDesc } from "./levelGeometry";

/**
 * The shape reported by the four-layers-over-one-image case that motivated
 * content-keyed pools: a 1024×1024×36 uint8 pyramid with 4 channels, rendered
 * as one layer per channel.
 */
const SPEC: BrickSpec = {
  payload: [64, 64, 36],
  border: 1,
  stored: [66, 66, 38],
  channelCount: 4,
};

const LEVELS: LevelSource[] = [
  { shape: [4, 36, 1024, 1024], chunks: [1, 19, 1024, 1024], dtype: "uint8", storeId: "342" },
  { shape: [4, 18, 512, 512], chunks: [1, 18, 512, 512], dtype: "uint8", storeId: "343" },
];

const CHANNEL_SLABS: SlabDesc[] = [
  { kind: "channel", channel: 0 },
  { kind: "channel", channel: 1 },
  { kind: "channel", channel: 2 },
  { kind: "channel", channel: 3 },
];

const geometry = (slabs: readonly SlabDesc[] = CHANNEL_SLABS) =>
  ({ slabs, channelCount: slabs.length }) as unknown as LayerLevelGeometry;

const base = (): PoolKeyInput => ({
  mode: "3D",
  spec: SPEC,
  geometry: geometry(),
  levels: LEVELS,
  sliceSignature: '{"xAxis":"x","yAxis":"y","zAxis":"z","selections":{},"slices":[]}',
  dataRange: [0, 255],
});

describe("buildPoolKey — layers that must SHARE a pool", () => {
  it("collides for layers differing only in how they are drawn", () => {
    // One layer per channel: identical data, identical slicing, identical value
    // range. Colormap/clim/gamma never reach this function — they are shader
    // uniforms applied against the shared atlas.
    expect(buildPoolKey(base())).toBe(buildPoolKey(base()));
  });

  it("is stable across separately-constructed but equal inputs", () => {
    const a = buildPoolKey({ ...base(), levels: LEVELS.map((l) => ({ ...l })) });
    expect(a).toBe(buildPoolKey(base()));
  });
});

describe("buildPoolKey — differences that must SPLIT a pool", () => {
  const splits: [string, Partial<PoolKeyInput>][] = [
    ["mode", { mode: "2D" }],
    [
      "storeId (a different image entirely)",
      { levels: [{ ...LEVELS[0], storeId: "999" }, LEVELS[1]] },
    ],
    ["dtype", { levels: [{ ...LEVELS[0], dtype: "uint16" }, LEVELS[1]] }],
    ["level chunking", { levels: [{ ...LEVELS[0], chunks: [1, 1, 512, 512] }, LEVELS[1]] }],
    ["level shape", { levels: [{ ...LEVELS[0], shape: [4, 36, 2048, 2048] }, LEVELS[1]] }],
    ["pyramid depth", { levels: [LEVELS[0]] }],
    ["brick payload", { spec: { ...SPEC, payload: [32, 32, 36] } }],
    ["border", { spec: { ...SPEC, border: 0 } }],
    ["channel count", { spec: { ...SPEC, channelCount: 2 } }],
    ["slice signature (dim slider moved)", { sliceSignature: '{"selections":{"t":3}}' }],
  ];

  for (const [what, patch] of splits) {
    it(`splits on ${what}`, () => {
      expect(buildPoolKey({ ...base(), ...patch })).not.toBe(buildPoolKey(base()));
    });
  }

  it("splits on data range — EMPTY page entries are quantized against it", () => {
    // Two layers sharing a page table but disagreeing on [min,max] would decode
    // each other's uniform bricks at the wrong intensity (see encodeEmptyValue).
    expect(buildPoolKey({ ...base(), dataRange: [0, 65535] })).not.toBe(
      buildPoolKey(base()),
    );
  });

  it("splits on phasor harmonic even when the slab COUNT matches", () => {
    // The guard the slab list exists for: equal channelCount, different bricks.
    const withHarmonic = (harmonic: number): SlabDesc[] => [
      { kind: "channel", channel: 0 },
      { kind: "phasor", component: "g", node: 0, channel: 0, harmonic },
      { kind: "phasor", component: "s", node: 0, channel: 0, harmonic },
      { kind: "phasor", component: "i", node: 0, channel: 0, harmonic },
    ];
    const first = buildPoolKey({ ...base(), geometry: geometry(withHarmonic(1)) });
    const second = buildPoolKey({ ...base(), geometry: geometry(withHarmonic(2)) });
    expect(first).not.toBe(second);
    // ...and both differ from the plain 4-channel layout of the same width.
    expect(first).not.toBe(buildPoolKey(base()));
  });
});

describe("buildPoolKey — autoRange is deliberately absent", () => {
  it("is implied by dtype + dataRange, so members always agree", () => {
    // autoRange === (dtype is float) && (no server histogram). "No server
    // histogram" is exactly what makes the range fall back to the dtype's, and
    // both dtype and the resulting range are keyed — so two inputs that collide
    // here cannot disagree on autoRange, and keying it would be dead weight.
    const floatNoHistogram = {
      ...base(),
      levels: LEVELS.map((l) => ({ ...l, dtype: "float32" })),
      dataRange: [0, 1] as const, // the dtype fallback → autoRange true
    };
    const floatWithHistogram = {
      ...floatNoHistogram,
      dataRange: [12, 4096] as const, // a real histogram → autoRange false
    };
    expect(buildPoolKey(floatNoHistogram)).not.toBe(buildPoolKey(floatWithHistogram));
    // Integer layers never auto-range; their dtype range is keyed as-is.
    expect(buildPoolKey(base())).not.toBe(buildPoolKey(floatNoHistogram));
  });
});

describe("buildStructureSignature", () => {
  it("ignores the slice and the value range, so a pool can be flushed in place", () => {
    // Same structure + different slice ⇒ different pool KEY but equal STRUCTURE,
    // which is what lets ensurePool reuse the atlas instead of reallocating it.
    const moved = { ...base(), sliceSignature: '{"selections":{"t":7}}', dataRange: [0, 1] as const };
    expect(buildPoolKey(moved)).not.toBe(buildPoolKey(base()));
    expect(buildStructureSignature(moved)).toBe(buildStructureSignature(base()));
  });

  it("still splits on anything that changes what a brick holds", () => {
    expect(
      buildStructureSignature({ ...base(), spec: { ...SPEC, channelCount: 2 } }),
    ).not.toBe(buildStructureSignature(base()));
    expect(
      buildStructureSignature({
        ...base(),
        levels: [{ ...LEVELS[0], storeId: "999" }, LEVELS[1]],
      }),
    ).not.toBe(buildStructureSignature(base()));
  });
});
