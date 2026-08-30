import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";

import {
  useGetSceneAnnotationsQuery,
  useGetSceneSurfacesQuery,
  type SceneAnnotationFragment,
  type SceneSurfaceFragment,
  AnnotationKind,
  // The filter's own enum: `AnnotationFilter.kind` is generated from the model's
  // TextChoices twin, so it is a separate type from the one on the annotation
  // even though the two carry the same members.
  AnnotationKindChoices,
} from "@/mikro-next/api/graphql";

import { Line } from "../../platform/draw/Line";
import { ellipsoidCrossSectionScale } from "./primitiveDraw";
import { sceneZExtent } from "../../platform/coords/worldTransform";
import { repairedSelections } from "./selectionRepair";
import { computeWorldUnitsPerPixel } from "../../platform/probe/probeWorld";
import {
  isAnnotationInView,
  sceneCoverages,
  type ScenePlane,
} from "./annotationVisibility";
import {
  MIN_DEPTH,
  ellipseRing,
  getVectorPoint,
  getWorldExtent,
  resolveCollectionMatrix,
  type AnnotationCollectionRef,
  type AnnotationLayerVariant,
} from "./annotationBounds";
import { resolveStyle, type ShapeStyle } from "./annotationStyle";
import {
  MIN_CROSS_SECTION_SCALE,
  buildOutlineBatches,
  isAnnotationBatchEnabled,
  roiForSegment,
  type OutlineBatch,
} from "./annotationBatch";
import { LineSegments2 } from "three/examples/jsm/lines/webgpu/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { Line2NodeMaterial } from "three/webgpu";
import { useModeStore } from "../../platform/stores/modeStore";
import { useRoiDrawingStore } from "./roiDrawingStore";
import { useRoiSelectionStore, type SelectedRoi } from "./roiSelectionStore";
import { useSceneStore } from "../../platform/stores/sceneStore";
import { useViewerStore } from "../../platform/stores/viewerStore";
import { useViewStoreApi } from "../../platform/stores/viewStore";

/**
 * AnnotationLayer renderer: the drawn shapes of one AnnotationCollection.
 *
 * The collection — not the scene, and not a dataset — owns the coordinate
 * system the vectors live in, so the layer's server-resolved `pathToWorld` is
 * the one placement question with an answer here. Composing it
 * (`composePlacementPath` + `affineToMatrix4`) is the universal rule every
 * layer follows (COORDINATE_SYSTEMS.md §0): the client composes pathToWorld
 * and nothing else — meshes do exactly the same in `collectionPlacement.ts`.
 *
 * Styling is per-shape: an AnnotationLayer draws a whole collection, so stroke
 * and fill live on each Annotation and are read off the query, not the layer.
 */

/**
 * Shared unit geometries, scaled per shape via the mesh transform instead of
 * per-shape `args`. Module lifetime, never disposed (P13-safe by
 * construction): with inline `args` every annotation minted its own GPU
 * geometry, so a thousand-ROI collection held a thousand identical spheres.
 */
const UNIT_SPHERE = new THREE.SphereGeometry(1, 24, 16);
const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const UNIT_PLANE = new THREE.PlaneGeometry(1, 1);
const UNIT_CIRCLE_48 = new THREE.CircleGeometry(1, 48);
const UNIT_CIRCLE_16 = new THREE.CircleGeometry(1, 16);



export const AnnotationLayerRenderer = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) => s.sceneLayers.find((candidate) => candidate.id === layerId));
  if (!layer || layer.__typename !== "AnnotationLayer") return null;
  if (!layer.annotationCollection || layer.visible === false) return null;
  return (
    <AnnotationCollectionGroup
      layer={layer}
      collection={layer.annotationCollection}
      layerId={layerId}
    />
  );
};

