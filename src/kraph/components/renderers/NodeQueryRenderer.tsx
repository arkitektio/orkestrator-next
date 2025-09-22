import { NodeQueryViewFragment, PathFragment } from "@/kraph/api/graphql";
import { PathGraph } from "./graph/PathGraph";
import { GraphTable } from "./table/GraphTable";
import { ViewOptions } from "./DelegatingNodeViewRenderer";

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
  view: NodeQueryViewFragment;
  options?: ViewOptions;
}) => {
  if (props.view.render.__typename === "Pairs") {
    return <div>Pair Rendering</div>;
  }

  if (props.view.render.__typename === "Path") {
    return <PathGraph path={props.view.render} />;
  }

  if (props.view.render.__typename === "Table") {
    return <GraphTable table={props.view.render} options={props.options} />;
  }

  return <div>Unknown Type</div>;
};
