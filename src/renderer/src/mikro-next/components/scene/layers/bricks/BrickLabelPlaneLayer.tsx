import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { useAttributeServiceOrNull } from "@/mikro-next/lib/attributes/AttributeServiceProvider";
import {
  createLabelPlaneNodeMaterial,
  setLabelColorLut,
  updateLabelNodes,
} from "../../render/bricks/labelNodeMaterials";
import { buildLabelColorLut } from "../../render/labels/labelColorLut";
import { level0StoreIdOf, systemIdOf } from "../../core/layerLevel0";
import {
  buildLabelUniformData,
  labelDataSignature,
} from "../../render/bricks/labelUniforms";
import { buildAffineMatrix } from "../../core/worldTransform";
import { useViewerStore } from "../../store/viewerStore";
import { perfMonitor } from "../../managers/perfMonitor";
import { useBrickPlaneLayer, useBrickPlaneProbe } from "./useBrickPlaneProbe";

/**
 * A label mask drawn as ONE full-layer quad, the same shape as `BrickPlaneLayer`
 * and over the same brick pool — the mask shares the image path's data entirely
 * (a Lens over an array, so the same planner, pool and residency) and differs
 * only in how a sampled value becomes colour.
 *
 * The two halves it does NOT own:
 *  - the level walk and the atlas tap live in `labelNodeMaterials.ts`, which
 *    imports the traversal from `brickNodeMaterials.ts` so there is one copy in
 *    lockstep with the CPU mirror;
 *  - the probe lives in `useBrickPlaneProbe`, shared with the image plane.
 *    Probing a mask is its PRIMARY interaction: it is what drives
 *    `AttributeProbeTracker` to resolve the object's attribute row, the same
 *    relation a `colorBys` entry colours by.
 *
 * `renderOrder` 2 puts a mask above the image plane's 1, which is what makes a
 * mask-over-image read correctly with `NormalBlending` and no depth write.
 */
export const BrickLabelPlaneLayer = ({ layerId }: { layerId: string }) => {
  perfMonitor.countRender("BrickLabelPlaneLayer"); // no-op unless a recording is armed

  // SCALAR plan subscriptions only (P9c/P17): the plan object churns identity
  // per replan; this component consumes only these.
  const planTargetLevel = useViewerStore((s) => s.nodePlans[layerId]?.targetLevel);
  const planSlabZ = useViewerStore((s) => s.nodePlans[layerId]?.slabZ);
  const planHasNodes = useViewerStore(
    (s) => (s.nodePlans[layerId]?.nodes.length ?? 0) > 0,
  );
  // Re-render on pool lifecycle only, never the streaming residency counter.
  useViewerStore((s) => s.poolsVersion);
  const brickSystem = useViewerStore((s) => s.brickSystem);

  const layer = useBrickPlaneLayer(layerId);

  const affineMatrix = useMemo(
    () => (layer ? buildAffineMatrix(layer) : new THREE.Matrix4().identity()),
    [layer],
  );

  const pool = brickSystem?.getLayerPool(layerId) ?? null;

  const { groupRef, handlers } = useBrickPlaneProbe({ layerId, layer, pool });

  const attributeService = useAttributeServiceOrNull();
  const invalidate = useThree((state) => state.invalidate);

  const labelData = useMemo(() => buildLabelUniformData(layer), [layer]);
  // A string, so the update effect does not re-run on the record's identity
  // churning every render (same reason `channelDataSignature` exists).
  const labelSignature = labelDataSignature(labelData);

  /** INTEGER base-voxel z of the displayed slab — see BrickPlaneLayer: the
   * shader's slab mode applies the planner's floor chain per level itself, so
   * no +0.5 here. planSlabZ is in level-0 slices; scale to base voxels. */
  const slabBaseZ = (planSlabZ ?? 0) * (pool?.geometry.levels[0]?.scale[2] ?? 1);

  // Recreated only when the pool is rebuilt (the mesh remounts on that key);
  // everything dynamic flows through the uniform NODES below.
  const bundle = useMemo(() => {
    if (!pool) return null;
    const created = createLabelPlaneNodeMaterial(pool, pool, labelData);
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
    // No bound textures of its own to dispose — the atlas and page table belong
    // to the pool, which outlives this material.
    return () => material?.dispose();
  }, [bundle]);

  useEffect(() => {
    if (!bundle || planTargetLevel === undefined) return;
    updateLabelNodes(bundle.nodes, labelData);
    bundle.nodes.uDesiredLevel.value = planTargetLevel;
    bundle.nodes.uSlabBaseZ.value = slabBaseZ;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle, labelSignature, planTargetLevel, slabBaseZ]);

  // --- the colour LUT: a picked colouring / the active filter rules ---------
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

  /**
   * A CONTENT key, not references. The card folds the server's answer in with
   * `Object.assign` into an immer draft, so array identity is structural
   * sharing's call and would re-run this effect for nothing — or miss a real
   * change. (Same reasoning as `FabriksCollectionLayer`'s `lutKey`.)
   */
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
      // A superseded build must not reach the GPU, and its texture is ours to
      // free — `setLabelColorLut` only ever disposes what it replaces.
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
    // `activeColorBy` / `activeRules` are read inside; `lutKey` decides whether
    // it re-runs. See the note on the key itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle, attributeService, systemId, storeId, lutKey, invalidate]);

  if (layer?.visible === false) return null;
  if (!planHasNodes || !pool || !bundle) return null;

  const base = pool.geometry.levels[0];
  const totalX = base.spatialShape[0] * base.scale[0];
  const totalY = base.spatialShape[1] * base.scale[1];

  return (
    <group
      matrix={affineMatrix}
      matrixAutoUpdate={false}
      ref={groupRef}
      // From `useBrickPlaneProbe` — spread rather than written out, because
      // `undefined` vs a function is the raycast gate (P20).
      {...handlers}
    >
      {/* Corner-anchored, exactly as the image plane: the unit quad is offset by
          half its size so group-local spans [0..shape] and voxel v renders at
          affine(v) — COORDINATE_SYSTEMS.md "Coordinate conventions". */}
      <mesh
        key={pool.structureSignature}
        scale={[totalX, totalY, 1]}
        position={[totalX / 2, totalY / 2, 0]}
        renderOrder={2}
      >
        <planeGeometry args={[1, 1]} />
        <primitive object={bundle.material} attach="material" />
      </mesh>
    </group>
  );
};
