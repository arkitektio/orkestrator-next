import { ListRender } from "@/components/layout/ListRender";
import { ElektroExperiment, ElektroSimulation, ElektroTrace } from "@/linkers";

import { SimulationFilter, TraceFilter, useListExperimentsQuery, useListSimulationsQuery, useTracesQuery } from "@/elektro/api/graphql";
import { OffsetPaginationInput } from "@/lok-next/api/graphql";
import TraceCard from "../cards/TraceCard";
import SimulationCard from "../cards/SimulationCard";
import ExperimentCard from "../cards/ExperimentCard";
import { ExperimentFilter } from "@/mikro-next/api/graphql";
import { Button } from "@/components/ui/button";

export type Props = {
  filters?: ExperimentFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListExperimentsQuery({
    variables: {
      filters: filters,
      pagination: pagination,
    },
    
  });

  return (
    <ListRender
      array={data?.experiments}
      title={
        <ElektroExperiment.ListLink className="flex-0">Experiments</ElektroExperiment.ListLink>
      }
      refetch={refetch}
      actions={
        <ElektroExperiment.NewButton
          className="flex-1"
        ><Button>x</Button></ElektroExperiment.NewButton>
      }
    >
      {(ex, index) => <ExperimentCard key={index} item={ex} />}
    </ListRender>
  );
};

export default List;
