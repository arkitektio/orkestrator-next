import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import * as THREE from "three";

import { useAttributeServiceOrNull } from "@/mikro-next/lib/attributes/AttributeServiceProvider";
import {
  createLabelVolumeNodeMaterial,
  setLabelColorLut,
  updateLabelVolumeNodes,
} from "../../render/bricks/labelNodeMaterials";
import { buildLabelUniformData, labelDataSignature } from "../../render/bricks/labelUniforms";
import { buildLabelColorLut } from "../../render/labels/labelColorLut";
import { level0StoreIdOf, systemIdOf } from "../../core/layerLevel0";
import { buildAffineMatrix } from "../../core/worldTransform";
import { qualityGovernor } from "../../core/qualityGovernor";
import { useViewStore, useViewStoreApi } from "../../store/viewStore";
import { useViewerStore } from "../../store/viewerStore";
import { perfMonitor } from "../../managers/perfMonitor";
import { useBrickPlaneLayer } from "./useBrickPlaneProbe";

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
 * NO PROBE, unlike the 2D plane. The 3D probe closure in `BrickVolumeLayer` is
 * bound up with ROI drawing, the annotation placement path and the merged-member
 * bookkeeping; a mask is probed on the plane, where the object under the cursor
 * is unambiguous. A first-hit surface would make "which voxel" a second question.
 * Worth revisiting, but not by half-copying that closure.
 */
