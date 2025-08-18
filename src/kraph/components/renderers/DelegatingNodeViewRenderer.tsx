import { NodeQueryViewFragment } from "@/kraph/api/graphql";
import { PathGraph } from "./graph/PathGraph";
import { GraphTable } from "./table/GraphTable";

export const DelegatinNodeViewRenderer = (props: {
  nodeView: NodeQueryViewFragment;
}) => {
  return (
    <>
      {props.nodeView.render.__typename === "Pairs" && (
        <div>Pair Rendering</div>
      )}

      {props.nodeView.render.__typename === "Path" && (
        <PathGraph path={props.nodeView.render} />
      )}

      {props.nodeView.render.__typename === "Table" && (
        <>
          <GraphTable table={props.nodeView.render} />
        </>
      )}
    </>
  );
};
