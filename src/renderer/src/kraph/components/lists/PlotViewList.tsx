import { ListRender } from "@/components/layout/ListRender";
import { KraphPlotView } from "@/linkers";
import {
  OffsetPaginationInput,
  OntologyFilter,
  useListPlotViewsQuery
} from "../../api/graphql";
import PlotViewCard from "../cards/PlotViewCard";

export type Props = {
  filters?: OntologyFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListPlotViewsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.plotViews}
      title={
        <KraphPlotView.ListLink className="flex-0">
          Views
        </KraphPlotView.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <PlotViewCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
