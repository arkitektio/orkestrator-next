import { ListRender } from "@/components/layout/ListRender";
import { ElektroSimulation } from "@/linkers";

import { SimulationFilter, SimulationOrder, useListSimulationsQuery } from "@/elektro/api/graphql";
import { OffsetPaginationInput } from "@/lok-next/api/graphql";
import SimulationCard from "../cards/SimulationCard";

export type Props = {
  filters?: SimulationFilter;
  order?: SimulationOrder;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, order, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListSimulationsQuery({
    variables: {
      filters: filters,
      pagination: pagination,
      order: order,
    },
  });

  return (
    <ListRender
      array={data?.simulations}
      title={
        <ElektroSimulation.ListLink className="flex-0">Simulations</ElektroSimulation.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <SimulationCard key={index} item={ex} />}
    </ListRender>
  );
};

export default List;
