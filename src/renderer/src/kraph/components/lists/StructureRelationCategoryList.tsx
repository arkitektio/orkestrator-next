import { ListRender } from "@/components/layout/ListRender";
import { KraphStructureRelationCategory } from "@/linkers";
import {
  MetricCategoryFilter,
  OffsetPaginationInput,
  useListStructureRelationCategoryQuery,
} from "../../api/graphql";
import StructureRelationCategoryCard from "../cards/StructureRelationCategoryCard";

export type Props = {
  filters?: MetricCategoryFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } =
    useListStructureRelationCategoryQuery({
      variables: { filters, pagination },
    });

  return (
    <ListRender
      array={data?.structureRelationCategories}
      title={
        <KraphStructureRelationCategory.ListLink className="flex-0">
          Structure Relation Categories
        </KraphStructureRelationCategory.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => (
        <StructureRelationCategoryCard key={index} item={ex} mates={[]} />
      )}
    </ListRender>
  );
};

export default List;
