import { srgbToOklch } from "@/lib/color/oklch";
import type { BrandTarget } from "@/providers/settings/brandTheme";
import { HUE_NOISE_FLOOR, MAX_BRAND_CHROMA } from "./brandTarget";

/**
 * The MAJORITY hue of a rendered frame, from a small RGBA pixel sample.
 *
 * This is deliberately not `brandTargetFromColors`' vector mean: a scene that
 * renders a red channel next to a cyan one should tint the app toward whichever
 * DOMINATES the pixels on screen, not toward the grey their mean cancels to.
 * So pixels vote into a coarse hue histogram and only the winning band (plus
 * its two neighbours, so a hue sitting on a bin edge doesn't split its vote)
 * decides the target.
 *
 * Votes are weighted by `chroma × alpha`:
 *   - alpha, because the scene canvas is transparent where nothing rendered —
 *     the background div showing through must not vote at all;
 *   - chroma, because a dim/grey pixel has no meaningful hue to vote for. A
 *     mostly-black volume render with a few vivid voxels correctly tints
 *     toward the voxels.
 *
 * Bins are in OKLCH hue — the same angle space the brand theme is
 * parameterised in — so "majority" here lands directly on `--brand-hue`.
 *
 * Return contract mirrors `brandTargetFromColors`: null means "nothing
 * rendered, nothing to derive a theme from" (blank canvas); an achromatic
 * frame is NOT nothing — it is a grey theme (`hue: null`, low chroma).
 */

/** 15° bins: coarse on purpose. Accuracy is not the point — stability is, and
 * wide bins keep the winner from flickering between neighbouring hues as the
 * camera moves. */
const BIN_COUNT = 24;

/** Below this alpha (out of 255) a pixel is background showing through the
 * transparent canvas, not scene content. */
const ALPHA_FLOOR = 8;

/** If fewer than this fraction of sampled pixels carry any content, the frame
 * is effectively blank (first frame, mid-load) — report "nothing" rather than
 * a theme derived from a handful of stray pixels. */
const MIN_COVERAGE = 0.02;

const TO_RADIANS = Math.PI / 180;

/**
 * Compute the majority-hue brand target of an RGBA8 pixel buffer
 * (`ImageData.data` layout, un-premultiplied).
 *
 * Cost is one `srgbToOklch` per covered pixel — for the 32×32 samples the
 * canvas probe feeds this, well under a millisecond.
 */
export const majorityHueFromPixels = (
  rgba: Uint8ClampedArray,
): BrandTarget | null => {
  const weight = new Float64Array(BIN_COUNT);
  const sumA = new Float64Array(BIN_COUNT);
  const sumB = new Float64Array(BIN_COUNT);
  const alphaWeight = new Float64Array(BIN_COUNT);

  const pixelCount = rgba.length >>> 2;
  let covered = 0;
  let coveredAlpha = 0;
  let chromaSum = 0;

  for (let i = 0; i < rgba.length; i += 4) {
    const a8 = rgba[i + 3];
    if (a8 < ALPHA_FLOOR) continue;
    const alpha = a8 / 255;
    covered += 1;
    coveredAlpha += alpha;

    const { c, h } = srgbToOklch(rgba[i], rgba[i + 1], rgba[i + 2]);
    chromaSum += c * alpha;
    // Achromatic pixels count toward coverage (a grey render is a grey theme)
    // but have no hue to vote for.
    if (c < HUE_NOISE_FLOOR) continue;

    const w = c * alpha;
    const bin = Math.min(BIN_COUNT - 1, (h / 360) * BIN_COUNT) | 0;
    const radians = h * TO_RADIANS;
    weight[bin] += w;
    sumA[bin] += w * Math.cos(radians);
    sumB[bin] += w * Math.sin(radians);
    alphaWeight[bin] += alpha;
  }

  if (covered < pixelCount * MIN_COVERAGE) return null;

  let best = 0;
  for (let bin = 1; bin < BIN_COUNT; bin += 1) {
    if (weight[bin] > weight[best]) best = bin;
  }

  if (weight[best] === 0) {
    // Content, but no hue anywhere: desaturate rather than abstain.
    return {
      hue: null,
      chroma: Math.min(chromaSum / coveredAlpha, MAX_BRAND_CHROMA),
    };
  }

  const prev = (best + BIN_COUNT - 1) % BIN_COUNT;
  const next = (best + 1) % BIN_COUNT;
  const a = sumA[prev] + sumA[best] + sumA[next];
  const b = sumB[prev] + sumB[best] + sumB[next];
  // Alpha-weighted mean chroma vector of the winning band: within a 45° span
  // cancellation is negligible, so this is the band's honest saturation.
  const bandAlpha = alphaWeight[prev] + alphaWeight[best] + alphaWeight[next];
  const chroma = Math.min(Math.hypot(a, b) / bandAlpha, MAX_BRAND_CHROMA);

  if (chroma < HUE_NOISE_FLOOR) return { hue: null, chroma };

  const hue = (Math.atan2(b, a) / TO_RADIANS + 360) % 360;
  return { hue, chroma };
};

/** ~Half a histogram-bin of hue and an invisible sliver of chroma: below this
 * a re-publish would re-tint the app to an indistinguishable color. */
export const sameBrandTarget = (
  a: BrandTarget | null,
  b: BrandTarget | null,
): boolean => {
  if (a === null || b === null) return a === b;
  if (Math.abs(a.chroma - b.chroma) > 0.005) return false;
  if (a.hue === null || b.hue === null) return a.hue === b.hue;
  const delta = Math.abs(a.hue - b.hue) % 360;
  return Math.min(delta, 360 - delta) <= 2;
};