const AnnotationCollectionGroup = ({
  layer,
  collection,
  layerId,
}: {
  layer: AnnotationLayerVariant;
  collection: AnnotationCollectionRef;
  layerId: string;
}) => {
  const transformContext = useSceneStore((s) => s.transformContext);
  const imageLayers = useSceneStore((s) => s.layers);
  const dimSelections = useViewerStore((s) => s.dimSelections);
  const currentZ = useViewerStore((s) => s.currentZ);
  const displayMode = useModeStore((s) => s.displayMode);
  const interactionMode = useModeStore((s) => s.interactionMode);
  const selectedRois = useRoiSelectionStore((s) => s.selectedRois);
  const selectOnlyRoi = useRoiSelectionStore((s) => s.selectOnlyRoi);
  const toggleSelectedRoi = useRoiSelectionStore((s) => s.toggleSelectedRoi);
  const setVisibleLayerRois = useRoiSelectionStore((s) => s.setVisibleLayerRois);
  const clearVisibleLayerRois = useRoiSelectionStore((s) => s.clearVisibleLayerRois);

  const viewApi = useViewStoreApi();
  const { data } = useGetSceneAnnotationsQuery({
    // Everything BUT painted regions. A surface's geometry is thousands of
    // vertices plus a face index, and this query runs every 5s for every
    // annotation layer in every mounted scene — so surfaces come from the
    // separate query below instead, which fetches them once.
    variables: { filters: { collection: collection.id, NOT: { kind: AnnotationKindChoices.Surface } } },
    pollInterval: 5000,
    // A poll landing mid-gesture re-renders and re-diffs the whole annotation
    // subtree while the user is dragging; skip those attempts (the next poll
    // after settle catches up).
    skipPollAttempt: () => viewApi.getState().cameraMoving,
  });

  // The painted regions. `useCreateSceneAnnotation` refetches this by name the
  // moment one is drawn, which is what makes a new stroke appear immediately —
  // but a refetch by name only reaches a query something is already observing,
  // and on a scene's FIRST stroke this component is still being mounted by the
  // GetScene refetch that minted the layer. The slow poll is the backstop for
  // exactly that gap, and for a surface drawn in another client. It is 12x the
  // annotation poll's interval because the payload is orders of magnitude
  // heavier and a surface only changes by an explicit edit.
  const { data: surfaceData } = useGetSceneSurfacesQuery({
    variables: { filters: { collection: collection.id, kind: AnnotationKindChoices.Surface } },
    pollInterval: 60000,
    skipPollAttempt: () => viewApi.getState().cameraMoving,
  });

  const affineMatrix = useMemo(
    () => resolveCollectionMatrix(layer, collection, transformContext),
    [collection, layer, transformContext],
  );

  // One list again from here on: the split is a fetching concern, and every
  // reader below (visibility, selection, placement) treats a surface like any
  // other shape. `SceneSurfaceFragment` is `SceneAnnotationFragment` plus
  // `faces`, so the union is just the wider of the two.
  const annotations = useMemo((): SceneSurfaceFragment[] | undefined => {
    if (!data?.annotations && !surfaceData?.annotations) return undefined;
    return [...(data?.annotations ?? []), ...(surfaceData?.annotations ?? [])];
  }, [data?.annotations, surfaceData?.annotations]);

  // Hand over from the local preview: a drawn shape stays on screen from the
  // gesture until its persisted copy is in hand HERE, so it never blinks out
  // in between (the gap is widest on a scene's first annotation, where this
  // layer has to be minted and mounted first).
  const resolvePersistedRois = useRoiDrawingStore((s) => s.resolvePersistedRois);
  useEffect(() => {
    if (!annotations) return;
    resolvePersistedRois(
      collection.id,
      annotations.map((annotation) => annotation.id),
    );
  }, [annotations, collection.id, resolvePersistedRois]);

  // Lookup identity for the selection store: attribute lookups start in the
  // collection's own system with the RAW collection-space vectors — the plan
  // path (server-resolved) does any frame conversion.
  const systemId = collection.coordinateSystem.id ?? null;
  const axisNames = useMemo(
    () => (collection.coordinateSystem.axes ?? []).map((axis) => axis.name),
    [collection],
  );

  const flattenToPlane = displayMode !== "3D";

  /**
   * What the scene is showing, in the terms an annotation is pinned in. The
   * flat view resolves z pins against the plane it draws; the volume shows
   * every slice, so there z spans (`planeZ` null).
   */
  const coverages = useMemo(
    () => sceneCoverages(imageLayers, dimSelections, flattenToPlane ? currentZ : null),
    [imageLayers, dimSelections, flattenToPlane, currentZ],
  );

  /**
   * The slab the flat view draws. Null in 3D and in a scene whose layers have
   * no z axis — neither has a plane a shape can be off.
   */
  const plane = useMemo((): ScenePlane | null => {
    if (!flattenToPlane) return null;
    const extent = sceneZExtent(imageLayers);
    return extent ? { z: currentZ, slabThickness: extent.step } : null;
  }, [flattenToPlane, imageLayers, currentZ]);

  /**
   * The drawn slice in the COLLECTION's space — where the shapes' own z values
   * live, so it is the frame a volumetric shape is sectioned in. Inverting the
   * placement on `(0, 0, z)` reads the plane back the way `physicalToVoxelZ`
   * does, which takes the placement to be axis-aligned in z (a rotated one has
   * no single collection-space z for a world plane).
   */
  const planeZLocal = useMemo(() => {
    if (!plane) return null;
    const local = new THREE.Vector3(0, 0, plane.z).applyMatrix4(
      affineMatrix.clone().invert(),
    );
    return local.z;
  }, [affineMatrix, plane]);

  /**
   * Every shape placed in the world once — the matrix pass, keyed only on the
   * data and the placement. Scrubbing z must not redo it: the plane moves at
   * pointer cadence and the geometry does not move with it.
   */
  const placed = useMemo(() => {
    if (!annotations) return [];

    return annotations
      .map((annotation) => {
        const extent = getWorldExtent(annotation, affineMatrix);
        if (!extent) return null;

        return {
          annotation,
          bounds: extent.bounds,
          zSpan: extent.zSpan,
          roi: {
            id: annotation.id,
            layerId,
            name: annotation.name,
            kind: annotation.kind,
            systemId,
            axisNames,
            vectors: annotation.vectors ?? [],
            coordinates: annotation.coordinates ?? [],
          },
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  }, [affineMatrix, annotations, layerId, systemId, axisNames]);

  /**
   * The shapes that are actually on screen. One list for both consumers: what
   * is drawn and what the rubber band can select have to agree, or a drag
   * picks up shapes from a slice that is not being shown.
   */
  const shown = useMemo(
    () =>
      placed.filter((entry) =>
        isAnnotationInView(
          { coordinates: entry.annotation.coordinates, zSpan: entry.zSpan },
          { coverages, plane },
        ),
      ),
    [placed, coverages, plane],
  );

  // This layer draws these annotations, so it holds the authoritative entry
  // for each — including the `layerId` a selection made before the layer
  // existed could not know. See `features/annotations/selectionRepair.ts`: without this the
  // info panel never finds a collection matrix for the shape and parks in the
  // corner. Converges after one pass (the repaired entries then agree).
  const mergeSelectedRois = useRoiSelectionStore((s) => s.mergeSelectedRois);
  useEffect(() => {
    const repairs = repairedSelections(
      selectedRois,
      placed.map((entry) => entry.roi),
    );
    if (repairs.length > 0) mergeSelectedRois(repairs);
  }, [placed, selectedRois, mergeSelectedRois]);

  const visibleRois = useMemo(
    () => shown.map((entry) => ({ ...entry.roi, bounds: entry.bounds })),
    [shown],
  );

  useEffect(() => {
    setVisibleLayerRois(layerId, visibleRois);

    return () => {
      clearVisibleLayerRois(layerId);
    };
  }, [clearVisibleLayerRois, layerId, setVisibleLayerRois, visibleRois]);

  // Identity-stable across renders so the memoized shapes below actually
  // skip: the per-shape closure this replaces re-minted every shape's handler
  // on every group render, defeating any memo.
  const onSelectRoi = useCallback(
    (roi: SelectedRoi, appendSelection: boolean) => {
      if (appendSelection) {
        toggleSelectedRoi(roi);
        return;
      }
      selectOnlyRoi(roi);
    },
    [selectOnlyRoi, toggleSelectedRoi],
  );

  const selectable = interactionMode !== "PROBE";
  const selectedRoiIds = useMemo(
    () => new Set(selectedRois.map((roi) => roi.id)),
    [selectedRois],
  );

  // Points draw as ONE InstancedMesh per opacity value instead of a React
  // subtree + useFrame per point; everything else stays a memoized shape.
  const { pointGroups, otherShapes } = useMemo(() => {
    const points: PointEntry[] = [];
    const others: typeof shown = [];
    for (const entry of shown) {
      const { annotation } = entry;
      if (
        annotation.kind === AnnotationKind.Point &&
        (annotation.vectors?.length ?? 0) >= 1
      ) {
        const style = resolveStyle(annotation, selectedRoiIds.has(annotation.id));
        points.push({
          id: annotation.id,
          position: getVectorPoint(annotation.vectors![0], flattenToPlane),
          color: style.stroke,
          opacity: style.strokeOpacity * 0.85,
          roi: entry.roi,
        });
      } else {
        others.push(entry);
      }
    }
    // Opacity is a MATERIAL property, so instances batch per distinct value
    // (in practice one group — per-shape stroke opacities are rare).
    const byOpacity = new Map<number, PointEntry[]>();
    for (const point of points) {
      const bucket = byOpacity.get(point.opacity);
      if (bucket) bucket.push(point);
      else byOpacity.set(point.opacity, [point]);
    }
    return { pointGroups: [...byOpacity.entries()], otherShapes: others };
  }, [shown, selectedRoiIds, flattenToPlane]);

  // Merged outline batches (orkestrator.annotationBatch, read once per
  // mount): one LineSegments2 per stroke width instead of one Line2 per
  // shape. The per-shape components then suppress their own <Line>.
  const batchOutlines = useMemo(isAnnotationBatchEnabled, []);
  const outlineBatches = useMemo(
    () =>
      batchOutlines
        ? buildOutlineBatches(otherShapes, flattenToPlane, planeZLocal, (id) =>
            selectedRoiIds.has(id),
          )
        : [],
    [batchOutlines, otherShapes, flattenToPlane, planeZLocal, selectedRoiIds],
  );

  if (shown.length === 0) return null;

  return (
    <group matrix={affineMatrix} matrixAutoUpdate={false}>
      {pointGroups.map(([opacity, entries]) => (
        <AnnotationPoints
          key={opacity}
          entries={entries}
          opacity={opacity}
          selectable={selectable}
          onSelectRoi={onSelectRoi}
        />
      ))}
      {outlineBatches.map((batch) => (
        <AnnotationOutlineBatch
          key={batch.lineWidth}
          batch={batch}
          selectable={selectable}
          onSelectRoi={onSelectRoi}
        />
      ))}
      {otherShapes.map(({ annotation, roi }) => (
        <AnnotationShape
          key={annotation.id}
          annotation={annotation}
          roi={roi}
          flattenToPlane={flattenToPlane}
          planeZ={planeZLocal}
          isActive={selectedRoiIds.has(annotation.id)}
          selectable={selectable}
          suppressOutlines={batchOutlines}
          onSelectRoi={onSelectRoi}
        />
      ))}
    </group>
  );
};

/**
 * One merged fat-line draw for a batch of shape outlines. Picking maps the
 * raycast's `faceIndex` (the segment's instance index) back to the owning ROI
 * through the batch's sorted ranges — same handler-attachment gating as the
 * per-shape path (P20: no handler in PROBE mode, so the whole batch leaves
 * the raycast set).
 */
const AnnotationOutlineBatch = ({
  batch,
  selectable,
  onSelectRoi,
}: {
  batch: OutlineBatch<SelectedRoi>;
  selectable: boolean;
  onSelectRoi: (roi: SelectedRoi, appendSelection: boolean) => void;
}) => {
  const geometry = useMemo(() => new LineSegmentsGeometry(), []);
  const material = useMemo(() => {
    const created = new Line2NodeMaterial();
    // Per-SEGMENT colors (instanceColorStart/End) carry each shape's stroke —
    // and the selection highlight, which is a color-range rewrite, not a
    // geometry rebuild.
    created.vertexColors = true;
    return created;
  }, []);
  const line = useMemo(() => new LineSegments2(geometry, material), [geometry, material]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  // Layout effect for the same reason as `Line`: the WGSL vertex layout is
  // derived from the geometry's attributes, so positions must exist before
  // the first frame draws.
  useLayoutEffect(() => {
    geometry.setPositions(batch.positions);
    geometry.setColors(batch.colors);
    line.computeLineDistances();
  }, [batch, geometry, line]);

  useEffect(() => {
    material.linewidth = batch.lineWidth;
    material.needsUpdate = true;
  }, [material, batch.lineWidth]);

  const handleClick = selectable
    ? (event: ThreeEvent<MouseEvent>) => {
        const roi = roiForSegment(batch.ranges, event.faceIndex);
        if (!roi) return;
        event.stopPropagation();
        onSelectRoi(roi, event.nativeEvent.shiftKey);
      }
    : undefined;

  return <primitive object={line} onClick={handleClick} />;
};

/**
 * The material for a closed shape's interior.
 *
 * A filled shape gets its fill. An UNFILLED one still gets a surface, just an
 * invisible one: it is what makes a click anywhere inside a rectangle or a
 * polygon select it, instead of forcing the user to hit the outline. An
 * invisible MATERIAL (not `visible={false}` on the object) is the idiom the
 * drawer's interaction plane and the marquee already use — `Mesh.raycast` never
 * reads it, so the surface still picks while the renderer skips drawing it.
 */
const InteriorMaterial = ({ style }: { style: ShapeStyle }) =>
  style.fill ? (
    <meshBasicMaterial
      color={style.fill}
      transparent
      opacity={style.fillOpacity}
      side={THREE.DoubleSide}
    />
  ) : (
    <meshBasicMaterial visible={false} side={THREE.DoubleSide} />
  );

/**
 * A polygon's interior, as a pickable surface.
 *
 * The geometry is memoized on the flattened vertices: rebuilding a `Shape` per
 * render would hand R3F fresh `args` every time and churn a GPU buffer on every
 * selection change.
 */
const PolygonInterior = ({
  points,
  style,
}: {
  points: [number, number, number][];
  style: ShapeStyle;
}) => {
  const shape = useMemo(
    () =>
      new THREE.Shape(points.map((point) => new THREE.Vector2(point[0], point[1]))),
    [points],
  );

  // Triangulation needs three distinct vertices; below that there is no inside.
  if (points.length < 3) return null;

  // No handler of its own: the shape's group owns selection, and a second
  // handler on the same hit would just be another thing to keep in step.
  return (
    <mesh position={[0, 0, points[0][2]]}>
      <shapeGeometry args={[shape]} />
      <InteriorMaterial style={style} />
    </mesh>
  );
};

/**
 * A painted region's surface.
 *
 * The geometry arrives indexed — unique vertices plus triangles that index them,
 * which is how it is stored and roughly a quarter the payload of the triangle
 * soup the extractor produces. It is expanded straight back to non-indexed here,
 * because `computeVertexNormals` on an indexed mesh averages normals across the
 * faces meeting at each vertex and reads SMOOTH, while the live preview in
 * `enhancers/paths/brushSkeleton/BrushStrokeSession.tsx` computes them on the raw
 * soup and reads FLAT. Both show a tet-marched isosurface, and it is the flat
 * shading that shows the surface the extraction actually found rather than an
 * interpolation of it — so the saved copy matches the preview the operator
 * approved instead of subtly smoothing when the scene reloads.
 */
const AnnotationSurface = ({
  vectors,
  faces,
  style,
  onSelect,
}: {
  vectors: number[][];
  faces: number[][];
  style: ShapeStyle;
  /** Undefined in PROBE mode — see `AnnotationShape`'s `handleSelect`. */
  onSelect?: (event: ThreeEvent<MouseEvent>) => void;
}) => {
  const geometry = useMemo(() => {
    const positions = new Float32Array(vectors.length * 3);
    for (let i = 0; i < vectors.length; i++) {
      const vector = vectors[i];
      positions[i * 3] = vector[0] ?? 0;
      positions[i * 3 + 1] = vector[1] ?? 0;
      positions[i * 3 + 2] = vector[2] ?? 0;
    }
    const indexed = new THREE.BufferGeometry();
    indexed.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    indexed.setIndex(faces.flat());
    const soup = indexed.toNonIndexed();
    indexed.dispose();
    soup.computeVertexNormals();
    return soup;
  }, [vectors, faces]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const opacity = style.fillOpacity > 0 ? style.fillOpacity : 0.35;
  // Draw order matters against an intensity volume. The volume composites
  // ADDITIVELY at renderOrder 1 (directly, or via the compositor's quad), and
  // a translucent mesh at the default renderOrder 0 is drawn BEFORE it — the
  // volume is then summed over the surface and drowns it, so the surface only
  // showed once the intensity layer was hidden. renderOrder 2 puts it above
  // the composited volume, the slot labels already use. A fully opaque surface
  // is additionally left non-`transparent` so the compositor's depth prepass
  // treats it as an occluder (`passVisibility.isOpaqueDepthWriter`), exactly
  // like an opaque fabriks mesh: the volume behind it is hidden rather than
  // added on top.
  const transparent = opacity < 1;
  return (
    <mesh geometry={geometry} frustumCulled={false} onClick={onSelect} renderOrder={2}>
      <meshStandardMaterial
        color={style.fill ?? style.stroke}
        transparent={transparent}
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/**
 * Point annotations, held at a constant size on screen.
 *
 * A point used to be a disc of 1.5 COLLECTION units, which on a 512 µm field
 * is sub-pixel as soon as you zoom out — invisible, and far too small to
 * click. All of a collection's points now draw as ONE `InstancedMesh` (per
 * opacity value): the previous per-point component ran a `useFrame` closure
 * per point per frame and held its own geometry + material. The screen-size
 * scaling stays imperative off the camera rather than through a
 * `worldUnitsPerPixel` subscription, the same reason `VertexHandles` does it
 * that way: the store field is throttled, and subscribing would re-render
 * every annotation in the scene on every camera move (P17). The scale is
 * written into the instance MATRICES (not a shader uniform) so the raycast —
 * which reads the CPU-side matrices — picks exactly what is drawn.
 */
const POINT_RADIUS_PX = 5;

type PointEntry = {
  id: string;
  position: [number, number, number];
  color: string;
  opacity: number;
  roi: SelectedRoi;
};

const POINT_SCRATCH_MATRIX = new THREE.Matrix4();
const POINT_SCRATCH_COLOR = new THREE.Color();

const AnnotationPoints = ({
  entries,
  opacity,
  selectable,
  onSelectRoi,
}: {
  entries: PointEntry[];
  opacity: number;
  selectable: boolean;
  onSelectRoi: (roi: SelectedRoi, appendSelection: boolean) => void;
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  /** Last written screen-size scale; 0 until the first frame (nothing draws
   * at the wrong size before the first `useFrame`, like the old `scale={0}`). */
  const scaleRef = useRef(0);

  // Grow-only capacity so entry-count churn (z-scrub filtering) doesn't
  // reconstruct the InstancedMesh every step; `count` trims the draw.
  const capacity = useMemo(
    () => Math.max(16, 2 ** Math.ceil(Math.log2(Math.max(1, entries.length)))),
    [entries.length],
  );

  const writeMatrices = (mesh: THREE.InstancedMesh, scale: number) => {
    for (let i = 0; i < entries.length; i++) {
      const [x, y, z] = entries[i].position;
      POINT_SCRATCH_MATRIX.makeScale(scale, scale, scale).setPosition(x, y, z);
      mesh.setMatrixAt(i, POINT_SCRATCH_MATRIX);
    }
    mesh.count = entries.length;
    mesh.instanceMatrix.needsUpdate = true;
  };

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    writeMatrices(mesh, scaleRef.current);
    for (let i = 0; i < entries.length; i++) {
      mesh.setColorAt(i, POINT_SCRATCH_COLOR.set(entries[i].color));
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, capacity]);

  useFrame(({ camera, size }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const scale = computeWorldUnitsPerPixel(camera, size.height) * POINT_RADIUS_PX;
    // One epsilon-gated batch rewrite instead of N per-frame closures: the
    // scale is shared by every point (it depends only on the camera), so
    // most frames skip entirely.
    if (Math.abs(scale - scaleRef.current) <= scaleRef.current * 0.002) return;
    scaleRef.current = scale;
    writeMatrices(mesh, scale);
  });

  const handleClick = selectable
    ? (event: ThreeEvent<MouseEvent>) => {
        const entry = event.instanceId !== undefined ? entries[event.instanceId] : undefined;
        if (!entry) return;
        event.stopPropagation();
        onSelectRoi(entry.roi, event.nativeEvent.shiftKey);
      }
    : undefined;

  return (
    <instancedMesh
      key={capacity}
      ref={meshRef}
      args={[UNIT_CIRCLE_16, undefined, capacity]}
      onClick={handleClick}
    >
      <meshBasicMaterial transparent opacity={opacity} side={THREE.DoubleSide} />
    </instancedMesh>
  );
};

type AnnotationShapeProps = {
  annotation: SceneAnnotationFragment | SceneSurfaceFragment;
  roi: SelectedRoi;
  flattenToPlane: boolean;
  /**
   * The slice the flat view is drawing, in the COLLECTION's space — what a
   * volumetric shape is sectioned against. Null in 3D, and in a scene with no
   * z axis to scrub.
   */
  planeZ: number | null;
  isActive: boolean;
  /** False in PROBE mode, so a shape can't swallow the click meant for a probe. */
  selectable: boolean;
  /** True when the collection's merged outline batch draws the fat lines —
   * the shape then renders only its interiors/wireframes (see
   * `annotationBatch.ts`, whose `outlinePoints` mirrors these branches). */
  suppressOutlines: boolean;
  onSelectRoi: (roi: SelectedRoi, appendSelection: boolean) => void;
};

/**
 * Only the ellipse/sphere branch reads `planeZ` (the cross-section it draws);
 * every other kind renders identically for any plane, so the memo below can
 * ignore z-scrub ticks for them — a scrub then re-renders ONLY the sectioned
 * shapes instead of the whole collection.
 */
const shapeReadsPlaneZ = (annotation: SceneAnnotationFragment): boolean =>
  annotation.kind === AnnotationKind.Ellipse || annotation.kind === AnnotationKind.Sphere;

const shapePropsEqual = (
  prev: AnnotationShapeProps,
  next: AnnotationShapeProps,
): boolean =>
  prev.annotation === next.annotation &&
  prev.roi === next.roi &&
  prev.flattenToPlane === next.flattenToPlane &&
  prev.isActive === next.isActive &&
  prev.selectable === next.selectable &&
  prev.suppressOutlines === next.suppressOutlines &&
  prev.onSelectRoi === next.onSelectRoi &&
  (prev.planeZ === next.planeZ || !shapeReadsPlaneZ(next.annotation));

/** One shape, in the collection's space (the parent group applies the affine). */
const AnnotationShape = memo(function AnnotationShape({
  annotation,
  roi,
  flattenToPlane,
  planeZ,
  isActive,
  selectable,
  suppressOutlines,
  onSelectRoi,
}: AnnotationShapeProps) {
  const vectors = annotation.vectors; // Array of [x, y, z]
  if (!vectors || vectors.length === 0) return null;

  const style = resolveStyle(annotation, isActive);

  // `undefined` when the shape is not selectable, NOT a handler that returns
  // early: a handler prop is what puts the object in R3F's interaction set, and
  // click-class events raycast that set UNFILTERED. An always-attached onClick
  // therefore made every click in PROBE mode walk every annotation — and a
  // traced path is one Line2 whose raycast is per-segment, over thousands of
  // vertices, with `LinePickTuning` widening the pick band on top. Passing
  // undefined drops them out of the raycast entirely; the layer underneath
  // then receives the event because nothing intercepted it, which is what the
  // early return used to achieve at full cost.
  const handleSelect = selectable
    ? (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelectRoi(roi, event.nativeEvent.shiftKey);
      }
    : undefined;

  if (annotation.kind === AnnotationKind.Line && vectors.length >= 2) {
    // The batch draws the stroke AND owns the pick (segment → roi mapping).
    if (suppressOutlines) return null;
    return (
      <Line
        points={vectors.map((vector) => getVectorPoint(vector, flattenToPlane))}
        color={style.stroke}
        lineWidth={style.strokeWidth}
        onClick={handleSelect}
      />
    );
  }

  // CUBE shares the rectangle branch: same corner-pair vectors, and the branch
  // already extrudes to a box whenever the corners span depth (which a cube's
  // always do) and falls back to the rectangle footprint when flattened.
  if (
    (annotation.kind === AnnotationKind.Rectangle || annotation.kind === AnnotationKind.Cube) &&
    vectors.length >= 2
  ) {
    const [[x0, y0, z0], [x1, y1, z1]] = vectors.map((vector) =>
      getVectorPoint(vector, flattenToPlane),
    );
    const width = Math.abs(x1 - x0);
    const height = Math.abs(y1 - y0);
    const depth = Math.abs(z1 - z0);

    if (!flattenToPlane && depth >= MIN_DEPTH) {
      const centerX = (x0 + x1) / 2;
      const centerY = (y0 + y1) / 2;
      const centerZ = (z0 + z1) / 2;

      return (
        <group onClick={handleSelect}>
          {style.fill && (
            <mesh
              position={[centerX, centerY, centerZ]}
              scale={[width, height, depth]}
              geometry={UNIT_BOX}
            >
              <meshBasicMaterial
                color={style.fill}
                transparent
                opacity={style.fillOpacity}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
          <mesh
            position={[centerX, centerY, centerZ]}
            scale={[width, height, depth]}
            geometry={UNIT_BOX}
          >
            <meshBasicMaterial
              color={style.stroke}
              wireframe
              transparent
              opacity={style.strokeOpacity * 0.85}
            />
          </mesh>
        </group>
      );
    }

    return (
      <group onClick={handleSelect}>
        {/* Always present, invisible when unfilled: the interior is what makes
            a rectangle clickable anywhere rather than only on its edge. */}
        <mesh
          position={[(x0 + x1) / 2, (y0 + y1) / 2, z0]}
          scale={[width, height, 1]}
          geometry={UNIT_PLANE}
        >
          <InteriorMaterial style={style} />
        </mesh>
        {!suppressOutlines && (
          <Line
            points={[
              [x0, y0, z0],
              [x1, y0, z0],
              [x1, y1, z0],
              [x0, y1, z0],
              [x0, y0, z0],
            ]}
            color={style.stroke}
            lineWidth={style.strokeWidth}
          />
        )}
      </group>
    );
  }

  // SPHERE shares the ellipsis branch: its corner-pair vectors are symmetric
  // (center ± r), so the scaled-unit-sphere path renders a true sphere in 3D
  // and the flattened path draws the ellipse the current plane cuts out of it.
  if (
    (annotation.kind === AnnotationKind.Ellipse || annotation.kind === AnnotationKind.Sphere) &&
    vectors.length >= 2
  ) {
    const [[x0, y0, z0], [x1, y1, z1]] = vectors.map((vector) =>
      getVectorPoint(vector, flattenToPlane),
    );
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const cz = (z0 + z1) / 2;
    const rx = Math.abs(x1 - x0) / 2;
    const ry = Math.abs(y1 - y0) / 2;
    const rz = Math.abs(z1 - z0) / 2;

    if (!flattenToPlane && rz >= MIN_DEPTH) {
      return (
        <group onClick={handleSelect}>
          {style.fill && (
            <mesh position={[cx, cy, cz]} scale={[rx, ry, rz]} geometry={UNIT_SPHERE}>
              <meshBasicMaterial
                color={style.fill}
                transparent
                opacity={style.fillOpacity}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
          <mesh position={[cx, cy, cz]} scale={[rx, ry, rz]} geometry={UNIT_SPHERE}>
            <meshBasicMaterial
              color={style.stroke}
              wireframe
              transparent
              opacity={style.strokeOpacity * 0.85}
            />
          </mesh>
        </group>
      );
    }

    // One ring: either a flat ellipse seen face-on, or the cross-section the
    // flat view's plane cuts out of an ellipsoid. `getVectorPoint` has already
    // discarded z for drawing, so the depth the section needs comes from the
    // raw vectors.
    const depthCenter = ((vectors[0][2] ?? 0) + (vectors[1][2] ?? 0)) / 2;
    const depthRadius = Math.abs((vectors[1][2] ?? 0) - (vectors[0][2] ?? 0)) / 2;
    const section =
      planeZ === null || depthRadius < MIN_DEPTH
        ? 1
        : Math.max(
            ellipsoidCrossSectionScale(planeZ, depthCenter, depthRadius) ?? 0,
            // The plane is past the pole — it only reached this shape through
            // the visibility slab's half-slice of slack. Mark where the
            // ellipsoid ends rather than collapsing to nothing.
            MIN_CROSS_SECTION_SCALE,
          );

    const points = ellipseRing(cx, cy, z0, rx * section, ry * section, 48);
    points.push(points[0]);

    return (
      <group onClick={handleSelect}>
        {/* Scaled to the SECTIONED radii, so what can be clicked is what is
            drawn — a sphere cut near its pole is a small target, not its
            equator's worth. */}
        <mesh
          position={[cx, cy, z0]}
          scale={[rx * section, ry * section, 1]}
          geometry={UNIT_CIRCLE_48}
        >
          <InteriorMaterial style={style} />
        </mesh>
        {!suppressOutlines && (
          <Line points={points} color={style.stroke} lineWidth={style.strokeWidth} />
        )}
      </group>
    );
  }

  // A painted region: the only kind whose geometry is indexed, so it is the only
  // one that reads `faces` rather than the vector list alone. Flattening it to a
  // plane is not attempted — a section through a surface is a set of contours,
  // not a shape this component draws — so it renders in 3D and sits out the flat
  // view, which is also the only mode the brush and blob tools are offered in.
  if (annotation.kind === AnnotationKind.Surface) {
    const faces = "faces" in annotation ? annotation.faces : null;
    if (flattenToPlane || !faces || faces.length === 0) return null;
    return (
      <AnnotationSurface
        vectors={vectors}
        faces={faces}
        style={style}
        onSelect={handleSelect}
      />
    );
  }

  if ((annotation.kind === AnnotationKind.Polygon || annotation.kind === AnnotationKind.Path) && vectors.length >= 2) {
    const pts = vectors.map((vector) => getVectorPoint(vector, flattenToPlane));
    const isPolygon = annotation.kind === AnnotationKind.Polygon;
    // A path is open: it has a stroke to click and no inside to speak of.
    const interior = isPolygon ? [...pts] : null;
    if (isPolygon) pts.push(pts[0]); // close polygon

    // A batched path has nothing left to draw here; a polygon keeps its
    // pickable interior.
    if (suppressOutlines && !interior) return null;

    return (
      <group onClick={handleSelect}>
        {interior && <PolygonInterior points={interior} style={style} />}
        {!suppressOutlines && (
          <Line points={pts} color={style.stroke} lineWidth={style.strokeWidth} />
        )}
      </group>
    );
  }

  // Fallback: render any shape as a polyline
  if (vectors.length >= 2) {
    if (suppressOutlines) return null;
    return (
      <Line
        points={vectors.map((vector) => getVectorPoint(vector, flattenToPlane))}
        color={style.stroke}
        lineWidth={style.strokeWidth}
        onClick={handleSelect}
      />
    );
  }

  return null;
}, shapePropsEqual);
