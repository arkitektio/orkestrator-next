import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useDetailExperimentQuery, useDetailSimulationQuery } from "../api/graphql";
import { ElektroExperiment, ElektroSimulation } from "@/linkers";

export default (props: ReturnWidgetProps) => {
  const { data } = useDetailExperimentQuery({
    variables: {
      id: props.value,
    },
  });

  return (
    <ElektroExperiment.DetailLink object={props.value}>
      <p className="text-xl">{data?.experiment?.name}</p>
      <p className="text-sm">{data?.experiment?.id}</p>
    </ElektroExperiment.DetailLink>
  );
};