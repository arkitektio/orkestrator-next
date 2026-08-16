import * as THREE from "three";
import { FabriksStoreFragment, SceneLayerFragment } from "@/mikro-next/api/graphql";
import { composePlacementPath } from "@/mikro-next/lib/coords/transformGraph";
import type { SceneTransformContext } from "../../core/layerModel";
import { affineToMatrix4 } from "../../core/worldTransform";

/**
 * A mesh collection's placement: `pathToWorld` composed through the transform
 * graph — and NOTHING else (COORDINATE_SYSTEMS.md, "Coordinate conventions").
 *
 * A mesh is continuous data IN its coordinate system, so the graph is the
 * complete CS→world story: coordinate c renders at exactly `pathToWorld(c)`.
 * No anchoring to another layer's frame, no shape-derived recentering, no
 * client-injected flips — any origin or raster convention is the server's to
 * express as transform edges (or the writer's, in the vertices themselves).
 * This is the same rule `core/annotationBounds.ts` applies to annotations;
 * images differ only in owning an additional index→local map.
 *
 * Pure and React-free so placement is unit-testable without R3F or Apollo.
 */

export type MeshLayerVariant = Extract<SceneLayerFragment, { __typename: "MeshLayer" }>;
export type MeshCollectionRef = NonNullable<MeshLayerVariant["collection"]>;

/**
 * The collection's axis names in VERTEX COMPONENT order, or null if unstated.
 *
 * fabriks addresses components by position — `cellSize[0]`, `bbox_*_x` — and
 * says nothing about which physical axis a slot is, so a collection cut from
 * (z, y, x) data is entirely consistent and would render transposed if the
 * renderer assumed otherwise. This is the store telling us the mapping, and it
 * is the only trustworthy source for it.
 */
export const fabriksAxisOrder = (node: FabriksStoreFragment): string[] | null =>
  node.axes && node.axes.length > 0 ? [...node.axes] : null;

/**
 * The collection's spatial axis names in VERTEX-COMPONENT (x, y, z slot)
 * order — the one place the slot↔axis convention lives (used by placement
 * AND by the attribute tracker turning a mesh probe's voxelIndex into named
 * coordinates).
 */
export const collectionSpatialAxes = (
  collection: MeshCollectionRef,
): [string | undefined, string | undefined, string | undefined] => {
  const names = (collection.coordinateSystem.axes ?? []).map((axis) => axis.name);
  const declared = fabriksAxisOrder(collection.store);
  return declared
    ? [declared[0], declared[1], declared[2]]
    : [names[names.length - 1], names[names.length - 2], names[names.length - 3]];
};

/** Placement warnings fire once per collection, not once per recompute — the
 * caller's matrix memo re-runs on unrelated store identity churn. */
const warnedCollections = new Set<string>();

export function resolveCollectionMatrix(
  layer: MeshLayerVariant,
  collection: MeshCollectionRef,
  transformContext: SceneTransformContext,
): THREE.Matrix4 {
  const names = (collection.coordinateSystem.axes ?? []).map((axis) => axis.name);
  // Components are slots: slot 0 is the vertex's first component, which is the
  // matrix's x. The store names them in that order when it can; fabriks itself
  // addresses components by position and says nothing about physical axes, so
  // the store's declaration is the only trustworthy source for the mapping.
  const declared = fabriksAxisOrder(collection.store);
  const spatial = declared
    ? [declared[0], declared[1], declared[2]]
    : [names[names.length - 1], names[names.length - 2], names[names.length - 3]];

  const firstResolve = !warnedCollections.has(collection.id);
  if (firstResolve) warnedCollections.add(collection.id);
  if (!declared && firstResolve) {
    console.warn(
      `[fabriks] store ${collection.store.id} declares no axis order; assuming the coordinate ` +
        `system's last three axes map to vertex components 0, 1, 2. A collection written in a ` +
        `different component order will render transposed.`,
    );
  }

  const composed = composePlacementPath(layer.pathToWorld, transformContext, spatial, names);
  if (!composed) {
    // A null path is UNREGISTERED or UNMAPPABLE. The meshes are still drawn,
    // in the collection's own space, rather than dropped silently — the same
    // degradation images and annotations use.
    if (firstResolve) {
      console.warn(
        `[fabriks] collection ${collection.id}: no path to world; ` +
          `rendering in the collection's own space`,
      );
    }
    return new THREE.Matrix4().identity();
  }
  return affineToMatrix4(composed);
}
