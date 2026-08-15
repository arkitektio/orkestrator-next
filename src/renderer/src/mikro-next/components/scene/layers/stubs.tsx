/**
 * Placeholder renderers for the layer types the backend has that we do not draw
 * yet (Point/Track/Label). They render nothing, but registering them in
 * `render/registry.ts` means implementing a type later is a one-component change
 * that never touches the image path (Mesh graduated to `render/fabriks/`, and
 * Annotation — the old Shape — to `layers/annotation/`).
 *
 * Each will grow into its own module (render/point, …) with its own data path:
 * Point/Track read table columns.
 *
 * Label is the odd one out: it shares the image path's data entirely (a Lens
 * over an array, so the same brick pool, planner and residency), and differs
 * only in how a sampled value becomes color — raw object ids hashed to distinct
 * hues instead of an intensity normalized through a transfer function. It is
 * stubbed rather than pointed at the image renderers on purpose: those would
 * normalize an int32 id against the dtype range `[-2^31, 2^31)`, landing every
 * id within ~2e-5 of 0.5 and painting the whole mask one flat color. Drawing
 * nothing is the honest state until the label material variant lands.
 */
type LayerRendererProps = { layerId: string };

export const PointLayerRenderer = (_props: LayerRendererProps) => null;
export const TrackLayerRenderer = (_props: LayerRendererProps) => null;
export const LabelLayerRenderer = (_props: LayerRendererProps) => null;
