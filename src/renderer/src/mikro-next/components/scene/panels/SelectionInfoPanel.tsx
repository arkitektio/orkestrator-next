import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Box, Focus, X } from "lucide-react";
import {
  useGetSceneAnnotationsQuery,
  type SceneAnnotationFragment,
} from "@/mikro-next/api/graphql";
import {
  resolveCollectionMatrix as resolveAnnotationMatrix,
  type AnnotationLayerVariant,
} from "../core/annotationBounds";
import {
  formatAnnotationMeasure,
  formatSceneLength,
  measureAnnotation,
} from "../core/roiMeasure";
import { unitLabel } from "../core/sceneUnits";
import { boundsCenter, type Point3 } from "../core/selectionAnchor";
import { useNavigateToAnnotation } from "../interactions/useNavigateToAnnotation";
import {
  meshObjectBox,
  useNavigateToMeshBox,
} from "../interactions/useNavigateToMeshObject";
import { useDeleteSelectedRois } from "../interactions/useDeleteSelectedRois";
import {
  resolveCollectionMatrix as resolveMeshMatrix,
  type MeshCollectionRef,
  type MeshLayerVariant,
} from "../layers/mesh/collectionPlacement";
import { perfMonitor } from "../managers/perfMonitor";
import type { FabriksObjectEntry } from "../render/fabriks/fabriksCatalogs";
import { useRoiSelectionStore, type SelectedRoi } from "../store/roiSelectionStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore, type MeshSelectionState } from "../store/viewerStore";
import { RoiAttributeSection } from "./RoiAttributeSection";
import { useSelectionAnchorChannel } from "./selectionAnchorChannel";
import {
  formatAnnotationKind,
  formatCount,
  hueStyle,
  indexLabel,
  objectLabel,
} from "./selectionFormat";

/**
 * "What did I just select?" — the in-canvas readout for the current selection:
 * the mesh instance (`viewerStore.meshSelection`) and the annotations
 * (`roiSelectionStore.selectedRois`), with the measures, pins and attribute
 * rows that describe them, plus the things you reach for immediately (frame
 * it, delete it, drop the selection).
 *
 * ANCHORED to the selection, not to a corner: the panel publishes the world
 * center of everything selected to the `SelectionAnchorChannel`, and
 * `SelectionAnchorProjector` — inside the canvas, on the frame loop — projects
 * that point through the camera's view-projection matrix and writes the
 * resulting screen placement onto this node. So it sits beside the shape it
 * describes and travels with it through pans, zooms and orbits. It flips sides
 * near an edge, clamps into the canvas, and hides while the anchor is behind
 * the camera (`core/selectionAnchor.ts` owns that math).
 *
 * Still a PANEL and not scene-space `Html`: the anchor moves it, but it does
 * not scale, rotate or occlude with the scene, it holds arbitrarily much
 * detail (attribute tables), and its content re-renders on selection changes
 * only — the per-frame work is one transform write.
 *
 * It is a SUMMARY, not the browser: the full per-collection lists live in the
 * Annotations and Meshes sidebar tabs (`sceneSidebarTabs.tsx`). Rows here are
 * capped at `ROW_CAP` — the panel says so when it truncates.
 */

/** Selected annotations rendered in full before the panel truncates. */
const ROW_CAP = 6;

const smallButton =
  "pointer-events-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70 hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

const sectionLabel =
  "text-[10px] font-medium uppercase tracking-[0.1em] text-white/50";

/** A mesh layer paired with its (non-null) collection. */
type MeshLayerRef = { layer: MeshLayerVariant; collection: MeshCollectionRef };

/** Everything the mesh block and the anchor need about the selected instance. */
type MeshDetails = {
  layerRef: MeshLayerRef | undefined;
  entry: FabriksObjectEntry | null;
  /** The instance's world AABB — null until the object catalog answers. */
  box: THREE.Box3 | null;
  stats: { vertices: number; indices: number } | null;
};

/**
 * The selected instance's placement and catalog record.
 *
 * The catalog lookup is by ORDINAL (`identifyOrdinal`, a cache hit once
 * anything has loaded the catalog) because a selection made by clicking the
 * mesh in the scene arrives as a bare ordinal — the vertex attribute is all a
 * pick knows. It lives in the panel root rather than in the mesh block because
 * the ANCHOR needs the same box the block reports its extent from.
 *
 * Accepts a null selection so the panel can call it unconditionally.
 */
