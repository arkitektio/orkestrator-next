/**
 * What the scene STRUCTURALLY is: which scene, which world, which layers in
 * which order, and each layer's placement-path topology — the facts a store
 * scope is built around and cannot absorb in place (new zarr arrays, moved
 * layers, a different world frame).
 *
 * Everything else the fragment carries — render graphs, opacity, visibility,
 * preferredView, animations, snapshots — is CONTENT: every mutation of it
 * already folds its result into the right store at the call site
 * (`updateLayer`, `setPreferredView`, `upsertAnimation`, ROI selection), so a
 * cache re-emission that only changes content must not rebuild the scope.
 * Apollo hands out a fresh `scene` object identity on ANY normalized write the
 * query selects, which is exactly why `SceneProvider` keys on this signature
 * and never on identity — keying on identity reloaded the whole scene on
 * every contrast save.
 *
 * `(transformation.id, version)` detects registration refinements: the server
 * rewrites the edge in place and bumps `version` (selected by the
 * PlacementStep fragment for this purpose).
 *
 * Kept free of generated imports so its suite runs in `node` — the same
 * discipline as `transformGraph.ts`.
 */

/** Structural subset of the `Scene` fragment the signature reads. */
export type SceneStructureLike = {
  id: string;
  worldCoordinateSystem?: { id: string } | null;
  layers: readonly {
    id: string;
    pathToWorld?:
      | readonly {
          transformation?: { id?: string; version?: number | null } | null;
          inverted: boolean;
        }[]
      | null;
  }[];
};

export const sceneStructureSignature = (scene: SceneStructureLike): string =>
  JSON.stringify({
    id: scene.id,
    world: scene.worldCoordinateSystem?.id ?? null,
    layers: scene.layers.map((layer) => ({
      id: layer.id,
      path:
        layer.pathToWorld?.map((step) => [
          step.transformation?.id ?? null,
          step.transformation?.version ?? null,
          step.inverted,
        ]) ?? null,
    })),
  });
