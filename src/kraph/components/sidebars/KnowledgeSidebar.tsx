import { Button } from "@/components/ui/button";
import {
  GetStructureDocument,
  GraphFragment,
  KnowledgeStructureFragment,
  ListGraphFragment,
  useCreateStructureMutation,
  useGetStructureQuery,
  useListGraphsQuery,
  useMyActiveGraphQuery,
} from "@/kraph/api/graphql";
import { Identifier } from "@/providers/smart/types";
import { DelegatinNodeViewRenderer } from "../renderers/DelegatingNodeViewRenderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type KnowledgeSidebarProps = {
  identifier: Identifier;
  object: string;
};

export type StructureViewWidgetProps = {
  graph: ListGraphFragment;
} & KnowledgeSidebarProps;

export const StructureViewWidget = (props: StructureViewWidgetProps) => {
  const { data } = useGetStructureQuery({
    variables: {
      identifier: props.identifier,
      object: props.object,
      graph: props.graph.id,
    },
  });

  const [createS] = useCreateStructureMutation({
    refetchQueries: [GetStructureDocument],
  });

  return (
    <>
      {data?.structure != undefined ? (
        <div className="w-full h-full">
          {data.structure.pinnedViews.map((p) => (
            <DelegatinNodeViewRenderer key={p.id} nodeView={p} />
          ))}
          {data.structure.pinnedViews.length == 0 && "No Pinned Views"}
        </div>
      ) : (
        <div className="">
          <Button
            onClick={() => {
              createS({
                variables: {
                  input: {
                    structure: `${props.identifier}:${props.object}`,
                    graph: props.graph.id,
                  },
                },
              });
            }}
          >
            Create Structure
          </Button>
        </div>
      )}
    </>
  );
};

export const KnowledgeSidebar = (props: KnowledgeSidebarProps) => {
  const { data } = useListGraphsQuery({
    variables: {
      filters: {
        pinned: true,
      },
    },
  });

  return (
    <div className="flex flex-col h-full p-2">
      {data?.graphs.map((g) => (
        <div className="flex-1">
          <StructureViewWidget
            identifier={props.identifier}
            graph={g}
            object={props.object}
          />
        </div>
      ))}
    </div>
  );
};
