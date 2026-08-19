import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  createLabelVolumeNodeMaterial,
  updateLabelVolumeNodes,
} from "../../render/bricks/labelNodeMaterials";
import { buildLabelUniformData, labelDataSignature } from "../../render/bricks/labelUniforms";
import { useLabelColorLut } from "../../render/labels/useLabelColorLut";
import { buildAffineMatrix } from "../../core/worldTransform";
import { useViewerStore, useViewerStoreApi } from "../../store/viewerStore";
import { perfMonitor } from "../../managers/perfMonitor";
import { useBrickLayer } from "./useBrickPlaneProbe";
import { useBrickMaterialBundle } from "./useBrickMaterialBundle";
import {
  useStepScaleUniform,
  useVolumePassRegistration,
  useVolumeRayUniforms,
} from "./useVolumeRayUniforms";

/**
 * A label mask in 3D: a unit-box proxy whose fragment shader marches the brick
 * pool until it meets an object, then paints it.
 *
 * The projection is FIRST HIT and not one of the image path's four, because none
 * of them mean anything over object ids — MIP would keep the largest id, which is
 * an arbitrary object. The reasoning is stated in full on
 * `createLabelVolumeNodeMaterial`, and the card says "2D only" for `contour`,
 * which this deliberately does not implement.
 *
 * NO MERGED PASS, unlike the intensity raymarcher. Two `LabelLayer`s over one
 * lens DO share a pool (`poolKey` separates only on `valueSemantics`), so the
 * image path would raymarch them in a single pass and this one draws both at
 * full cost. Deferred rather than impossible — the merged material is the
 * channel compositor unrolled per member, so a label merge needs its own
 * unrolling, and two masks over one array is a rare enough scene to wait.
 *
 * NO PROBE, unlike the 2D plane. The 3D probe closure in `BrickVolumeLayer` is
 * bound up with ROI drawing, the annotation placement path and the merged-member
 * bookkeeping; a mask is probed on the plane, where the object under the cursor
 * is unambiguous. A first-hit surface would make "which voxel" a second question.
 * Worth revisiting, but not by half-copying that closure.
 */
export const BrickLabelVolumeLayer = ({ layerId }: { layerId: string }) => {
  perfMonitor.countRender("BrickLabelVolumeLayer"); // no-op unless a recording is armed

  const register = useViewerStore((s) => s.register);
  const unregister = useViewerStore((s) => s.unregister);
  // SCALAR plan subscriptions only (P9c/P17) — see BrickVolumeLayer.
  const planTargetLevel = useViewerStore((s) => s.nodePlans[layerId]?.targetLevel);
  const planMode = useViewerStore((s) => s.nodePlans[layerId]?.mode);
  useViewerStore((s) => s.poolsVersion);
  const brickSystem = useViewerStore((s) => s.brickSystem);


  const layer = useBrickLayer(layerId);

  /**
   * Registering the group is NOT optional, and its failure mode is silent.
   *
   * `trackables` → `visibilityTracker` → `computeSceneVisibility` →
   * `viewerStore.layerViewRanges` → `nodePlanTracker`'s `viewRange` argument to
   * `planLayerNodes`. Without an entry there, the planner builds no
   * `visibleBox`/`strictBox`, and `nodePlanning`'s `fetchBand` collapses: every
   * non-root node becomes band 1, so off-screen prefetch competes on equal
   * footing with the bricks actually on screen. Nothing errors — the mask just
   * streams in brick by brick instead of showing its coarse backdrop first and
   * refining what you are looking at.
   *
   * The 2D label plane gets this from `useBrickPlaneProbe`; a volume has no
   * probe yet, so it registers here.
   */
  const groupRef = useRef<THREE.Group>(null!);
  useEffect(() => {
    const refProxy = { kind: "layer" as const, id: layerId, ref: groupRef };
    register(refProxy);
    return () => unregister(refProxy);
  }, [layerId, register, unregister]);
  const invalidate = useThree((state) => state.invalidate);
  const viewerStoreApi = useViewerStoreApi();

  const affineMatrix = useMemo(
    () => (layer ? buildAffineMatrix(layer) : new THREE.Matrix4().identity()),
    [layer],
  );

  const pool = brickSystem?.getLayerPool(layerId) ?? null;

  const labelData = useMemo(() => buildLabelUniformData(layer), [layer]);
  const labelSignature = labelDataSignature(labelData);

  const bundle = useBrickMaterialBundle(
    pool,
    (p) => createLabelVolumeNodeMaterial(p, p, labelData),
  );


  // Every label-specific uniform in one push; the ray uniforms and the
  // camera-motion step scale are driven by the shared hooks below, which the
  // intensity raymarcher uses too.
  useEffect(() => {
    if (!bundle) return;
    updateLabelVolumeNodes(bundle.nodes, labelData);
    viewerStoreApi.getState().volumeInputs.bump("label-uniforms");
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle, labelSignature, invalidate]);

  useVolumeRayUniforms(bundle?.nodes, {
    pool,
    desiredLevel: planTargetLevel,
    planTargetLevel,
  });
  useStepScaleUniform(bundle?.nodes); // no settleRefine: canvas-pass material
  useVolumePassRegistration(!!bundle);

  // The picked colouring and the active filter rules, resolved into the
  // material's colour LUT. Shared with the other label mode — same table, same
  // indexing; only what a texel is USED for differs.
  useLabelColorLut(bundle?.nodes, layer);

  if (layer?.visible === false) return null;
  if (planMode !== "3D" || !pool || !bundle) return null;

  const base = pool.geometry.levels[0];
  const volumeSize: [number, number, number] = [
    base.spatialShape[0] * base.scale[0],
    base.spatialShape[1] * base.scale[1],
    base.spatialShape[2] * base.scale[2],
  ];

  return (
    <group ref={groupRef} matrix={affineMatrix} matrixAutoUpdate={false}>
      {/* Corner-anchored: the unit box is offset by half its size so group-local
          spans [0..shape] and voxel v renders at exactly affine(v) —
          COORDINATE_SYSTEMS.md "Coordinate conventions". `renderOrder` 2 puts the
          mask above an image volume's 1, matching the 2D pair. */}
      {/* NOT tagged VOLUME_PASS_OBJECT: the compositor's offscreen target is
          an ADDITIVE-DELTA buffer (see brickNodeMaterials' blending note) and
          this material's NormalBlending cannot share it — the label raymarch
          renders live in the canvas pass, drawn AFTER the composite quad
          (renderOrder 2 > 1) exactly as it draws after image volumes today.
          Folding labels into their own cached target is a noted follow-up. */}
      <mesh
        key={pool.structureSignature}
        scale={volumeSize}
        position={[volumeSize[0] / 2, volumeSize[1] / 2, volumeSize[2] / 2]}
        renderOrder={2}
      >
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={bundle.material} attach="material" />
      </mesh>
    </group>
  );
};
