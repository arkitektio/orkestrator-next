/**
 * Kill switch (localStorage, default ON), mirroring `orkestrator.gpuRepack` /
 * `orkestrator.volumeMerge`: lets a session A/B the restructured raymarch
 * fast path (skip-before-sample for EMPTY bricks, `textureSampleLevel` atlas
 * taps, ATTENUATED_MIP early ray termination) against the original emission
 * order without a rebuild. Read at material-build time, so toggling takes
 * effect on the next scene mount. This is the only practical way to bisect a
 * visual regression in a shader that cannot be unit-tested against a GPU.
 */
const SHADER_FAST_PATH_STORAGE_KEY = "orkestrator.shaderFastPath";

export function isShaderFastPathEnabled(): boolean {
  try {
    return window.localStorage.getItem(SHADER_FAST_PATH_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setShaderFastPathEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(SHADER_FAST_PATH_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable: session keeps its current state */
  }
}
