import { KraphGraph } from "@/linkers";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useGetGraphQuery } from "../api/graphql";

export default (props: ReturnWidgetProps) => {
  const { data } = useGetGraphQuery({
    variables: {
      id: props.value,
    },
  });

  return (
    <KraphGraph.DetailLink object={props.value}>
      <div className="rounded p-3">{data?.graph?.name}</div>
      <div className="rounded p-3">{data?.graph?.description}</div>
    </KraphGraph.DetailLink>
  );
};
