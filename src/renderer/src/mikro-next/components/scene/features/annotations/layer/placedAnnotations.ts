import type * as THREE from "three";

import { AnnotationKind, type SceneAnnotationFragment } from "@/mikro-next/api/graphql";
import { getVectorPoint, getWorldExtent } from "../annotationBounds";
import { resolveStyle } from "../annotationStyle";
import type { ZSpan } from "../annotationVisibility";
import type { RoiBounds, SelectedRoi } from "../roiSelectionStore";

/**
 * The PURE half of the annotation layer's data flow: query rows → placed
 * entries → point/shape split. Extracted from the component so the memo
 * bodies are unit-testable — and so the one identity invariant everything
 * hangs on is enforced in exactly one place:
 *
 * **A row that did not change keeps its `PlacedEntry` (and `roi`) identity.**
 * Apollo preserves row object identity across polls for unchanged rows;
 * caching the placement per row (WeakMap) extends that stability through the
 * whole chain — `shapePropsEqual` compares `roi` by reference, so a poll
 * that changes one annotation re-renders ONE shape, not the collection
 * (previously every recompute minted fresh `roi` objects and re-rendered
 * everything).
 */

export type PlacedEntry = {
  annotation: SceneAnnotationFragment;
  bounds: RoiBounds;
  zSpan: ZSpan;
  roi: SelectedRoi;
};

/** The per-layer constants of a placement — memoize ONE object per layer. */
export type PlacementIdentity = {
  layerId: string;
  systemId: string | null;
  axisNames: string[];
};

type CacheSlot = {
  matrix: THREE.Matrix4;
  identity: PlacementIdentity;
  entry: PlacedEntry;
};

const PLACEMENT_CACHE = new WeakMap<SceneAnnotationFragment, CacheSlot>();

export function placeAnnotations(
  annotations: readonly SceneAnnotationFragment[],
  matrix: THREE.Matrix4,
  identity: PlacementIdentity,
): PlacedEntry[] {
  const out: PlacedEntry[] = [];
  for (const annotation of annotations) {
    const cached = PLACEMENT_CACHE.get(annotation);
    if (cached && cached.matrix === matrix && cached.identity === identity) {
      out.push(cached.entry);
      continue;
    }
    const extent = getWorldExtent(annotation, matrix);
    if (!extent) continue;
    const entry: PlacedEntry = {
      annotation,
      bounds: extent.bounds,
      zSpan: extent.zSpan,
      roi: {
        id: annotation.id,
        layerId: identity.layerId,
        name: annotation.name,
        kind: annotation.kind,
        systemId: identity.systemId,
        axisNames: identity.axisNames,
        vectors: annotation.vectors ?? [],
        coordinates: annotation.coordinates ?? [],
      },
    };
    PLACEMENT_CACHE.set(annotation, { matrix, identity, entry });
    out.push(entry);
  }
  return out;
}

export type PointEntry = {
  id: string;
  position: [number, number, number];
  color: string;
  opacity: number;
  roi: SelectedRoi;
};

/**
 * Points draw as instanced meshes (one per distinct opacity); everything else
 * stays a memoized shape. Same split the component used inline.
 */
export function splitPointEntries(
  shown: readonly PlacedEntry[],
  isSelected: (id: string) => boolean,
  flattenToPlane: boolean,
): { pointGroups: [number, PointEntry[]][]; otherShapes: PlacedEntry[] } {
  const points: PointEntry[] = [];
  const others: PlacedEntry[] = [];
  for (const entry of shown) {
    const { annotation } = entry;
    if (annotation.kind === AnnotationKind.Point && (annotation.vectors?.length ?? 0) >= 1) {
      const style = resolveStyle(annotation, isSelected(annotation.id));
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
  const byOpacity = new Map<number, PointEntry[]>();
  for (const point of points) {
    const bucket = byOpacity.get(point.opacity);
    if (bucket) bucket.push(point);
    else byOpacity.set(point.opacity, [point]);
  }
  return { pointGroups: [...byOpacity.entries()], otherShapes: others };
}

/** Element-wise identity: cached entries make this the cheap change test. */
export const sameEntries = (
  a: readonly PlacedEntry[] | null,
  b: readonly PlacedEntry[],
): boolean => a !== null && a.length === b.length && a.every((entry, i) => entry === b[i]);