const useMeshDetails = (selection: MeshSelectionState | null): MeshDetails => {
  const sceneLayers = useSceneStore((s) => s.sceneLayers);
  const transformContext = useSceneStore((s) => s.transformContext);
  const manager = useViewerStore((s) =>
    selection ? s.meshSystems[selection.layerId] : undefined,
  );

  const layerRef = useMemo<MeshLayerRef | undefined>(() => {
    if (!selection) return undefined;
    const layer = sceneLayers.find(
      (candidate): candidate is MeshLayerVariant =>
        candidate.__typename === "MeshLayer" && candidate.id === selection.layerId,
    );
    return layer?.collection ? { layer, collection: layer.collection } : undefined;
  }, [sceneLayers, selection]);

  const matrix = useMemo(
    () =>
      layerRef
        ? resolveMeshMatrix(layerRef.layer, layerRef.collection, transformContext)
        : null,
    [layerRef, transformContext],
  );

  // The answer is STAMPED with the selection it answers rather than cleared
  // when the selection moves: an effect that reset the state synchronously
  // would render twice per click for no gain, and a stale entry belongs to
  // another instance — reading it through the stamp drops it in the same
  // render the selection changed in.
  const [catalog, setCatalog] = useState<{
    key: string;
    entry: FabriksObjectEntry | null;
  } | null>(null);
  const selectionKey = selection ? `${selection.layerId}|${selection.ordinal}` : "";
  const ordinal = selection?.ordinal;

  useEffect(() => {
    if (!manager || ordinal === undefined) return;
    let cancelled = false;
    manager
      .identifyOrdinal(ordinal)
      .then((found) => {
        if (!cancelled) setCatalog({ key: selectionKey, entry: found ?? null });
      })
      .catch((reason: unknown) =>
        console.warn("[fabriks] cannot identify the selected instance:", reason),
      );
    return () => {
      cancelled = true;
    };
  }, [manager, ordinal, selectionKey]);

  const entry = catalog?.key === selectionKey ? catalog.entry : null;
  const box = useMemo(
    () => (entry && matrix ? meshObjectBox(entry, matrix) : null),
    [entry, matrix],
  );

  return {
    layerRef,
    entry,
    box,
    // The catalog answer wins over the selection's snapshot: a pick carries no
    // stats until the catalog resolves, and this is the lookup that fills them.
    stats: entry
      ? { vertices: entry.vertexCount, indices: entry.indexCount }
      : (selection?.stats ?? null),
  };
};

export const SelectionInfoPanel = () => {
  perfMonitor.countRender("SelectionInfoPanel"); // no-op unless a perf recording is armed
  const selectedRois = useRoiSelectionStore((s) => s.selectedRois);
  const meshSelection = useViewerStore((s) => s.meshSelection);
  const sceneLayers = useSceneStore((s) => s.sceneLayers);
  const transformContext = useSceneStore((s) => s.transformContext);
  const channel = useSelectionAnchorChannel();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const annotationLayers = useMemo(
    () =>
      sceneLayers.filter(
        (layer): layer is AnnotationLayerVariant =>
          layer.__typename === "AnnotationLayer" && !!layer.annotationCollection,
      ),
    [sceneLayers],
  );

  // One collection matrix per annotation layer, shared by the anchor and by
  // every row's measure — resolving it per ROI would redo the same walk of the
  // transform graph for each shape of a multi-selection.
  const matrixByLayer = useMemo(() => {
    const matrices = new Map<string, THREE.Matrix4>();
    for (const layer of annotationLayers) {
      matrices.set(
        layer.id,
        resolveAnnotationMatrix(layer, layer.annotationCollection!, transformContext),
      );
    }
    return matrices;
  }, [annotationLayers, transformContext]);

  const mesh = useMeshDetails(meshSelection);

  /**
   * The world point the panel pins to: the center of the bounds of EVERYTHING
   * selected — every selected annotation's vertices plus the mesh instance's
   * box. One panel gets one anchor, and with a mesh and the annotations drawn
   * on it selected together it lands on the pair, which is the object the
   * panel is describing.
   */
  const anchor = useMemo<Point3 | null>(() => {
    const points: Point3[] = [];
    const scratch = new THREE.Vector3();
    for (const roi of selectedRois) {
      const matrix = matrixByLayer.get(roi.layerId);
      if (!matrix) continue;
      for (const vector of roi.vectors) {
        scratch.set(vector[0] ?? 0, vector[1] ?? 0, vector[2] ?? 0).applyMatrix4(matrix);
        points.push({ x: scratch.x, y: scratch.y, z: scratch.z });
      }
    }
    if (mesh.box) {
      points.push({ ...mesh.box.min }, { ...mesh.box.max });
    }
    return boundsCenter(points);
  }, [selectedRois, matrixByLayer, mesh.box]);

  // Register the node (and keep its measured size current) for the projector.
  // The size comes from a ResizeObserver rather than a per-frame `offsetWidth`
  // read: that read would flush layout on the frame loop.
  useEffect(() => {
    const element = panelRef.current;
    if (!element) return;
    const publishSize = () =>
      channel.set({
        size: { width: element.offsetWidth, height: element.offsetHeight },
      });
    const observer = new ResizeObserver(publishSize);
    observer.observe(element);
    channel.set({ element });
    publishSize();
    return () => {
      observer.disconnect();
      channel.set({ element: null });
    };
  }, [channel]);

  useEffect(() => {
    channel.set({ world: anchor });
  }, [channel, anchor]);

  if (selectedRois.length === 0 && !meshSelection) return null;

  return (
    <div
      ref={panelRef}
      // left/top 0 + transform: the projector owns the position and writes it
      // as a compositor-only translate. The initial transform is the corner
      // fallback, so the panel is never invisible waiting for a first frame.
      style={{ transform: "translate3d(8px, 8px, 0)", willChange: "transform" }}
      className="pointer-events-auto absolute left-0 top-0 z-30 flex max-h-[60vh] w-fit min-w-52 max-w-72 flex-col gap-2 overflow-y-auto rounded-lg border border-black/10 bg-black/40 p-2 backdrop-blur-md"
    >
      {meshSelection && <MeshSelectionSection selection={meshSelection} mesh={mesh} />}
      {meshSelection && selectedRois.length > 0 && (
        <div className="h-px shrink-0 bg-white/10" />
      )}
      {selectedRois.length > 0 && (
        <RoiSelectionSection rois={selectedRois} matrixByLayer={matrixByLayer} />
      )}
    </div>
  );
};

