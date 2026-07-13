import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo } from "react";
import * as THREE from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

import { useDatalayerEndpoint } from "@/app/Arkitekt";
import {
  SceneLayerFragment,
  useRequestGeneralParquetAccessMutation,
  useRequestParquetAccessMutation,
} from "@/mikro-next/api/graphql";

import type { LayerState, SceneTransformContext } from "../../core/layerModel";
import { buildVolumeVoxelToWorld } from "../../core/octree/voxelFrame";
import {
  collectDatasetEdges,
  composeCsToWorld,
} from "../../core/transformGraph";
import { affineToMatrix4 } from "../../core/worldTransform";
import { useSceneStore } from "../../store/sceneStore";
import { useViewerStore } from "../../store/viewerStore";
import { useViewStoreApi } from "../../store/viewStore";
import { MeshCollectionManager } from "./meshManager";
import { MeshParquetSource } from "./meshParquet";
import { parseMeshEncoding, parseMeshGrid } from "./meshSpec";

/**
 * MeshLayer renderer: a versioned, coordinate-system-anchored MeshCollection
 * streamed from Parquet. The React layer here owns only lifecycle and wiring;
 * planning/streaming/three-object churn live in `MeshCollectionManager`
 * (imperative, camera-settle cadence — no React re-render per batch, P17),
 * SQL/grants in `MeshParquetSource`, and the byte contract in `meshDecode`.
 */

type MeshLayerVariant = Extract<SceneLayerFragment, { __typename: "MeshLayer" }>;
type MeshCollectionRef = NonNullable<MeshLayerVariant["collection"]>;

export const MeshCollectionLayer = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) =>
    s.sceneLayers.find((candidate) => candidate.id === layerId),
  );
  if (!layer || layer.__typename !== "MeshLayer") return null;
  if (!layer.collection || layer.visible === false) return null;
  return <MeshCollectionGroup layer={layer} collection={layer.collection} />;
};

/**
 * The collection's voxel→scene matrix. Preferred path: an image layer in the
 * scene whose pyramid contains the collection's coordinate system (the labels
 * layer the meshes were extracted from) — reusing ITS frame reproduces the
 * image path's centering/y-flip convention exactly, so meshes and labels
 * overlap by construction. Fallback: compose through the transform graph
 * (correct in world µm, but uncentered relative to image layers — the shared
 * scene-frame normalization is the tracked follow-up).
 */
const resolveCollectionMatrix = (
  collection: MeshCollectionRef,
  imageLayers: readonly LayerState[],
  transformContext: SceneTransformContext,
): THREE.Matrix4 => {
  const csId = collection.coordinateSystem.id;
  const anchorLayer = imageLayers.find(
    (layer) =>
      layer.lens.coordinateSystem?.id === csId ||
      layer.lens.dataset.coordinateSystem?.id === csId ||
      layer.lens.dataset.dataArrays.some(
        (dataArray) => dataArray.coordinateSystem?.id === csId,
      ),
  );
  if (anchorLayer) return buildVolumeVoxelToWorld(anchorLayer);

  const axes = collection.coordinateSystem.axes ?? [];
  const names = axes.map((axis) => axis.name);
  const spatial = [names[names.length - 1], names[names.length - 2], names[names.length - 3]];
  const composed = composeCsToWorld(
    transformContext,
    csId,
    spatial,
    collectDatasetEdges(imageLayers),
  );
  console.warn(
    `[mesh] collection ${collection.id}: no image layer shares CS ${csId}; ` +
      `rendering in the composed world frame (uncentered relative to image layers)`,
  );
  return affineToMatrix4(composed);
};

