import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";

import {
  SceneLayerFragment,
  useGetAnnotationsQuery,
  type ListAnnotationFragment,
  RoiKind,
} from "@/mikro-next/api/graphql";
import { composePlacementPath } from "@/mikro-next/lib/coords/transformGraph";

import { Line } from "../../primitives/Line";
import { affineToMatrix4 } from "../../core/worldTransform";
import { useModeStore } from "../../store/modeStore";
import { type RoiBounds, useRoiSelectionStore } from "../../store/roiSelectionStore";
import { useSceneStore } from "../../store/sceneStore";
import type { SceneTransformContext } from "../../core/layerModel";

/**
 * AnnotationLayer renderer: the drawn shapes of one AnnotationCollection.
 *
 * The collection — not the scene, and not a dataset — owns the coordinate
 * system the vectors live in, so the layer's server-resolved `pathToWorld` is
 * the one placement question with an answer here. Composing it follows the
 * MeshLayer path (`composePlacementPath` + `affineToMatrix4`); unlike meshes
 * there is no image-layer frame to prefer, because a collection's space is its
 * own rather than a pyramid level of somebody's array.
 *
 * Styling is per-shape: an AnnotationLayer draws a whole collection, so stroke
 * and fill live on each Annotation and are read off the query, not the layer.
 */

type AnnotationLayerVariant = Extract<SceneLayerFragment, { __typename: "AnnotationLayer" }>;
type AnnotationCollectionRef = AnnotationLayerVariant["annotationCollection"];

const ANNOTATION_RENDER_Z = 0.15;
const MIN_DEPTH = 0.001;
const DEFAULT_STROKE = "#38bdf8";
const ACTIVE_STROKE = "#f59e0b";
/** Fill alpha for a shape that asks to be filled but names no fill color. */
const IMPLIED_FILL_OPACITY = 0.08;

