import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";

import { sceneZExtent } from "../../platform/coords/worldTransform";
import { useModeStore } from "../../platform/stores/modeStore";
import { useSceneStore, type NetworkLayerSessionState } from "../../platform/stores/sceneStore";
import { useViewStoreApi } from "../../platform/stores/viewStore";
import { useViewerStoreApi } from "../../platform/stores/viewerStore";
import {
  resolveCollectionMatrix,
  type NetworkCollectionRef,
  type NetworkLayerVariant,
} from "../../platform/model/collectionPlacement";
import type { KonnektionCollection } from "./konnektion/konnektionCollection";
import { openNetworkCollection } from "./konnektion/konnektionSource";
import { KonnektionCollectionManager } from "./konnektionManager";
import { useNetworkStoreApi } from "./store/networkSlice";

/**
 * NetworkLayer renderer: a konnektion collection — a self-describing prefix of
 * Parquet files holding a node/edge graph — placed by its own `pathToWorld`
 * composed through the scene's transform graph, and nothing else
 * (`collectionPlacement.ts`; COORDINATE_SYSTEMS.md "Coordinate conventions").
 *
 * The React layer owns only lifecycle, transform resolution and the settle
 * cadence. Level choice and geometry live in `KonnektionCollectionManager`
 * (imperative — no React re-render per load, OCTREE_RENDERER.md P17), the read
 * plan in `KonnektionCollection`, and the byte contract in `konnektionDecode`.
 *
 * One component for both display modes: in 2D it clips itself to a slab around
 * `currentZ`, exactly as the mesh layer does.
 */

export const NetworkCollectionLayer = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) =>
    s.sceneLayers.find((candidate) => candidate.id === layerId),
  );
  if (!layer || layer.__typename !== "NetworkLayer") return null;
  if (!layer.collection) return null;
  // `visible: false` stays MOUNTED: the group survives with its manager, so the
  // open footers and byte cache stay warm and a re-show is a cache replay
  // rather than a re-download. The manager stops planning while hidden.
  return <NetworkCollectionGroup layer={layer} collection={layer.collection} />;
};

/** The fragment plus the card's session-local render state. */
type NetworkLayerView = NetworkLayerVariant & NetworkLayerSessionState;

/**
 * The card's detail presets → the planner's pixel-error budget.
 *
 * Looser than the mesh path's on purpose. Choosing a level here swaps the WHOLE
 * collection, and a coarser konnektion level has genuinely fewer branches
 * (Strahler pruning removes twigs; it does not approximate them), so a tight
 * budget that keeps flipping is both more expensive and more visible than it is
 * for a surface.
 */
const DETAIL_BUDGETS = { fine: 2, balanced: 5, fast: 10 } as const;

