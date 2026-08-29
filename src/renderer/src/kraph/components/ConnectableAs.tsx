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
  ListApplicableMeasurementCategoriesQuery,
  useListApplicableMeasurementCategoriesQuery,
} from "@/kraph/api/graphql";
import { Link } from "lucide-react";
import { useState } from "react";

type MeasurementCategory =
  ListApplicableMeasurementCategoriesQuery["measurementCategories"][number];

const ConnectableCategoryList = ({
  categories,
  loading,
  error,
}: {
  categories: MeasurementCategory[];
  loading: boolean;
  error?: string;
}) => {
  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading connectable targets...</div>;
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
        No connectable targets available for this structure.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {categories.map((category) => (
        <div key={category.id} className="rounded-md border bg-background/80 p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{category.label || category.key}</div>
              <div className="truncate text-xs text-muted-foreground">
                {/*
                  A category declares which entities it may target as a
                  *descriptor*, not as one resolved category — `MaterializedEdge`
                  used to have that resolved and stored, and went stale doing it.
                */}
                Target: {category.targetDescriptor.keys?.join(", ") ||
                  category.targetDescriptor.defaultCategoryKey ||
                  "any entity"}
              </div>
            </div>
            <div className="shrink-0 text-xs text-muted-foreground">
              Select a target entity to connect
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

// NOTE: these rows are a read-only survey of what this structure *could* be
// measured against. Actually recording one needs a concrete target Entity, while
// a measurement category only says which entity categories it accepts — that
// picking step lives in the `setasmeasurement` dialog, which resolves the
// descriptor, ensures the source structure and calls `assertMeasurementExists`.
export const ConnectableAs = ({
  identifier,
  graphId,
  variant = "dialog",
}: ConnectableAsProps) => {
  const { data, loading, error } = useListApplicableMeasurementCategoriesQuery({
    variables: {
      sourceIdentifier: identifier,
      graph: graphId,
    },
    fetchPolicy: "network-only",
  });

  const [popoverOpen, setPopoverOpen] = useState(false);

  const categories = data?.measurementCategories ?? [];

  const categoryList = (
    <ConnectableCategoryList
      categories={categories}
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
