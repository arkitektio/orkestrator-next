import { hasPhasorSlabs, type LayerLevelGeometry } from "./levelGeometry";

/**
 * Atlas storage format for a layer's dtype — pure planning knowledge, shared
 * by pool viability math (core) and the GPU atlas itself (render). Lives in
 * core so planning never imports GPU code.
 */

export type AtlasKind = "r8" | "r16f" | "r32f";

/** R16F atlases store `raw / R16F_DATA_SCALE`; the shader multiplies back
 * through `uAtlasScale` (= this), exactly like the R8 path's 255. */
export const R16F_DATA_SCALE = 65535;

/**
 * R16F atlases for unsigned-16-bit INTENSITY data (roadmap R3): stored as
 * `raw / 65535` half floats with `dataScale = 65535`, halving those pools'
 * atlas bytes (and doubling their slot budgets). See halfFloat.ts for the
 * precision analysis. A module flag rather than a localStorage read at every
 * call site: `atlasKindForGeometry` runs inside the PURE planner
 * (nodePlanning), which must not touch browser globals — the render side
 * initializes the flag once from `orkestrator.r16Atlas` (default ON).
 */
let r16AtlasesEnabled = true;
try {
  r16AtlasesEnabled = window.localStorage.getItem("orkestrator.r16Atlas") !== "off";
} catch {
  /* no storage (worker/tests): default applies */
}

export const isR16AtlasesEnabled = (): boolean => r16AtlasesEnabled;
export const setR16AtlasesEnabled = (enabled: boolean): void => {
  r16AtlasesEnabled = enabled;
  try {
    window.localStorage.setItem("orkestrator.r16Atlas", enabled ? "on" : "off");
  } catch {
    /* session keeps its current state */
  }
};

/**
 * This MUST mirror the codec worker's DEFAULT-fidelity promotion
 * (`lib/zarr/runner/codec-worker.ts` `promoteChunkForTexture`): only
 * **unsigned 8-bit** stays a `Uint8Array` and uses an `R8` atlas; **every
 * other dtype is promoted to `Float32Array`** and uses `R32F` — except
 * unsigned 16-bit with `allowHalf`, which the REPACK re-encodes to half
 * floats for an `R16F` atlas (the promoted float32 chunks are unchanged; the
 * conversion happens brick-side, so the worker lockstep is preserved). In
 * particular `int8`/`int16`/`uint32` all stay float32 — an earlier
 * `dtype.includes("8")` test wrongly routed `int8` (a signed,
 * possibly-negative Float32Array) into a Uint8 R8 atlas, wrapping/
 * truncating its values; signed 16-bit similarly cannot ride the
 * multiply-only `uAtlasScale` rescale and stays R32F.
 *
 * The scene never sets `textureFidelity`, so 'default' promotion is assumed.
 * If a caller ever requests 'low'/'high' fidelity (per-chunk-normalized
 * uint8/uint16), this decision would no longer match the worker's
 * `promotedType` and normalization would break — keep the two in lockstep.
 */
export const atlasKindForDtype = (dtype: string, allowHalf = false): AtlasKind => {
  const d = dtype.toLowerCase();
  // Canonical "uint8" contains no "u1"; numpy-style unsigned 8-bit is "|u1".
  const isUnsigned8 = d === "uint8" || d === "uint8clamped" || d.includes("u1");
  if (isUnsigned8) return "r8";
  const isUnsigned16 = d === "uint16" || d.includes("u2");
  if (isUnsigned16 && allowHalf) return "r16f";
  return "r32f";
};

/**
 * Atlas kind for a whole layer geometry: a phasor layer's slabs are derived
 * (g, s ∈ [-1, 1] and a mean photon count), so its atlas is float regardless
 * of the source dtype; a layer with EXACT-value semantics (label ids —
 * `geometry.exactValues`) never uses R16F, whose 11-bit significand would
 * corrupt ids above 2048; everything else keys off the base level's dtype
 * with R16F allowed for unsigned 16-bit intensities.
 *
 * This is the SINGLE source of truth for slot sizing — the planner's byte
 * accounting (`planLayerNodes`) and the pool's atlas allocation
 * (`ensurePool`) must both use it. When they disagreed (planner sized a
 * uint8 phasor layer at 1 B/voxel, pool allocated r32f), the plan requested
 * ~4× the slots that existed — guaranteed acquire failures at full
 * refinement.
 */
export const atlasKindForGeometry = (geometry: LayerLevelGeometry): AtlasKind => {
  if (hasPhasorSlabs(geometry)) return "r32f";
  return atlasKindForDtype(
    geometry.levels[0].dtype,
    isR16AtlasesEnabled() && !geometry.exactValues,
  );
};

/** Bytes per stored voxel for an atlas kind. */
export const atlasBytesPerVoxel = (kind: AtlasKind): number =>
  kind === "r8" ? 1 : kind === "r16f" ? 2 : 4;
