import { RoiKind } from "@/mikro-next/api/graphql";

/**
 * The center + radius math of the volumetric drawing tools (Sphere, Cube).
 *
 * Wire contract shared with the server: a volumetric primitive's `vectors` are
 * the two opposite corners of its bounding cube, `[center − (r,r,r),
 * center + (r,r,r)]` — the same corner semantics RECTANGLE/ELLIPSIS/CUBE
 * already use, so `intrinsicBbox` derivation and XY marquee bounds need no
 * kind-specific cases.
 */

/**
 * The SPHERE RoiKind, ahead of the generated enum: the backend kind is being
 * added, and until the next `pnpm mikro` pull includes it the literal is
 * widened here — in exactly one place. Replace with `RoiKind.Sphere` once the
 * regenerated enum carries it.
 */
export const SPHERE_KIND = "SPHERE" as RoiKind;

export type Vec3 = [number, number, number];

/** `[center − (r,r,r), center + (r,r,r)]` — the primitive's bounding corners. */
export const primitiveCornerVectors = (
  center: Vec3,
  radius: number,
): [Vec3, Vec3] => {
  const r = Math.abs(radius);
  return [
    [center[0] - r, center[1] - r, center[2] - r],
    [center[0] + r, center[1] + r, center[2] + r],
  ];
};

/**
 * The sizing gesture's radius: the cursor's XY distance from the anchor.
 * The gesture runs on the world-XY plane through the anchor (the same plane
 * mechanism every drawing tool uses), so z never contributes.
 */
export const planarRadius = (anchor: Vec3, cursor: Vec3): number =>
  Math.hypot(cursor[0] - anchor[0], cursor[1] - anchor[1]);

/**
 * How much an axis-aligned ellipsoid has shrunk where a z plane cuts it: the
 * circle-of-latitude factor `sqrt(1 − ((z − cz)/rz)²)`, to be applied to BOTH
 * planar radii. 1 at the equator, 0 at the poles.
 *
 * This is what the flat view owes a volumetric primitive: a sphere cut near its
 * top is a small circle, and drawing its equator there would claim it is wider
 * on this slice than it is.
 *
 * Null when the plane is past a pole — it cuts nothing. The caller decides what
 * that means, because a shape can reach the renderer with the plane just
 * outside it (the visibility slab is half a slice thicker than the geometry).
 */
export const ellipsoidCrossSectionScale = (
  planeZ: number,
  centerZ: number,
  radiusZ: number,
): number | null => {
  const rz = Math.abs(radiusZ);
  if (rz === 0) return null;
  const offset = (planeZ - centerZ) / rz;
  if (Math.abs(offset) > 1) return null;
  return Math.sqrt(1 - offset * offset);
};
