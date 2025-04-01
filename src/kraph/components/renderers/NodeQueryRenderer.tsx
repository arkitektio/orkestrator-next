import {
  NodeQueryFragment,
  PathFragment,
  RenderNodeQueryQuery,
  useRenderNodeQueryQuery,
} from "@/kraph/api/graphql";
import { PathGraph } from "./graph/KnowledgeGraph";
import { GraphTable } from "./table/GraphTable";

export const PathRenderer = (props: { path: PathFragment }) => {
  return (
    <div>
      {props.path.nodes.map((node, i) => (
        <div key={i}>{node.__typename}</div>
      ))}
    </div>
  );
};

export const SelectiveNodeViewRenderer = (props: {
  render: RenderNodeQueryQuery["renderNodeQuery"];
  nodeId: string;
}) => {
  if (props.render.__typename === "Pairs") {
    return <div>Pair Rendering</div>;
  }

  if (props.render.__typename === "Path") {
    return <PathGraph path={props.render} root={props.nodeId} />;
  }

  if (props.render.__typename === "Table") {
    return <GraphTable table={props.render} />;
  }

  return <div>Unknown Type</div>;
};

export const NodeViewRenderer = (props: {
  query: NodeQueryFragment;
  nodeId: string;
}) => {
  const { data, error } = useRenderNodeQueryQuery({
    variables: {
      id: props.query.id,
      nodeId: props.nodeId,
    },
  });

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  if (data.renderNodeQuery.__typename === "Pairs") {
    return <div>Pair Rendering</div>;
  }

  if (data.renderNodeQuery.__typename === "Path") {
    return <PathGraph path={data.renderNodeQuery} root={props.nodeId} />;
  }
};
