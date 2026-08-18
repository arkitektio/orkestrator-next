/* eslint-disable react-hooks/immutability --
 * Driving TSL UNIFORM NODES is this module's whole job, and a uniform node is a
 * deliberately mutable handle into an already-compiled shader graph — writing
 * `.value` is how a frame's data reaches the GPU without rebuilding the
 * material. The rule reads that as mutating a hook argument; treating these as
 * React state instead would mean recompiling the shader on every camera move,
 * which is exactly what the uniform-push contract exists to avoid. */
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useSyncExternalStore } from "react";

import { qualityGovernor } from "../../core/qualityGovernor";
import type { LayerBrickPool } from "../../managers/brickResidency";
import { useViewStore, useViewStoreApi } from "../../store/viewStore";
import { useViewerStore } from "../../store/viewerStore";

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
  uMaxSteps: { value: number };
};

/** The handle `useStepScaleUniform` drives. Separate: it is imperative. */
export type StepScaleUniformHandle = { uStepScale: { value: number } };

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
  // Quality tier / streaming flips are rare (P17-clean); re-runs the push so
  // `uMaxSteps` tracks the governor's profile.
  const qualityVersion = useSyncExternalStore(
    qualityGovernor.subscribe,
    () => qualityGovernor.getVersion(),
  );

  const minDelta = useMemo(() => {
    if (!pool || planTargetLevel === undefined) return 1;
    const level = pool.geometry.levels[Math.min(planTargetLevel, pool.geometry.levels.length - 1)];
    return 0.5 * level.scale[0];
  }, [pool, planTargetLevel]);

  useEffect(() => {
    if (!nodes || desiredLevel === undefined) return;
    nodes.uDesiredLevel.value = desiredLevel;
    nodes.uLodBias.value = lodBias;
    nodes.uPxPerVoxelAtUnitDist.value = pxPerVoxelAtUnitDistance;
    nodes.uMinDelta.value = minDelta;
    nodes.uMaxSteps.value = qualityGovernor.getProfile().maxRaySteps;
    invalidate();
  }, [
    nodes,
    desiredLevel,
    lodBias,
    pxPerVoxelAtUnitDistance,
    minDelta,
    qualityVersion,
    invalidate,
  ]);
};

/**
 * `uStepScale`, driven IMPERATIVELY off the camera-motion flag.
 *
 * `cameraMoving` is deliberately NOT a React subscription: it flips true on every
 * leading camera emission and false on every settle (~23 flips over a 10 s
 * orbit), and it feeds exactly ONE float. Subscribing re-rendered every volume
 * layer on each flip and re-ran the whole uniform effect, rebuilding pointer
 * handlers and re-diffing the group tree. This writes the uniform directly and
 * requests a frame.
 */
export const useStepScaleUniform = (nodes: StepScaleUniformHandle | undefined): void => {
  const viewStoreApi = useViewStoreApi();
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
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
    const unsubscribeView = viewStoreApi.subscribe(apply);
    const unsubscribeQuality = qualityGovernor.subscribe(apply);
    return () => {
      unsubscribeView();
      unsubscribeQuality();
    };
  }, [nodes, viewStoreApi, invalidate]);
};
