import { Blending, ColorMap, ProjectionMode } from "@/mikro-next/api/graphql";
import { ImageLayerFragment, LabelLayerFragment } from "./layerGuards";
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
import { resolveIntensityAxis, resolvePhasorAxis } from "./dims";
import { composeLayerAffine, type SceneTransformContext } from "@/mikro-next/lib/coords/transformGraph";

export type { SceneTransformContext };

/**
 * The scene renderer's per-layer view-model. Extracted from `platform/stores/sceneStore.ts`
 * so the store holds state, and this module owns the pure derivation from the
 * server fragment into render-ready state.
 *
 * BRICK-BACKED layers are tracked here — images and label masks. Both are a Lens
 * over an array, so both want the same zarr stores, octree planning, residency
 * and probe; they differ only in how a sampled value becomes colour. The other
 * layer types (Annotation/Point/Track/Mesh) render through separate paths and
 * are consumed straight off their fragments.
 *
 * A structural SUPERSET with a `__typename` discriminant, deliberately not a
 * discriminated union: ~30 modules read `.channels` / `.climMin` / `.projection`
 * off a `LayerState`, and every one of them would have to narrow first for the
 * sake of fields it will only ever meet on an image. The superset works because
 * `renderGraph` is already optional on the image fragment and the label
 * selection spreads the identical `SceneLens` — the label arm is a subset of the
 * image arm plus `labelRender`.
 *
 * The price is that a label carries the render-graph-derived fields as
 * degenerate values. `normalizeLabelLayer` picks them to be HONEST rather than
 * plausible — `channels: []` above all, so a label that ever reached the image
 * compositor by mistake draws nothing instead of something wrong.
 */
export type LayerState = Omit<ImageLayerFragment, "__typename"> & {
  __typename: "ImageLayer" | "LabelLayer";
  /**
   * How a label mask's ids become colour. Present only on a label layer, and the
   * one field that says which kind this is beyond the `__typename` — narrow with
   * `isLabelLayerState` rather than testing it, so the intent reads.
   */
  labelRender?: LabelLayerFragment["labelRender"];
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
  xAxis: string | null;
  yAxis: string | null;
  zAxis: string | null;
  tAxis: string | null;
  intensityAxis: string | null;
  /**
   * The axis the layer's phasor nodes reduce (a MICROTIME/SPECTRUM axis). Null
   * when the graph has no phasor node — and when it is set, the axis is NOT
   * collapsible: the phasor needs every bin, so there is no dim slider for it
   * (`sliceSignature.collapsibleDims`), and the brick repack reduces it into
   * g/s/intensity slabs instead of pinning one index.
   */
  phasorAxis: string | null;
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
    xAxis: renderAxes?.x ?? null,
    yAxis: renderAxes?.y ?? null,
    zAxis: renderAxes?.z ?? null,
    tAxis: renderAxes?.t ?? null,
    intensityAxis: resolveIntensityAxis(primary?.intensityAxis, renderAxes),
    phasorAxis: resolvePhasorAxis(phasors[0]?.phasorAxis, renderAxes),
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

/** Which arm of the superset this is. Prefer it to testing `labelRender`. */
export const isLabelLayerState = (layer: LayerState): boolean =>
  layer.__typename === "LabelLayer";

/**
 * The `LayerState` a label mask normalizes to.
 *
 * Everything the render graph would have decided is filled with a degenerate
 * value, because a label map HAS no render graph — it has one source and no
 * compositing tree, and clim/gamma/colormaps/projections are all meaningless over
 * object ids. The choices, and why each is the honest one:
 *
 *  - `channels: []` / `phasors: []` / `sources: []` — an empty source list means
 *    the image compositor draws NOTHING. If a label ever reached it by mistake
 *    (a missed branch, a future merged pass) the failure is a blank layer, not a
 *    mask painted one flat wrong colour.
 *  - `climMin`/`climMax` from the dtype range. Nothing normalizes a label, but
 *    these also feed the pool's value range, and `resolveLayerDataRange` is where
 *    the id-preserving range is decided for both the planner and the allocator.
 *  - `colormap`/`color`/`gamma` null — a colormap over ids would impose an order
 *    they do not have. Ids become colour by hashing, or by a `colorBys` entry.
 *  - `projection: Mip`, `blend: Additive` — placeholders the label material never
 *    reads. MIP over ids is meaningless (the largest id wins, which is an
 *    arbitrary object); the 3D label path resolves FIRST HIT instead and decides
 *    that itself.
 *
 * `intensityAxis` is deliberately NULL even though `labelRender.intensityIndex`
 * names a channel. Setting it would make `buildLayerLevelGeometry` allocate
 * `min(16, extent)` slabs per brick — 3-16x the atlas and the fetch — for
 * channels nothing draws. The chosen index is pinned as a collapsed slice
 * instead, which is what the slice signature, the fixed-index resolution, the
 * probe's coordinate mapping and the dim sliders all already read.
 */
export const normalizeLabelLayer = (
  layer: LabelLayerFragment,
  defaultVolumeLod: number | null,
  scene: SceneTransformContext,
): LayerState => {
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
  const intensityAxis = resolveIntensityAxis(
    layer.labelRender?.intensityAxis ?? undefined,
    renderAxes,
  );
  return {
    ...layer,
    // Pin the mask's channel as a COLLAPSED slice rather than as the layer's
    // intensity axis (see the docblock). A scene-wide dim slider can still
    // override it — `resolveFixedDimIndex` lets a selection win over a slice —
    // which is the right behaviour: `intensityIndex` is the default this mask
    // opens on, not a lock.
    lens:
      intensityAxis && layer.labelRender
        ? {
            ...layer.lens,
            slices: [
              ...(layer.lens.slices ?? []).filter((slice) => slice.axis !== intensityAxis),
              {
                __typename: "Slice" as const,
                axis: intensityAxis,
                start: layer.labelRender.intensityIndex,
                stop: layer.labelRender.intensityIndex + 1,
                step: null,
              },
            ],
          }
        : layer.lens,
    climMin: baseMin,
    climMax: baseMax,
    colormap: null,
    color: null,
    gamma: null,
    affineMatrix: composeLayerAffine(scene, layer),
    xAxis: renderAxes?.x ?? null,
    yAxis: renderAxes?.y ?? null,
    zAxis: renderAxes?.z ?? null,
    tAxis: renderAxes?.t ?? null,
    // NOT the mask's channel axis — see the docblock.
    intensityAxis: null,
    phasorAxis: null,
    channels: [],
    phasors: [],
    sources: [],
    blend: Blending.Additive,
    projection: ProjectionMode.Mip,
    fixedLOD: null,
    defaultVolumeLOD: defaultVolumeLod,
    visible: true,
  } as LayerState;
};
