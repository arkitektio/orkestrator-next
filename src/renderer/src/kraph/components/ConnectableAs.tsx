import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ListMaterializedMeasurementsQuery,
  useCreateEntityInlineMutation,
  useCreateMeasurementMutation,
  useListEntitiesQuery,
  useListMaterializedMeasurementsQuery,
} from "@/kraph/api/graphql";
import { Link, Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type MaterializedMeasurementEdge =
  ListMaterializedMeasurementsQuery["materializedMeasurementEdges"][number];

const edgeLabel = (edge: MaterializedMeasurementEdge) =>
  `${edge.edge.label || edge.edge.key} - ${edge.target.label || edge.target.key}`;

const ExistingEntityPicker = ({
  edge,
  structure,
  onConnected,
}: {
  edge: MaterializedMeasurementEdge;
  structure: string;
  onConnected: (targetId: string) => Promise<void>;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 250);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, [edge.id]);

  const { data, loading, error } = useListEntitiesQuery({
    variables: {
      entityCategoryId: edge.target.id,
      filters: {
        search: debouncedSearch || undefined,
      },
      pagination: {
        limit: 12,
      },
    },
    fetchPolicy: "network-only",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <div className="text-sm font-medium">{edgeLabel(edge)}</div>
        <div className="text-xs text-muted-foreground">
          Search the latest entities for {edge.target.label || edge.target.key} and
          connect them to this structure.
        </div>
        <div className="text-xs text-muted-foreground">Structure: {structure}</div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          autoFocus
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={`Search ${edge.target.label || edge.target.key}`}
          className="pl-9"
        />
      </div>

      <ScrollArea className="max-h-72 rounded-md border">
        <div className="flex flex-col gap-2 p-2">
          {loading && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              Loading entities...
            </div>
          )}
          {error && (
            <div className="px-2 py-4 text-center text-sm text-destructive">
              {error.message}
            </div>
          )}
          {!loading && !error && data?.entities.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No entities found.
            </div>
          )}
          {data?.entities.map((entity) => (
            <Button
              key={entity.id}
              type="button"
              variant="outline"
              className="justify-between"
              disabled={connectingId === entity.id}
              onClick={async () => {
                setConnectingId(entity.id);
                try {
                  await onConnected(entity.id);
                } finally {
                  setConnectingId(null);
                }
              }}
            >
              <span className="truncate">{entity.label}</span>
              <span className="text-xs text-muted-foreground">
                {connectingId === entity.id ? "Connecting..." : edge.target.label}
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const ConnectExistingPopover = ({
  edge,
  structure,
  onConnected,
  disabled,
}: {
  edge: MaterializedMeasurementEdge;
  structure: string;
  onConnected: (targetId: string) => Promise<void>;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" size="sm" disabled={disabled}>
          Connect
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[28rem] max-w-[min(90vw,28rem)]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <PopoverHeader>
          <PopoverTitle>Connect Existing Entity</PopoverTitle>
          <PopoverDescription>
            Search recent entities for the selected target and connect one.
          </PopoverDescription>
        </PopoverHeader>
        <ExistingEntityPicker
          edge={edge}
          structure={structure}
          onConnected={async (targetId) => {
            await onConnected(targetId);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

const ConnectableCategoryList = ({
  edges,
  loading,
  error,
  creatingId,
  structure,
  onCreateNew,
  onConnectExisting,
}: {
  edges: MaterializedMeasurementEdge[];
  loading: boolean;
  error?: string;
  creatingId: string | null;
  structure: string;
  onCreateNew: (edge: MaterializedMeasurementEdge) => Promise<void>;
  onConnectExisting: (edge: MaterializedMeasurementEdge, targetId: string) => Promise<void>;
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
            <div className="flex gap-2">
              <ConnectExistingPopover
                edge={edge}
                structure={structure}
                disabled={creatingId === edge.id}
                onConnected={(targetId) => onConnectExisting(edge, targetId)}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={creatingId === edge.id}
                onClick={async () => {
                  await onCreateNew(edge);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {creatingId === edge.id ? "Creating..." : "New"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export type ConnectableAsProps = {
  identifier: string;
  structure: string;
  graphId: string;
  onConnect?: () => void;
  variant?: "dialog" | "inline";
};

export const ConnectableAs = ({
  identifier,
  structure,
  graphId,
  onConnect,
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

  const [createEntityInline] = useCreateEntityInlineMutation();
  const [createMeasurement] = useCreateMeasurementMutation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const edges = data?.materializedMeasurementEdges ?? [];

  const connectEntity = async (
    edge: MaterializedMeasurementEdge,
    targetId: string,
  ) => {
    await createMeasurement({
      variables: {
        input: {
          category: edge.edge.id,
          sourceId: structure,
          targetId,
        },
      },
    });

    toast.success("Measurement created successfully.");
    onConnect?.();
  };

  const handleCreateNew = async (edge: MaterializedMeasurementEdge) => {
    setCreatingId(edge.id);

    try {
      const result = await createEntityInline({
        variables: {
          category: edge.target.id,
        },
      });

      const targetId = result.data?.result.value;

      if (!targetId) {
        throw new Error("Could not create a new target entity.");
      }

      await connectEntity(edge, targetId);

      if (variant !== "inline") {
        setPopoverOpen(false);
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to create and connect entity.";
      toast.error(message);
    } finally {
      setCreatingId(null);
    }
  };

  const categoryList = (
    <ConnectableCategoryList
      edges={edges}
      loading={loading}
      error={error?.message}
      creatingId={creatingId}
      structure={structure}
      onCreateNew={handleCreateNew}
      onConnectExisting={async (edge, targetId) => {
        try {
          await connectEntity(edge, targetId);
        } catch (caughtError) {
          const message =
            caughtError instanceof Error
              ? caughtError.message
              : "Failed to connect entity.";
          toast.error(message);
        }
      }}
    />
  );

  if (variant === "inline") {
    return (
      <div className="flex flex-col gap-3 rounded-lg p-3">
        <div>
          <div className="text-sm font-medium">Connect as</div>
          <div className="text-xs text-muted-foreground">
            Pick a connectable target and either attach an existing entity or create a new one.
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
            Choose a target, then connect an existing entity or create a new one.
          </PopoverDescription>
        </PopoverHeader>
        {categoryList}
      </PopoverContent>
    </Popover>
  );
};
