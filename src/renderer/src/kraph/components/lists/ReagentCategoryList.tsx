import { ListRender } from "@/components/layout/ListRender";
import { KraphReagentCategory } from "@/linkers";
import {
  OffsetPaginationInput,
  OntologyFilter,
  useListReagentCategoryQuery
} from "../../api/graphql";
import ReagentCategoryCard from "../cards/ReagentCategoryCard";

export type Props = {
  filters?: OntologyFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListReagentCategoryQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.reagentCategories}
      title={
        <KraphReagentCategory.ListLink className="flex-0">Reagent Categories</KraphReagentCategory.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ReagentCategoryCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
