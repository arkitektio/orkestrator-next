import * as THREE from "three";

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

/** Frame `target`'s world-space bounding box in the canvas camera (ortho or perspective). */
export function fitCameraToObject(target: THREE.Object3D, canvas: FitCanvasContext): void {
  const box = new THREE.Box3().setFromObject(target);
  if (box.isEmpty()) throw new Error("Bounding box for fit target is empty");

  const center = box.getCenter(new THREE.Vector3());
  const boxSize = box.getSize(new THREE.Vector3());
  const { camera, controls, size, invalidate } = canvas;

  if ((camera as THREE.OrthographicCamera).isOrthographicCamera) {
    const ortho = camera as THREE.OrthographicCamera;
    const padding = 1.1;
    const zoomX = size.width / (boxSize.x * padding);
    const zoomY = size.height / (boxSize.y * padding);
    ortho.position.set(center.x, center.y, ortho.position.z);
    ortho.zoom = Math.min(zoomX, zoomY);
    ortho.updateProjectionMatrix();
    if (controls) {
      controls.target.set(center.x, center.y, 0);
      controls.update();
    }
  } else {
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const fov = (camera as THREE.PerspectiveCamera).fov;
    const halfFovRad = THREE.MathUtils.degToRad(fov / 2);
    const distance = (sphere.radius / Math.sin(halfFovRad)) * 1.3;
    const direction = camera.position.clone().sub(center).normalize();
    camera.position.copy(center.clone().add(direction.multiplyScalar(distance)));
    camera.lookAt(center);
    if (controls) {
      controls.target.copy(center);
      controls.update();
    }
  }
  invalidate();
}
