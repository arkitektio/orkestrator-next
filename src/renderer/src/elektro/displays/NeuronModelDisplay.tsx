import { DisplayWidgetProps } from "@/lib/display/registry";
import { useDetailBlockQuery, useDetailNeuronModelQuery, useDetailSimulationQuery } from "../api/graphql";
import { NeuronVisualizer } from "../components/NeuronRenderer";

export const NeuronModelDisplay = (props: DisplayWidgetProps) => {
  const { data } = useDetailNeuronModelQuery({
    variables: {
      id: props.object,
    },
  });

  const roi = data?.neuronModel;
  if (!roi) {
    return <div>ROI not found</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="mb-4 font-bold">{data.neuronModel.name}</div>
      <div className="flex-grow">
      <NeuronVisualizer model={data.neuronModel} />
      </div>
    </div>
  );
};
