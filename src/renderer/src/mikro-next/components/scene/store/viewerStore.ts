import { createStore } from "zustand/vanilla";
import { createScopedStoreHooks } from "./createScopedStore"
import { GeneralZarrAccessGrant, MikroClient, SceneZarrStoreDescriptor, ZarrStore } from "../zarr/zarr_stores/type";
import { ConfiguredS3Store } from "../zarr/zarr_stores/s3Store";
import { RefObject } from "react";
import { open, type Array as ZarrArray, type DataType } from "zarrita";
export type StoreBuilder = (storeId: string, signal?: AbortSignal) => Promise<ZarrStore>;
import * as THREE from 'three';
import { RequestGeneralZarrAccessDocument, RequestGeneralZarrAccessMutation, RequestGeneralZarrAccessMutationVariables, SceneFragment } from "@/mikro-next/api/graphql";

type OpenedZarrArray = ZarrArray<DataType, ZarrStore>;

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

export interface LayerViewRange {
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number] | null;
  /** Screen pixels per image pixel (how many viewer pixels one voxel occupies) */
  scale: number;
}


interface ViewerState {
  // We store the combined projection + view matrix
  zStart: number | null;
  zEnd: number | null;
  tStart: Date | null;
  tEnd: Date | null;
  debug: boolean;
  showScaleBar: boolean;
  showScaleGrid: boolean;
  worldUnitsPerPixel: number;
  storeBuilder: StoreBuilder;
  getArray: (store: ZarrStore) => Promise<OpenedZarrArray>;
  currentZ: number;
  frustumNear: number;
  frustumFar: number;
  canvas: CanvasContext | null;
  // We store the actual refs to perform math on them in the loop
  trackables: Set<TrackableObject>
  // We store strings (names/IDs) for the React UI to consume
  visibleLayers: string[]
  // Visible image-coordinate ranges per layer
  layerViewRanges: Record<string, LayerViewRange>

  lodBias: number;
  cullRadius: number;
  setCullRadius: (radius: number) => void;
  setLodBias: (bias: number) => void;
  renderedChunks: Record<string, { layerId: string; chunkKey: string; level: number; status: 'loading' | 'rendered' }>;
  setChunkStatus: (chunkId: string, info: { layerId: string; chunkKey: string; level: number; status: 'loading' | 'rendered' } | null) => void;
  lodDebugInfo: Record<string, { currentLOD: number; targetResolution: number; renderedLevels?: number[] }>;
  setLodDebugInfo: (layerId: string, info: { currentLOD: number; targetResolution: number; renderedLevels?: number[] }) => void;

  register: (ref: TrackableObject) => void
  unregister: (ref: TrackableObject) => void
  setVisible: (visibleSet: Set<string>) => void
  setLayerViewRanges: (ranges: Record<string, LayerViewRange>) => void


  setZRange: (start: number | null, end: number | null) => void;
  setTRange: (start: Date | null, end: Date | null) => void;
  setDebug: (debug: boolean) => void;
  setShowScaleBar: (show: boolean) => void;
  setShowScaleGrid: (show: boolean) => void;
  setWorldUnitsPerPixel: (v: number) => void;
  setCurrentZ: (z: number) => void;
  setFrustum: (near: number, far: number) => void;
  registerCanvas: (ctx: CanvasContext) => void;
  /** Fit the camera so that the given layer fills the viewport */
  fitToLayer: (layerId: string) => void;
}


function collectSceneStoreDescriptors(scene: SceneFragment): Map<string, SceneZarrStoreDescriptor> {
  const descriptors = new Map<string, SceneZarrStoreDescriptor>();

  for (const layer of scene.layers) {
    for (const dataArray of layer.lens.dataset.dataArrays) {
      descriptors.set(dataArray.store.id, {
        bucket: dataArray.store.bucket,
        key: dataArray.store.key,
        path: dataArray.store.path,
        storeId: dataArray.store.id,
      });
    }
  }

  return descriptors;
}

