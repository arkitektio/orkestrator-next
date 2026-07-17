import * as THREE from "three";

/**
 * Value semantics shared by the brick pyramid's shader and its CPU mirror.
 *
 * The traversal itself lives in the TSL port (`layers/bricks/brickNodeMaterials.ts`),
 * which compiles to WGSL; what stays here is the small set of constants and
 * encodings the CPU side must reproduce exactly to stay in lockstep with what
 * the GPU renders.
 */

export const MAX_BRICK_LEVELS = 10;

/** 8-bit encoding of a uniform brick's raw value for EMPTY page entries. */
export function encodeEmptyValue(
  value: number,
  dataRange: { minValue: number; maxValue: number },
): number {
  const range = dataRange.maxValue - dataRange.minValue;
  if (range <= 0) return 0;
  return Math.round(THREE.MathUtils.clamp((value - dataRange.minValue) / range, 0, 1) * 255);
}

/**
 * CPU mirror of the shader's EMPTY-brick decode (`sampleBrickEx`:
 * `uEmptyDecodeMin + entry.r/255 * uEmptyDecodeRange`). An EMPTY brick's value
 * survives only as an 8-bit page-table byte, so the value the GPU renders is the
 * `encode`→`decode` round-trip of the raw value — NOT the raw value itself. The
 * CPU raymarch (`marchResidentBricks`) must apply the same round-trip to stay in
 * lockstep with the rendered image. Note this is inherently lossy for wide dtype
 * ranges (~257 raw units per code over uint16's [0,65535]); see P11.
 */
export function decodeEmptyValue(
  encoded: number,
  dataRange: { minValue: number; maxValue: number },
): number {
  const range = dataRange.maxValue - dataRange.minValue;
  return dataRange.minValue + (encoded / 255) * range;
}
