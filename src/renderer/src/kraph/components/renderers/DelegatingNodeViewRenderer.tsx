import { NodeQueryFragment } from "@/kraph/api/graphql";
import { RenderGraphPath } from "./graph/PathGraph";
import { RenderGraphQueryPairs } from "./pairs/Pairs";
import { RenderGraphQueryTable } from "./table/GraphTable";


export type ViewOptions = {
  minimal: boolean
};

export const DelegatinNodeViewRenderer = (props: {
  nodeView: NodeQueryFragment;
  options?: ViewOptions
}) => {
  return (
    <>
      {props.nodeView.__typename === "NodePairsQuery" && (
        <RenderGraphQueryPairs graphQueryId={props.nodeView.id} options={props.options} />
      )}

      {props.nodeView.__typename === "NodePathQuery" && (
        <RenderGraphPath graphQueryId={props.nodeView.id} options={props.options} />
      )}

      {props.nodeView.__typename === "NodeTableQuery" && (
        <RenderGraphQueryTable graphQueryId={props.nodeView.id} options={props.options} />
      )}
    </>
  );
};
