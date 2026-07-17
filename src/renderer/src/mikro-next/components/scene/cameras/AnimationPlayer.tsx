import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type * as THREE from "three";

import { sampleTour } from "../core/animation";
import { applyCameraState, readDimSelections, readSceneZ } from "../core/cameraState";
import { useAnimationStore, useAnimationStoreApi } from "../store/animationStore";
import { useModeStoreApi } from "../store/modeStore";
import { useViewerStoreApi } from "../store/viewerStore";

type TargetControls = { target: THREE.Vector3; update: () => void };

/**
 * Drives the camera along the playing tour.
 *
 * The only thing in the scene that turns a sampled pose into motion — all the
 * timing and interpolation is pure, in `core/animation.ts`. Store reads go
 * through the non-reactive `…StoreApi` escape hatch because this runs in a
 * `useFrame`: subscribing to `elapsedMs` would re-render the React tree at
 * frame rate (P17).
 *
 * Must be mounted inside the Canvas, after `<CameraController/>`.
 */
export const AnimationPlayer = () => {
  const playingId = useAnimationStore((s) => s.playingId);
  const animationApi = useAnimationStoreApi();
  const modeApi = useModeStoreApi();
  const viewerApi = useViewerStoreApi();
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  // The Canvas is `frameloop="demand"`: with a settled camera nothing asks for
  // a frame, so without this kick the tour would never take its first step and
  // `useFrame` would never run to ask for the next one.
  useEffect(() => {
    if (playingId) invalidate();
  }, [playingId, invalidate]);

  useFrame((_, delta) => {
    const state = animationApi.getState();
    if (!state.playingId) return;
    const animation = state.animations.find((a) => a.id === state.playingId);
    if (!animation) return;

    // Read the clock back after advancing: `advance` clamps to the tour's end
    // (and clears `playingId`), so this settles exactly on the final pose
    // instead of wherever the last frame's delta overshot to.
    state.advance(delta * 1000);
    const pose = sampleTour(animation.waypoints, animationApi.getState().elapsedMs);
    if (!pose) return;

    const displayMode = modeApi.getState().displayMode;
    const targetControls =
      controls && "target" in controls ? (controls as unknown as TargetControls) : null;

    applyCameraState(
      pose,
      { camera, controls: targetControls, size: { width: size.width, height: size.height } },
      displayMode,
      state.frame,
    );

    const viewer = viewerApi.getState();
    // In 2D the pose's z is the slice, not the target (see core/cameraState.ts).
    const sliceZ = readSceneZ(pose, state.frame.axes);
    if (displayMode === "2D" && sliceZ !== null) viewer.setCurrentZ(sliceZ);
    for (const [dim, index] of Object.entries(readDimSelections(pose, state.frame.axes))) {
      viewer.setDimSelection(dim, index);
    }

    // Keep the demand loop turning for the next step.
    if (animationApi.getState().playingId) invalidate();
  });

  return null;
};