/** RGBA as four 0-255 ints (the schema's `[Int!]`) → a three-ready color + alpha. */
function rgbaToStyle(
  rgba: readonly number[] | null | undefined,
): { color: string; opacity: number } | null {
  if (!rgba || rgba.length < 3) return null;
  const channel = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)))
      .toString(16)
      .padStart(2, "0");
  const alpha = rgba[3];
  return {
    color: `#${channel(rgba[0])}${channel(rgba[1])}${channel(rgba[2])}`,
    opacity: alpha === undefined ? 1 : Math.max(0, Math.min(1, alpha / 255)),
  };
}

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
function resolveStyle(annotation: ListAnnotationFragment, isActive: boolean): ShapeStyle {
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

function getVectorPoint(vector: number[], flattenToPlane: boolean): [number, number, number] {
  return [vector[0] ?? 0, vector[1] ?? 0, flattenToPlane ? ANNOTATION_RENDER_Z : (vector[2] ?? 0)];
}

function getRectangleCorners(
  start: number[],
  end: number[],
  flattenToPlane: boolean,
): [number, number, number][] {
  const [x0, y0, z0] = getVectorPoint(start, flattenToPlane);
  const [x1, y1, z1] = getVectorPoint(end, flattenToPlane);

  if (flattenToPlane || Math.abs(z1 - z0) < MIN_DEPTH) {
    return [
      [x0, y0, z0],
      [x1, y0, z0],
      [x1, y1, z0],
      [x0, y1, z0],
    ];
  }

  return [
    [x0, y0, z0],
    [x1, y0, z0],
    [x1, y1, z0],
    [x0, y1, z0],
    [x0, y0, z1],
    [x1, y0, z1],
    [x1, y1, z1],
    [x0, y1, z1],
  ];
}

function getEllipsisPoints(
  start: number[],
  end: number[],
  flattenToPlane: boolean,
  segments = 24,
): [number, number, number][] {
  const [x0, y0, z0] = getVectorPoint(start, flattenToPlane);
  const [x1, y1, z1] = getVectorPoint(end, flattenToPlane);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const rx = Math.abs(x1 - x0) / 2;
  const ry = Math.abs(y1 - y0) / 2;
  const points: [number, number, number][] = [];

  for (let index = 0; index < segments; index += 1) {
    const theta = (index / segments) * Math.PI * 2;
    points.push([cx + rx * Math.cos(theta), cy + ry * Math.sin(theta), z0]);
  }

  if (!flattenToPlane && Math.abs(z1 - z0) >= MIN_DEPTH) {
    for (let index = 0; index < segments; index += 1) {
      const theta = (index / segments) * Math.PI * 2;
      points.push([cx + rx * Math.cos(theta), cy + ry * Math.sin(theta), z1]);
    }
  }

  return points;
}

function getAnnotationSelectionPoints(
  annotation: ListAnnotationFragment,
  flattenToPlane: boolean,
): [number, number, number][] {
  const vectors = annotation.vectors;
  if (!vectors || vectors.length === 0) return [];

  if (annotation.kind === RoiKind.Point && vectors.length >= 1) {
    return [getVectorPoint(vectors[0], flattenToPlane)];
  }

  if (annotation.kind === RoiKind.Line && vectors.length >= 2) {
    return vectors.map((vector) => getVectorPoint(vector, flattenToPlane));
  }

  if (annotation.kind === RoiKind.Rectangle && vectors.length >= 2) {
    return getRectangleCorners(vectors[0], vectors[1], flattenToPlane);
  }

  if (annotation.kind === RoiKind.Ellipsis && vectors.length >= 2) {
    return getEllipsisPoints(vectors[0], vectors[1], flattenToPlane);
  }

  return vectors.map((vector) => getVectorPoint(vector, flattenToPlane));
}

function getWorldBounds(
  annotation: ListAnnotationFragment,
  affineMatrix: THREE.Matrix4,
): RoiBounds | null {
  const points = getAnnotationSelectionPoints(annotation, false);
  if (points.length === 0) return null;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  points.forEach(([x, y, z]) => {
    const world = new THREE.Vector3(x, y, z).applyMatrix4(affineMatrix);
    minX = Math.min(minX, world.x);
    maxX = Math.max(maxX, world.x);
    minY = Math.min(minY, world.y);
    maxY = Math.max(maxY, world.y);
  });

  return { minX, maxX, minY, maxY };
}

/**
 * The collection's drawing space → scene world. The collection owns its
 * coordinate system, so its axes name the columns of every edge on the path;
 * `spatial` is the (x, y, z) triple the composer reads them out in.
 */
function resolveCollectionMatrix(
  layer: AnnotationLayerVariant,
  collection: AnnotationCollectionRef,
  transformContext: SceneTransformContext,
): THREE.Matrix4 {
  const names = (collection.coordinateSystem.axes ?? []).map((axis) => axis.name);
  const spatial = [names[names.length - 1], names[names.length - 2], names[names.length - 3]];
  const composed = composePlacementPath(layer.pathToWorld, transformContext, spatial, names);
  if (!composed) {
    // A null path is UNREGISTERED or UNMAPPABLE — the layer's `placement` says
    // which, but the shared SceneLayer fragment does not select it. The shapes
    // are still drawn, in the collection's own space, rather than dropped
    // silently.
    console.warn(
      `[annotation] collection ${collection.id}: no path to world; ` +
        `drawing in the collection's own space`,
    );
    return new THREE.Matrix4().identity();
  }
  return affineToMatrix4(composed);
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
  const displayMode = useModeStore((s) => s.displayMode);
  const selectedRois = useRoiSelectionStore((s) => s.selectedRois);
  const selectOnlyRoi = useRoiSelectionStore((s) => s.selectOnlyRoi);
  const toggleSelectedRoi = useRoiSelectionStore((s) => s.toggleSelectedRoi);
  const setVisibleLayerRois = useRoiSelectionStore((s) => s.setVisibleLayerRois);
  const clearVisibleLayerRois = useRoiSelectionStore((s) => s.clearVisibleLayerRois);

  const { data } = useGetAnnotationsQuery({
    variables: { filters: { collection: collection.id } },
    pollInterval: 5000,
  });

  const affineMatrix = useMemo(
    () => resolveCollectionMatrix(layer, collection, transformContext),
    [collection, layer, transformContext],
  );

  const annotations = data?.annotations;
  const visibleRois = useMemo(() => {
    if (!annotations) return [];

    return annotations
      .map((annotation) => {
        const bounds = getWorldBounds(annotation, affineMatrix);
        if (!bounds) return null;

        return {
          id: annotation.id,
          layerId,
          name: annotation.name,
          kind: annotation.kind,
          bounds,
        };
      })
      .filter((roi): roi is NonNullable<typeof roi> => roi !== null);
  }, [affineMatrix, annotations, layerId]);

  useEffect(() => {
    setVisibleLayerRois(layerId, visibleRois);

    return () => {
      clearVisibleLayerRois(layerId);
    };
  }, [clearVisibleLayerRois, layerId, setVisibleLayerRois, visibleRois]);

  if (!annotations || annotations.length === 0) return null;
  const selectedRoiIds = new Set(selectedRois.map((roi) => roi.id));

  return (
    <group matrix={affineMatrix} matrixAutoUpdate={false}>
      {annotations.map((annotation) => (
        <AnnotationShape
          key={annotation.id}
          annotation={annotation}
          flattenToPlane={displayMode !== "3D"}
          isActive={selectedRoiIds.has(annotation.id)}
          onSelect={(appendSelection) => {
            const selectedRoi = {
              id: annotation.id,
              layerId,
              name: annotation.name,
              kind: annotation.kind,
            };

            if (appendSelection) {
              toggleSelectedRoi(selectedRoi);
              return;
            }

            selectOnlyRoi(selectedRoi);
          }}
        />
      ))}
    </group>
  );
};

/** One shape, in the collection's space (the parent group applies the affine). */
const AnnotationShape = ({
  annotation,
  flattenToPlane,
  isActive,
  onSelect,
}: {
  annotation: ListAnnotationFragment;
  flattenToPlane: boolean;
  isActive: boolean;
  onSelect: (appendSelection: boolean) => void;
}) => {
  const vectors = annotation.vectors; // Array of [x, y, z]
  if (!vectors || vectors.length === 0) return null;

  const style = resolveStyle(annotation, isActive);

  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(event.nativeEvent.shiftKey);
  };

  if (annotation.kind === RoiKind.Point && vectors.length >= 1) {
    const [x, y, z] = getVectorPoint(vectors[0], flattenToPlane);
    return (
      <mesh position={[x, y, z]} onClick={handleSelect}>
        <circleGeometry args={[1.5, 16]} />
        <meshBasicMaterial
          color={style.stroke}
          transparent
          opacity={style.strokeOpacity * 0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }

  if (annotation.kind === RoiKind.Line && vectors.length >= 2) {
    return (
      <Line
        points={vectors.map((vector) => getVectorPoint(vector, flattenToPlane))}
        color={style.stroke}
        lineWidth={style.strokeWidth}
        onClick={handleSelect}
      />
    );
  }

  if (annotation.kind === RoiKind.Rectangle && vectors.length >= 2) {
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
        {style.fill && (
          <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, z0]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial
              color={style.fill}
              transparent
              opacity={style.fillOpacity}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
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

  if (annotation.kind === RoiKind.Ellipsis && vectors.length >= 2) {
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

    const points = getEllipsisPoints(vectors[0], vectors[1], flattenToPlane, 48);
    if (flattenToPlane || Math.abs(z1 - z0) < MIN_DEPTH) {
      points.push(points[0]);
    }

    return (
      <Line
        points={points}
        color={style.stroke}
        lineWidth={style.strokeWidth}
        onClick={handleSelect}
      />
    );
  }

  if ((annotation.kind === RoiKind.Polygon || annotation.kind === RoiKind.Path) && vectors.length >= 2) {
    const pts = vectors.map((vector) => getVectorPoint(vector, flattenToPlane));
    if (annotation.kind === RoiKind.Polygon) pts.push(pts[0]); // close polygon
    return (
      <Line
        points={pts}
        color={style.stroke}
        lineWidth={style.strokeWidth}
        onClick={handleSelect}
      />
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