async function requestGeneralAccess(client: MikroClient): Promise<GeneralZarrAccessGrant> {
  const access = await client.mutate<RequestGeneralZarrAccessMutation, RequestGeneralZarrAccessMutationVariables>({
    mutation: RequestGeneralZarrAccessDocument,
    variables: { input: {} },
  });

  const credentials = access.data?.requestGeneralZarrAccess;
  if (!credentials) {
    throw new Error("Failed to obtain general Zarr access credentials");
  }

  return credentials;
}

export const createS3Builder = (scene: SceneFragment, client: MikroClient, datalayer: string): StoreBuilder => {
  const descriptors = collectSceneStoreDescriptors(scene);
  const storeMapPromise = (async () => {
    const credentials = await requestGeneralAccess(client);
    const expiresAt = Date.now() + credentials.expiresIn * 1000;

    const stores = await Promise.all(
      Array.from(descriptors.values()).map(async (descriptor) => {
        const store = new ConfiguredS3Store(
          {
            accessKey: credentials.accessKey,
            baseUrl: `${datalayer.replace(/\/$/, "")}/${credentials.bucket}/${descriptor.key}`,
            expiresAt,
            region: credentials.region,
            secretKey: credentials.secretKey,
            sessionToken: credentials.sessionToken,
            storeId: descriptor.storeId,
          },
          { preloadMetadata: true },
        );
        await store.ready();
        return [descriptor.storeId, store] as const;
      }),
    );

    return new Map(stores);
  })();

  return async (storeId: string, _signal?: AbortSignal) => {
    const stores = await storeMapPromise;
    const store = stores.get(storeId);

    if (!store) {
      throw new Error(`No preconfigured Zarr store found for ${storeId}`);
    }

    return store;
  };
};



export const createViewerStore = (storeBuilder: StoreBuilder) =>
  {
    const openedArrayPromises = new WeakMap<object, Promise<OpenedZarrArray>>();

    return createStore<ViewerState>((set, get) => ({
    zStart: 0,
    zEnd: 100,
    tStart: null,
    trackables: new Set(),
    visibleLayers: [],
    layerViewRanges: {},
    lodBias: 0.2,
    cullRadius: 4000,
    setCullRadius: (radius) => set({ cullRadius: radius }),
    setLodBias: (bias) => set({ lodBias: bias }),
    renderedChunks: {},
    setChunkStatus: (chunkId, info) => set((state) => {
      const next = { ...state.renderedChunks };
      if (!info) {
        delete next[chunkId];
      } else {
        next[chunkId] = info;
      }
      return { renderedChunks: next };
    }),
    lodDebugInfo: {},
    setLodDebugInfo: (layerId, info) => set((state) => ({ lodDebugInfo: { ...state.lodDebugInfo, [layerId]: info } })),
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
    setLayerViewRanges: (ranges) => set({ layerViewRanges: ranges }),
    currentZ: 0,
    tEnd: null,
    debug: false,
    showScaleBar: true,
    showScaleGrid: false,
    worldUnitsPerPixel: 1,
    frustumNear: 0.1,
    frustumFar: 100000,
    canvas: null,
    storeBuilder: storeBuilder,
    getArray: (store) => {
      const key = store as object;
      const cached = openedArrayPromises.get(key);
      if (cached) {
        return cached;
      }

      const opened = open.v3(store, { kind: "array" }) as Promise<OpenedZarrArray>;
      openedArrayPromises.set(key, opened);
      opened.catch(() => {
        if (openedArrayPromises.get(key) === opened) {
          openedArrayPromises.delete(key);
        }
      });
      return opened;
    },
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
    setShowScaleBar: (show) => set({ showScaleBar: show }),
    setShowScaleGrid: (show) => set({ showScaleGrid: show }),
    setWorldUnitsPerPixel: (v) => set({ worldUnitsPerPixel: v }),
  }));
};

const {
  StoreContext: ViewerStoreContext,
  useScopedStore: useViewerStore,
  useStoreApi: useViewerStoreApi,
} = createScopedStoreHooks<ViewerState>("ViewerStore");

export { ViewerStoreContext, useViewerStore, useViewerStoreApi };
