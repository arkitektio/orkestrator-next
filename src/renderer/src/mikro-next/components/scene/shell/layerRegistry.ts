import { FC } from "react";
import { SceneLayerFragment } from "@/mikro-next/api/graphql";
import { ImagePlaneLayer } from "../features/volume/ImagePlaneLayer";
import { ImageVolumeLayer } from "../features/volume/ImageVolumeLayer";
import { FabriksCollectionLayer } from "../features/meshes/FabriksCollectionLayer";
import { AnnotationLayerRenderer } from "../features/annotations/AnnotationLayer";
import { LabelPlaneLayer, LabelVolumeLayer } from "../features/labels/LabelPlaneLayer";
import { TrackLayerRenderer } from "../features/tracks/TracksLayer";
import { PointLayerRenderer } from "../features/points/PointsLayer";

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
  // The three FIXED-SHAPE lens kinds. They normalize into the same `LayerState`
  // as an image (one channel, three tinted planes, one phasor source), so they
  // ride the same components and the same brick engine — what their declared
  // shape buys is on the material side, where `LayerState.renderKind` lets a
  // specialised compositor be compiled instead of the general 16-slot one.
  IntensityLayer: { Layer2D: ImagePlaneLayer, Layer3D: ImageVolumeLayer },
  RgbLayer: { Layer2D: ImagePlaneLayer, Layer3D: ImageVolumeLayer },
  PhasorLayer: { Layer2D: ImagePlaneLayer, Layer3D: ImageVolumeLayer },
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
