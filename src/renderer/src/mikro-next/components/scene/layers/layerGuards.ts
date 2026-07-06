import { SceneLayerFragment } from "@/mikro-next/api/graphql";

/**
 * `Scene.layers` is a polymorphic `Layer` interface. The generated
 * `SceneLayerFragment` is a `__typename`-discriminated union of the concrete
 * layer variants. These helpers extract the per-variant fragment types and
 * provide type guards so consumers can narrow before reading variant-only
 * fields (e.g. `lens`, `climMin`, `renderGraph` on ImageLayer).
 */
export type ImageLayerFragment = Extract<
  SceneLayerFragment,
  { __typename: "ImageLayer" }
>;
export type ShapeLayerFragment = Extract<
  SceneLayerFragment,
  { __typename: "ShapeLayer" }
>;
export type PointLayerFragment = Extract<
  SceneLayerFragment,
  { __typename: "PointLayer" }
>;
export type TrackLayerFragment = Extract<
  SceneLayerFragment,
  { __typename: "TrackLayer" }
>;
export type MeshLayerFragment = Extract<
  SceneLayerFragment,
  { __typename: "MeshLayer" }
>;

export const isImageLayer = (
  layer: SceneLayerFragment,
): layer is ImageLayerFragment => layer.__typename === "ImageLayer";

export const isShapeLayer = (
  layer: SceneLayerFragment,
): layer is ShapeLayerFragment => layer.__typename === "ShapeLayer";

export const isPointLayer = (
  layer: SceneLayerFragment,
): layer is PointLayerFragment => layer.__typename === "PointLayer";

export const isTrackLayer = (
  layer: SceneLayerFragment,
): layer is TrackLayerFragment => layer.__typename === "TrackLayer";

export const isMeshLayer = (
  layer: SceneLayerFragment,
): layer is MeshLayerFragment => layer.__typename === "MeshLayer";
