import { Blending, ColorMap, ProjectionMode } from "@/mikro-next/api/graphql";
import { ImageLayerFragment } from "./layerGuards";
import { resolveLayerDataRange } from "./dataRange";
import {
  ChannelRenderNode,
  PhasorRenderNode,
  SourceRenderNode,
  flattenChannels,
  flattenPhasors,
  flattenSources,
  resolveLayerGraph,
  resolveProjectionMode,
} from "./renderGraph";
import { resolveIntensityDim, resolvePhasorDim } from "./dims";
import { composeLayerAffine, type SceneTransformContext } from "./transformGraph";

export type { SceneTransformContext };

/**
 * The scene renderer's per-layer view-model. Extracted from `store/sceneStore.ts`
 * so the store holds state, and this module owns the pure derivation from the
 * server `ImageLayerFragment` into render-ready state.
 *
 * Only image layers are tracked here (they carry the zarr data +
 * transfer/render-graph state). Non-image layers (Shape/Point/Track/Mesh) are
 * rendered through a separate path.
 */
export type LayerState = ImageLayerFragment & {
  fixedLOD?: number | null;
  defaultVolumeLOD?: number | null;
  visible?: boolean;
  /**
   * Voxel→world spatial affine (x, y, z rows), composed CLIENT-SIDE from the
   * scene's coordinate-transformation graph (`transformGraph.ts`) — the server
   * no longer carries a flat `affineMatrix` on layers. Null = identity.
   */
  affineMatrix: number[][] | null;
  /**
   * Axis-name mapping, from the lens' server-derived `renderAxes` (axis TYPES
   * decide, so a dim cannot be both spatial and the channel axis anymore).
   * Kept as flat fields because ~15 consumers (slice signatures, probes,
   * panels, planners) read them by these names.
   */
  xDim: string | null;
  yDim: string | null;
  zDim: string | null;
  tDim: string | null;
  intensityDim: string | null;
  /**
   * The axis the layer's phasor nodes reduce (a MICROTIME/SPECTRUM axis). Null
   * when the graph has no phasor node — and when it is set, the axis is NOT
   * collapsible: the phasor needs every bin, so there is no dim slider for it
   * (`sliceSignature.collapsibleDims`), and the brick repack reduces it into
   * g/s/intensity slabs instead of pinning one index.
   */
  phasorDim: string | null;
  /** Channel sources flattened from the layer's render graph (tree order). */
  channels: ChannelRenderNode[];
  /** Phasor sources flattened from the layer's render graph (tree order). */
  phasors: PhasorRenderNode[];
  /**
   * Every pixel-producing leaf in tree order — channels and phasors together.
   * This is the compositor's slot list: slot i of the shader's source loop is
   * `sources[i]`.
   */
  sources: SourceRenderNode[];
  /** Blend mode of the render graph's root, used to composite channels. */
  blend: Blending;
  /** Projection mode (from a ProjectionNode in the graph, else MIP) for 3D. */
  projection: ProjectionMode;
  /**
   * Primary-channel render fields, DERIVED from the render graph (the single
   * rendering truth) and kept flat for the single-channel 3D shader path and
   * display chrome. The server no longer carries these on ImageLayer — they
   * come exclusively from the graph here.
   */
  climMin: number;
  climMax: number;
  colormap: ColorMap | null;
  color: number[] | null;
  gamma: number | null;
};

/**
 * Resolve an `ImageLayerFragment` (+ its default volume LOD) into `LayerState`:
 * flatten the render graph (or a default single-channel fallback) into a channel
 * list, and fold the primary channel's transfer onto the flat fields for the
 * single-channel render path. The render graph is the only source of these
 * fields — the server-side flat properties were removed.
 */
export const normalizeLayer = (
  layer: ImageLayerFragment,
  defaultVolumeLod: number | null,
  scene: SceneTransformContext,
): LayerState => {
  const graph = resolveLayerGraph(layer);
  const channels = flattenChannels(graph);
  const phasors = flattenPhasors(graph);
  const sources = flattenSources(graph);
  const primary = channels[0];
  const transfer = primary?.transfer;
  // Clim is stored in absolute base-native units; null = "full range". Resolve
  // null against the layer's base-native data range so the flat single-channel
  // fields (used by the 3D shader path + CPU probe march) stay concrete.
  const dtype = layer.lens?.dataset?.dataArrays?.[0]?.store?.dtype;
  let baseMin = 0;
  let baseMax = 1;
  if (dtype) {
    try {
      [baseMin, baseMax] = resolveLayerDataRange(layer, dtype);
    } catch {
      // keep [0,1] fallback
    }
  }
  const renderAxes = layer.lens.renderAxes;
  return {
    ...layer,
    climMin: transfer?.climMin ?? baseMin,
    climMax: transfer?.climMax ?? baseMax,
    colormap: transfer?.colormap ?? null,
    color: transfer?.color ?? null,
    gamma: transfer?.gamma ?? null,
    affineMatrix: composeLayerAffine(scene, layer),
    xDim: renderAxes?.x ?? null,
    yDim: renderAxes?.y ?? null,
    zDim: renderAxes?.z ?? null,
    tDim: renderAxes?.t ?? null,
    intensityDim: resolveIntensityDim(primary?.intensityDim, renderAxes),
    phasorDim: resolvePhasorDim(phasors[0]?.phasorDim, renderAxes),
    channels,
    phasors,
    sources,
    blend: graph.blending,
    projection: resolveProjectionMode(graph),
    fixedLOD: null,
    defaultVolumeLOD: defaultVolumeLod,
    visible: true,
  };
};
