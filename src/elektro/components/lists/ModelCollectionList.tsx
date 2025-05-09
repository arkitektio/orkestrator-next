import { ListRender } from "@/components/layout/ListRender";
import { ElektroExperiment, ElektroModelCollection, ElektroSimulation, ElektroTrace } from "@/linkers";

import { SimulationFilter, TraceFilter, useListExperimentsQuery, useListModelCollectionsQuery, useListSimulationsQuery, useTracesQuery } from "@/elektro/api/graphql";
import { OffsetPaginationInput } from "@/lok-next/api/graphql";
import TraceCard from "../cards/TraceCard";
import SimulationCard from "../cards/SimulationCard";
import ExperimentCard from "../cards/ExperimentCard";
import { ExperimentFilter } from "@/mikro-next/api/graphql";
import ModelCollectionCard from "../cards/ModelCollectionCard";

export type Props = {
  filters?: ExperimentFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListModelCollectionsQuery({
    variables: {
      filters: filters,
      pagination: pagination,
    },
    
  });

  return (
    <ListRender
      array={data?.modelCollections}
      title={
        <ElektroModelCollection.ListLink className="flex-0">Model Collections</ElektroModelCollection.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ModelCollectionCard key={index} item={ex} />}
    </ListRender>
  );
};

export default List;
