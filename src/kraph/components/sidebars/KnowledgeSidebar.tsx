import { FormDialog } from "@/components/dialog/FormDialog";
import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  ListGraphFragment,
  ListMeasurementCategoryFragment,
  useCreateEntityInlineMutation,
  useCreateMeasurementMutation,
  useCreateStructureMutation,
  useGetInformedStructureQuery,
  useListGraphsQuery,
  useListMeasurmentCategoryQuery,
  useSearchEntitiesForRoleLazyQuery
} from "@/kraph/api/graphql";
import CreateMeasurementCategoryForm from "@/kraph/forms/CreateMeasurementCategoryForm";
import { KraphGraph, KraphStructure } from "@/linkers";
import { Identifier } from "@/providers/smart/types";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SelectiveNodeViewRenderer } from "../renderers/NodeQueryRenderer";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { MetricsTable } from "../tables/MetricsTable";
import { Card } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "@/components/ui/empty";

export type KnowledgeSidebarProps = {
  identifier: Identifier;
  object: string;
};

export type StructureViewWidgetProps = {
  graph: ListGraphFragment;
} & KnowledgeSidebarProps;



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
          Connect
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
    <div className="flex flex-col p-2 h-full">
      {loading && <p className="text-xs text-muted-foreground">Loading...</p>}
      {error && <p className="text-red-500 text-xs">Error: {error.message}</p>}
      {!data?.structureByIdentifier && <div className="flex items-center justify-center"><Button
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
      </Button></div>}
      {data?.structureByIdentifier &&
        <>
          {data?.structureByIdentifier.bestView ? (
            <div className="h-full w-full aspect-square">
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
          <div className="flex flex-row gap-2 mt-4">
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

            <ConnectableAs
              identifier={props.identifier}
              structure={data?.structureByIdentifier.id || ""}
              graph={props.graph}
              refetch={refetch}
            />
          </div>
          <div className="flex flex-col gap-2 p-2">
            {data.structureByIdentifier.metrics.length > 0 && <MetricsTable metrics={data?.structureByIdentifier.metrics || []} />}
          </div>
        </>}
    </div>
  );
};

const KNOWLEDGE_SIDEBAR_KEY = "knowledge-sidebar-accordion";

export const KnowledgeSidebar = (props: KnowledgeSidebarProps) => {
  const { data } = useListGraphsQuery({
    variables: {
      filters: {
        pinned: true,
      },
    },
  });

  const [openItems, setOpenItems] = useState<string[]>(() => {
    // Load from local storage on initial render
    const saved = localStorage.getItem(KNOWLEDGE_SIDEBAR_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [data?.graphs.at(0)?.id || "0"];
      }
    }
    return [data?.graphs.at(0)?.id || "0"];
  });

  // Save to local storage whenever the open items change
  useEffect(() => {
    localStorage.setItem(KNOWLEDGE_SIDEBAR_KEY, JSON.stringify(openItems));
  }, [openItems]);

  if (!data || data.graphs.length === 0) {
    return <Empty>
      <EmptyTitle>No pinned graphs</EmptyTitle>
      <EmptyDescription>There are no graphs that you have pinned for quick access.</EmptyDescription>
      <EmptyContent>Go to the graphs page to pin some graphs to your knowledge sidebar.</EmptyContent>
      <KraphGraph.ListLink className="mt-4">
        <Button variant="outline">View Graphs</Button>
      </KraphGraph.ListLink>

    </Empty>;
  }




  return (
    <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="h-full p-2" >
      {data?.graphs.map((g) => (
        <AccordionItem value={g.id} key={g.id}>
          <AccordionTrigger>{g.name}</AccordionTrigger>
          <AccordionContent className="flex-grow overflow-y-auto">
            {openItems.includes(g.id) && (
              <GraphKnowledgeView
                identifier={props.identifier}
                graph={g}
                object={props.object}
              />
            )}
          </AccordionContent>
        </AccordionItem>
      ))}

    </Accordion>
  );
};
