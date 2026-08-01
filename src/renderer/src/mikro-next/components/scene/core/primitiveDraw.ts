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
 * added, and until the next `yarn mikro` pull includes it the literal is
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
