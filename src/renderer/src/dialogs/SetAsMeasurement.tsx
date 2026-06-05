import { useDialog } from "@/app/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import {
  ListMaterializedMeasurementEdgeFragment,
  useCreateMeasurementMutation,
  useCreateStructureMutation,
  useListEntitiesQuery,
} from "@/kraph/api/graphql";
import { Structure } from "@/types";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Activity, CircleDot } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const SetAsMeasurement = (props: {
  left: Structure[];
  edge: ListMaterializedMeasurementEdgeFragment;
}) => {
  const { closeDialog } = useDialog();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const source = props.left[0];

  const { data, loading } = useListEntitiesQuery({
    variables: {

      entityCategoryId: props.edge.target.id,
      filters: {
        search: debouncedSearch || undefined,
      },
    },
  });

  const [createStructure] = useCreateStructureMutation({
    onCompleted: (data) => {
      console.log("Structure created:", data);
    },
    onError: (error) => {
      console.error("Error creating structure:", error);
      toast.error("Failed to create structure");
    },
  });

  const [createMeasurement] = useCreateMeasurementMutation({
    onCompleted: () => {
      toast.success("Measurement created successfully");
      closeDialog();
    },
    onError: (error) => {
      console.error("Error creating measurement:", error);
      toast.error("Failed to create measurement");
    },
  });

  const onClickEntity = async (entityId: string) => {
    setIsLoading(true);
    try {
      if (!source?.object?.id) {
        throw new Error("Missing source structure id");
      }

      const s = await createStructure({
        variables: {
          input: {
            category: props.edge.source.id,
            object: source.object.id,
            graph: props.edge.graph.id,
          },
        },
      });

      if (!s.data) {
        toast.error("Failed to create structure");
        return;
      }

      await createMeasurement({
        variables: {
          input: {
            sourceId: s.data.createStructure.id,
            targetId: entityId,
            category: props.edge.edge.id,
          },
        },
      });
    } catch (error) {
      console.error("Error setting entity as measurement:", error);
      toast.error("Failed to set entity as measurement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Set As Measurement
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose an entity from {props.edge.target.label} to attach to this structure.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
              <Activity className="h-3.5 w-3.5" />
              {props.edge.edge.label}
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
              <CircleDot className="h-3.5 w-3.5" />
              {props.edge.graph.name}
            </Badge>
          </div>
        </div>
        {source ? (
          <div className="mt-4 rounded-lg border bg-muted/20 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Source</span>
            <div className="mt-1 font-medium">{source.identifier}</div>
            <div className="font-mono text-xs text-muted-foreground">
              {source.object.id}
            </div>
          </div>
        ) : null}
      </div>

      <div className="px-6 py-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search ${props.edge.target.label.toLowerCase()} entities...`}
            value={searchQuery}
            onChange={handleSearchChange}
            className="h-10 rounded-lg pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 pb-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {loading || isLoading ? (
            <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed py-12">
              <div className="text-sm text-muted-foreground">Loading entities...</div>
            </div>
          ) : !data?.entities.length ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed py-12 space-y-2">
              <MagnifyingGlassIcon className="h-12 w-12 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">No entities found</div>
              {searchQuery && (
                <div className="text-sm text-muted-foreground">
                  Try adjusting your search terms
                </div>
              )}
            </div>
          ) : (
            data.entities.map((entity) => (
              <Card
                key={entity.id}
                className="cursor-pointer border-border/70 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/30"
                onClick={() => onClickEntity(entity.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-base">{entity.label}</CardTitle>
                      {entity.category.label && (
                        <CardDescription className="mt-1">
                          {entity.category.label}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0">Select</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-xs text-muted-foreground break-all">
                    {entity.id}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-end space-x-2 border-t px-6 py-4">
        <Button variant="outline" onClick={closeDialog}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
