import * as THREE from "three";
import { SceneLayerFragment } from "@/mikro-next/api/graphql";

/** Build a THREE.Matrix4 from the raw affine matrix stored on a layer */
export function buildAffineMatrix(layer: SceneLayerFragment): THREE.Matrix4 {
  const mat = new THREE.Matrix4().identity();
  const raw = layer.affineMatrix;
  if (!raw) return mat;

  if (raw.length === 3) {
    mat.set(
      raw[0][0], raw[0][1], 0, raw[0][2],
      raw[1][0], raw[1][1], 0, raw[1][2],
      0, 0, 1, 0,
      raw[2][0], raw[2][1], 0, raw[2][2],
    );
  } else if (raw.length === 4) {
    mat.set(
      raw[0][0], raw[0][1], raw[0][2], raw[0][3],
      raw[1][0], raw[1][1], raw[1][2], raw[1][3],
      raw[2][0], raw[2][1], raw[2][2], raw[2][3],
      raw[3][0], raw[3][1], raw[3][2], raw[3][3],
    );
  }
  return mat;
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
