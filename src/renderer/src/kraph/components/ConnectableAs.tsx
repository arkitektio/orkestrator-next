import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ListMaterializedMeasurementsQuery,
  useListMaterializedMeasurementsQuery,
} from "@/kraph/api/graphql";
import { Link } from "lucide-react";
import { useState } from "react";

type MaterializedMeasurementEdge =
  ListMaterializedMeasurementsQuery["materializedMeasurementEdges"][number];

const ConnectableCategoryList = ({
  edges,
  loading,
  error,
}: {
  edges: MaterializedMeasurementEdge[];
  loading: boolean;
  error?: string;
}) => {
  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading connectable targets...</div>;
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  if (edges.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
        No connectable targets available for this structure.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {edges.map((edge) => (
        <div key={edge.id} className="rounded-md border bg-background/80 p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{edge.edge.label || edge.edge.key}</div>
              <div className="truncate text-xs text-muted-foreground">
                Target: {edge.target.label || edge.target.key}
              </div>
            </div>
            <div className="shrink-0 text-xs text-muted-foreground">
              Connecting unavailable
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export type ConnectableAsProps = {
  identifier: string;
  graphId: string;
  variant?: "dialog" | "inline";
};

// NOTE: The backend removed `createMeasurement` without a replacement, so a
// structure can no longer be connected to an entity from here — measurements
// are now recorded as supporting evidence on `createNaturalEvent` /
// `createProtocolEvent`, which needs an event category and role mapping this
// component has no source for. `materializedMeasurementEdges` is unchanged, so
// the connectable targets are still listed; only the connect / create-new
// actions are gone until an attach path exists again.
export const ConnectableAs = ({
  identifier,
  graphId,
  variant = "dialog",
}: ConnectableAsProps) => {
  const { data, loading, error } = useListMaterializedMeasurementsQuery({
    variables: {
      filters: {
        sourceIdentifier: identifier,
        graphId: graphId,
      },
    },
    fetchPolicy: "network-only",
  });

  const [popoverOpen, setPopoverOpen] = useState(false);

  const edges = data?.materializedMeasurementEdges ?? [];

  const categoryList = (
    <ConnectableCategoryList
      edges={edges}
      loading={loading}
      error={error?.message}
    />
  );

  if (variant === "inline") {
    return (
      <div className="flex flex-col gap-3 rounded-lg p-3">
        <div>
          <div className="text-sm font-medium">Connect as</div>
          <div className="text-xs text-muted-foreground">
            These are the targets this structure can be measured against.
          </div>
        </div>
        {categoryList}
      </div>
    );
  }

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Link className="h-4 w-4" />
          Connect
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[30rem] max-w-[min(90vw,30rem)]"
      >
        <PopoverHeader>
          <PopoverTitle>Connect as...</PopoverTitle>
          <PopoverDescription>
            These are the targets this structure can be measured against.
          </PopoverDescription>
        </PopoverHeader>
        {categoryList}
      </PopoverContent>
    </Popover>
  );
};
