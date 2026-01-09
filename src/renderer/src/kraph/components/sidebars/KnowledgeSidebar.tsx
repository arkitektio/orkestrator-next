import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ListGraphFragment,
  useCreateStructureMutation,
  useGetInformedStructureQuery,
  useListGraphsQuery,
} from "@/kraph/api/graphql";
import { KraphGraph } from "@/linkers";
import { Identifier } from "@/providers/smart/types";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { SelectiveNodeViewRenderer } from "../renderers/NodeQueryRenderer";
import { useEffect, useState } from "react";
import { MetricsTable } from "../tables/MetricsTable";
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "@/components/ui/empty";

export type KnowledgeSidebarProps = {
  identifier: Identifier;
  object: string;
};

export type StructureViewWidgetProps = {
  graph: ListGraphFragment;
} & KnowledgeSidebarProps;



import { ConnectableAs } from "../ConnectableAs";

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
              graphId={props.graph.id}
              onConnect={refetch}
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
