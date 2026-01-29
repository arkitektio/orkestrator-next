import { ListRender } from "@/components/layout/ListRender";
import { KraphMetricCategory } from "@/linkers";
import {
  MetricCategoryFilter,
  OffsetPaginationInput,
  useListMetricCategoryQuery,
} from "../../api/graphql";
import MetricCategoryCard from "../cards/MetricCategoryCard";

export type Props = {
  filters?: MetricCategoryFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListMetricCategoryQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.metricCategories}
      title={
        <KraphMetricCategory.ListLink className="flex-0">
          Metric Categories
        </KraphMetricCategory.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <MetricCategoryCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
