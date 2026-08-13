import { ListRender } from "@/components/layout/ListRender";
import { KraphStructureCategory } from "@/linkers";
import {
  OffsetPaginationInput,
  StructureCategoryFilter,
  useListStructureCategoryQuery
} from "../../api/graphql";
import StructureCategoryCard from "../cards/StructureCategoryCard";

export type Props = {
  filters?: StructureCategoryFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, refetch } = useListStructureCategoryQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.structureCategories}
      title={
        <KraphStructureCategory.ListLink className="flex-0">Structure Categories</KraphStructureCategory.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <StructureCategoryCard key={index} item={ex} />}
    </ListRender>
  );
};

export default List;
