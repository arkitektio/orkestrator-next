import { SceneLayerFragment } from "@/mikro-next/api/graphql";

/**
 * `Scene.layers` is a polymorphic `Layer` interface. The generated
 * `SceneLayerFragment` is a `__typename`-discriminated union of the concrete
 * layer variants. This extracts the variant types and provides type guards so
 * consumers can narrow before reading variant-only fields (e.g. `lens`,
 * `renderGraph` on ImageLayer, `labelRender` on LabelLayer).
 */
export type ImageLayerFragment = Extract<
  SceneLayerFragment,
  { __typename: "ImageLayer" }
>;

export type LabelLayerFragment = Extract<
  SceneLayerFragment,
  { __typename: "LabelLayer" }
>;

export const isImageLayer = (
  layer: SceneLayerFragment,
): layer is ImageLayerFragment => layer.__typename === "ImageLayer";

export const isLabelLayer = (
  layer: SceneLayerFragment,
): layer is LabelLayerFragment => layer.__typename === "LabelLayer";

/**
 * Layers backed by a BRICK POOL: an image and a label mask alike.
 *
 * This — not `isImageLayer` — is the guard the data path wants. A label layer is
 * a Lens over an array exactly as an image layer is, so it wants the same zarr
 * stores opened, the same octree planning, the same brick residency and the same
 * probe. What differs is only how a sampled value becomes colour, which is the
 * material's business and nothing the data path knows about.
 *
 * Named for the invariant every downstream site actually depends on. The three
 * that gate on it are the ones where a label layer being absent means it never
 * loads at all: `platform/sources/zarrSources.ts` (opening the arrays),
 * `platform/stores/sceneStore.ts` (normalizing into `layers`) and the `isImage` predicate
 * `reconcileSceneLayers` folds by.
 *
 * `isImageLayer` stays, and is still the right question wherever the answer
 * really is "an intensity image": the render-graph editor, the transfer
 * controls, `AddLayerForm`.
 */
export type BrickLayerFragment = ImageLayerFragment | LabelLayerFragment;

export const isBrickLayer = (
  layer: SceneLayerFragment,
): layer is BrickLayerFragment =>
  layer.__typename === "ImageLayer" || layer.__typename === "LabelLayer";
