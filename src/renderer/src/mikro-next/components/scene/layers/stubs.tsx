/**
 * Placeholder renderers for the layer types the backend has that we do not draw
 * yet (Point/Track). They render nothing, but registering them in
 * `render/registry.ts` means implementing a type later is a one-component change
 * that never touches the image path (Mesh graduated to `render/mesh/`, and
 * Annotation — the old Shape — to `layers/annotation/`).
 *
 * Each will grow into its own module (render/point, …) with its own data path:
 * Point/Track read table columns.
 */
type LayerRendererProps = { layerId: string };

export const PointLayerRenderer = (_props: LayerRendererProps) => null;
export const TrackLayerRenderer = (_props: LayerRendererProps) => null;
