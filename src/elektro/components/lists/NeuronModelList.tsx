import { ListRender } from "@/components/layout/ListRender";
import { ElektroSimulation } from "@/linkers";

import { NeuronModelFilter, useListNeuronModelsQuery } from "@/elektro/api/graphql";
import { OffsetPaginationInput } from "@/lok-next/api/graphql";
import NeuronModelCard from "../cards/NeuronModelCard";

export type Props = {
  filters?: NeuronModelFilter;
  pagination?: OffsetPaginationInput;
  order?: NeuronModelOrder;
};

const List = ({ filters, pagination, order }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListNeuronModelsQuery({
    variables: {
      filters: filters,
      pagination: pagination,
      order: order,
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
      {(ex, index) => <NeuronModelCard key={ex.id} item={ex} />}
    </ListRender>
  );
};

export default List;
