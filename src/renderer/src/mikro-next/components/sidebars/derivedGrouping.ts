import { lensLabel, LensLabelInput } from "../../lenses";

/**
 * The grouping behind the ADataset page's "Derived" tab, kept apart from the
 * component so it can be tested as the pure function it is.
 */

/** The catch-all bucket's key — no coordinate system can collide with it. */
export const UNPLACED_GROUP = "unplaced";

export type DerivedGroup<D> = {
  /** The parent space's id, or UNPLACED_GROUP. */
  key: string;
  title: string;
  /** The lens descriptor, or the intrinsic system's name. */
  subtitle?: string;
  items: {
    dataset: D;
    /**
     * How many parents beyond the primary one this child declared. A fusion of
     * two tiles is listed once, under the parent that places it, and says so.
     */
    otherParents: number;
  }[];
};

export type GroupableLens = {
  id: string;
  coordinateSystem?: { id: string } | null;
} & LensLabelInput;

export type GroupableDerived = {
  derivedFrom: readonly {
    kind: string;
    output?: { id: string } | null;
  }[];
};

/**
 * Buckets the children by the space their PRIMARY derivation edge lands in.
 *
 * A derivation edge maps the child's own pixel grid back into the space it was
 * computed from, so `output` is the parent — and `derivedFrom[0]` is the primary
 * parent, the one that places the child.
 *
 * An UNSLICED lens' `coordinateSystem` resolves to the dataset's intrinsic
 * system, so it never gets a bucket of its own: it and the dataset are the same
 * space, and its children belong in the "whole dataset" group. Keying the buckets
 * by coordinate-system id makes that fall out rather than needing a special case.
 *
 * A child whose derivation is UNMAPPABLE is still a child — it came from here
 * even though its geometry did not survive — so it goes in the trailing bucket
 * rather than being dropped.
 */
export const groupDerived = <L extends GroupableLens, D extends GroupableDerived>(
  intrinsicSystemId: string | undefined,
  intrinsicSystemName: string | undefined,
  lenses: readonly L[],
  derived: readonly D[],
): DerivedGroup<D>[] => {
  const bySystem = new Map<string, DerivedGroup<D>>();

  if (intrinsicSystemId) {
    bySystem.set(intrinsicSystemId, {
      key: intrinsicSystemId,
      title: "Whole dataset",
      subtitle: intrinsicSystemName,
      items: [],
    });
  }

  for (const lens of lenses) {
    const systemId = lens.coordinateSystem?.id;
    // No system (nothing to match against) or the intrinsic one (an unsliced
    // lens): both already covered above.
    if (!systemId || bySystem.has(systemId)) continue;
    bySystem.set(systemId, {
      key: systemId,
      title: "Lens",
      subtitle: lensLabel(lens),
      items: [],
    });
  }

  const unplaced: DerivedGroup<D> = {
    key: UNPLACED_GROUP,
    title: "Unmappable",
    subtitle: "derived from this dataset, but their geometry did not survive",
    items: [],
  };

  for (const dataset of derived) {
    const primary = dataset.derivedFrom.at(0);
    const otherParents = Math.max(0, dataset.derivedFrom.length - 1);
    const bucket =
      primary && primary.kind !== "UNMAPPABLE" && primary.output?.id
        ? bySystem.get(primary.output.id)
        : undefined;
    (bucket ?? unplaced).items.push({ dataset, otherParents });
  }

  // Insertion order is intrinsic-first, then the lenses as the query returned
  // them; the catch-all always trails.
  return [...bySystem.values(), unplaced].filter(
    (group) => group.items.length > 0,
  );
};
