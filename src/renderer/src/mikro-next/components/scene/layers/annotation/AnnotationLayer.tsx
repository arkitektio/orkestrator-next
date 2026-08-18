import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";

import {
  useGetSceneAnnotationsQuery,
  type SceneAnnotationFragment,
  AnnotationKind,
} from "@/mikro-next/api/graphql";

import { Line } from "../../primitives/Line";
import { SPHERE_KIND, ellipsoidCrossSectionScale } from "../../core/primitiveDraw";
import { sceneZExtent } from "../../core/worldTransform";
import { repairedSelections } from "../../core/selectionRepair";
import { computeWorldUnitsPerPixel } from "../../core/probeWorld";
import {
  isAnnotationInView,
  sceneCoverages,
  type ScenePlane,
} from "../../core/annotationVisibility";
import {
  MIN_DEPTH,
  ellipseRing,
  getVectorPoint,
  getWorldExtent,
  resolveCollectionMatrix,
  type AnnotationCollectionRef,
  type AnnotationLayerVariant,
} from "../../core/annotationBounds";
import {
  ACTIVE_STROKE,
  DEFAULT_STROKE,
  IMPLIED_FILL_OPACITY,
  rgbaToStyle,
} from "../../core/annotationStyle";
import { useModeStore } from "../../store/modeStore";
import { useRoiDrawingStore } from "../../store/roiDrawingStore";
import { useRoiSelectionStore } from "../../store/roiSelectionStore";
import { useSceneStore } from "../../store/sceneStore";
import { useViewerStore } from "../../store/viewerStore";
import { useViewStoreApi } from "../../store/viewStore";

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

/** Smallest cross-section drawn for an ellipsoid the plane barely grazes. */
const MIN_CROSS_SECTION_SCALE = 0.05;

type ShapeStyle = {
  stroke: string;
  strokeOpacity: number;
  strokeWidth: number;
  fill: string | null;
  fillOpacity: number;
};

/**
 * A selected shape is drawn in the selection color regardless of its own — the
 * point of the highlight is that it overrides.
 */
function resolveStyle(annotation: SceneAnnotationFragment, isActive: boolean): ShapeStyle {
  const stroke = rgbaToStyle(annotation.strokeColor);
  const fill = rgbaToStyle(annotation.fillColor);
  const strokeColor = isActive ? ACTIVE_STROKE : (stroke?.color ?? DEFAULT_STROKE);

  return {
    stroke: strokeColor,
    strokeOpacity: isActive ? 1 : (stroke?.opacity ?? 1),
    strokeWidth: annotation.strokeWidth ?? 1.5,
    fill: annotation.filled ? (fill?.color ?? strokeColor) : null,
    fillOpacity: fill?.opacity ?? IMPLIED_FILL_OPACITY,
  };
}

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
    variables: { filters: { collection: collection.id } },
    pollInterval: 5000,
    // A poll landing mid-gesture re-renders and re-diffs the whole annotation
    // subtree while the user is dragging; skip those attempts (the next poll
    // after settle catches up).
    skipPollAttempt: () => viewApi.getState().cameraMoving,
  });

  const affineMatrix = useMemo(
    () => resolveCollectionMatrix(layer, collection, transformContext),
    [collection, layer, transformContext],
  );

  const annotations = data?.annotations;

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
  // existed could not know. See `core/selectionRepair.ts`: without this the
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

  if (shown.length === 0) return null;
  const selectedRoiIds = new Set(selectedRois.map((roi) => roi.id));

  return (
    <group matrix={affineMatrix} matrixAutoUpdate={false}>
      {shown.map(({ annotation, roi }) => (
        <AnnotationShape
          key={annotation.id}
          annotation={annotation}
          flattenToPlane={flattenToPlane}
          planeZ={planeZLocal}
          isActive={selectedRoiIds.has(annotation.id)}
          selectable={interactionMode !== "PROBE"}
          onSelect={(appendSelection) => {
            if (appendSelection) {
              toggleSelectedRoi(roi);
              return;
            }

            selectOnlyRoi(roi);
          }}
        />
      ))}
    </group>
  );
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
 * A point annotation, held at a constant size on screen.
 *
 * It used to be a disc of 1.5 COLLECTION units, which on a 512 µm field is
 * sub-pixel as soon as you zoom out — invisible, and far too small to click. The
 * scaling is imperative in `useFrame` off the camera rather than through a
 * `worldUnitsPerPixel` subscription, the same reason `VertexHandles` does it
 * that way: the store field is throttled, and subscribing would re-render every
 * annotation in the scene on every camera move (P17).
 */
