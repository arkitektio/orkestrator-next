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

/**
 * How many bits of a page-table entry an EMPTY (uniform) brick's value gets.
 *
 * An EMPTY brick costs no atlas slot: its single value rides in the page-table
 * entry itself, which is RGBA8. The width is a per-POOL property, not a global
 * constant, because the two kinds of pool need different things from it:
 *
 *  - `8` — INTENSITY. One byte in `r`, which is inherently lossy for wide dtype
 *    ranges (~257 raw units per code over uint16's `[0,65535]`; see P11) and has
 *    always been, because an intensity is about to be normalized through a
 *    transfer function anyway.
 *  - `24` — LABEL IDS, spread across `r`, `g` and `b`. An id must survive
 *    EXACTLY: a mask is mostly uniform bricks (the background between objects,
 *    the interior of any large object), so an 8-bit round-trip would not lose a
 *    little precision on a few voxels, it would paint most of the mask as the
 *    wrong object. Over `[0, 2^24-1]` the 24-bit round-trip is exact for every
 *    id a float32 atlas can hold anyway.
 *
 * 24 bits is free rather than a trade: an EMPTY entry is written as
 * `[code, 0, 0]` today, so `g` and `b` are unused — they carry slot coordinates
 * only when the flag says RESIDENT.
 */
export type EmptyValueBits = 8 | 24;

/** The largest code each width can hold. */
const codeCeiling = (bits: EmptyValueBits): number => (bits === 24 ? 0xffffff : 0xff);

/**
 * Quantize a uniform brick's raw value to an integer code of `bits` width.
 *
 * Returns the CODE, not the texel — `encodeEmptyTexel` splits it into the bytes
 * a page entry carries. The two are separate because the CPU mirror
 * (`decodeEmptyValue`) round-trips the code, and only the write path cares how
 * the code is laid out across channels.
 */
export function encodeEmptyValue(
  value: number,
  dataRange: { minValue: number; maxValue: number },
  bits: EmptyValueBits = 8,
): number {
  const range = dataRange.maxValue - dataRange.minValue;
  if (range <= 0) return 0;
  const ceiling = codeCeiling(bits);
  return Math.round(
    THREE.MathUtils.clamp((value - dataRange.minValue) / range, 0, 1) * ceiling,
  );
}

/**
 * CPU mirror of the shader's EMPTY-brick decode. An EMPTY brick's value survives
 * only as the page-table code, so the value the GPU renders is the
 * `encode`→`decode` round-trip of the raw value — NOT the raw value itself. The
 * CPU raymarch (`marchResidentBricks`) and the resident probe must apply the same
 * round-trip to stay in lockstep with the rendered image.
 */
export function decodeEmptyValue(
  encoded: number,
  dataRange: { minValue: number; maxValue: number },
  bits: EmptyValueBits = 8,
): number {
  const range = dataRange.maxValue - dataRange.minValue;
  return dataRange.minValue + (encoded / codeCeiling(bits)) * range;
}

/**
 * The `[r, g, b]` bytes an EMPTY page entry carries, little-endian.
 *
 * At 8 bits this is the historical `[code, 0, 0]`. At 24 it fills all three, and
 * the shader recomposes with the same weights — keep the two in lockstep
 * (`emitResolveBrickResidency`'s EMPTY branch).
 */
export function encodeEmptyTexel(
  value: number,
  dataRange: { minValue: number; maxValue: number },
  bits: EmptyValueBits = 8,
): [number, number, number] {
  const code = encodeEmptyValue(value, dataRange, bits);
  if (bits === 8) return [code, 0, 0];
  return [code & 0xff, (code >>> 8) & 0xff, (code >>> 16) & 0xff];
}
