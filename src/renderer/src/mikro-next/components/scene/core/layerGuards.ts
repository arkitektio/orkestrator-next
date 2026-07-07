import { SceneLayerFragment } from "@/mikro-next/api/graphql";

/**
 * `Scene.layers` is a polymorphic `Layer` interface. The generated
 * `SceneLayerFragment` is a `__typename`-discriminated union of the concrete
 * layer variants. This extracts the ImageLayer variant type and provides a type
 * guard so consumers can narrow before reading variant-only fields (e.g.
 * `lens`, `climMin`, `renderGraph` on ImageLayer).
 */
export type ImageLayerFragment = Extract<
  SceneLayerFragment,
  { __typename: "ImageLayer" }
>;

export const isImageLayer = (
  layer: SceneLayerFragment,
): layer is ImageLayerFragment => layer.__typename === "ImageLayer";
