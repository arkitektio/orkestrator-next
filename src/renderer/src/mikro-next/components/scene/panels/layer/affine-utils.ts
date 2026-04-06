import * as THREE from "three";
import { SceneLayerFragment } from "@/mikro-next/api/graphql";

/**
 * Convert a raw affine matrix (number[][]) to a THREE.Matrix4.
 *
 * The server always delivers the affine in **(x, y, z)** dim order:
 *   - 3×3  →  2-D affine  (x, y, translate)  – z is identity pass-through
 *   - 4×4  →  3-D affine  (x, y, z, translate)
 *   - 2×2  →  2-D linear  (no translation) – z is identity pass-through
 *   - null / empty → identity
 */
export function affineToMatrix4(raw: number[][] | null | undefined): THREE.Matrix4 {
  const mat = new THREE.Matrix4().identity();
  if (!raw || raw.length === 0) return mat;

  if (raw.length === 2 && raw[0].length === 2) {
    // 2×2 linear (no translation) – scale / rotation only in x-y
    mat.set(
      raw[0][0], raw[0][1], 0, 0,
      raw[1][0], raw[1][1], 0, 0,
      0,         0,         1, 0,
      0,         0,         0, 1,
    );
  } else if (raw.length === 3 && raw[0].length === 3) {
    // 3×3 2-D affine: rows = [x-out, y-out, homogeneous]
    //   [a00 a01 tx]       x' = a00·x + a01·y + tx
    //   [a10 a11 ty]  →    y' = a10·x + a11·y + ty
    //   [ 0   0   1]       z' = z  (pass-through)
    mat.set(
      raw[0][0], raw[0][1], 0, raw[0][2],
      raw[1][0], raw[1][1], 0, raw[1][2],
      0,         0,         1, 0,
      raw[2][0], raw[2][1], 0, raw[2][2],
    );
  } else if (raw.length === 4 && raw[0].length === 4) {
    // 4×4 3-D affine: direct mapping (x, y, z, homogeneous rows)
    mat.set(
      raw[0][0], raw[0][1], raw[0][2], raw[0][3],
      raw[1][0], raw[1][1], raw[1][2], raw[1][3],
      raw[2][0], raw[2][1], raw[2][2], raw[2][3],
      raw[3][0], raw[3][1], raw[3][2], raw[3][3],
    );
  }
  return mat;
}

/** Build a THREE.Matrix4 from the raw affine matrix stored on a layer (x,y,z convention) */
export function buildAffineMatrix(layer: SceneLayerFragment): THREE.Matrix4 {
  return affineToMatrix4(layer.affineMatrix);
}

/** Get the number of Z voxels for a layer, or null if the layer has no Z dimension */
export function getLayerZSize(layer: SceneLayerFragment): number | null {
  if (!layer.zDim) return null;
  const idx = layer.lens.dims.indexOf(layer.zDim);
  if (idx === -1) return null;
  return layer.lens.shape[idx] ?? null;
}

/** Convert a voxel Z coordinate to physical Z using the affine matrix */
export function voxelToPhysicalZ(
  affine: THREE.Matrix4,
  voxelZ: number,
): number {
  const pt = new THREE.Vector3(0, 0, voxelZ);
  pt.applyMatrix4(affine);
  return pt.z;
}

/** Convert a physical Z coordinate to the closest voxel Z index, clamped to [0, maxZ] */
export function physicalToVoxelZ(
  affine: THREE.Matrix4,
  physicalZ: number,
  maxVoxelZ: number,
): number {
  const inv = affine.clone().invert();
  const pt = new THREE.Vector3(0, 0, physicalZ);
  pt.applyMatrix4(inv);
  return Math.max(0, Math.min(maxVoxelZ, Math.round(pt.z)));
}
