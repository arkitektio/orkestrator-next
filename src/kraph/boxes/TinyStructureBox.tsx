import { FormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import { KraphGraph, KraphStructure } from "@/linkers";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { DialogContent } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  ListGraphFragment,
  ListMeasurementCategoryFragment,
  useCreateEntityInlineMutation,
  useCreateEntityMutation,
  useCreateMeasurementMutation,
  useCreateStructureMutation,
  useGetInformedStructureQuery,
  useListGraphsQuery,
  useListMeasurmentCategoryQuery,
  useSearchEntitiesForRoleLazyQuery,
} from "../api/graphql";
import { SelectiveNodeViewRenderer } from "../components/renderers/NodeQueryRenderer";
import CreateMeasurementCategoryForm from "../forms/CreateMeasurementCategoryForm";
import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";

const FindEntity = (props: {
  structure: string;
  measurement: ListMeasurementCategoryFragment;
  refetch?: () => void;
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
              toast.success("Measurement created successfully.");
            })
            .catch((e) => {
              toast.error("Error creating measurement:", e);
            });
        })}
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
          <Button type="submit">Create</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

const ConnectableAs = (props: {
  identifier: string;
  structure: string;
  graph: ListGraphFragment;
  refetch?: () => void;
}) => {
  const { data, refetch } = useListMeasurmentCategoryQuery({
    variables: {
      filters: {
        graph: props.graph.id,
        sourceIdentifier: props.identifier,
      },
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          Connect to {props.identifier}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {data?.measurementCategories.map((category) => (
          <Dialog key={category.id}>
            <DialogTrigger>
              <Button variant="outline" className="w-full">
                {category.label}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="flex flex-col gap-2">
                <h3 className="text-scroll font-semibold text-xs">
                  {category.label}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.description}
                </p>
                <FindEntity
                  structure={props.structure}
                  measurement={category}
                  refetch={props.refetch}
                />
              </div>
            </DialogContent>
          </Dialog>
        ))}
        <FormDialog
          trigger={
            <Button variant="outline" className="w-full">
              Create Measurement Category
            </Button>
          }
          onSubmit={() => {
            refetch();
          }}
        >
          <CreateMeasurementCategoryForm
            graph={props.graph.id}
            identifier={props.identifier}
          />
        </FormDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const GraphKnowledgeView = (props: {
  identifier: string;
  object: string;
  graph: ListGraphFragment;
}) => {
  const { data, refetch, error, loading } = useGetInformedStructureQuery({
    variables: {
      identifier: props.identifier,
      object: props.object,
      graph: props.graph.id,
    },
  });

  const [addStructure] = useCreateStructureMutation({
    onCompleted: () => refetch(),
  });

  return (
    <div className="flex flex-col gap-2">
      <KraphGraph.DetailLink object={props.graph.id}>
        <h3 className="text-scroll font-semibold text-xs">
          {props.graph.name}
        </h3>
      </KraphGraph.DetailLink>
      {loading && <p className="text-xs text-muted-foreground">Loading...</p>}
      {error && <p className="text-red-500 text-xs">Error: {error.message}</p>}
      {
        <>
          {data?.structureByIdentifier.bestView ? (
            <div className="h-64 w-full">
              <SelectiveNodeViewRenderer
                view={data.structureByIdentifier.bestView}
                options={{ minimal: true }}
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No best view available for this structure.
            </p>
          )}
          <KraphStructure.DetailLink
            object={data?.structureByIdentifier.id}
            className="text-xs text-scroll font-light"
          >
            {data?.structureByIdentifier.label}
          </KraphStructure.DetailLink>
        </>
      }
      <div className="flex flex-row gap-2">
        {data?.structureByIdentifier ? (
          <ObjectButton
            objects={[{ identifier: props.identifier, object: props.object }]}
            className="w-full"
            partners={[
              {
                identifier: "@kraph/graph",
                object: props.graph.id,
              },
            ]}
            disableKraph={true}
            expect={["@mikro/metric"]}
            onDone={() => {
              refetch();
            }}
          >
            <Button variant="outline" className="w-full">
              Measure
            </Button>
          </ObjectButton>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              addStructure({
                variables: {
                  input: {
                    structure: `${props.identifier}:${props.object}`,
                    graph: props.graph.id,
                  },
                },
              })
            }
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};

export const ProtectedTinyStructureBox = (props: {
  identifier: string;
  object: string;
}) => {
  const { data, error, loading } = useListGraphsQuery({
    variables: {
      filters: {
        pinned: true,
      },
    },
  });

  if (loading) {
    return <p className="text-xs text-muted-foreground">Loading...</p>;
  }

  return (
    <Carousel className="w-full dark:text-white">
      <CarouselPrevious />
      <CarouselContent>
        {data?.graphs.map((graph) => (
          <CarouselItem key={graph.id}>
            <Card className="p-3 ">
              <GraphKnowledgeView
                identifier={props.identifier}
                object={props.object}
                graph={graph}
              />
            </Card>
          </CarouselItem>
        ))}
        {data?.graphs.length == 0 && (
          <CarouselItem>
            <Card className="p-3 flex flex-col gap-2">
              <h3 className="text-scroll font-semibold text-xs">
                No pinned Graphs. Pin some graphs to see them here.
              </h3>
            </Card>
          </CarouselItem>
        )}
        {error && (
          <CarouselItem className="grid grid-cols-12">
            <p>Error: {error.message}</p>
          </CarouselItem>
        )}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
};

export const TinyStructureBox = (props: {
  identifier: string;
  object: string;
}) => {
  return (
    <Guard.Kraph>
      <ProtectedTinyStructureBox
        identifier={props.identifier}
        object={props.object}
      />
    </Guard.Kraph>
  );
};
