/**
 * Healing selection entries that were made before the layer drawing them
 * existed.
 *
 * `useCreateSceneAnnotation` auto-selects a new annotation the moment the
 * server confirms it — but on a scene's FIRST annotation the server is also
 * minting the `AnnotationLayer` that draws it, so there is no layer to name
 * yet and the entry is written with `layerId: ""`. The canvas highlight copes
 * (it matches by annotation id), but everything that resolves the collection
 * by `layerId` — measures, go-to, delete — finds nothing for that entry, for
 * the rest of the session, because nothing else revisits it.
 *
 * The layer that draws an annotation holds the authoritative entry for it, so
 * it is the one that repairs. Kept pure and free of generated imports so its
 * suite runs in `node`.
 */

/** The selection fields this module compares; the real type carries more. */
type SelectionLike = { id: string; layerId: string };

/**
 * The subset of `authoritative` that should replace what is currently
 * selected: entries whose drawing layer now disagrees with the stored one.
 *
 * Only ever returns entries that are ALREADY selected — repairing must never
 * change WHAT is selected, only what is known about it. Empty when there is
 * nothing to fix, so the caller can skip the store write entirely (this runs
 * on every annotation poll).
 */
export function repairedSelections<A extends SelectionLike, S extends SelectionLike>(
  selected: readonly S[],
  authoritative: readonly A[],
): A[] {
  if (selected.length === 0 || authoritative.length === 0) return [];

  const byId = new Map(authoritative.map((entry) => [entry.id, entry]));
  return selected.flatMap((entry) => {
    const truth = byId.get(entry.id);
    return truth && truth.layerId !== entry.layerId ? [truth] : [];
  });
}
