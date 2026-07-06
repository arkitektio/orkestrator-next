import { Blending, ProjectionMode } from "@/mikro-next/api/graphql";
import { ImageLayerFragment } from "./layerGuards";
import {
  ChannelRenderNode,
  flattenChannels,
  primaryChannelRenderFields,
  resolveLayerGraph,
  resolveProjectionMode,
} from "./renderGraph";

/**
 * The scene renderer's per-layer view-model. Extracted from `store/sceneStore.ts`
 * so the store holds state, and this module owns the pure derivation from the
 * server `ImageLayerFragment` into render-ready state.
 *
 * Only image layers are tracked here (they carry the zarr data +
 * transfer/render-graph state). Non-image layers (Shape/Point/Track/Mesh) are
 * rendered through a separate path.
 */
export type ReportedContrast = {
  id: string;
  minValue: number;
  maxValue: number;
};

export type LayerState = ImageLayerFragment & {
  fixedLOD?: number | null;
  defaultVolumeLOD?: number | null;
  visible?: boolean;
  /** Channel sources flattened from the layer's render graph (tree order). */
  channels: ChannelRenderNode[];
  /** Blend mode of the render graph's root, used to composite channels. */
  blend: Blending;
  /** Projection mode (from a ProjectionNode in the graph, else MIP) for 3D. */
  projection: ProjectionMode;
};

/**
 * Resolve an `ImageLayerFragment` (+ its default volume LOD) into `LayerState`:
 * flatten the render graph (or a single-channel fallback from the flat fields)
 * into a channel list, and fold the primary channel's transfer onto the flat
 * fields for the single-channel render path.
 */
export const normalizeLayer = (
  layer: ImageLayerFragment,
  defaultVolumeLod: number | null,
): LayerState => {
  const graph = resolveLayerGraph(layer);
  const channels = flattenChannels(graph);
  const primary = primaryChannelRenderFields(layer.renderGraph);
  return {
    ...layer,
    climMin: primary?.climMin ?? layer.climMin ?? 0,
    climMax: primary?.climMax ?? layer.climMax ?? 1,
    colormap: primary?.colormap ?? layer.colormap,
    color: primary?.color ?? layer.color,
    gamma: primary?.gamma ?? layer.gamma,
    intensityDim: primary?.intensityDim ?? layer.intensityDim,
    channels,
    blend: graph.blending,
    projection: resolveProjectionMode(graph),
    fixedLOD: null,
    defaultVolumeLOD: defaultVolumeLod,
    visible: true,
  };
};
