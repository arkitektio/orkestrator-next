/**
 * Placeholder renderers for the layer types the backend has that we do not draw
 * yet (Point/Track). They render nothing, but registering them in
 * `layers/registry.ts` means implementing a type later is a one-component change
 * that never touches the image path.
 *
 * Each will grow into its own module (layers/point, …) with its own data path:
 * Point/Track read table columns.
 *
 * LABEL GRADUATED from here to `layers/label/` + `render/bricks/labelNodeMaterials.ts`.
 * The note that used to live here — that pointing a mask at the image renderers
 * would normalize an int32 id against the dtype range `[-2^31, 2^31)`, landing
 * every id within ~2e-5 of 0.5 and painting the whole mask one flat colour — is
 * now the reason the label material skips `channelNormalize`; it is restated
 * there, where the code that must not do it lives. Mesh graduated earlier to
 * `render/fabriks/`, and Annotation — the old Shape — to `layers/annotation/`.
 */
type LayerRendererProps = { layerId: string };

export const PointLayerRenderer = (_props: LayerRendererProps) => null;
export const TrackLayerRenderer = (_props: LayerRendererProps) => null;