export const BrickLabelVolumeLayer = ({ layerId }: { layerId: string }) => {
  perfMonitor.countRender("BrickLabelVolumeLayer"); // no-op unless a recording is armed

  const lodBias = useViewerStore((s) => s.lodBias);
  // SCALAR plan subscriptions only (P9c/P17) — see BrickVolumeLayer.
  const planTargetLevel = useViewerStore((s) => s.nodePlans[layerId]?.targetLevel);
  const planMode = useViewerStore((s) => s.nodePlans[layerId]?.mode);
  useViewerStore((s) => s.poolsVersion);
  const brickSystem = useViewerStore((s) => s.brickSystem);

  // Scalar selector only: the footprint scale depends on fov + viewport height
  // alone (both constant while orbiting); the camera position reaches the shader
  // through `vOrigin`.
  const pxPerVoxelAtUnitDistance = useViewStore((s) =>
    s.cameraPose?.isPerspective && s.cameraPose.fovY > 0
      ? s.viewportSize.height / (2 * Math.tan(s.cameraPose.fovY / 2))
      : 0,
  );
  const viewStoreApi = useViewStoreApi();
  const qualityVersion = useSyncExternalStore(
    qualityGovernor.subscribe,
    () => qualityGovernor.getVersion(),
  );

  const layer = useBrickPlaneLayer(layerId);
  const attributeService = useAttributeServiceOrNull();
  const invalidate = useThree((state) => state.invalidate);

  const affineMatrix = useMemo(
    () => (layer ? buildAffineMatrix(layer) : new THREE.Matrix4().identity()),
    [layer],
  );

  const pool = brickSystem?.getLayerPool(layerId) ?? null;

  const labelData = useMemo(() => buildLabelUniformData(layer), [layer]);
  const labelSignature = labelDataSignature(labelData);

  /**
   * Step sizing from the plan's finest requested level: half a voxel of it. The
   * per-sample step adapts to the LOD sampled at that point (see `stepLen` in the
   * shader), and the in-shader `floorDelta` guarantees every ray reaches its exit
   * within the loop bound.
   */
  const marchParams = useMemo(() => {
    if (!pool || planTargetLevel === undefined) return { minDelta: 1 };
    const level = pool.geometry.levels[Math.min(planTargetLevel, pool.geometry.levels.length - 1)];
    return { minDelta: 0.5 * level.scale[0] };
  }, [pool, planTargetLevel]);

  const bundle = useMemo(() => {
    if (!pool) return null;
    const created = createLabelVolumeNodeMaterial(pool, pool, labelData);
    created.nodes.uBaseShape.value.set(
      pool.geometry.levels[0].spatialShape[0],
      pool.geometry.levels[0].spatialShape[1],
      pool.geometry.levels[0].spatialShape[2],
    );
    return created;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, pool?.structureSignature]);

  useEffect(() => {
    const material = bundle?.material;
    // The atlas and page table belong to the pool, which outlives this material;
    // the LUT textures are disposed by `setLabelColorLut` as they are replaced.
    return () => material?.dispose();
  }, [bundle]);

  useEffect(() => {
    if (!bundle || planTargetLevel === undefined) return;
    const n = bundle.nodes;
    updateLabelVolumeNodes(n, labelData);
    n.uDesiredLevel.value = planTargetLevel;
    n.uLodBias.value = lodBias;
    n.uPxPerVoxelAtUnitDist.value = pxPerVoxelAtUnitDistance;
    n.uMinDelta.value = marchParams.minDelta;
    n.uMaxSteps.value = qualityGovernor.getProfile().maxRaySteps;
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bundle,
    labelSignature,
    planTargetLevel,
    lodBias,
    pxPerVoxelAtUnitDistance,
    marchParams,
    qualityVersion,
    invalidate,
  ]);

  /**
   * `uStepScale`, driven IMPERATIVELY off the camera-motion flag — a React
   * subscription would re-render this component on every leading camera emission
   * and every settle (~23 flips over a 10 s orbit) for a single float.
   */
  useEffect(() => {
    const nodes = bundle?.nodes;
    if (!nodes) return;
    let last: number | null = null;
    const apply = () => {
      const profile = qualityGovernor.getProfile();
      const next =
        viewStoreApi.getState().cameraMoving || qualityGovernor.isStreaming()
          ? profile.activeStepScale
          : profile.settledStepScale;
      if (next === last) return; // the flag flips far more often than the value
      last = next;
      nodes.uStepScale.value = next;
      invalidate();
    };
    apply();
    const unsubscribeCamera = viewStoreApi.subscribe(apply);
    const unsubscribeQuality = qualityGovernor.subscribe(apply);
    return () => {
      unsubscribeCamera();
      unsubscribeQuality();
    };
  }, [bundle, viewStoreApi, invalidate]);

  // --- the colour LUT: identical to the 2D path's, over the same entries -----
  const render = layer?.labelRender;
  const activeColorBy =
    render?.activeColorBy != null ? (render.colorBys?.[render.activeColorBy] ?? null) : null;
  const activeRules = useMemo(
    () =>
      (render?.activeFilterBys ?? [])
        .map((index) => render?.filterBys?.[index])
        .filter((rule): rule is NonNullable<typeof rule> => Boolean(rule)),
    [render?.activeFilterBys, render?.filterBys],
  );
  const lutKey = useMemo(
    () => JSON.stringify([activeColorBy, activeRules]),
    [activeColorBy, activeRules],
  );

  const systemId = layer ? systemIdOf(layer) : null;
  const storeId = layer ? level0StoreIdOf(layer) : null;

  useEffect(() => {
    if (!bundle) return;
    const nothingActive = !activeColorBy && activeRules.length === 0;
    if (!attributeService || !systemId || !storeId || nothingActive) {
      setLabelColorLut(
        bundle.nodes,
        { texture: null, width: 0, height: 0, idOffset: 0 },
        { colorize: false, filter: false },
      );
      return;
    }
    let cancelled = false;
    void (async () => {
      const plans = await attributeService.plansFor(systemId);
      if (cancelled) return;
      const lut = await buildLabelColorLut({
        colorBy: activeColorBy,
        filterBys: activeRules,
        plans,
        storeId,
        engine: attributeService.engine,
      });
      if (cancelled) {
        lut.texture?.dispose();
        return;
      }
      if (lut.skipped.length > 0) {
        console.warn("[label] picker entries that do not render yet:", lut.skipped);
      }
      setLabelColorLut(bundle.nodes, lut, {
        colorize: activeColorBy !== null,
        filter: activeRules.length > 0,
      });
      invalidate();
    })().catch((error) => {
      if (cancelled) return;
      console.warn("[label] could not build the colour lookup:", error);
      setLabelColorLut(
        bundle.nodes,
        { texture: null, width: 0, height: 0, idOffset: 0 },
        { colorize: false, filter: false },
      );
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle, attributeService, systemId, storeId, lutKey, invalidate]);

  if (layer?.visible === false) return null;
  if (planMode !== "3D" || !pool || !bundle) return null;

  const base = pool.geometry.levels[0];
  const volumeSize: [number, number, number] = [
    base.spatialShape[0] * base.scale[0],
    base.spatialShape[1] * base.scale[1],
    base.spatialShape[2] * base.scale[2],
  ];

  return (
    <group matrix={affineMatrix} matrixAutoUpdate={false}>
      {/* Corner-anchored: the unit box is offset by half its size so group-local
          spans [0..shape] and voxel v renders at exactly affine(v) —
          COORDINATE_SYSTEMS.md "Coordinate conventions". `renderOrder` 2 puts the
          mask above an image volume's 1, matching the 2D pair. */}
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
