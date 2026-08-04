import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { MikroADataset, MikroCoordinateSystem } from "@/linkers";
import { CornerDownRight } from "lucide-react";
import { GetADatasetDerivedQuery } from "../../api/graphql";
import { parentDatasetOfEdge } from "./derivedGrouping";

type QueryEdge = GetADatasetDerivedQuery["adataset"]["derivedFrom"][number];

/**
 * Where this dataset came FROM — the other half of its lineage.
 *
 * One edge for a deconvolution or a resample, several for a fusion of channels
 * or tiles, none at all for anything acquired rather than computed. The order is
 * the priority its creator declared, so the first edge is the primary parent:
 * the one that places it. That ordering is the query's, and is preserved here.
 *
 * Each row names the parent DATASET where one can be found and the SPACE
 * otherwise — the edge lands in a space, and a space without a dataset resident
 * is still a true answer, just a less useful one.
 */
export const DerivedFromSection = ({
  edges,
}: {
  edges: readonly QueryEdge[];
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-baseline justify-between gap-2">
        <div className="text-xs font-semibold">Derived from</div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {edges.length}
        </span>
      </div>

      {edges.length === 0 ? (
        <Empty>
          <EmptyTitle>Acquired, not computed</EmptyTitle>
          <EmptyDescription>
            This dataset names no parent, so it came off an instrument rather
            than out of a task.
          </EmptyDescription>
        </Empty>
      ) : (
        edges.map((edge, index) => {
          const parent = parentDatasetOfEdge(edge);
          // Only UnmappableTransformation carries a reason; the rest of the
          // union does not, so this is narrowed structurally rather than on
          // __typename — the same read `DerivedRow` uses.
          const reason =
            "reason" in edge ? (edge.reason ?? undefined) : undefined;

          return (
            <div
              key={edge.id}
              className="flex flex-row items-start gap-2 rounded-md border border-border/60 p-2"
            >
              <CornerDownRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-col gap-1">
                {parent ? (
                  <MikroADataset.DetailLink
                    object={parent}
                    className="break-all text-sm font-medium"
                  >
                    {parent.name}
                  </MikroADataset.DetailLink>
                ) : edge.output ? (
                  <MikroCoordinateSystem.DetailLink
                    object={edge.output}
                    className="break-all text-sm font-medium"
                  >
                    {edge.output.name}
                  </MikroCoordinateSystem.DetailLink>
                ) : (
                  <span className="break-all text-sm text-muted-foreground">
                    Unknown parent
                  </span>
                )}

                <div className="flex flex-row flex-wrap items-center gap-x-2 text-[0.625rem] uppercase tracking-wide text-muted-foreground">
                  <span>{edge.kind}</span>
                  {edge.valueRelation && <span>· {edge.valueRelation}</span>}
                  {index === 0 && edges.length > 1 && <span>· primary</span>}
                </div>

                {reason && (
                  <div className="text-[0.625rem] text-muted-foreground">
                    {reason}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
