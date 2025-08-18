import { Button } from "@/components/ui/button";
import {
  GetStructureDocument,
  ListGraphFragment,
  useCreateStructureMutation,
  useGetInformedStructureQuery,
  useListGraphsQuery
} from "@/kraph/api/graphql";
import { Identifier } from "@/providers/smart/types";
import { SelectiveNodeViewRenderer } from "../renderers/NodeQueryRenderer";

export type KnowledgeSidebarProps = {
  identifier: Identifier;
  object: string;
};

export type StructureViewWidgetProps = {
  graph: ListGraphFragment;
} & KnowledgeSidebarProps;

export const StructureViewWidget = (props: StructureViewWidgetProps) => {
  const { data, loading, error } = useGetInformedStructureQuery({
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
      {data?.structureByIdentifier != undefined ? (
        <div className="w-full h-full">
          <div className="text-xs font-bold">{props.graph.name}</div>

          {data.structureByIdentifier.bestView && (
            <SelectiveNodeViewRenderer
              view={data.structureByIdentifier.bestView}
            />
          )}
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
