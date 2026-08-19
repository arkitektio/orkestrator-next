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

/**
 * Zoom smoothing (same pattern): tricubic B-spline reconstruction of the
 * intensity taps once magnification passes `uSmoothThreshold` px/voxel —
 * magnified fluorescence renders as smooth blobs instead of hard voxel
 * blocks. Off = the tricubic code is not emitted at all. Read at material
 * build time; takes effect on the next scene mount.
 */
const SMOOTH_ZOOM_STORAGE_KEY = "orkestrator.smoothZoom";

/**
 * Occupancy observed-range encoding (same pattern): quantize the per-brick
 * min/max occupancy sidecar against the pool's OBSERVED value range instead
 * of the full dtype range. On dim integer data (uint16 peaking at ~2000 of
 * 65535) the dtype-range encoding collapses every brick into a handful of
 * codes and the raymarcher's MIP maximum-culling never fires; the observed
 * range restores the discrimination. Read at POOL CREATION time (like
 * `orkestrator.r16Atlas`) — toggling takes effect for pools created after,
 * i.e. reopen the scene.
 */
const OCC_OBSERVED_RANGE_STORAGE_KEY = "orkestrator.occObservedRange";

/**
 * Direction-projected ray stride (same pattern): the marching pitch becomes
 * the ellipsoidal voxel-crossing distance along the RAY —
 * `0.75 / |dir / levelScale|` — instead of `0.75·max(levelScale)`. On
 * isotropic levels the two are identical for every direction; on anisotropic
 * pyramids the max rule under-samples every axis finer than the max (the
 * face-on 6× z-undersample on [2ⁿ,2ⁿ,1] pyramids that drops thin structures
 * from MIP — a quality bug this fixes). Default ON; read at material-build
 * time, takes effect on the next scene mount.
 */
const ANISO_STRIDE_STORAGE_KEY = "orkestrator.anisoStride";

/**
 * Anisotropy-aware PLANNER LOD (same pattern; a planner flag housed here
 * with the other renderer kill switches): `wantFiner` tempers the max-axis
 * refinement factor with the dominant-axis discount
 * (`nodePlanning.anisoEffectiveFactor`) so face-on views of true-factor
 * pyramids stop admitting a whole finer level ~1.46× early (~8× the bricks
 * over ~55% of the zoom range). The shader's `desiredLevelAt` deliberately
 * stays max-based (residency fallback closes the gap). Read per replan —
 * toggling takes effect live at the next replan.
 */
const ANISO_LOD_STORAGE_KEY = "orkestrator.anisoLod";

/**
 * Hierarchical occupancy (R4): aggregate per-brick measured ranges up one
 * level (`core/octree/occupancyAggregate.ts`) and let the raymarcher hop a
 * whole COARSE cell when the aggregate proves every member invisible /
 * mip-beaten / iso-missed there (with a level guard so no finer-desired
 * sample is skipped). Default **OFF** until live-validated — unlike the
 * other switches this one defaults conservative: it is the largest new
 * shader surface of the anisotropy overhaul. CPU aggregation is captured at
 * pool creation; the shader hop at material build — reopen the scene after
 * toggling.
 */
const OCC_HIERARCHY_STORAGE_KEY = "orkestrator.occHierarchy";

export function isOccHierarchyEnabled(): boolean {
  try {
    return window.localStorage.getItem(OCC_HIERARCHY_STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function setOccHierarchyEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(OCC_HIERARCHY_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable: session keeps its current state */
  }
}

export function isAnisoLodEnabled(): boolean {
  try {
    return window.localStorage.getItem(ANISO_LOD_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setAnisoLodEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(ANISO_LOD_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable: session keeps its current state */
  }
}

export function isAnisoStrideEnabled(): boolean {
  try {
    return window.localStorage.getItem(ANISO_STRIDE_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setAnisoStrideEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(ANISO_STRIDE_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable: session keeps its current state */
  }
}

export function isOccObservedRangeEnabled(): boolean {
  try {
    return window.localStorage.getItem(OCC_OBSERVED_RANGE_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setOccObservedRangeEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(OCC_OBSERVED_RANGE_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable: session keeps its current state */
  }
}

export function isSmoothZoomEnabled(): boolean {
  try {
    return window.localStorage.getItem(SMOOTH_ZOOM_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSmoothZoomEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(SMOOTH_ZOOM_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable: session keeps its current state */
  }
}
