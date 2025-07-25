import {
  GraphQueryFragment,
  useGetGraphQuery,
  useGetGraphQueryQuery,
} from "@/kraph/api/graphql";
import { PathGraph } from "./graph/PathGraph";
import { GraphTable } from "./table/GraphTable";
import { Pairs } from "./pairs/Pairs";

export const SelectiveGraphQueryRenderer = (props: {
  graphQuery: GraphQueryFragment;
}) => {
  if (props.graphQuery.render.__typename === "Pairs") {
    return <Pairs pairs={props.graphQuery.render} />;
  }

  if (props.graphQuery.render.__typename === "Path") {
    return <PathGraph path={props.graphQuery.render} />;
  }

  if (props.graphQuery.render.__typename === "Table") {
    return <GraphTable table={props.graphQuery.render} />;
  }
};

export const GraphQueryRenderer = (props: { id: string }) => {
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

  return <SelectiveGraphQueryRenderer graphQuery={data.graphQuery} />;
};
