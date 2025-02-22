import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useGetGraphViewQuery, useGetOntologyQuery } from "../api/graphql";
import { KraphGraphView, KraphOntology } from "@/linkers";

export default (props: ReturnWidgetProps) => {
  const { data } = useGetGraphViewQuery({
    variables: {
      id: props.value,
    },
  });

  return (
    <KraphGraphView.DetailLink object={props.value}>
      <div className="rounded p-3">{data?.graphView?.query.name}</div> on
      <div className="rounded p-3">{data?.graphView?.graph.name}</div>
    </KraphGraphView.DetailLink>
  );
};
