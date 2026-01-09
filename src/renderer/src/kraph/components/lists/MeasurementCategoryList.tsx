import { ListRender } from "@/components/layout/ListRender";
import { KraphMetricCategory } from "@/linkers";
import {
  MetricCategoryFilter,
  OffsetPaginationInput,
  useListMeasurmentCategoryQuery,
} from "../../api/graphql";
import MeasurementCategoryCard from "../cards/MeasurementCategoryCard";

export type Props = {
  filters?: MetricCategoryFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } =
    useListMeasurmentCategoryQuery({
      variables: { filters, pagination },
    });

  return (
    <ListRender
      array={data?.measurementCategories}
      title={
        <KraphMetricCategory.ListLink className="flex-0">
          Metric Categories
        </KraphMetricCategory.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => (
        <MeasurementCategoryCard key={index} item={ex} mates={[]} />
      )}
    </ListRender>
  );
};

export default List;
