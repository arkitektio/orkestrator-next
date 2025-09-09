import { NodeQueryViewFragment } from "@/kraph/api/graphql";
import { PathGraph } from "./graph/PathGraph";
import { GraphTable } from "./table/GraphTable";
import { bool } from "yup";


export type ViewOptions = {
  minimal: bool
};

export const DelegatinNodeViewRenderer = (props: {
  nodeView: NodeQueryViewFragment;
  options?: ViewOptions
}) => {
  return (
    <>
      {props.nodeView.render.__typename === "Pairs" && (
        <div>Pair Rendering</div>
      )}

      {props.nodeView.render.__typename === "Path" && (
        <PathGraph path={props.nodeView.render} options={props.options} />
      )}

      {props.nodeView.render.__typename === "Table" && (
        <>
          <GraphTable table={props.nodeView.render} options={props.options} />
        </>
      )}
    </>
  );
};
