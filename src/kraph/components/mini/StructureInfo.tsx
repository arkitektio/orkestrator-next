import { Button } from "@/components/ui/button";
import {
  GetStructureDocument,
  GraphFragment,
  KnowledgeStructureFragment,
  ListGraphFragment,
  useCreateStructureMutation,
  useGetStructreInfoQuery,
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
import { KraphNode } from "@/linkers";
import { Badge } from "@/components/ui/badge";

export type KnowledgeSidebarProps = {
  identifier: Identifier;
  object: string;
};

export type StructureViewWidgetProps = {
  graph: ListGraphFragment;
} & KnowledgeSidebarProps;

export const StructureViewWidget = (props: StructureViewWidgetProps) => {
  const { data, loading, error } = useGetStructreInfoQuery({
    variables: {
      identifier: props.identifier,
      object: props.object,
      graph: props.graph.id,
    },
  });

  const [createS] = useCreateStructureMutation({
    refetchQueries: [GetStructureDocument],
  });

  if (loading) return <></>;

  if (error) {
    return (
      <div className="text-red-500 text-xs">
        No structure found in graph {props.graph.name}.
      </div>
    );
  }

  return (
    <>
      {data?.structure != undefined ? (
        <div className="w-full h-full">
          <div className="text-xs font-bold">{props.graph.name}</div>

          {data.structure.leftEdges.map((edge) => (
            <div className="flex flex-row">
              {edge.__typename == "Relation" ? (
                <div className="flex flex-row">
                  {edge.left.__typename == "Structure"
                    ? edge.left.identifier
                    : ""}
                  {edge.left.__typename == "Entity" ? edge.left.label : ""}
                  {"-> "}
                </div>
              ) : null}
            </div>
          ))}

          {data.structure.rightEdges.length == 0 && (
            <div className="flex flex-row">
              {data.structure.identifier} has no measurments
            </div>
          )}

          {data.structure.rightEdges.map((edge) => (
            <ul className="flex flex-row gap-2">
              {edge.__typename == "Relation" ? (
                <li className="flex flex-row" key={edge.id}>
                  <KraphNode.DetailLink object={edge.right.id}>
                    <Badge className="bg-red-200">
                      {edge.label.replaceAll('"', "")}
                    </Badge>
                    {" - "}
                    <Badge color="blue">
                      {edge.right.__typename == "Entity"
                        ? edge.right.label
                        : ""}
                      {edge.right.__typename == "Structure"
                        ? edge.right.identifier
                        : ""}
                    </Badge>
                  </KraphNode.DetailLink>
                </li>
              ) : null}
            </ul>
          ))}
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

export const StructureInfo = (props: KnowledgeSidebarProps) => {
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
