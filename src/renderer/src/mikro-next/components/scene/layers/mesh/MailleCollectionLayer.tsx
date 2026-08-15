import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import { SceneLayerFragment } from "@/mikro-next/api/graphql";

import type { LayerState, SceneTransformContext } from "../../core/layerModel";
import { buildVolumeVoxelToWorld } from "../../core/octree/voxelFrame";
import { composePlacementPath } from "@/mikro-next/lib/coords/transformGraph";
import { affineToMatrix4 } from "../../core/worldTransform";
import { useSceneStore } from "../../store/sceneStore";
import { useViewStoreApi } from "../../store/viewStore";
import { MailleCollection } from "../../render/maille/mailleCollection";
import { MailleCollectionManager } from "../../render/maille/mailleManager";
import { mailleAxisOrder, openMailleCollection } from "../../render/maille/mailleSource";

/**
 * MeshLayer renderer: a maille collection — a self-describing prefix of
 * Parquet files — streamed by row group and anchored to a coordinate system in
 * the scene's transform graph.
 *
 * The React layer owns only lifecycle, transform resolution and the settle
 * cadence. Planning and streaming live in `MailleCollectionManager`
 * (imperative — no React re-render per batch, OCTREE_RENDERER.md P17), the
 * read plan in `MailleCollection`, and the byte contract in `mailleDecode`.
 */

type MeshLayerVariant = Extract<SceneLayerFragment, { __typename: "MeshLayer" }>;
type MeshCollectionRef = NonNullable<MeshLayerVariant["collection"]>;

export const MailleCollectionLayer = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) =>
    s.sceneLayers.find((candidate) => candidate.id === layerId),
  );
  if (!layer || layer.__typename !== "MeshLayer") return null;
  if (!layer.collection || layer.visible === false) return null;
  return <MailleCollectionGroup layer={layer} collection={layer.collection} />;
};

/**
 * The collection's voxel→world matrix. Preferred path: an image layer whose
 * pyramid contains the collection's coordinate system (the labels layer the
 * meshes were extracted from) — reusing ITS frame reproduces the image path's
 * centering/y-flip exactly, so meshes and labels overlap by construction.
 * Fallback: compose the layer's own server-resolved `pathToWorld`.
 *
 * **Axis slots.** maille addresses vertex components by POSITION and says
 * nothing about which physical axis a slot is, so a collection cut from
 * (z, y, x) data is entirely consistent — and would render transposed if we
 * assumed the coordinate system's own axis order. `MailleStore.axes` states
 * the mapping, and it is the only trustworthy source for it; the last-three
 * convention is the fallback for a store that does not.
 */
const resolveCollectionMatrix = (
  layer: MeshLayerVariant,
  collection: MeshCollectionRef,
  imageLayers: readonly LayerState[],
  transformContext: SceneTransformContext,
): THREE.Matrix4 => {
  const csId = collection.coordinateSystem.id;
  const anchorLayer = imageLayers.find(
    (imageLayer) =>
      imageLayer.lens.coordinateSystem?.id === csId ||
      imageLayer.lens.dataset.intrinsicSystem?.id === csId ||
      imageLayer.lens.dataset.dataArrays.some(
        (dataArray) => dataArray.coordinateSystem?.id === csId,
      ),
  );
  if (anchorLayer) return buildVolumeVoxelToWorld(anchorLayer);

  const axes = collection.coordinateSystem.axes ?? [];
  const names = axes.map((axis) => axis.name);
  // Components are slots: slot 0 is the vertex's first component, which is the
  // matrix's x. The store names them in that order when it can.
  const declared = mailleAxisOrder(collection.store);
  const spatial = declared
    ? [declared[0], declared[1], declared[2]]
    : [names[names.length - 1], names[names.length - 2], names[names.length - 3]];
  if (!declared) {
    console.warn(
      `[maille] store ${collection.store.id} declares no axis order; assuming the coordinate ` +
        `system's last three axes map to vertex components 0, 1, 2. A collection written in a ` +
        `different component order will render transposed.`,
    );
  }
  const composed = composePlacementPath(layer.pathToWorld, transformContext, spatial, names);
  console.warn(
    `[maille] collection ${collection.id}: no image layer shares CS ${csId}; ` +
      `rendering via the layer's pathToWorld (uncentered relative to image layers)`,
  );
  return affineToMatrix4(composed);
};

