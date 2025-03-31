import { ListRender } from "@/components/layout/ListRender";
import { KraphReagentCategory } from "@/linkers";
import {
  OffsetPaginationInput,
  OntologyFilter,
  useListProtocolEventCategoriesQuery
} from "../../api/graphql";
import ReagentCategoryCard from "../cards/ReagentCategoryCard";
import ProtocolEventCategoryCard from "../cards/ProtocolEventCategoryCard";

export type Props = {
  filters?: OntologyFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListProtocolEventCategoriesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.protocolEventCategories}
      title={
        <KraphReagentCategory.ListLink className="flex-0">Protocol Categories</KraphReagentCategory.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ProtocolEventCategoryCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
