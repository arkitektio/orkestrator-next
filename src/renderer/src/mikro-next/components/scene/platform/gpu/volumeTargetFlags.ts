/**
 * Kill switches for the volume compositor (localStorage, default ON — same
 * pattern as `render/bricks/shaderFlags.ts`). The compositor is render-path
 * restructuring that cannot be GPU-verified in CI, so every piece ships
 * behind an instantly revertible flag:
 *
 *  - `orkestrator.volumeTarget` — R2: raymarch image volume passes into a
 *    dedicated render target (full-res settled, half-res while active) and
 *    composite the upsampled result additively. The image materials keep
 *    plain AdditiveBlending in BOTH paths (an earlier separate-alpha design
 *    was reverted — the target is an additive-DELTA buffer, see
 *    brickNodeMaterials' blending note). Read once at scene mount
 *    (ThreeDScene), so toggling takes effect on the next scene mount.
 *  - `orkestrator.volumeCache` — R1: skip re-rendering the volume target when
 *    no volume input changed, compositing the cached texture instead. Read
 *    per frame, so it can be A/B'd live without a remount.
 *  - `orkestrator.volumeDepthPrepass` — the depth-only prepass of opaque
 *    occluders (fabriks meshes) into the volume target, which preserves
 *    today's per-fragment mesh-over-volume occlusion. Occluders render with
 *    their own materials, colorWrite off (see `disableColorWrite`). Off
 *    documents the accepted regression (volumes composite over meshes) —
 *    the escape hatch if the prepass misbehaves.
 */

const VOLUME_TARGET_STORAGE_KEY = "orkestrator.volumeTarget";
const VOLUME_CACHE_STORAGE_KEY = "orkestrator.volumeCache";
const VOLUME_DEPTH_PREPASS_STORAGE_KEY = "orkestrator.volumeDepthPrepass";

const readFlag = (key: string): boolean => {
  try {
    return window.localStorage.getItem(key) !== "off";
  } catch {
    return true;
  }
};

const writeFlag = (key: string, enabled: boolean): void => {
  try {
    window.localStorage.setItem(key, enabled ? "on" : "off");
  } catch {
    /* storage unavailable: session keeps its current state */
  }
};

export const isVolumeTargetEnabled = (): boolean => readFlag(VOLUME_TARGET_STORAGE_KEY);
export const setVolumeTargetEnabled = (enabled: boolean): void =>
  writeFlag(VOLUME_TARGET_STORAGE_KEY, enabled);

export const isVolumeCacheEnabled = (): boolean => readFlag(VOLUME_CACHE_STORAGE_KEY);
export const setVolumeCacheEnabled = (enabled: boolean): void =>
  writeFlag(VOLUME_CACHE_STORAGE_KEY, enabled);

export const isVolumeDepthPrepassEnabled = (): boolean =>
  readFlag(VOLUME_DEPTH_PREPASS_STORAGE_KEY);
export const setVolumeDepthPrepassEnabled = (enabled: boolean): void =>
  writeFlag(VOLUME_DEPTH_PREPASS_STORAGE_KEY, enabled);
