import { ListRender } from "@/components/layout/ListRender";
import { KraphGraphQuery } from "@/linkers";
import {
  GraphQueryFilter,
  OffsetPaginationInput,
  useListGraphQueriesQuery
} from "../../api/graphql";
import GraphQueryCard from "../cards/GraphQueryCard";

export type Props = {
  filters?: GraphQueryFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListGraphQueriesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.graphQueries}
      title={
        <KraphGraphQuery.ListLink className="flex-0">Graph Queries</KraphGraphQuery.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <GraphQueryCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
