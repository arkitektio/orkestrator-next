import { ElektroNeuronModel } from "@/linkers";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useDetailNeuronModelQuery } from "../api/graphql";
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