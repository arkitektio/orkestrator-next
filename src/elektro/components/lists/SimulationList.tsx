import { ListRender } from "@/components/layout/ListRender";
import { ElektroSimulation, ElektroTrace } from "@/linkers";

import { SimulationFilter, TraceFilter, useListSimulationsQuery, useTracesQuery } from "@/elektro/api/graphql";
import { OffsetPaginationInput } from "@/lok-next/api/graphql";
import TraceCard from "../cards/TraceCard";
import SimulationCard from "../cards/SimulationCard";

export type Props = {
  filters?: SimulationFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListSimulationsQuery({
    variables: {
      filters: filters,
      pagination: pagination,
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
