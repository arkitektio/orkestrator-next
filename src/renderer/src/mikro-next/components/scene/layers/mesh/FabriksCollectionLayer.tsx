import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";

import { sceneZExtent } from "../../core/worldTransform";
import { useModeStore } from "../../store/modeStore";
import { useSceneStore, type MeshLayerSessionState } from "../../store/sceneStore";
import { useViewerStore, useViewerStoreApi } from "../../store/viewerStore";
import { useViewStoreApi } from "../../store/viewStore";
import { FabriksCollection } from "../../render/fabriks/fabriksCollection";
import { FabriksCollectionManager } from "../../render/fabriks/fabriksManager";
import { openFabriksCollection } from "../../render/fabriks/fabriksSource";
import {
  resolveCollectionMatrix,
  type MeshCollectionRef,
  type MeshLayerVariant,
} from "./collectionPlacement";

/**
 * MeshLayer renderer: a fabriks collection — a self-describing prefix of
 * Parquet files — streamed by row group and placed by its own `pathToWorld`
 * composed through the scene's transform graph, nothing else
 * (`collectionPlacement.ts`; COORDINATE_SYSTEMS.md "Coordinate conventions").
 *
 * The React layer owns only lifecycle, transform resolution and the settle
 * cadence. Planning and streaming live in `FabriksCollectionManager`
 * (imperative — no React re-render per batch, OCTREE_RENDERER.md P17), the
 * read plan in `FabriksCollection`, and the byte contract in `fabriksDecode`.
 */

export const FabriksCollectionLayer = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) =>
    s.sceneLayers.find((candidate) => candidate.id === layerId),
  );
  if (!layer || layer.__typename !== "MeshLayer") return null;
  if (!layer.collection || layer.visible === false) return null;
  return <FabriksCollectionGroup layer={layer} collection={layer.collection} />;
};

/** The fragment plus the card's session-local render state. */
type MeshLayerView = MeshLayerVariant & MeshLayerSessionState;