const MailleCollectionGroup = ({
  layer,
  collection,
}: {
  layer: MeshLayerVariant;
  collection: MeshCollectionRef;
}) => {
  const invalidate = useThree((state) => state.invalidate);
  const imageLayers = useSceneStore((s) => s.layers);
  const transformContext = useSceneStore((s) => s.transformContext);
  const viewApi = useViewStoreApi();
  const datalayer = useDatalayerEndpoint();
  const client = useMikro();

  const matrix = useMemo(
    () => resolveCollectionMatrix(layer, collection, imageLayers, transformContext),
    [layer, collection, imageLayers, transformContext],
  );

  // Opening reads maille.json and nothing else; the catalogs come with the
  // first plan. Collections are immutable per version, so the open survives as
  // long as (collection, version).
  const [opened, setOpened] = useState<MailleCollection | null>(null);
  useEffect(() => {
    if (!datalayer) return; // no endpoint configured: nothing to read from
    let cancelled = false;
    openMailleCollection(collection, client, datalayer)
      .then((next) => {
        if (!cancelled) setOpened(next);
      })
      .catch((error) => console.error(`[maille] cannot open collection ${collection.id}:`, error));
    return () => {
      cancelled = true;
    };
  }, [collection, client, datalayer]);

  const manager = useMemo(() => {
    if (!opened) return null;
    return new MailleCollectionManager({
      collection: opened,
      voxelToWorld: matrix,
      loadDecoder: async () => {
        await MeshoptDecoder.ready;
        return MeshoptDecoder;
      },
      onInvalidate: invalidate,
    });
    // The world-space cell index is built from `matrix`, so a placement change
    // rebuilds the manager rather than silently planning against stale boxes.
  }, [opened, matrix, invalidate]);

  useEffect(() => () => manager?.dispose(), [manager]);

  useEffect(() => {
    manager?.setMaterialConfig({
      color: layer.materialColor,
      wireframe: layer.wireframe,
      opacity: layer.opacity,
    });
    invalidate();
  }, [manager, layer.materialColor, layer.wireframe, layer.opacity, invalidate]);

  useEffect(() => {
    if (!manager) return;
    manager.group.matrix.copy(matrix);
    manager.group.matrixWorldNeedsUpdate = true;
    invalidate();
  }, [manager, matrix, invalidate]);

  // Planning cadence: once the cell index is in, plan on mount and on every
  // camera SETTLE — never per camera tick.
  useEffect(() => {
    if (!manager) return;
    let cancelled = false;

    const plan = () => {
      if (cancelled) return;
      const { viewProjectionMatrix, viewportSize, cameraPose } = viewApi.getState();
      if (!viewProjectionMatrix) return;

      // WORLD space throughout: the cell index was transformed once at load,
      // so there is no inverse-matrix pull-through and no per-plan clone, and
      // an anisotropic voxel grid cannot skew the error test.
      const frustum = new THREE.Frustum().setFromProjectionMatrix(viewProjectionMatrix);
      let cameraPosition: [number, number, number] | null = null;
      let focalPixels = 0;
      if (cameraPose?.isPerspective && cameraPose.fovY > 0) {
        cameraPosition = [...cameraPose.position] as [number, number, number];
        // An object of world size s at distance d covers s·focalPixels/d px.
        focalPixels = (0.5 * viewportSize.height) / Math.tan(0.5 * cameraPose.fovY);
      }
      manager.updatePlan({ frustum, cameraPosition, focalPixels, pixelBudget: 1 });
    };

    manager
      .ensureIndex()
      .then(plan)
      .catch((error) => console.error("[maille] failed to load the cell catalog:", error));

    const unsubscribe = viewApi.subscribe((state, prev) => {
      if (prev.cameraMoving && !state.cameraMoving) plan();
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [manager, viewApi]);

  if (!manager) return null;
  return <primitive object={manager.group} />;
};
