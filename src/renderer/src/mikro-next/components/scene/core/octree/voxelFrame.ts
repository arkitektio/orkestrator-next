import * as THREE from "three";
import { resolveAxisIndices } from "../dims";
import { affineToMatrix4 } from "../worldTransform";
import type { LayerState } from "../layerModel";

/**
 * The layer's centering matrix: base-voxel [x, y, z] → the centered, y-flipped
 * frame the layer affine is applied on top of. All three axes are centered on
 * the layer origin and y is flipped (`centers[i] = … - total/2; centers[1] =
 * -centers[1]`).
 *
 * Exported because it is exactly the factor that separates three-space from
 * the scene's world µm (COORDINATE_SYSTEMS.md §4) — `core/cameraState.ts`
 * needs it on its own to invert the frame. Keep it as the ONE definition of
 * the convention: the whole point of §4's tracked "scene-root frame
 * normalization" is that this eventually collapses to the identity.
 */
export function buildCenteringMatrix(layer: LayerState): THREE.Matrix4 {
  const { xPos, yPos, zPos } = resolveAxisIndices(layer.lens.axisNames, layer);
  const xMax = xPos !== -1 ? layer.lens.shape[xPos] ?? 0 : 0;
  const yMax = yPos !== -1 ? layer.lens.shape[yPos] ?? 0 : 0;
  const zMax = zPos !== -1 ? layer.lens.shape[zPos] ?? 0 : 0;

  return new THREE.Matrix4().set(
    1, 0, 0, -xMax / 2,
    0, -1, 0, yMax / 2,
    0, 0, 1, -zMax / 2,
    0, 0, 0, 1,
  );
}

/**
 * Base-voxel [x, y, z] → world transform of a layer's 3D volume mesh.
 *
 * Matches the frame `VolumeLayer` builds its box in: `buildCenteringMatrix`,
 * then the layer affine applied by the enclosing group.
 *
 * NOTE the in-tree z conventions differ: the 2D slab picker
 * (`chunkPlanning.resolveLevelZ`, `ZSliderPanel`) maps physical z → voxel z
 * through the affine WITHOUT centering. The octree planner therefore uses
 * this frame only for 3D frustum/camera math and the uncentered mapping for
 * 2D slab selection.
 */
export function buildVolumeVoxelToWorld(layer: LayerState): THREE.Matrix4 {
  return affineToMatrix4(layer.affineMatrix).multiply(buildCenteringMatrix(layer));
}
