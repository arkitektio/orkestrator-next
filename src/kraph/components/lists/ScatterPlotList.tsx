import { ListRender } from "@/components/layout/ListRender";
import { KraphGraphQuery } from "@/linkers";
import {
  GraphQueryFilter,
  OffsetPaginationInput,
  ScatterPlotFilter,
  useListGraphQueriesQuery,
  useListScatterPlotsQuery
} from "../../api/graphql";
import GraphQueryCard from "../cards/GraphQueryCard";
import ScatterPlotCard from "../cards/ScatterPlotCard";

export type Props = {
  filters?: ScatterPlotFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListScatterPlotsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      error={error}
      array={data?.scatterPlots}
      title={
        <KraphGraphQuery.ListLink className="flex-0">Scatter Plots</KraphGraphQuery.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ScatterPlotCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
