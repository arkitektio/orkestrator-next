import { ListRender } from "@/components/layout/ListRender";
import { KraphRelationCategory } from "@/linkers";
import {
  MetricCategoryFilter,
  OffsetPaginationInput,
  useListRelationCategoryQuery
} from "../../api/graphql";
import RelationCategoryCard from "../cards/RelationCategoryCard";

export type Props = {
  filters?: MetricCategoryFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } =
    useListRelationCategoryQuery({
      variables: { filters, pagination },
    });

  return (
    <ListRender
      array={data?.relationCategories}
      title={
        <KraphRelationCategory.ListLink className="flex-0">
          Relation Categories
        </KraphRelationCategory.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <RelationCategoryCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
