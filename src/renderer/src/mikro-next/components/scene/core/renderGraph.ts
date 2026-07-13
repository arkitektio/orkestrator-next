import {
  Blending,
  ColorMap,
  LayerNodeInput,
  LayerRenderGraphFragment,
  ProjectionMode,
  TransferFunctionInput,
} from "@/mikro-next/api/graphql";
import { ImageLayerFragment } from "./layerGuards";

/**
 * A layer's `renderGraph` (`ImageLayer.renderGraph`) is a composable render
 * recipe: a tree rooted at a `BlendNode` whose leaves are `ChannelSourceNode`s
 * (one intensity source + transfer function) and whose inner nodes are further
 * `BlendNode`s or `ProjectionNode`s.
 *
 * The generated `LayerRenderGraphFragment` is a deeply-nested union (the GraphQL
 * fragment is expanded to a fixed depth). This module converts it into a clean
 * recursive domain model that the editor and renderer consume, and back into
 * the `LayerRenderGraphInput` shape for saving.
 */

export const CHANNEL_KIND = "channel";
export const BLEND_KIND = "blend";
export const PROJECTION_KIND = "projection";

export type TransferFn = {
  climMin: number | null;
  climMax: number | null;
  colormap: ColorMap | null;
  color: number[] | null;
  gamma: number | null;
  opacity: number | null;
  invert: boolean | null;
  categorical: boolean | null;
};

export type ChannelRenderNode = {
  type: "channel";
  kind: string;
  label: string | null;
  intensityDim: string | null;
  intensityIndex: number;
  visible: boolean;
  transfer: TransferFn;
};

export type BlendRenderNode = {
  type: "blend";
  kind: string;
  label: string | null;
  blending: Blending;
  children: RenderNode[];
};

export type ProjectionRenderNode = {
  type: "projection";
  kind: string;
  label: string | null;
  mode: ProjectionMode;
  children: RenderNode[];
};

export type RenderNode =
  | ChannelRenderNode
  | BlendRenderNode
  | ProjectionRenderNode;

// Structural shape of a fragment node (any depth). The generated union members
// all carry `__typename` plus the fields selected by RenderNodeCommon.
type FragmentNode = {
  __typename?: string;
  kind?: string;
  label?: string | null;
  blending?: Blending;
  mode?: ProjectionMode;
  intensityDim?: string | null;
  intensityIndex?: number;
  visible?: boolean;
  transfer?: Partial<TransferFn> | null;
  children?: FragmentNode[] | null;
};

const DEFAULT_TRANSFER: TransferFn = {
  // null clim = "full base-native range", resolved by each consumer against the
  // layer's data range. Clim is stored in absolute base-native value units.
  climMin: null,
  climMax: null,
  colormap: ColorMap.Viridis,
  color: null,
  gamma: null,
  opacity: null,
  invert: null,
  categorical: null,
};

const parseTransfer = (transfer: Partial<TransferFn> | null | undefined): TransferFn => ({
  climMin: transfer?.climMin ?? null,
  climMax: transfer?.climMax ?? null,
  colormap: transfer?.colormap ?? null,
  color: transfer?.color ?? null,
  gamma: transfer?.gamma ?? null,
  opacity: transfer?.opacity ?? null,
  invert: transfer?.invert ?? null,
  categorical: transfer?.categorical ?? null,
});

/** Recursively convert a fragment node into the domain model. */
export const parseRenderNode = (node: FragmentNode): RenderNode => {
  if (node.__typename === "ChannelSourceNode") {
    return {
      type: "channel",
      kind: node.kind ?? CHANNEL_KIND,
      label: node.label ?? null,
      intensityDim: node.intensityDim ?? null,
      intensityIndex: node.intensityIndex ?? 0,
      visible: node.visible ?? true,
      transfer: parseTransfer(node.transfer),
    };
  }
  if (node.__typename === "ProjectionNode") {
    return {
      type: "projection",
      kind: node.kind ?? PROJECTION_KIND,
      label: node.label ?? null,
      mode: node.mode ?? ProjectionMode.Mip,
      children: (node.children ?? []).map(parseRenderNode),
    };
  }
  // BlendNode (and unknown kinds default to blend containers).
  return {
    type: "blend",
    kind: node.kind ?? BLEND_KIND,
    label: node.label ?? null,
    blending: node.blending ?? Blending.Additive,
    children: (node.children ?? []).map(parseRenderNode),
  };
};

