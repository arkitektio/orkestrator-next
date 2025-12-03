import { FormDialogContext } from "@/components/dialog/FormDialog";
import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  ListMeasurementCategoryFragment,
  useCreateEntityInlineMutation,
  useCreateMeasurementMutation,
  useListMeasurmentCategoryQuery,
  useSearchEntitiesForRoleLazyQuery,
} from "@/kraph/api/graphql";
import CreateMeasurementCategoryForm from "@/kraph/forms/CreateMeasurementCategoryForm";
import { Link, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const FindEntity = (props: {
  structure: string;
  measurement: ListMeasurementCategoryFragment;
  refetch?: () => void;
  onSuccess?: () => void;
}) => {
  const [search] = useSearchEntitiesForRoleLazyQuery({
    variables: {
      tags:
        props.measurement?.targetDefinition?.tagFilters?.map((tag) => tag) ||
        [],
      categories:
        props.measurement?.targetDefinition?.categoryFilters?.map(
          (cat) => cat,
        ) || [],
    },
    nextFetchPolicy: "cache-and-network",
  });

  const form = useForm({
    defaultValues: {
      entity: null,
    },
  });

  const [createMeasurement] = useCreateMeasurementMutation({
    refetchQueries: ["GetGraph"],
  });

  const [create] = useCreateEntityInlineMutation({
    refetchQueries: ["SearchEntitiesForRole"],
  });

  const createCategory = props.measurement.targetDefinition.defaultUseNew;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          createMeasurement({
            variables: {
              input: {
                entity: data.entity,
                category: props.measurement.id,
                structure: props.structure,
              },
            },
          })
            .then(() => {
              props.refetch?.();
              props.onSuccess?.();
              toast.success("Measurement created successfully.");
            })
            .catch((e) => {
              toast.error("Error creating measurement:", e);
            });
        })}
        className="flex flex-col gap-4"
      >
        {createCategory ? (
          <GraphQLCreatableSearchField
            label="Entity"
            name="entity"
            searchQuery={search}
            description="Search for an entity to connect to this measurement."
            createMutation={(s) =>
              create({
                variables: {
                  input: s.variables.input,
                  category: createCategory.id,
                },
              })
            }
          />
        ) : (
          <GraphQLSearchField
            label="Entity"
            name="entity"
            searchQuery={search}
            description="Search for an entity to connect to this measurement."
          />
        )}

        <DialogFooter>
          <Button type="submit">Create Connection</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export type ConnectableAsProps = {
  identifier: string;
  structure: string;
  graphId: string;
  onConnect?: () => void;
};

export const ConnectableAs = ({
  identifier,
  structure,
  graphId,
  onConnect,
}: ConnectableAsProps) => {
  const { data, refetch } = useListMeasurmentCategoryQuery({
    variables: {
      filters: {
        graph: graphId,
        sourceIdentifier: identifier,
      },
    },
  });

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCategory = () => {
    refetch();
    setIsCreating(false);
  };

  const reset = () => {
    setSelectedCategory(null);
    setIsCreating(false);
  };

  const selectedMeasurement = data?.measurementCategories.find(
    (c) => c.id === selectedCategory,
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Link className="h-4 w-4" />
          Connect
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCreating
              ? "Create Category"
              : selectedCategory
                ? "Connect Entity"
                : "Connect as..."}
          </DialogTitle>
          <DialogDescription>
            {isCreating
              ? "Create a new measurement category"
              : selectedCategory
                ? "Select an entity to connect"
                : "Select a category to connect as"}
          </DialogDescription>
        </DialogHeader>

        {isCreating ? (
          <FormDialogContext.Provider
            value={{
              onSubmit: () => {
                handleCreateCategory();
              },
              onError: () => {
                toast.error("Error creating category");
              },
            }}
          >
            <CreateMeasurementCategoryForm
              graph={graphId}
              identifier={identifier}
            />
          </FormDialogContext.Provider>
        ) : selectedCategory && selectedMeasurement ? (
          <FindEntity
            structure={structure}
            measurement={selectedMeasurement}
            refetch={onConnect}
            onSuccess={() => setOpen(false)}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {data?.measurementCategories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="justify-start"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
            {data?.measurementCategories.length === 0 && (
              <div className="p-2 text-xs text-muted-foreground text-center">
                No categories available
              </div>
            )}
            <Button variant="ghost" onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </div>
        )}
        {(selectedCategory || isCreating) && (
          <Button variant="ghost" size="sm" onClick={reset} className="mt-2">
            Back
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
