import { ListRender } from "@/components/layout/ListRender";
import { KraphReagentCategory, KraphStructureCategory } from "@/linkers";
import {
  OffsetPaginationInput,
  OntologyFilter,
  useListStructureCategoryQuery
} from "../../api/graphql";
import ReagentCategoryCard from "../cards/ReagentCategoryCard";
import StructureCategoryCard from "../cards/StructureCategoryCard";

export type Props = {
  filters?: OntologyFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListStructureCategoryQuery({
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
      {(ex, index) => <StructureCategoryCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
