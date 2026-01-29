import { ListRender } from "@/components/layout/ListRender";
import { KraphReagent } from "@/linkers";
import {
  OffsetPaginationInput,
  OntologyFilter,
  useListReagentsQuery
} from "../../api/graphql";
import ReagentCard from "../cards/ReagentCard";

export type Props = {
  filters?: OntologyFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListReagentsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.reagents}
      title={
        <KraphReagent.ListLink className="flex-0">
          Reagents
        </KraphReagent.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ReagentCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
