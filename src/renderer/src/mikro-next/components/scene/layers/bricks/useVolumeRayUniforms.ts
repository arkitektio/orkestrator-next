/* eslint-disable react-hooks/immutability --
 * Driving TSL UNIFORM NODES is this module's whole job, and a uniform node is a
 * deliberately mutable handle into an already-compiled shader graph — writing
 * `.value` is how a frame's data reaches the GPU without rebuilding the
 * material. The rule reads that as mutating a hook argument; treating these as
 * React state instead would mean recompiling the shader on every camera move,
 * which is exactly what the uniform-push contract exists to avoid. */
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useSyncExternalStore } from "react";

import {
  qualityGovernor,
  resolveMaxRaySteps,
  resolveSmoothThreshold,
} from "../../core/qualityGovernor";
import { isSmoothZoomEnabled } from "../../render/bricks/shaderFlags";
import type { LayerBrickPool } from "../../managers/brickResidency";
import { useViewStore, useViewStoreApi } from "../../store/viewStore";
import { useViewerStore, useViewerStoreApi } from "../../store/viewerStore";

/**
 * The CPU side of `volumeRayNodes`' uniforms — what actually drives the ray
 * scaffolding every frame.
 *
 * The SHADER half of these was extracted into `render/bricks/volumeRayNodes.ts`
 * because `desiredLevelAt` must stay in lockstep with the planner's `wantFiner`.
 * The driver half belongs with it for exactly the same reason:
 * `pxPerVoxelAtUnitDistance` is the other half of that footprint calculation, and
 * a second hand-written copy of the projection formula is the same rot in the
 * other direction. Both raymarchers — intensity and label — feed these uniforms
 * identically, so they feed them from here.
 *
 * `desiredLevel` is a PARAMETER rather than derived, because the two callers
 * legitimately disagree: a merged image pass uses its group's finest planned
 * level (residency is shared across members), a lone layer uses its own.
 */

/** The uniform handles this drives — the subset both volume materials expose. */
export type VolumeRayUniformHandles = {
  uDesiredLevel: { value: number };
  uLodBias: { value: number };
  uPxPerVoxelAtUnitDist: { value: number };
  uMinDelta: { value: number };
};

/** The handles `useStepScaleUniform` drives. Separate: it is imperative.
 * `uMaxSteps` lives HERE, not with the React-effect uniforms above: adaptive
 * depth flips it on every activity edge (camera moving / streaming), which is
 * exactly the cadence this vanilla subscription exists for.
 * `uSmoothThreshold` is optional — the label raymarcher has no smoothing. */
export type StepScaleUniformHandle = {
  uStepScale: { value: number };
  uMaxSteps: { value: number };
  uSmoothThreshold?: { value: number };
};

/**
 * Screen px per base voxel at unit distance — the CPU twin of the footprint term
 * in `volumeRayNodes.desiredLevelAt`.
 *
 * A SCALAR selector on purpose: `cameraPose` and `viewportSize` are new objects
 * on every camera write (~16/s while orbiting) and subscribing to them would
 * re-render every volume layer continuously. The value depends on fov and
 * viewport height alone, both constant during an orbit; the camera POSITION
 * reaches the shader through `vOrigin`, not through React.
 */
export const usePxPerVoxelAtUnitDistance = (): number =>
  useViewStore((s) =>
    s.cameraPose?.isPerspective && s.cameraPose.fovY > 0
      ? s.viewportSize.height / (2 * Math.tan(s.cameraPose.fovY / 2))
      : 0,
  );

/**
 * Push the five ray uniforms. Returns nothing; it is a driver.
 *
 * `minDelta` is half a voxel of the plan's finest requested level. The actual
 * per-sample step adapts to the LOD sampled at that point (`stepLen` in the
 * shader), and the in-shader `floorDelta` guarantees every ray reaches its exit
 * within the loop bound whatever this says.
 */
export const useVolumeRayUniforms = (
  nodes: VolumeRayUniformHandles | undefined,
  {
    pool,
    desiredLevel,
    planTargetLevel,
  }: {
    pool: LayerBrickPool | null;
    /** Usually `planTargetLevel`; a merged pass passes its group's level. */
    desiredLevel: number | undefined;
    planTargetLevel: number | undefined;
  },
): void => {
  const lodBias = useViewerStore((s) => s.lodBias);
  const pxPerVoxelAtUnitDistance = usePxPerVoxelAtUnitDistance();
  const invalidate = useThree((state) => state.invalidate);
  const viewerStoreApi = useViewerStoreApi();
  // Quality tier / streaming flips are rare (P17-clean); re-runs the push so
  // `uMaxSteps` tracks the governor's profile.
  const qualityVersion = useSyncExternalStore(
    qualityGovernor.subscribe,
    () => qualityGovernor.getVersion(),
  );

  const minDelta = useMemo(() => {
    if (!pool || planTargetLevel === undefined) return 1;
    const level = pool.geometry.levels[Math.min(planTargetLevel, pool.geometry.levels.length - 1)];
    // MAX spatial component — the axis rule of the planner/shader lockstep
    // (`wantFiner` / `desiredLevelAt`); identical on pyramids where x is the
    // max factor.
    return 0.5 * Math.max(level.scale[0], level.scale[1], level.scale[2]);
  }, [pool, planTargetLevel]);

  useEffect(() => {
    if (!nodes || desiredLevel === undefined) return;
    nodes.uDesiredLevel.value = desiredLevel;
    nodes.uLodBias.value = lodBias;
    nodes.uPxPerVoxelAtUnitDist.value = pxPerVoxelAtUnitDistance;
    nodes.uMinDelta.value = minDelta;
    // uMaxSteps is driven by `useStepScaleUniform` (adaptive depth flips it
    // per activity edge — a vanilla-subscription cadence, not an effect one).
    viewerStoreApi.getState().volumeInputs.bump("ray-uniforms");
    invalidate();
  }, [
    nodes,
    desiredLevel,
    lodBias,
    pxPerVoxelAtUnitDistance,
    minDelta,
    qualityVersion,
    invalidate,
    viewerStoreApi,
  ]);
};

