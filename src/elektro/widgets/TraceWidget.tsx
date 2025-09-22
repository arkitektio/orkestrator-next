import { ElektroSimulation } from "@/linkers";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useDetailSimulationQuery } from "../api/graphql";

export default (props: ReturnWidgetProps) => {
  const { data } = useDetailSimulationQuery({
    variables: {
      id: props.value,
    },
  });

  return (
    <ElektroSimulation.DetailLink object={props.value}>
      <p className="text-xl">{data?.simulation?.name}</p>
      <p className="text-sm">{data?.simulation?.id}</p>
    </ElektroSimulation.DetailLink>
  );
};