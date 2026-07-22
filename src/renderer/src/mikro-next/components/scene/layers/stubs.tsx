/**
 * Placeholder renderers for the non-image layer types the backend added
 * (Shape/Point/Track). They render nothing yet, but registering them in
 * `render/registry.ts` means implementing a type later is a one-component change
 * that never touches the image path (Mesh graduated to `render/mesh/`).
 *
 * Each will grow into its own module (render/shape, render/point, …) with its
 * own data path: Shape → dataRoi geometry, Point/Track → table columns.
 */
type LayerRendererProps = { layerId: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ShapeLayerRenderer = (_props: LayerRendererProps) => null;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PointLayerRenderer = (_props: LayerRendererProps) => null;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TrackLayerRenderer = (_props: LayerRendererProps) => null;