const NetworkCollectionGroup = ({
  layer,
  collection,
}: {
  layer: NetworkLayerView;
  collection: NetworkCollectionRef;
}) => {
  const invalidate = useThree((state) => state.invalidate);
  const transformContext = useSceneStore((s) => s.transformContext);
  const viewApi = useViewStoreApi();
  const networkApi = useNetworkStoreApi();
  // `currentZ` and `worldUnitsPerPixel` are PLATFORM slice members (dimsSlice,
  // viewSlice), so they come off the viewer store directly. The mesh layer
  // reaches them through its own slice hook, which would make
  // `features/network -> features/meshes` an edge for nothing.
  const viewerApi = useViewerStoreApi();
  const datalayer = useDatalayerEndpoint();
  const client = useMikro();

  // Load-cadence stats → debug-only `networkVersion`, throttled here so the
  // manager stays cadence-blind and the store sees at most ~8 writes/s (P17).
  const onStatsChanged = useMemo(() => {
    let last = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const bump = () => {
      last = performance.now();
      networkApi.getState().bumpNetworkVersion();
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
  }, [networkApi]);

  // VALUE-stable: the memo's inputs churn identity on unrelated store writes,
  // so a recompute landing on the same placement must return the SAME Matrix4 —
  // downstream effects key on it.
  const matrixRef = useRef<THREE.Matrix4 | null>(null);
  const matrix = useMemo(() => {
    const next = resolveCollectionMatrix(layer, collection, transformContext);
    if (matrixRef.current?.equals(next)) return matrixRef.current;
    matrixRef.current = next;
    return next;
    // `layer.pathToWorld` is ALL resolveCollectionMatrix reads from the layer.
    // Depending on the whole `layer` would re-compose the transform chain on
    // every patchSceneLayer tick — an opacity drag included.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer.pathToWorld, collection, transformContext]);

  // Opening costs NO S3 round trip: the server mirrors konnektion.json onto the
  // store node. Collections are immutable per version, so the open survives as
  // long as (collection, client, datalayer).
  const [opened, setOpened] = useState<KonnektionCollection | null>(null);
  useEffect(() => {
    if (!datalayer) return; // no endpoint configured: nothing to read from
    let cancelled = false;
    openNetworkCollection(collection, client, datalayer)
      .then((next) => {
        if (!cancelled) setOpened(next);
      })
      .catch((error: unknown) =>
        console.error("[konnektion] failed to open the collection:", error),
      );
    return () => {
      cancelled = true;
    };
  }, [collection, client, datalayer]);

  // Keyed on the OPEN alone. A placement change goes through setVoxelToWorld,
  // never a manager rebuild — rebuilding would refetch the whole level.
  const manager = useMemo(() => {
    if (!opened) return null;
    return new KonnektionCollectionManager({
      collection: opened,
      onInvalidate: invalidate,
      onStatsChanged,
    });
  }, [opened, invalidate, onStatsChanged]);

  useEffect(() => () => manager?.dispose(), [manager]);

  // Registered for the debug panel, and deregistered on unmount so a removed
  // layer does not leave a disposed manager in the store.
  useEffect(() => {
    if (!manager) return;
    networkApi.getState().registerNetworkSystem(layer.id, manager);
    return () => networkApi.getState().registerNetworkSystem(layer.id, null);
  }, [manager, networkApi, layer.id]);

  useEffect(() => {
    manager?.setVoxelToWorld(matrix);
  }, [manager, matrix]);

  useEffect(() => {
    manager?.setMaterialConfig({
      color: layer.materialColor,
      opacity: layer.opacity,
      lineWidth: layer.lineWidth,
      // The session override wins over the stored value, so a toggle on the
      // card is immediate and costs no round trip.
      showNodes: layer.showNodesOverride ?? layer.showNodes,
      directed: layer.directedOverride ?? layer.directed,
    });
  }, [
    manager,
    layer.materialColor,
    layer.opacity,
    layer.lineWidth,
    layer.showNodes,
    layer.showNodesOverride,
    layer.directed,
    layer.directedOverride,
  ]);

  useEffect(() => {
    manager?.setPlanConfig({
      pixelBudget: DETAIL_BUDGETS[layer.detail ?? "balanced"],
      // `maxLevel` is the layer's BUDGET on detail — a cap, not a choice.
      maxLevel: layer.maxLevel ?? null,
    });
  }, [manager, layer.detail, layer.maxLevel]);

  useEffect(() => {
    manager?.setVisible(layer.visible !== false);
  }, [manager, layer.visible]);

  // Planning cadence: once the cell index is in, plan on mount and on every
  // camera SETTLE — never per camera tick.
  useEffect(() => {
    if (!manager) return;
    let cancelled = false;

    const plan = () => {
      if (cancelled) return;
      const { viewProjectionMatrix, viewportSize, cameraPose } = viewApi.getState();
      if (!viewProjectionMatrix) return;

      // WORLD space throughout: the cell index was transformed once at load, so
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
        // Ortho (2D) has no focal length, so the planner's camera-free branch
        // takes over. Without this an ortho plan picks level 0 unconditionally.
        errorBudget =
          manager.getPlanConfig().pixelBudget * viewerApi.getState().worldUnitsPerPixel;
      }
      void manager.updatePlan({ frustum, cameraPosition, focalPixels, errorBudget });
    };

    manager
      .ensureIndex()
      .then(plan)
      .catch((error) =>
        console.error("[konnektion] failed to load the cell catalog:", error),
      );

    const unsubscribe = viewApi.subscribe((state, prev) => {
      if (prev.cameraMoving && !state.cameraMoving) plan();
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [manager, viewApi, viewerApi]);

  // 2D slab: clip the collection to one z-step around the displayed slice.
  // Thickness comes from the finest image layer's z-step; a scene without one
  // falls back to one collection voxel (the placement matrix's z basis length).
  const displayMode = useModeStore((s) => s.displayMode);
  // A PRIMITIVE selector: `s.layers` churns identity on every brick-layer
  // LOD/visibility write, but the step it yields is a number, so Object.is
  // equality suppresses those re-renders.
  const slabStep = useSceneStore((s) => sceneZExtent(s.layers)?.step);
  const slabThickness = useMemo(() => {
    const base =
      slabStep && Number.isFinite(slabStep)
        ? slabStep
        : Math.max(new THREE.Vector3().setFromMatrixColumn(matrix, 2).length(), 1e-3);
    return base * (layer.slabScale ?? 1);
  }, [slabStep, matrix, layer.slabScale]);

  // z-scrub via a VANILLA subscription: setSlabClip mutates plane constants
  // only, so a scrub tick must not re-render this group to reach the manager.
  useEffect(() => {
    if (!manager) return;
    const apply = () => {
      manager.setSlabClip(
        displayMode === "3D"
          ? null
          : { z: viewerApi.getState().currentZ, thickness: slabThickness },
      );
      invalidate();
    };
    apply();
    if (displayMode === "3D") return; // 3D ignores z; nothing to track
    return viewerApi.subscribe((state, prev) => {
      if (state.currentZ !== prev.currentZ) apply();
    });
  }, [manager, displayMode, slabThickness, viewerApi, invalidate]);

  if (!manager) return null;
  // No pointer handlers attached at all: picking is not wired for this layer
  // yet, and P20 is explicit that ATTACHMENT is the raycast gate — an
  // unconditional handler would cost a full raycast per pointer move in every
  // mode, for nothing.
  return <primitive object={manager.group} />;
};
