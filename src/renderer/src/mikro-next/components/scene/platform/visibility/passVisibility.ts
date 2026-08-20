import type * as THREE from "three";

/**
 * Partitioning the scene for the volume compositor's two-pass frame.
 *
 * The compositor renders tagged volume raymarch meshes into an offscreen
 * target, then the rest of the scene (plus a composite quad) to the canvas.
 * There is no `THREE.Layers` usage in this codebase and introducing camera
 * layers would entangle the raycast/probe contract, so partitioning follows
 * the `captureVisibility` precedent instead: transient `visible` toggling
 * with exact restore, applied inside the frame callback where neither React
 * nor R3F's event raycasts can observe it.
 *
 * Toggling happens on LEAF renderables only (meshes/lines/points/sprites) —
 * never on groups — so ancestors keep rendering the leaves that stay in the
 * pass. An object already invisible for its own reasons is left alone and
 * restored to nothing.
 */

/** `userData` key tagging a mesh as volume-pass content (the raymarch box
 * proxies). Set where the meshes are declared, read by `collectPassSets`. */
export const VOLUME_PASS_OBJECT = "volumePassObject";

/** `userData` key for objects the compositor itself owns (the composite
 * quad): excluded from every pass set — the compositor drives their
 * visibility directly. */
export const COMPOSITOR_INTERNAL = "volumeCompositorInternal";

export type PassSets = {
  /** Visible tagged raymarch meshes — the offscreen pass's content. */
  volumeMeshes: THREE.Mesh[];
  /** Visible opaque depth-writing leaves (fabriks meshes, depth-tested
   * lines) — the depth-only prepass set that preserves mesh-over-volume
   * occlusion inside the offscreen target. */
  occluders: THREE.Object3D[];
  /** Every other visible leaf renderable — hidden during the offscreen
   * pass, rendered normally in the canvas pass. */
  otherRenderables: THREE.Object3D[];
};

type LeafRenderable = THREE.Object3D & {
  isMesh?: boolean;
  isLine?: boolean;
  isPoints?: boolean;
  isSprite?: boolean;
  material?: THREE.Material | THREE.Material[];
};

const isLeafRenderable = (object: LeafRenderable): boolean =>
  object.isMesh === true ||
  object.isLine === true ||
  object.isPoints === true ||
  object.isSprite === true;

const isOpaqueDepthWriter = (object: LeafRenderable): boolean => {
  // MESHES only: lines/points/sprites also write depth, but running the
  // prepass override material over non-triangle topology is exactly the kind
  // of node-path edge that fails silently on WebGPU — and thin line
  // furniture occluding a volume is visually negligible.
  if (object.isMesh !== true) return false;
  const material = object.material;
  if (!material) return false;
  const materials = Array.isArray(material) ? material : [material];
  return (
    materials.length > 0 &&
    materials.every((m) => m.depthWrite === true && m.transparent === false && m.visible !== false)
  );
};

/**
 * One traversal classifying every VISIBLE leaf renderable under `root`.
 * Leaves pruned by an invisible ancestor still classify (they render in
 * neither pass either way); compositor-internal objects classify nowhere.
 */
export const collectPassSets = (root: THREE.Object3D): PassSets => {
  const volumeMeshes: THREE.Mesh[] = [];
  const occluders: THREE.Object3D[] = [];
  const otherRenderables: THREE.Object3D[] = [];
  root.traverse((object) => {
    if (!object.visible) return;
    if (object.userData?.[COMPOSITOR_INTERNAL] === true) return;
    if (!isLeafRenderable(object as LeafRenderable)) return;
    if (object.userData?.[VOLUME_PASS_OBJECT] === true) {
      volumeMeshes.push(object as THREE.Mesh);
    } else if (isOpaqueDepthWriter(object as LeafRenderable)) {
      occluders.push(object);
    } else {
      otherRenderables.push(object);
    }
  });
  return { volumeMeshes, occluders, otherRenderables };
};

/**
 * Hide the given objects and return a function restoring visibility exactly:
 * only objects this call actually hid are re-shown. The caller must invoke
 * the restore fn in a `finally` — a pass that throws mid-render must not
 * leave the live scene missing content (`hideExcludedFromCapture` contract).
 */
export const hideObjects = (objects: readonly THREE.Object3D[]): (() => void) => {
  const hidden: THREE.Object3D[] = [];
  for (const object of objects) {
    if (object.visible) {
      object.visible = false;
      hidden.push(object);
    }
  }
  return () => {
    for (const object of hidden) object.visible = true;
  };
};

/**
 * Turn off color writes on every material of the given objects and return a
 * function restoring the previous flags exactly (shared materials are
 * touched once). This is how the volume compositor's depth prepass renders
 * occluders: with their OWN materials — depth from the real shader, so
 * BatchedMesh multi-draw ranges, displacement etc. stay correct —
 * `scene.overrideMaterial` with a plain material corrupted BatchedMesh
 * draws (out-of-range DrawIndexed). Same `finally`-restore contract as
 * `hideObjects`.
 */
export const disableColorWrite = (
  objects: readonly THREE.Object3D[],
): (() => void) => {
  const touched = new Map<THREE.Material, boolean>();
  for (const object of objects) {
    const material = (object as LeafRenderable).material;
    if (!material) continue;
    const materials = Array.isArray(material) ? material : [material];
    for (const m of materials) {
      if (!touched.has(m)) {
        touched.set(m, m.colorWrite);
        m.colorWrite = false;
      }
    }
  }
  return () => {
    for (const [m, colorWrite] of touched) m.colorWrite = colorWrite;
  };
};
