import { Guard } from "@/arkitekt/Arkitekt";
import { Button } from "@/components/ui/button";
import {
  EntityGraph,
  GetStructureDocument,
  GraphFragment,
  MyActiveGraphDocument,
  useCreateGraphMutation,
  useCreateStructureMutation,
  useGetEntityGraphQuery,
  useGetStructureQuery,
  useMyActiveGraphQuery,
} from "../api/graphql";
import { KnowledgeGraph } from "./graph/KnowledgeGraph";
import { KnowledgeEdge, KnowledgeNode } from "./graph/types";

export type KnowledgeProps = {
  object: string;
  identifier: string;
};

export type InsideProps = KnowledgeProps & {
  graph: GraphFragment;
};

export const entityNodesToNodes = (
  nodes: EntityGraph["nodes"],
): KnowledgeNode[] => {
  return nodes.map((node) => {
    return {
      position: { x: 0, y: 0 },
      id: node.id,
      label: node.label,
      data: { label: node.label, id: node.id },
    } as KnowledgeNode;
  });
};

export const entityRelationToEdges = (
  relations: EntityGraph["edges"],
): KnowledgeEdge[] => {
  return relations.map((relation) => {
    return {
      id: relation.id,
      source: relation.leftId,
      target: relation.rightId,
    } as KnowledgeEdge;
  });
};

const RealKnowledgeGraph = ({ entity }: { entity: string }) => {
  const { data, error } = useGetEntityGraphQuery({
    variables: {
      id: entity,
    },
  });

  if (error) {
    return <div>Error {JSON.stringify(error)}</div>;
  }

  if (!data) {
    return <>....Loading ...</>;
  }

  return (
    <div className="h-full w-full">
      <KnowledgeGraph
        nodes={entityNodesToNodes(data.entityGraph.nodes)}
        edges={entityRelationToEdges(data.entityGraph.edges)}
      />
    </div>
  );
};

const Inside = ({ object, graph, identifier }: InsideProps) => {
  const { data, error } = useGetStructureQuery({
    variables: {
      graph: graph.id,
      structure: `${identifier}:${object}`,
    },
  });

  const [create] = useCreateStructureMutation({
    refetchQueries: [GetStructureDocument],
  });

  return (
    <div className="h-full w-full">
      {data?.structure.id && <RealKnowledgeGraph entity={data.structure.id} />}
      {error && (
        <div className="p-3">
          <Button
            onClick={() =>
              create({
                variables: {
                  input: {
                    graph: graph.id,
                    structure: `${identifier}:${object}`,
                  },
                },
              })
            }
          >
            Create Entity in {graph.name}
          </Button>
        </div>
      )}
    </div>
  );
};

export const CreateGraphButton = () => {
  const [create] = useCreateGraphMutation({
    refetchQueries: [MyActiveGraphDocument],
  });

  return (
    <div className="p-3">
      <Button
        onClick={() =>
          create({
            variables: {
              input: { name: "New Graph" },
            },
          })
        }
      >
        Create
      </Button>
    </div>
  );
};

export const KnowledgeProtected = (props: KnowledgeProps) => {
  const { data } = useMyActiveGraphQuery();

  return (
    <>
      {data?.myActiveGraph.id && (
        <Inside {...props} graph={data?.myActiveGraph} />
      )}

      {!data?.myActiveGraph.id && (
        <div className="text-full">
          No active graph for this user <CreateGraphButton />
        </div>
      )}
    </>
  );
};

export const Knowledge = (props: KnowledgeProps) => {
  return (
    <>
      <Guard.Kraph>
        <KnowledgeProtected {...props} />
      </Guard.Kraph>
    </>
  );
};
