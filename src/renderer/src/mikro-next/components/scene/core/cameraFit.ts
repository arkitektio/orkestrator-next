import * as THREE from "three";
import { computeFitPose } from "./sceneFit";

/**
 * The camera/controls surface `fitCameraToObject` needs. Structurally matches
 * `viewerStore`'s `CanvasContext`. Extracted here so the THREE camera-fitting
 * math lives outside the store (the store action just looks up the target and
 * delegates).
 */
export type FitCanvasContext = {
  camera: THREE.Camera;
  controls: { target: THREE.Vector3; update: () => void } | null;
  size: { width: number; height: number };
  invalidate: () => void;
};

/**
 * Apply a `computeFitPose` result to a live camera + controls. Shared by the
 * post-mount object fit below and the pre-first-render initial fit
 * (`cameras/InitialCameraFit.tsx`).
 */
export function applyFitToCamera(box: THREE.Box3, canvas: FitCanvasContext): void {
  const { camera, controls, size, invalidate } = canvas;

  if ((camera as THREE.OrthographicCamera).isOrthographicCamera) {
    const ortho = camera as THREE.OrthographicCamera;
    const pose = computeFitPose(box, {
      kind: "orthographic",
      viewport: size,
      cameraZ: ortho.position.z,
    });
    ortho.position.copy(pose.position);
    ortho.zoom = pose.zoom!;
    ortho.updateProjectionMatrix();
    if (controls) {
      controls.target.copy(pose.target);
      controls.update();
    }
  } else {
    const persp = camera as THREE.PerspectiveCamera;
    const center = box.getCenter(new THREE.Vector3());
    const pose = computeFitPose(box, {
      kind: "perspective",
      fov: persp.fov,
      // Preserve the current viewing angle; only the distance changes.
      viewDirection: camera.position.clone().sub(center),
    });
    camera.position.copy(pose.position);
    camera.lookAt(pose.target);
    if (controls) {
      controls.target.copy(pose.target);
      controls.update();
    }
  }
  invalidate();
}

/** Frame `target`'s world-space bounding box in the canvas camera (ortho or perspective). */
export function fitCameraToObject(target: THREE.Object3D, canvas: FitCanvasContext): void {
  const box = new THREE.Box3().setFromObject(target);
  if (box.isEmpty()) throw new Error("Bounding box for fit target is empty");
  applyFitToCamera(box, canvas);
}