/**
 * The selected mesh instance: what it is, how big it is, and the three actions
 * only the selection has — frame it, show it alone, drop it.
 *
 * No attribute rows here: a mesh pick's attribute plans are executed on the
 * PROBE path (`AttributeProbeTracker`) and read out in `SelectedPointPanel`,
 * so repeating them would show the same tables twice in one viewport.
 */
const MeshSelectionSection = ({
  selection,
  mesh,
}: {
  selection: MeshSelectionState;
  mesh: MeshDetails;
}) => {
  const spatialUnit = useSceneStore((s) => s.spatialUnit);
  const setMeshSelection = useViewerStore((s) => s.setMeshSelection);
  const navigateToBox = useNavigateToMeshBox();

  const unit = unitLabel(spatialUnit);
  const size = useMemo(
    () => (mesh.box ? mesh.box.getSize(new THREE.Vector3()) : null),
    [mesh.box],
  );

  return (
    <section className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className={sectionLabel}>Mesh</span>
        <div className="flex gap-1">
          <button
            className={smallButton}
            title="Frame the selected instance"
            disabled={!mesh.box}
            onClick={() => mesh.box && navigateToBox(mesh.box.clone())}
          >
            <Focus className="mr-1 inline h-3 w-3" />
            Go to
          </button>
          <button
            className={`${smallButton} ${selection.isolate ? "bg-sky-400/20 text-white" : ""}`}
            title="Show ONLY this instance"
            onClick={() =>
              setMeshSelection({ ...selection, isolate: !selection.isolate })
            }
          >
            <Box className="mr-1 inline h-3 w-3" />
            Isolate
          </button>
          <button
            className={smallButton}
            title="Clear the mesh selection"
            onClick={() => setMeshSelection(null)}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="space-y-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-[11px]">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-sm"
            style={hueStyle(selection.ordinal)}
          />
          <span className="min-w-0 flex-1 truncate font-mono text-white/90">
            {objectLabel(
              selection.objectId ?? mesh.entry?.objectId ?? null,
              selection.ordinal,
            )}
          </span>
          {selection.isolate && (
            <span className="rounded bg-sky-500/20 px-1 text-[9px] font-medium text-sky-200">
              isolated
            </span>
          )}
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-white/50">Collection</span>
          <span className="min-w-0 truncate text-white/80">
            {mesh.layerRef ? mesh.layerRef.collection.id : "—"}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-white/50">Geometry</span>
          <span className="font-mono text-white/90">
            {mesh.stats
              ? `${formatCount(mesh.stats.vertices)}v · ${formatCount(
                  Math.round(mesh.stats.indices / 3),
                )}t`
              : "…"}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-white/50">Extent</span>
          <span className="font-mono text-white/90">
            {size
              ? `${formatSceneLength(size.x)} × ${formatSceneLength(
                  size.y,
                )} × ${formatSceneLength(size.z)} ${unit}`
              : "…"}
          </span>
        </div>
      </div>
    </section>
  );
};

/**
 * The selected annotations. Multi-select is the annotations' norm (the meshes'
 * selection is a singleton), so this is a list with a shared action row — and
 * the attribute lookups run only for a SINGLE selection, the same bound the
 * sidebar card keeps.
 */
