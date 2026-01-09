import { ListRender } from "@/components/layout/ListRender";
import { KraphEntityCategory } from "@/linkers";
import {
  EntityCategoryFilter,
  OffsetPaginationInput,
  useListEntityCategoryQuery
} from "../../api/graphql";
import EntityCategoryCard from "../cards/EntityCategoryCard";

export type Props = {
  filters?: EntityCategoryFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListEntityCategoryQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.entityCategories}
      title={
        <KraphEntityCategory.ListLink className="flex-0">Entity Categories</KraphEntityCategory.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <EntityCategoryCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