const POINT_RADIUS_PX = 5;

const AnnotationPoint = ({
  position,
  color,
  opacity,
  onSelect,
}: {
  position: [number, number, number];
  color: string;
  opacity: number;
  /** Undefined in PROBE mode — see `AnnotationShape`'s `handleSelect`. */
  onSelect?: (event: ThreeEvent<MouseEvent>) => void;
}) => {
  const group = useRef<THREE.Group>(null);

  useFrame(({ camera, size }) => {
    if (!group.current) return;
    group.current.scale.setScalar(
      computeWorldUnitsPerPixel(camera, size.height) * POINT_RADIUS_PX,
    );
  });

  return (
    // `scale={0}` at mount so nothing draws at the wrong size for a frame; the
    // first useFrame sets the real radius before the first paint.
    <group ref={group} position={position} scale={0}>
      <mesh onClick={onSelect}>
        <circleGeometry args={[1, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

/** One shape, in the collection's space (the parent group applies the affine). */
const AnnotationShape = ({
  annotation,
  flattenToPlane,
  planeZ,
  isActive,
  selectable,
  onSelect,
}: {
  annotation: SceneAnnotationFragment;
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
  onSelect: (appendSelection: boolean) => void;
}) => {
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
        onSelect(event.nativeEvent.shiftKey);
      }
    : undefined;

  if (annotation.kind === AnnotationKind.Point && vectors.length >= 1) {
    return (
      <AnnotationPoint
        position={getVectorPoint(vectors[0], flattenToPlane)}
        color={style.stroke}
        opacity={style.strokeOpacity * 0.85}
        onSelect={handleSelect}
      />
    );
  }

  if (annotation.kind === AnnotationKind.Line && vectors.length >= 2) {
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
            <mesh position={[centerX, centerY, centerZ]}>
              <boxGeometry args={[width, height, depth]} />
              <meshBasicMaterial
                color={style.fill}
                transparent
                opacity={style.fillOpacity}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
          <mesh position={[centerX, centerY, centerZ]}>
            <boxGeometry args={[width, height, depth]} />
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
        <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, z0]}>
          <planeGeometry args={[width, height]} />
          <InteriorMaterial style={style} />
        </mesh>
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
      </group>
    );
  }

  // SPHERE shares the ellipsis branch: its corner-pair vectors are symmetric
  // (center ± r), so the scaled-unit-sphere path renders a true sphere in 3D
  // and the flattened path draws the ellipse the current plane cuts out of it.
  if (
    (annotation.kind === AnnotationKind.Ellipse || annotation.kind === SPHERE_KIND) &&
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
            <mesh position={[cx, cy, cz]} scale={[rx, ry, rz]}>
              <sphereGeometry args={[1, 24, 16]} />
              <meshBasicMaterial
                color={style.fill}
                transparent
                opacity={style.fillOpacity}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
          <mesh position={[cx, cy, cz]} scale={[rx, ry, rz]}>
            <sphereGeometry args={[1, 24, 16]} />
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
        <mesh position={[cx, cy, z0]} scale={[rx * section, ry * section, 1]}>
          <circleGeometry args={[1, 48]} />
          <InteriorMaterial style={style} />
        </mesh>
        <Line points={points} color={style.stroke} lineWidth={style.strokeWidth} />
      </group>
    );
  }

  if ((annotation.kind === AnnotationKind.Polygon || annotation.kind === AnnotationKind.Path) && vectors.length >= 2) {
    const pts = vectors.map((vector) => getVectorPoint(vector, flattenToPlane));
    const isPolygon = annotation.kind === AnnotationKind.Polygon;
    // A path is open: it has a stroke to click and no inside to speak of.
    const interior = isPolygon ? [...pts] : null;
    if (isPolygon) pts.push(pts[0]); // close polygon

    return (
      <group onClick={handleSelect}>
        {interior && <PolygonInterior points={interior} style={style} />}
        <Line points={pts} color={style.stroke} lineWidth={style.strokeWidth} />
      </group>
    );
  }

  // Fallback: render any shape as a polyline
  if (vectors.length >= 2) {
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
};
