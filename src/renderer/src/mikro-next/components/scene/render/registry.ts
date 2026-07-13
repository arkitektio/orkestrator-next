import { FC } from "react";
import { SceneLayerFragment } from "@/mikro-next/api/graphql";
import { ImagePlaneLayer } from "./image/ImagePlaneLayer";
import { ImageVolumeLayer } from "./image/ImageVolumeLayer";
import { MeshCollectionLayer } from "./mesh/MeshCollectionLayer";
import {
  PointLayerRenderer,
  ShapeLayerRenderer,
  TrackLayerRenderer,
} from "./stubs";

export type LayerRendererProps = { layerId: string };

export type LayerRenderers = {
  Layer2D: FC<LayerRendererProps> | null;
  Layer3D: FC<LayerRendererProps> | null;
};

/**
 * Per-`__typename` render dispatch. Adding a new layer type = one entry here +
 * one component. The image path (`ImagePlaneLayer`/`ImageVolumeLayer`) is never
 * touched when adding other types.
 */
export const LAYER_RENDERERS: Record<SceneLayerFragment["__typename"], LayerRenderers> = {
  ImageLayer: { Layer2D: ImagePlaneLayer, Layer3D: ImageVolumeLayer },
  ShapeLayer: { Layer2D: ShapeLayerRenderer, Layer3D: ShapeLayerRenderer },
  PointLayer: { Layer2D: PointLayerRenderer, Layer3D: PointLayerRenderer },
  TrackLayer: { Layer2D: TrackLayerRenderer, Layer3D: TrackLayerRenderer },
  MeshLayer: { Layer2D: null, Layer3D: MeshCollectionLayer },
};