/**
 * Count this component as one mounted full-screen volume raymarch pass while
 * `activePass` holds (a live raymarch material bundle — merge-group primaries
 * and label volume layers; non-primaries and 2D planes never pass true).
 * Feeds the governor's scene-load factor: total frame cost is linear in the
 * number of concurrent raymarch passes, and this is the feedforward signal
 * that lets the step budget and the DPR burst prediction scale with it.
 */
export const useVolumePassRegistration = (activePass: boolean): void => {
  useEffect(() => {
    if (!activePass) return;
    return qualityGovernor.registerVolumePass();
  }, [activePass]);
};

/**
 * `uStepScale` (and the tricubic gate `uSmoothThreshold`), driven IMPERATIVELY
 * off the camera-motion flag.
 *
 * `cameraMoving` is deliberately NOT a React subscription: it flips true on every
 * leading camera emission and false on every settle (~23 flips over a 10 s
 * orbit), and it feeds exactly ONE float. Subscribing re-rendered every volume
 * layer on each flip and re-ran the whole uniform effect, rebuilding pointer
 * handlers and re-diffing the group tree. This writes the uniforms directly and
 * requests a frame.
 *
 * Three governor inputs fold in here:
 *  - the SCENE-LOAD factor (`getLoadFactor`): step scales stretch by √(pass
 *    count) so total sample cost across N concurrent raymarch passes grows
 *    ~√N instead of N — the feedforward half of the many-layers fix;
 *  - ADAPTIVE DEPTH (`resolveMaxRaySteps`): the ray-step ceiling halves while
 *    the camera angle is changing (or bricks stream) — in the zoom+tilt worst
 *    case the ray always runs to the ceiling (the stride floor guarantees
 *    full-ray coverage), so the CEILING, not the step scale, is what bounds
 *    that cost; strides lengthen, nothing truncates, settle restores;
 *  - the tricubic gate (`resolveSmoothThreshold`): smoothing off while active
 *    and on TIER_LOW — zoom+tilt otherwise flips ~the whole step budget to
 *    8× taps exactly when the frame is already fragment-bound.
 */
export const useStepScaleUniform = (nodes: StepScaleUniformHandle | undefined): void => {
  const viewStoreApi = useViewStoreApi();
  const viewerStoreApi = useViewerStoreApi();
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!nodes) return;
    let lastStep: number | null = null;
    let lastMaxSteps: number | null = null;
    let lastSmooth: number | null = null;
    // Read once per effect, not per camera tick (localStorage): flipping the
    // flag rebuilds the material, which remounts this effect anyway.
    const smoothZoom = isSmoothZoomEnabled();
    const apply = () => {
      const profile = qualityGovernor.getProfile();
      const active =
        viewStoreApi.getState().cameraMoving || qualityGovernor.isStreaming();
      const step =
        (active ? profile.activeStepScale : profile.settledStepScale) *
        qualityGovernor.getLoadFactor();
      const maxSteps = resolveMaxRaySteps(
        profile,
        active,
        qualityGovernor.getVolumePassCount(),
      );
      const smooth = smoothZoom
        ? resolveSmoothThreshold(qualityGovernor.getTier(), active)
        : 0;
      if (step === lastStep && maxSteps === lastMaxSteps && smooth === lastSmooth) {
        return; // the flags flip far more often than the values
      }
      lastStep = step;
      lastMaxSteps = maxSteps;
      lastSmooth = smooth;
      nodes.uStepScale.value = step;
      nodes.uMaxSteps.value = maxSteps;
      if (nodes.uSmoothThreshold) nodes.uSmoothThreshold.value = smooth;
      // Value-deduped edge — exactly the cadence the volume compositor's
      // cache must re-render on (adaptive depth / tricubic / step changes).
      viewerStoreApi.getState().volumeInputs.bump("step-uniforms");
      invalidate();
    };
    apply();
    const unsubscribeView = viewStoreApi.subscribe(apply);
    const unsubscribeQuality = qualityGovernor.subscribe(apply);
    return () => {
      unsubscribeView();
      unsubscribeQuality();
    };
  }, [nodes, viewStoreApi, viewerStoreApi, invalidate]);
};