const FabriksCollectionGroup = ({
  layer,
  collection,
}: {
  layer: MeshLayerView;
  collection: MeshCollectionRef;
}) => {
  const invalidate = useThree((state) => state.invalidate);
  const transformContext = useSceneStore((s) => s.transformContext);
  const viewApi = useViewStoreApi();
  const viewerApi = useViewerStoreApi();
  const datalayer = useDatalayerEndpoint();
  const client = useMikro();

  // Streaming-cadence stats → debug-only `meshVersion`, throttled here so the
  // manager stays cadence-blind and the store sees at most ~8 writes/s.
  const onStatsChanged = useMemo(() => {
    let last = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const bump = () => {
      last = performance.now();
      viewerApi.getState().bumpMeshVersion();
    };
    return () => {
      const elapsed = performance.now() - last;
      if (elapsed >= 120) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        bump();
      } else if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          bump();
        }, 120 - elapsed);
      }
    };
  }, [viewerApi]);

  // VALUE-stable: the memo's inputs churn identity on unrelated store writes,
  // so a recompute that lands on the same placement must return the SAME
  // Matrix4 — downstream effects key on it, and a fresh-but-equal instance
  // used to rebuild the whole manager and refetch every cell.
  const matrixRef = useRef<THREE.Matrix4 | null>(null);
  const matrix = useMemo(() => {
    const next = resolveCollectionMatrix(layer, collection, transformContext);
    if (matrixRef.current?.equals(next)) return matrixRef.current;
    matrixRef.current = next;
    return next;
  }, [layer, collection, transformContext]);

  // Opening reads fabriks.json and nothing else; the catalogs come with the
  // first plan. Collections are immutable per version, so the open survives as
  // long as (collection, version).
  const [opened, setOpened] = useState<FabriksCollection | null>(null);
  useEffect(() => {
    if (!datalayer) return; // no endpoint configured: nothing to read from
    let cancelled = false;
    openFabriksCollection(collection, client, datalayer)
      .then((next) => {
        if (!cancelled) setOpened(next);
      })
      .catch((error) => console.error(`[fabriks] cannot open collection ${collection.id}:`, error));
    return () => {
      cancelled = true;
    };
  }, [collection, client, datalayer]);

  // Keyed on the OPEN alone. A placement change goes through
  // `setVoxelToWorld` below — index rebuild and replan, caches untouched —
  // never through a manager rebuild, which would refetch everything.
  const manager = useMemo(() => {
    if (!opened) return null;
    return new FabriksCollectionManager({
      collection: opened,
      loadDecoder: async () => {
        await MeshoptDecoder.ready;
        return MeshoptDecoder;
      },
      onInvalidate: invalidate,
      onStatsChanged,
    });
  }, [opened, invalidate, onStatsChanged]);

  useEffect(() => () => manager?.dispose(), [manager]);

  // Placement, applied before the first plan (effects run in order) and again
  // on any real change. Value-equal matrices are a no-op inside the manager.
  useEffect(() => {
    manager?.setVoxelToWorld(matrix);
  }, [manager, matrix]);

  // Debug registration: DebugPanel reads stats and steers the planner through
  // this handle — the mesh twin of registerBrickSystem.
  useEffect(() => {
    if (!manager) return;
    const { registerMeshSystem, bumpMeshVersion } = viewerApi.getState();
    registerMeshSystem(layer.id, manager);
    bumpMeshVersion();
    return () => {
      viewerApi.getState().registerMeshSystem(layer.id, null);
    };
  }, [manager, viewerApi, layer.id]);

  useEffect(() => {
    manager?.setMaterialConfig({
      color: layer.materialColor,
      wireframe: layer.wireframe,
      opacity: layer.opacity,
      instanceColormap: layer.instanceColormap,
    });
    invalidate();
  }, [
    manager,
    layer.materialColor,
    layer.wireframe,
    layer.opacity,
    layer.instanceColormap,
    invalidate,
  ]);

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
      let errorBudget: number | undefined;
      if (cameraPose?.isPerspective && cameraPose.fovY > 0) {
        cameraPosition = [...cameraPose.position] as [number, number, number];
        // An object of world size s at distance d covers s·focalPixels/d px.
        focalPixels = (0.5 * viewportSize.height) / Math.tan(0.5 * cameraPose.fovY);
      } else {
        // Ortho (2D): distance-independent LOD via the planner's camera-free
        // branch — allow a world-space error worth `pixelBudget` on-screen
        // pixels at the current zoom. Without this an ortho plan refines
        // everything to level 0.
        errorBudget =
          manager.getPlanConfig().pixelBudget * viewerApi.getState().worldUnitsPerPixel;
      }
      // Budgets (pixelBudget, maxCells) live in the manager's plan config so
      // the debug panel can steer them between settles.
      manager.updatePlan({ frustum, cameraPosition, focalPixels, errorBudget });
    };

    manager
      .ensureIndex()
      .then(plan)
      .catch((error) => console.error("[fabriks] failed to load the cell catalog:", error));

    const unsubscribe = viewApi.subscribe((state, prev) => {
      if (prev.cameraMoving && !state.cameraMoving) plan();
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [manager, viewApi, viewerApi]);

  // 2D slab: clip the collection to one z-step around the displayed slice
  // (the annotation layer's slab convention). Thickness comes from the finest
  // image layer's z-step; a scene without one falls back to one mesh voxel
  // (the placement matrix's z basis length). Z-scrub mutates only the plane
  // constants — no replan, no pipeline rebuild.
  const displayMode = useModeStore((s) => s.displayMode);
  const currentZ = useViewerStore((s) => s.currentZ);
  const imageLayers = useSceneStore((s) => s.layers);
  const slabThickness = useMemo(() => {
    const step = sceneZExtent(imageLayers)?.step;
    if (step && Number.isFinite(step)) return step;
    const zBasis = new THREE.Vector3().setFromMatrixColumn(matrix, 2).length();
    return Math.max(zBasis, 1e-3);
  }, [imageLayers, matrix]);
  useEffect(() => {
    if (!manager) return;
    manager.setSlabClip(
      displayMode === "3D" ? null : { z: currentZ, thickness: slabThickness },
    );
    invalidate();
  }, [manager, displayMode, currentZ, slabThickness, invalidate]);

  if (!manager) return null;
  return <primitive object={manager.group} />;
};
