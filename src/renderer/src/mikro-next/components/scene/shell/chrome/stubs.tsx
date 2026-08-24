/**
 * Placeholder renderer for the layer type the backend has that we do not draw
 * yet (Track). It renders nothing, but registering it in
 * `shell/layerRegistry.ts` means implementing a type later is a one-component change
 * that never touches the image path.
 *
 * It will grow into its own module with its own data path: Track reads table columns.
 *
 * POINT GRADUATED from here to `features/points/`, taking the table-column data path with
 * it — positions read columnar through `lib/attributes/columnarReads`, per-object position and
 * value in storage buffers indexed by `instanceIndex`. Track is the same data path and can
 * follow the same way.
 *
 * LABEL GRADUATED from here to `features/labels/` + `features/labels/labelNodeMaterials.ts`.
 * The note that used to live here — that pointing a mask at the image renderers
 * would normalize an int32 id against the dtype range `[-2^31, 2^31)`, landing
 * every id within ~2e-5 of 0.5 and painting the whole mask one flat colour — is
 * now the reason the label material skips `channelNormalize`; it is restated
 * there, where the code that must not do it lives. Mesh graduated earlier to
 * `features/meshes/fabriks/`, and Annotation — the old Shape — to `features/annotations/`.
 */
type LayerRendererProps = { layerId: string };

export const TrackLayerRenderer = (_props: LayerRendererProps) => null;
