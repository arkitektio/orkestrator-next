import { ListRender } from "@/components/layout/ListRender";
import { ElektroSimulation, ElektroTrace } from "@/linkers";

import { NeuronModelFilter, SimulationFilter, TraceFilter, useListNeuronModelsQuery, useListSimulationsQuery, useTracesQuery } from "@/elektro/api/graphql";
import { OffsetPaginationInput } from "@/lok-next/api/graphql";
import TraceCard from "../cards/TraceCard";
import SimulationCard from "../cards/SimulationCard";
import NeuronModelCard from "../cards/NeuronModelCard";

export type Props = {
  filters?: NeuronModelFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListNeuronModelsQuery({
    variables: {
      filters: filters,
      pagination: pagination,
    },
  });

  return (
    <ListRender
      array={data?.neuronModels}
      title={
        <ElektroSimulation.ListLink className="flex-0">NeuronModels</ElektroSimulation.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <NeuronModelCard key={index} item={ex} />}
    </ListRender>
  );
};

export default List;
