import { Structure } from "@/types";
import { useDialog } from "@/app/dialog";
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
  ListMaterializedEdgeFragment,
  useCreateMeasurementMutation,
  useCreateStructureMutation,
  useListEntitiesQuery,
} from "@/kraph/api/graphql";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";

export const SetAsMeasurement = (props: {
  left: Structure[];
  edge: ListMaterializedEdgeFragment;
}) => {
  const { closeDialog } = useDialog();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, loading } = useListEntitiesQuery({
    variables: {
      filters: {
        search: debouncedSearch || undefined,
        categories: [props.edge?.target.id],
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
      const leftStructureString = `${props.left[0]?.identifier}:${props.left[0]?.object}`;

      const s = await createStructure({
        variables: {
          input: {
            structure: leftStructureString,
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
            structure: s.data.createStructure.id,
            entity: entityId,
            category: props.edge.relation.id,
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
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Associate Entity</h2>
        <p className="text-muted-foreground">
          Search and select an entity to associate with the measurement
        </p>
      </div>

      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search entities..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      <ScrollArea className="flex-1 max-h-[400px]">
        <div className="space-y-3">
          {loading || isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading entities...</div>
            </div>
          ) : !data?.entities.length ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2">
              <MagnifyingGlassIcon className="h-12 w-12 text-muted-foreground" />
              <div className="text-muted-foreground">No entities found</div>
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
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onClickEntity(entity.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{entity.label}</CardTitle>
                  {entity.category.label && (
                    <CardDescription>
                      Category: {entity.category.label}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    ID: {entity.id}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-end space-x-2 border-t pt-4">
        <Button variant="outline" onClick={closeDialog}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
