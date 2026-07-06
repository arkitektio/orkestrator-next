/**
 * Shared GLSL chunks composed into the scene's shader materials. Keeping these
 * as single string constants prevents the copy-paste that previously existed
 * between the volume raymarch shader and the (now-deleted) legacy ChunkVolume
 * shader, and gives new materials a common library to build on.
 *
 * NOTE: any transfer/normalize math added here must stay in lockstep with the
 * CPU mirror in `core/probeMath.ts` (see the comment there).
 */

/** Cheap hash for per-fragment ray jitter. */
export const GLSL_RAND = /* glsl */ `
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}`;

/** Ray/unit-box (centered at origin, half-extent 0.5) intersection: returns (tNear, tFar). */
export const GLSL_HITBOX = /* glsl */ `
vec2 hitBox(vec3 orig, vec3 dir) {
  vec3 box_min = vec3(-0.5);
  vec3 box_max = vec3(0.5);
  vec3 inv_dir = 1.0 / dir;
  vec3 tmin_tmp = (box_min - orig) * inv_dir;
  vec3 tmax_tmp = (box_max - orig) * inv_dir;
  vec3 tmin = min(tmin_tmp, tmax_tmp);
  vec3 tmax = max(tmin_tmp, tmax_tmp);
  float t0 = max(tmin.x, max(tmin.y, tmin.z));
  float t1 = min(tmax.x, min(tmax.y, tmax.z));
  return vec2(t0, t1);
}`;