const MeshCollectionGroup = ({
  layer,
  collection,
}: {
  layer: MeshLayerVariant;
  collection: MeshCollectionRef;
}) => {
  const invalidate = useThree((state) => state.invalidate);
  const imageLayers = useSceneStore((s) => s.layers);
  const transformContext = useSceneStore((s) => s.transformContext);
  const lodBias = useViewerStore((s) => s.lodBias);
  const viewApi = useViewStoreApi();
  const datalayer = useDatalayerEndpoint();
  const [requestParquetAccess] = useRequestParquetAccessMutation();
  const [requestGeneralParquetAccess] = useRequestGeneralParquetAccessMutation();

  const grid = useMemo(() => parseMeshGrid(collection.grid), [collection.grid]);
  const encoding = useMemo(() => parseMeshEncoding(collection.encoding), [collection.encoding]);

  const requestGrant = useCallback(
    async (storeId: string) => {
      const response = await requestParquetAccess({ variables: { input: { storeId } } });
      const grant = response.data?.requestParquetAccess;
      if (!grant) throw new Error(`no parquet access grant for store ${storeId}`);
      return grant;
    },
    [requestParquetAccess],
  );
  const requestRegion = useCallback(async () => {
    const response = await requestGeneralParquetAccess({ variables: { input: {} } });
    const grant = response.data?.requestGeneralParquetAccess;
    if (!grant) throw new Error("no general parquet access grant");
    return grant.region;
  }, [requestGeneralParquetAccess]);

  // Collections are immutable per version — source & manager live exactly as
  // long as (collection version, grid/encoding contract).
  const manager = useMemo(() => {
    if (!grid) return null;
    const source = new MeshParquetSource(collection.geometry, {
      requestGrant,
      requestRegion,
      datalayerEndpoint: datalayer,
    });
    return new MeshCollectionManager({
      grid,
      encoding,
      source,
      loadDecoder: async () => {
        await MeshoptDecoder.ready;
        return MeshoptDecoder;
      },
      onInvalidate: invalidate,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection.id, collection.version, grid, encoding]);

  useEffect(() => () => manager?.dispose(), [manager]);

  useEffect(() => {
    manager?.setMaterialConfig({
      color: layer.materialColor,
      wireframe: layer.wireframe,
      opacity: layer.opacity,
    });
    invalidate();
  }, [manager, layer.materialColor, layer.wireframe, layer.opacity, invalidate]);

  const matrix = useMemo(
    () => resolveCollectionMatrix(collection, imageLayers, transformContext),
    [collection, imageLayers, transformContext],
  );
  useEffect(() => {
    if (!manager) return;
    manager.group.matrix.copy(matrix);
    manager.group.matrixWorldNeedsUpdate = true;
    invalidate();
  }, [manager, matrix, invalidate]);

  // Planning cadence: once the cell index is in, plan on mount and on every
  // camera SETTLE (never per camera tick — same discipline as the brick
  // planner's debounce, but meshes don't even need the moving emissions).
  useEffect(() => {
    if (!manager) return;
    let disposed = false;

    const plan = () => {
      if (disposed) return;
      const { viewProjectionMatrix, viewportSize, cameraPose } = viewApi.getState();
      if (!viewProjectionMatrix) return;
      const voxelToWorld = manager.group.matrix;
      const voxelFrustum = new THREE.Frustum().setFromProjectionMatrix(
        viewProjectionMatrix.clone().multiply(voxelToWorld),
      );
      let cameraVoxelPos: [number, number, number] | null = null;
      let pxPerVoxelAtUnitDistance = 0;
      if (cameraPose?.isPerspective && cameraPose.fovY > 0) {
        const p = new THREE.Vector3(...cameraPose.position).applyMatrix4(
          voxelToWorld.clone().invert(),
        );
        cameraVoxelPos = [p.x, p.y, p.z];
        // px an object of 1 world unit subtends at world distance 1; distances
        // are measured in voxel space, where the scale cancels (uniform-scale
        // approximation, same as the brick planner's).
        pxPerVoxelAtUnitDistance = viewportSize.height / (2 * Math.tan(cameraPose.fovY / 2));
      }
      manager.updatePlan({ voxelFrustum, cameraVoxelPos, pxPerVoxelAtUnitDistance, lodBias });
    };

    manager
      .ensureIndex()
      .then(plan)
      .catch((error) => console.error("[mesh] failed to load cell index:", error));

    const unsubscribe = viewApi.subscribe((state, prev) => {
      if (prev.cameraMoving && !state.cameraMoving) plan();
    });
    return () => {
      disposed = true;
      unsubscribe();
    };
  }, [manager, viewApi, lodBias, matrix]);

  if (!manager) return null;
  return <primitive object={manager.group} />;
};
