import * as THREE from "three";
import { resolveAxisIndices } from "../dims";
import { affineToMatrix4 } from "../worldTransform";
import type { LayerState } from "../layerModel";

/**
 * Base-voxel [x, y, z] → world transform of a layer's 3D volume mesh.
 *
 * Matches the frame `VolumeLayer` builds its box in: all three axes centered
 * on the layer origin, y flipped (`centers[i] = … - total/2; centers[1] =
 * -centers[1]`), then the layer affine applied by the enclosing group.
 *
 * NOTE the in-tree z conventions differ: the 2D slab picker
 * (`chunkPlanning.resolveLevelZ`, `ZSliderPanel`) maps physical z → voxel z
 * through the affine WITHOUT centering. The octree planner therefore uses
 * this frame only for 3D frustum/camera math and the uncentered mapping for
 * 2D slab selection.
 */
export function buildVolumeVoxelToWorld(layer: LayerState): THREE.Matrix4 {
  const { xPos, yPos, zPos } = resolveAxisIndices(layer.lens.dims, layer);
  const xMax = xPos !== -1 ? layer.lens.shape[xPos] ?? 0 : 0;
  const yMax = yPos !== -1 ? layer.lens.shape[yPos] ?? 0 : 0;
  const zMax = zPos !== -1 ? layer.lens.shape[zPos] ?? 0 : 0;

  const centering = new THREE.Matrix4().set(
    1, 0, 0, -xMax / 2,
    0, -1, 0, yMax / 2,
    0, 0, 1, -zMax / 2,
    0, 0, 0, 1,
  );
  return affineToMatrix4(layer.affineMatrix).multiply(centering);
}
