import { useGetGraphViewQuery } from "@/kraph/api/graphql";
import { PathGraph } from "./graph/KnowledgeGraph";
import { GraphTable } from "./table/GraphTable";

export const GraphViewRenderer = (props: { id: string }) => {
  const { data, error } = useGetGraphViewQuery({
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

  if (data.graphView.render.__typename === "Pairs") {
    return <div>Pair Rendering</div>;
  }

  if (data.graphView.render.__typename === "Path") {
    return <PathGraph path={data.graphView.render} />;
  }

  if (data.graphView.render.__typename === "Table") {
    return <GraphTable table={data.graphView.render} />;
  }
};
