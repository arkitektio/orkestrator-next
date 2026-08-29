import React from "react";
import {
  EntityCategoriesMatchingDescriptorDocument,
  EntityCategoriesMatchingDescriptorQuery,
  EntityCategoriesMatchingDescriptorQueryVariables,
  EntityDescriptorInput,
  StructureDescriptorInput,
  StructureKindsMatchingDescriptorDocument,
  StructureKindsMatchingDescriptorQuery,
  StructureKindsMatchingDescriptorQueryVariables,
} from "@/kraph/api/graphql";
import { useKraph } from "@/app/Arkitekt";

/**
 * Which edge categories admit the two ends a user is pairing up.
 *
 * The old answer was a stored cross-product (`MaterializedRelationEdge` and
 * friends). It was removed as a cache with no invalidation: nothing refreshed it
 * when a category was added, and `createRelationCategory` never wrote to it at
 * all — so an API-created relation category had zero rows forever and the Relate
 * menu was quietly empty for it. A read surface over a cache that stopped being
 * maintained answers confidently and wrongly.
 *
 * So the pairs are computed on read, and the *server* decides: each candidate
 * category's `sourceDescriptor` / `targetDescriptor` is handed back through
 * `matchesDescriptor`, which is the same predicate the writer applies. The menu
 * therefore cannot offer a pairing that the write would then reject.
 *
 * The cost is one probe per candidate per side. A graph's categories are the size
 * of its schema rather than of its evidence, the probes run concurrently, and
 * Apollo caches them — so reopening the menu costs nothing.
 */

/** A candidate edge category, reduced to what admission depends on. */
export type DescriptorCandidate<D> = {
  id: string;
  sourceDescriptor: D;
  targetDescriptor: D;
};

type ProbeState<T> = {
  applicable: T[];
  loading: boolean;
  error?: Error;
};

const descriptorInput = <D extends object>(descriptor: D) =>
  // The generated fragment types carry `__typename`; the input types do not.
  Object.fromEntries(
    Object.entries(descriptor).filter(([key]) => key !== "__typename"),
  );

/**
 * Narrow `candidates` to those whose descriptors admit the given ends.
 *
 * `sourceId` / `targetId` name the concrete ends — an `EntityCategory` id for a
 * relation, a `StructureKind` identifier for a structure relation. A candidate
 * is kept only when both probes come back non-empty.
 */
const useDescriptorProbe = <T extends DescriptorCandidate<any>>(
  candidates: T[] | undefined,
  sourceEnd: string | undefined,
  targetEnd: string | undefined,
  probe: (
    client: ReturnType<typeof useKraph>,
    end: string,
    descriptor: any,
  ) => Promise<boolean>,
): ProbeState<T> => {
  const client = useKraph();
  const [state, setState] = React.useState<ProbeState<T>>({
    applicable: [],
    loading: false,
  });

  // The candidate ids, so a re-render with an equal-but-new array does not
  // re-probe. Descriptors are fixed per category, so the ids pin the work.
  const key = (candidates ?? []).map((candidate) => candidate.id).join(",");

  React.useEffect(() => {
    if (!candidates?.length || !sourceEnd || !targetEnd) {
      setState({ applicable: [], loading: false });
      return;
    }

    let cancelled = false;
    setState((previous) => ({ ...previous, loading: true, error: undefined }));

    // Booleans rather than `T | null`, because `Promise.all` maps the element
    // type through `Awaited<T>` and a generic `T` does not survive that.
    Promise.all(
      candidates.map(async (candidate): Promise<boolean> => {
        const [source, target] = await Promise.all([
          probe(client, sourceEnd, candidate.sourceDescriptor),
          probe(client, targetEnd, candidate.targetDescriptor),
        ]);
        return source && target;
      }),
    )
      .then((admitted) => {
        if (cancelled) return;
        setState({
          applicable: candidates.filter((_, index) => admitted[index]),
          loading: false,
        });
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setState({ applicable: [], loading: false, error });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, sourceEnd, targetEnd, client]);

  return state;
};

const probeEntityCategory = async (
  client: ReturnType<typeof useKraph>,
  categoryId: string,
  descriptor: EntityDescriptorInput,
) => {
  const { data } = await client.query<
    EntityCategoriesMatchingDescriptorQuery,
    EntityCategoriesMatchingDescriptorQueryVariables
  >({
    query: EntityCategoriesMatchingDescriptorDocument,
    variables: {
      ids: [categoryId],
      descriptor: descriptorInput(descriptor ?? {}),
    },
  });
  return (data?.entityCategories.length ?? 0) > 0;
};

const probeStructureKind = async (
  client: ReturnType<typeof useKraph>,
  identifier: string,
  descriptor: StructureDescriptorInput,
) => {
  const { data } = await client.query<
    StructureKindsMatchingDescriptorQuery,
    StructureKindsMatchingDescriptorQueryVariables
  >({
    query: StructureKindsMatchingDescriptorDocument,
    variables: {
      identifiers: [identifier],
      descriptor: descriptorInput(descriptor ?? {}),
    },
  });
  return (data?.structureKinds.length ?? 0) > 0;
};

/** Relation categories that connect one entity category to another. */
export const useApplicableRelationCategories = <
  T extends DescriptorCandidate<EntityDescriptorInput>,
>(
  candidates: T[] | undefined,
  sourceCategoryId: string | undefined,
  targetCategoryId: string | undefined,
) =>
  useDescriptorProbe(
    candidates,
    sourceCategoryId,
    targetCategoryId,
    probeEntityCategory,
  );

/** Structure-relation categories that connect one structure kind to another. */
export const useApplicableStructureRelationCategories = <
  T extends DescriptorCandidate<StructureDescriptorInput>,
>(
  candidates: T[] | undefined,
  sourceIdentifier: string | undefined,
  targetIdentifier: string | undefined,
) =>
  useDescriptorProbe(
    candidates,
    sourceIdentifier,
    targetIdentifier,
    probeStructureKind,
  );
