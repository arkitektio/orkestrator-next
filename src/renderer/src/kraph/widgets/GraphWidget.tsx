import { KraphGraph } from "@/linkers";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useGetGraphQuery } from "../api/graphql";

export const GraphWidget = (props: ReturnWidgetProps) => {
  const { data } = useGetGraphQuery({
    variables: {
      id: props.value,
    },
  });

  if (!data?.graph) {
    return <div>Graph not found</div>;
  }

  return (
    <KraphGraph.DetailLink object={data.graph}>
      <div className="rounded p-3">{data?.graph?.name}</div>
      <div className="rounded p-3">{data?.graph?.description}</div>
    </KraphGraph.DetailLink>
  );
};


export default GraphWidget;
