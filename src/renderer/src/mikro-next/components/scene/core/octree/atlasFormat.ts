/**
 * Atlas storage format for a layer's dtype — pure planning knowledge, shared
 * by pool viability math (core) and the GPU atlas itself (render). Lives in
 * core so planning never imports GPU code.
 */

export type AtlasKind = "r8" | "r32f";

/**
 * This MUST mirror the codec worker's DEFAULT-fidelity promotion
 * (`lib/zarr/runner/codec-worker.ts` `promoteChunkForTexture`): only
 * **unsigned 8-bit** stays a `Uint8Array` and uses an `R8` atlas; **every
 * other dtype is promoted to `Float32Array`** and uses `R32F`. In particular
 * `int8`/`int16`/`uint16`/`uint32` all promote to float32 — an earlier
 * `dtype.includes("8")` test wrongly routed `int8` (a signed,
 * possibly-negative Float32Array) into a Uint8 R8 atlas, wrapping/
 * truncating its values.
 *
 * The scene never sets `textureFidelity`, so 'default' promotion is assumed.
 * If a caller ever requests 'low'/'high' fidelity (per-chunk-normalized
 * uint8/uint16), this decision would no longer match the worker's
 * `promotedType` and normalization would break — keep the two in lockstep.
 */
export const atlasKindForDtype = (dtype: string): AtlasKind => {
  const d = dtype.toLowerCase();
  // Canonical "uint8" contains no "u1"; numpy-style unsigned 8-bit is "|u1".
  const isUnsigned8 = d === "uint8" || d === "uint8clamped" || d.includes("u1");
  return isUnsigned8 ? "r8" : "r32f";
};
