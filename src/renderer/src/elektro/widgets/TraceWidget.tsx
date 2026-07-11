import { ElektroSimulation } from "@/linkers";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useDetailSimulationQuery } from "../api/graphql";

export default (props: ReturnWidgetProps) => {
  const { data } = useDetailSimulationQuery({
    variables: {
      id: String(props.value ?? ""),
    },
  });

  if (!data?.simulation) {
    return <div>Simulation not found</div>;
  }

  return (
    <ElektroSimulation.DetailLink object={data.simulation}>
      <p className="text-xl">{data.simulation.name}</p>
      <p className="text-sm">{data.simulation.id}</p>
    </ElektroSimulation.DetailLink>
  );
};
