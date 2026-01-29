
import { createList } from "@/components/layout/createList";
import { useListNeuronModelsQuery } from "@/elektro/api/graphql";
import { ElektroNeuronModel } from "@/linkers";
import NeuronModelCard from "../cards/NeuronModelCard";

const TList = createList({
  useHook: useListNeuronModelsQuery,
  dataKey: "neuronModels",
  ItemComponent: NeuronModelCard,
  title: "Neuron Models",
  smart: ElektroNeuronModel,
});
export default TList;
