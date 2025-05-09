import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useDetailNeuronModelQuery, useDetailSimulationQuery } from "../api/graphql";
import { ElektroNeuronModel, ElektroSimulation } from "@/linkers";
import { NeuronVisualizer } from "../components/NeuronRenderer";

export default (props: ReturnWidgetProps) => {
  const { data } = useDetailNeuronModelQuery({
    variables: {
      id: props.value,
    },
  });

  return (
    <ElektroNeuronModel.DetailLink object={props.value}>
      {data?.neuronModel && <NeuronVisualizer model={data?.neuronModel} />}
      </ElektroNeuronModel.DetailLink>
  );
};