import {
  PathFragment,
  useGetNodeViewQuery,
  useRenderGraphQuery,
  useRenderNodeQuery,
} from "@/kraph/api/graphql";
import { PathGraph } from "./graph/KnowledgeGraph";

export const PathRenderer = (props: { path: PathFragment }) => {
  return (
    <div>
      {props.path.nodes.map((node, i) => (
        <div key={i}>{node.__typename}</div>
      ))}
    </div>
  );
};

export const NodeViewRenderer = (props: { id: string }) => {
  const { data, error } = useGetNodeViewQuery({
    variables: {
      id: props.id,
    },
  });

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  if (data.nodeView.render.__typename === "Pairs") {
    return <div>Pair Rendering</div>;
  }

  if (data.nodeView.render.__typename === "Path") {
    return (
      <PathGraph
        path={data.nodeView.render}
        root={data.nodeView.node.graphId}
      />
    );
  }
};
