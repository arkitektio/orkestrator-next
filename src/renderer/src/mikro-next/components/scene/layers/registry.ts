import { FC } from "react";
import { SceneLayerFragment } from "@/mikro-next/api/graphql";
import { ImagePlaneLayer } from "./image/ImagePlaneLayer";
import { ImageVolumeLayer } from "./image/ImageVolumeLayer";
import { FabriksCollectionLayer } from "./mesh/FabriksCollectionLayer";
import { AnnotationLayerRenderer } from "./annotation/AnnotationLayer";
import { LabelPlaneLayer, LabelVolumeLayer } from "./label/LabelPlaneLayer";
import { PointLayerRenderer, TrackLayerRenderer } from "./stubs";

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
  // 2D fills (or outlines, with `contour`); 3D marches to FIRST HIT — MIP over
  // object ids would keep the largest, which is an arbitrary object. See
  // `createLabelVolumeNodeMaterial`.
  LabelLayer: { Layer2D: LabelPlaneLayer, Layer3D: LabelVolumeLayer },
  AnnotationLayer: { Layer2D: AnnotationLayerRenderer, Layer3D: AnnotationLayerRenderer },
  PointLayer: { Layer2D: PointLayerRenderer, Layer3D: PointLayerRenderer },
  TrackLayer: { Layer2D: TrackLayerRenderer, Layer3D: TrackLayerRenderer },
  // One component for both modes: in 2D it clips itself to a slab around
  // currentZ (see FabriksCollectionLayer's slab effect).
  MeshLayer: { Layer2D: FabriksCollectionLayer, Layer3D: FabriksCollectionLayer },
};