/** Parse a full `renderGraph` fragment; returns null when absent. */
export const parseRenderGraph = (
  graph: LayerRenderGraphFragment | null | undefined,
): BlendRenderNode | null => {
  if (!graph?.root) return null;
  const root = parseRenderNode(graph.root as FragmentNode);
  return root.type === "blend" ? root : { type: "blend", kind: BLEND_KIND, label: null, blending: Blending.Additive, children: [root] };
};

/** All channel leaves in tree order (what a multi-channel renderer composites). */
export const flattenChannels = (node: RenderNode | null): ChannelRenderNode[] => {
  if (!node) return [];
  if (node.type === "channel") return [node];
  return node.children.flatMap(flattenChannels);
};

/** The first projection mode found in the tree, or MIP by default. */
export const resolveProjectionMode = (node: RenderNode | null): ProjectionMode => {
  if (!node) return ProjectionMode.Mip;
  if (node.type === "projection") return node.mode;
  if (node.type === "blend") {
    for (const child of node.children) {
      const found = findProjectionMode(child);
      if (found) return found;
    }
  }
  return ProjectionMode.Mip;
};

const findProjectionMode = (node: RenderNode): ProjectionMode | null => {
  if (node.type === "projection") return node.mode;
  if (node.type === "blend") {
    for (const child of node.children) {
      const found = findProjectionMode(child);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Build a default single-channel render graph for a layer that has no
 * `renderGraph` (e.g. legacy layers), so the renderer/editor always has a graph
 * to work with. The transfer uses defaults — the server no longer carries flat
 * clim/colormap/color/gamma fields; the render graph is the only source.
 */
export const defaultLayerGraph = (layer: ImageLayerFragment): BlendRenderNode => ({
  type: "blend",
  kind: BLEND_KIND,
  label: null,
  blending: layer.blending ?? Blending.Additive,
  children: [
    {
      type: "channel",
      kind: CHANNEL_KIND,
      label: null,
      intensityDim: layer.lens.renderAxes?.intensity ?? null,
      intensityIndex: 0,
      visible: layer.visible ?? true,
      transfer: { ...DEFAULT_TRANSFER },
    },
  ],
});

/** The render graph for a layer: its own graph, or the default fallback. */
export const resolveLayerGraph = (layer: ImageLayerFragment): BlendRenderNode =>
  parseRenderGraph(layer.renderGraph) ?? defaultLayerGraph(layer);

const serializeTransfer = (transfer: TransferFn): TransferFunctionInput => ({
  climMin: transfer.climMin,
  climMax: transfer.climMax,
  colormap: transfer.colormap,
  color: transfer.color,
  gamma: transfer.gamma,
  opacity: transfer.opacity,
  invert: transfer.invert,
  categorical: transfer.categorical,
});

/** Convert a domain node back into the `LayerNodeInput` shape for `updateLayer`. */
export const serializeRenderNode = (node: RenderNode): LayerNodeInput => {
  if (node.type === "channel") {
    return {
      kind: node.kind || CHANNEL_KIND,
      label: node.label,
      intensityDim: node.intensityDim,
      intensityIndex: node.intensityIndex,
      visible: node.visible,
      transfer: serializeTransfer(node.transfer),
    };
  }
  if (node.type === "projection") {
    return {
      kind: node.kind || PROJECTION_KIND,
      label: node.label,
      mode: node.mode,
      children: node.children.map(serializeRenderNode),
    };
  }
  return {
    kind: node.kind || BLEND_KIND,
    label: node.label,
    blending: node.blending,
    children: node.children.map(serializeRenderNode),
  };
};

export const serializeRenderGraph = (root: BlendRenderNode) => ({
  root: serializeRenderNode(root),
});

/**
 * Render fields (clim / colormap / color / gamma / intensity source) derived
 * from a render graph's primary (first) channel. The current single-channel
 * renderer consumes these flat fields, so this lets the render graph drive the
 * viewer for single-channel graphs. Returns null when the layer has no graph
 * (the flat fields remain authoritative). Multi-channel compositing +
 * projection modes still require the dedicated multi-channel shader path.
 */
export const primaryChannelRenderFields = (
  graph: LayerRenderGraphFragment | null | undefined,
): {
  climMin: number | null;
  climMax: number | null;
  colormap: ColorMap | null;
  color: number[] | null;
  gamma: number | null;
  intensityDim: string | null;
} | null => {
  const parsed = parseRenderGraph(graph);
  const primary = flattenChannels(parsed)[0];
  if (!primary) return null;
  return {
    climMin: primary.transfer.climMin,
    climMax: primary.transfer.climMax,
    colormap: primary.transfer.colormap,
    color: primary.transfer.color,
    gamma: primary.transfer.gamma,
    intensityDim: primary.intensityDim,
  };
};
