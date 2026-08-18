/**
 * CPU mirrors of the per-step decisions the raymarch fast path emits in
 * `render/bricks/brickNodeMaterials.ts` — keep the two in lockstep (same
 * pattern as `core/opacityCorrection.ts`). The shader cannot be unit-tested
 * against a GPU; these pin the semantics the TSL emission encodes.
 */

/** Residency status codes from the page-table walk (`emitResolveBrickResidency`). */
export const STATUS_UNMAPPED = 0;
export const STATUS_RESIDENT = 1;
export const STATUS_EMPTY = 2;

/**
 * The empty-space skip predicate: an unmapped chain always skips; a uniform
 * EMPTY brick skips when no visible channel would contribute. Residents are
 * NOT decided here — their skip is the occupancy predicate below
 * (`residentBrickSkippable`). `maxNorm` is the max normalized intensity across
 * every visible slot of every member at this step.
 */
export function shouldSkipStep(status: number, maxNorm: number): boolean {
  if (status < 0.5) return true;
  return status > 1.5 && maxNorm <= 0.001;
}

/** Transfer-function inputs of one compositor slot (mirrors `chParamsA/B`). */
export type SlotTransfer = {
  climMin: number;
  climMax: number;
  gamma: number;
  invert: boolean;
  visible: boolean;
};

/**
 * Mirror of the shader's `channelNormalize` (`makeChannelNormalize`): raw →
 * range norm → clim window → gamma → optional invert. Clamps to 0.999 BEFORE
 * gamma, so only invert can reach exactly 1.0 — the ATTENUATED_MIP bound below
 * relies on the result never exceeding 1.
 */
export function normalizeSlotValue(
  raw: number,
  dataMin: number,
  dataMax: number,
  slot: SlotTransfer,
): number {
  const baseNorm = clamp01((raw - dataMin) / Math.max(dataMax - dataMin, 0.00001));
  const climRange = Math.max(slot.climMax - slot.climMin, 0.00001);
  let normalized = Math.min(Math.max((baseNorm - slot.climMin) / climRange, 0), 0.999);
  normalized = Math.pow(normalized, Math.max(slot.gamma, 0.0001));
  return slot.invert ? 1 - normalized : normalized;
}

/**
 * The cheap EMPTY-step norm the fast path skips on: every slot of an EMPTY
 * brick taps the same uniform value, so the step's max norm is derivable with
 * pure ALU — no colormap sample, no phasor taps, no cursor loop. Invisible
 * slots are excluded, exactly like the full sampling loop's visibility guard.
 */
export function emptyStepMaxNorm(
  emptyValue: number,
  dataMin: number,
  dataMax: number,
  slots: readonly SlotTransfer[],
): number {
  let maxNorm = 0;
  for (const slot of slots) {
    if (!slot.visible) continue;
    maxNorm = Math.max(maxNorm, normalizeSlotValue(emptyValue, dataMin, dataMax, slot));
  }
  return maxNorm;
}

/**
 * Upper bound of the windowed norm any voxel of a brick can reach, from the
 * occupancy sidecar's conservative raw bracket `[brickMin, brickMax]`
 * (`decodeOccupancyBounds`). `normalizeSlotValue` is monotone in the raw value
 * up to its final invert, so over the whole bracket the norm is bounded by the
 * larger endpoint image — valid for inverted channels too (there the min
 * endpoint dominates). Max over the member's VISIBLE slots, mirroring the
 * shader's `oc<m>` loop.
 */
export function occupancyUpperNorm(
  brickMin: number,
  brickMax: number,
  dataMin: number,
  dataMax: number,
  slots: readonly SlotTransfer[],
): number {
  let upper = 0;
  for (const slot of slots) {
    if (!slot.visible) continue;
    upper = Math.max(
      upper,
      normalizeSlotValue(brickMin, dataMin, dataMax, slot),
      normalizeSlotValue(brickMax, dataMin, dataMax, slot),
    );
  }
  return upper;
}

/** One merged-pass member's inputs to the resident-brick skip decision. */
export type MemberSkipState = {
  /** 0 MIP, 1 ATTENUATED_MIP, 2 VOLUME, 3 ISO. */
  projectionMode: number;
  /** `occupancyUpperNorm` over this member's visible slots. */
  upperNorm: number;
  /** The member's MIP accumulator (max norm seen so far on this ray). */
  bestNorm: number;
  isoThreshold: number;
  /** The member's early-out flag (saturated / first ISO crossing). */
  done: boolean;
};

/**
 * The RESIDENT-brick occupancy skip (shader lockstep: the `occSkipAll` block
 * in `brickNodeMaterials.ts`): the ray may hop the resident brick's whole cell
 * when EVERY member is satisfied — invisible under its clim window (the EMPTY
 * threshold), a MIP that the brick cannot beat, an ISO the brick never
 * reaches, or already done. Conservative by construction: a skipped brick
 * cannot change any member's accumulator.
 */
export function residentBrickSkippable(members: readonly MemberSkipState[]): boolean {
  return members.every((member) => {
    if (member.done) return true;
    if (member.upperNorm <= 0.001) return true;
    if (member.projectionMode === 0 && member.upperNorm <= member.bestNorm) return true;
    if (member.projectionMode === 3 && member.upperNorm < member.isoThreshold) return true;
    return false;
  });
}

/**
 * ATTENUATED_MIP early ray termination bound. The projection ranks samples by
 * `norm · exp(-1.5 · depthFrac)`; `depthFrac` strictly increases along the ray
 * and `norm ≤ 1`, so every future contribution is strictly below
 * `exp(-1.5 · depthFrac_now)`. Once the accumulated max reaches that ceiling,
 * nothing later on the ray can beat it. Deterministic per pixel (P14-safe,
 * same argument as the MIP 0.995 early-out).
 */
export function attenuatedMipDone(attenuatedMax: number, depthFrac: number): boolean {
  return attenuatedMax >= attenuationAt(depthFrac);
}

/** The ATTENUATED_MIP depth weight — mirrors `exp(-1.5·depthFrac)` in the shader. */
export function attenuationAt(depthFrac: number): number {
  return Math.exp(-1.5 * depthFrac);
}

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}
