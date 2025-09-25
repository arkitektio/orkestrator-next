import { GraphQueryFragment, useGetGraphQueryQuery } from "@/kraph/api/graphql";
import { PathGraph } from "./graph/PathGraph";
import { NodeListRender, RenderGraphQueryNodeList } from "./node_list/NodeList";
import { RenderGraphQueryTable } from "./table/GraphTable";
import { RenderGraphQueryPairs } from "./pairs/Pairs";
import { RenderGraphQueryPath } from "./graph/PathGraph";
import { Pairs } from "./pairs/Pairs";
import { GraphTable } from "./table/GraphTable";

export const SelectiveGraphQueryRenderer = (props: {
  graphQuery: GraphQueryFragment;
  interactive?: boolean;
}) => {
  if (props.graphQuery.render.__typename === "Pairs") {
    if (props.interactive) {
      return <RenderGraphQueryPairs graphQueryId={props.graphQuery.id} />;
    }
    return <Pairs pairs={props.graphQuery.render} />;
  }

  if (props.graphQuery.render.__typename === "Path") {
    if (props.interactive) {
      return <RenderGraphQueryPath graphQueryId={props.graphQuery.id} />;
    }
    return <PathGraph path={props.graphQuery.render} />;
  }

  if (props.graphQuery.render.__typename === "Table") {
    if (props.interactive) {
      return <RenderGraphQueryTable graphQueryId={props.graphQuery.id} />;
    }
    return <GraphTable table={props.graphQuery.render} />;
  }

  if (props.graphQuery.render.__typename === "NodeList") {
    if (props.interactive) {
      return <RenderGraphQueryNodeList graphQueryId={props.graphQuery.id} />;
    }
    return <NodeListRender list={props.graphQuery.render} />;
  }

  return null;
};

export const GraphQueryRenderer = (props: {
  id: string;
  interactive?: boolean;
}) => {
  const { data, error } = useGetGraphQueryQuery({
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

  return (
    <SelectiveGraphQueryRenderer
      graphQuery={data.graphQuery}
      interactive={props.interactive}
    />
  );
};

export const RenderGraphQuery = (props: { id: string }) => {
  return <RenderGraphQueryNodeList graphQueryId={props.id} />;
};

export const RenderGraphQueryAsTable = (props: { id: string }) => {
  return <RenderGraphQueryTable graphQueryId={props.id} />;
};

export const RenderGraphQueryAsPairs = (props: { id: string }) => {
  return <RenderGraphQueryPairs graphQueryId={props.id} />;
};

export const RenderGraphQueryAsPath = (props: { id: string }) => {
  return <RenderGraphQueryPath graphQueryId={props.id} />;
};
