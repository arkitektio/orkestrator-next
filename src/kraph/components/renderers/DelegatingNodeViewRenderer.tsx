import { NodeViewFragment } from "@/kraph/api/graphql";
import { GraphTable } from "./table/GraphTable";
import { PathGraph } from "./graph/KnowledgeGraph";

export const DelegatinNodeViewRenderer = (props: {
  nodeView: NodeViewFragment;
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
