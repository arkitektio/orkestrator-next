import { createStore } from "zustand/vanilla";
import { createScopedStoreHooks } from "./createScopedStore"
import { ZarrAccessGrantFragment } from "@/mikro-next/api/graphql";
import { TestNoiseZarrStore } from "../zarr/zarr_stores/noiseStore";
import { CachedFetchStore } from "../zarr/zarr_stores/fetchStore";
import { ZarrStore } from "../zarr/zarr_stores/type";
import { AwsClient } from "aws4fetch";
import { CachedS3Store } from "../zarr/zarr_stores/s3Store";
import { RefObject } from "react";
export type StoreBuilder = (fragment: ZarrAccessGrantFragment, datalayer: string, signal: AbortSignal) => Promise<ZarrStore>;
import * as THREE from 'three';

/** The subset of the R3F root state we need for camera operations */
export interface CanvasContext {
  camera: THREE.Camera;
  controls: { target: THREE.Vector3; update: () => void } | null;
  size: { width: number; height: number };
  invalidate: () => void;
}


interface TrackableObject {
  kind: "layer" | "gizmo" | "other";
  id: string;
  ref: RefObject<THREE.Object3D | undefined>;
}



interface ViewerState {
  // We store the combined projection + view matrix
  zStart: number | null;
  zEnd: number | null;
  tStart: Date | null;
  tEnd: Date | null;
  debug: boolean;
  storeBuilder: StoreBuilder;
  currentZ: number;
  frustumNear: number;
  frustumFar: number;
  canvas: CanvasContext | null;
  // We store the actual refs to perform math on them in the loop
  trackables: Set<TrackableObject>
  // We store strings (names/IDs) for the React UI to consume
  visibleLayers: string[]

  register: (ref: TrackableObject) => void
  unregister: (ref: TrackableObject) => void
  setVisible: (visibleSet: Set<string>) => void


  setZRange: (start: number | null, end: number | null) => void;
  setTRange: (start: Date | null, end: Date | null) => void;
  setDebug: (debug: boolean) => void;
  setCurrentZ: (z: number) => void;
  setFrustum: (near: number, far: number) => void;
  registerCanvas: (ctx: CanvasContext) => void;
  /** Fit the camera so that the given layer fills the viewport */
  fitToLayer: (layerId: string) => void;
}


export const localBuilder = async (fragment: ZarrAccessGrantFragment, datalayer: string, signal: AbortSignal) => {
  console.log("[BUILD] Using localBuilder with fragment:", fragment, datalayer);
  return new TestNoiseZarrStore(fragment);
}

export const fetchBuilder = async (fragment: ZarrAccessGrantFragment, datalayer: string, signal: AbortSignal) => {

  console.log("Using fetchBuilder with fragment:", fragment)

  return new CachedFetchStore(fragment.store.bucket);
}

export const s3Builder = async (fragment: ZarrAccessGrantFragment, datalayer: string, signal: AbortSignal) => {




  const aws = new AwsClient({
    accessKeyId: fragment.accessKey,
    secretAccessKey: fragment.secretKey,
    sessionToken: fragment.sessionToken,
    service: "s3",
  });

  const path = datalayer + "/" + fragment.bucket + "/" + fragment.key;
  console.log("Using s3Builder with path:", path);

  const store = new CachedS3Store(aws, path, {});
  return store;
}



export const createViewerStore = () =>
  createStore<ViewerState>((set, get) => ({
    zStart: 0,
    zEnd: 100,
    tStart: null,
    trackables: new Set(),
    visibleLayers: [],
     register: (ref) => set((state) => {
      state.trackables.add(ref);
      return state;
    }),
    unregister: (ref) => set((state) => {
      state.trackables.delete(ref);
      return state;
    }),
    setVisible: (visibleSet) => set((state) => {
      state.visibleLayers = Array.from(visibleSet.keys());
      return state;
    }),
    currentZ: 0,
    tEnd: null,
    debug: false,
    frustumNear: 0.1,
    frustumFar: 100000,
    canvas: null,
    storeBuilder: s3Builder, // Default to fetchBuilder, can be switched to localBuilder for testing
    setZRange: (start, end) => set({ zStart: start, zEnd: end }),
    setTRange: (start, end) => set({ tStart: start, tEnd: end }),
    setCurrentZ: (z) => set({ currentZ: z }),
    setFrustum: (near, far) => set({ frustumNear: near, frustumFar: far }),
    registerCanvas: (ctx) => set({ canvas: ctx }),
    fitToLayer: (layerId) => {
      const { trackables, canvas } = get();

      if (!canvas) throw new Error("Canvas context is not registered in viewer store");

      // Find the trackable matching this layer
      let target: THREE.Object3D | undefined;
      for (const t of trackables) {
        if (t.kind === "layer" && t.id === layerId && t.ref.current) {
          target = t.ref.current;
          break;
        }
      }
      if (!target) throw new Error(`Target for layer ${layerId} not found`);

      // Compute world-space bounding box
      const box = new THREE.Box3().setFromObject(target);
      if (box.isEmpty()) throw new Error(`Bounding box for layer ${layerId} is empty`);

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
    },
    setDebug: (debug) => set({ debug }),
  }));

const {
  StoreContext: ViewerStoreContext,
  useScopedStore: useViewerStore,
  useStoreApi: useViewerStoreApi,
} = createScopedStoreHooks<ViewerState>("ViewerStore");

export { ViewerStoreContext, useViewerStore, useViewerStoreApi };