const RoiSelectionSection = ({
  rois,
  matrixByLayer,
}: {
  rois: readonly SelectedRoi[];
  matrixByLayer: ReadonlyMap<string, THREE.Matrix4>;
}) => {
  const clearSelectedRois = useRoiSelectionStore((s) => s.clearSelectedRois);
  const { deleteSelectedRois, isDeleting } = useDeleteSelectedRois();
  const sceneLayers = useSceneStore((s) => s.sceneLayers);

  const annotationLayers = useMemo(
    () =>
      sceneLayers.filter(
        (layer): layer is AnnotationLayerVariant =>
          layer.__typename === "AnnotationLayer" && !!layer.annotationCollection,
      ),
    [sceneLayers],
  );

  const shown = rois.slice(0, ROW_CAP);

  return (
    <section className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className={sectionLabel}>
          {rois.length === 1 ? "Annotation" : `Annotations · ${rois.length}`}
        </span>
        <div className="flex gap-1">
          <button
            className={`${smallButton} hover:bg-red-500/30`}
            title="Delete the selected annotations (Backspace)"
            disabled={isDeleting}
            onClick={() => void deleteSelectedRois()}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
          <button
            className={smallButton}
            title="Clear the selection"
            onClick={() => clearSelectedRois()}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {shown.map((roi) => (
        <SelectedRoiRow
          key={roi.id}
          roi={roi}
          layer={annotationLayers.find((layer) => layer.id === roi.layerId)}
          matrix={matrixByLayer.get(roi.layerId)}
          // Bounded lookups only: attribute plans for a single selection.
          showAttributes={rois.length === 1}
        />
      ))}

      {rois.length > shown.length && (
        <div className="text-[10px] text-white/40">
          +{rois.length - shown.length} more — see the Annotations tab.
        </div>
      )}
    </section>
  );
};

/**
 * One selected annotation: index, kind, world measure, the discrete pins it
 * sits on, and (single selection) "what is under it".
 *
 * The index and the go-to both need the collection's annotation list, and the
 * query is the SAME one the canvas layer polls — identical variables, so
 * Apollo serves this from that cache entry rather than issuing a request.
 */
const SelectedRoiRow = ({
  roi,
  layer,
  matrix,
  showAttributes,
}: {
  roi: SelectedRoi;
  layer: AnnotationLayerVariant | undefined;
  matrix: THREE.Matrix4 | undefined;
  showAttributes: boolean;
}) => {
  const spatialUnit = useSceneStore((s) => s.spatialUnit);
  const navigateToAnnotation = useNavigateToAnnotation();

  const collectionId = layer?.annotationCollection?.id;
  const { data } = useGetSceneAnnotationsQuery({
    variables: { filters: { collection: collectionId ?? "" } },
    skip: !collectionId,
  });
  const index =
    data?.annotations?.findIndex((annotation) => annotation.id === roi.id) ?? -1;
  const annotation: SceneAnnotationFragment | undefined =
    index >= 0 ? data?.annotations?.[index] : undefined;

  // Measures are quoted in WORLD units (the scene's µm), not the collection's
  // raw numbers — the same frame the scale bar and the draw readout speak.
  const measure = useMemo(() => {
    if (!matrix) return null;
    const worldPoints = roi.vectors.map((vector) => {
      const world = new THREE.Vector3(
        vector[0] ?? 0,
        vector[1] ?? 0,
        vector[2] ?? 0,
      ).applyMatrix4(matrix);
      return { x: world.x, y: world.y, z: world.z };
    });
    return formatAnnotationMeasure(
      measureAnnotation(roi.kind, worldPoints),
      unitLabel(spatialUnit),
    );
  }, [matrix, roi.vectors, roi.kind, spatialUnit]);

  return (
    <div className="space-y-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-[11px]">
      <div className="flex items-center gap-2">
        <span className="shrink-0 font-mono text-white/90">
          {index >= 0 ? indexLabel(index) : "Annotation"}
        </span>
        <span className="min-w-0 flex-1 truncate text-white/60">
          {formatAnnotationKind(roi.kind)}
        </span>
        <button
          className={smallButton}
          title="Go to annotation"
          disabled={!annotation || !layer}
          onClick={() => annotation && layer && navigateToAnnotation(annotation, layer)}
        >
          <Focus className="h-3 w-3" />
        </button>
      </div>

      {measure && (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-white/50">Measure</span>
          <span className="font-mono text-white/90">{measure}</span>
        </div>
      )}

      {/* The pins: which slice / timepoint / channel the shape was drawn on —
          the reason a selected annotation can be invisible in the viewport. */}
      {roi.coordinates.length > 0 && (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-white/50">At</span>
          <span className="min-w-0 truncate font-mono text-white/90">
            {roi.coordinates.map((pin) => `${pin.name} ${pin.value}`).join(" · ")}
          </span>
        </div>
      )}

      {showAttributes && <RoiAttributeSection roi={roi} />}
    </div>
  );
};
