import { Blending } from "@/mikro-next/api/graphql";
import type { LayerState } from "../../core/layerModel";
import { buildColormapAtlas } from "../../zarr/colormaps";

/**
 * Channel-compositor uniform data shared by the 2D and 3D brick materials —
 * the render-graph flattening logic lifted from ChunkPlane (≤16 channels,
 * colormap atlas rows, per-channel clim/gamma/opacity/invert, blend mode).
 */

export const MAX_CHANNELS = 16;

export const blendModeToInt = (blend: Blending | undefined): number => {
  if (blend === Blending.Multiplicative) return 1;
  if (blend === Blending.Normal) return 2;
  return 0; // ADDITIVE
};

export type ChannelUniformData = {
  atlas: ReturnType<typeof buildColormapAtlas>;
  numChannels: number;
  blendMode: number;
  /** Integer channel-slab index per compositor slot (float-typed for GLSL). */
  channelIndex: number[];
  climMin: number[];
  climMax: number[];
  gamma: number[];
  opacity: number[];
  visible: number[];
  invert: number[];
  row: number[];
};

export function buildChannelUniformData(
  layer: LayerState | undefined,
  maxChannelIndex: number,
): ChannelUniformData {
  const channels = (layer?.channels ?? []).slice(0, MAX_CHANNELS);
  const numChannels = channels.length;

  const atlas = buildColormapAtlas(
    numChannels > 0
      ? channels.map((c) => ({ colormap: c.transfer.colormap, color: c.transfer.color }))
      : [{ colormap: layer?.colormap, color: layer?.color }],
  );

  const channelIndex = new Array<number>(MAX_CHANNELS).fill(0);
  const climMin = new Array<number>(MAX_CHANNELS).fill(0);
  const climMax = new Array<number>(MAX_CHANNELS).fill(1);
  const gamma = new Array<number>(MAX_CHANNELS).fill(1);
  const opacity = new Array<number>(MAX_CHANNELS).fill(1);
  const visible = new Array<number>(MAX_CHANNELS).fill(0);
  const invert = new Array<number>(MAX_CHANNELS).fill(0);
  const row = new Array<number>(MAX_CHANNELS).fill(0);

  const rows = Math.max(1, numChannels);
  channels.forEach((c, i) => {
    channelIndex[i] = Math.min(maxChannelIndex, Math.max(0, c.intensityIndex ?? 0));
    climMin[i] = c.transfer.climMin ?? 0;
    climMax[i] = c.transfer.climMax ?? 1;
    gamma[i] = c.transfer.gamma ?? 1;
    opacity[i] = c.transfer.opacity ?? 1;
    visible[i] = c.visible ? 1 : 0;
    invert[i] = c.transfer.invert ? 1 : 0;
    row[i] = (i + 0.5) / rows;
  });

  // `normalizeLayer` always yields ≥1 channel (default single-channel graph),
  // so an empty compositor here matches ChunkPlane rendering nothing.
  return {
    atlas,
    numChannels,
    blendMode: blendModeToInt(layer?.blend),
    channelIndex,
    climMin,
    climMax,
    gamma,
    opacity,
    visible,
    invert,
    row,
  };
}

/** GLSL uniform declarations matching `ChannelUniformData` (fragment side). */
export const CHANNEL_UNIFORMS_GLSL = /* glsl */ `
#define MAX_CHANNELS ${MAX_CHANNELS}
uniform sampler2D colormapAtlas;
uniform float minValue;
uniform float maxValue;
uniform int numChannels;
uniform int blendMode;      // 0 additive, 1 multiplicative, 2 normal
uniform float chChannel[MAX_CHANNELS];
uniform float chClimMin[MAX_CHANNELS];
uniform float chClimMax[MAX_CHANNELS];
uniform float chGamma[MAX_CHANNELS];
uniform float chOpacity[MAX_CHANNELS];
uniform float chVisible[MAX_CHANNELS];
uniform float chInvert[MAX_CHANNELS];
uniform float chRow[MAX_CHANNELS];

float channelNormalize(int i, float rawValue) {
  float baseNorm = clamp((rawValue - minValue) / max(maxValue - minValue, 0.00001), 0.0, 1.0);
  float climRange = max(chClimMax[i] - chClimMin[i], 0.00001);
  float normalized = clamp((baseNorm - chClimMin[i]) / climRange, 0.0, 0.999);
  normalized = pow(normalized, max(chGamma[i], 0.0001));
  if (chInvert[i] > 0.5) normalized = 1.0 - normalized;
  return normalized;
}
`;
