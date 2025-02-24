import { ListRender } from "@/components/layout/ListRender";
import { KraphPlotView, MikroDataset } from "@/linkers";
import {
  OffsetPaginationInput,
  OntologyFilter,
  useListGraphsQuery,
  useListOntologiesQuery,
  useListPlotViewsQuery,
} from "../../api/graphql";
import OntologyCard from "../cards/OntologyCard";
import GraphCard from "../cards/GraphCard";
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
        <KraphPlotView.ListLink className="flex-0">Views</KraphPlotView.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <PlotViewCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
