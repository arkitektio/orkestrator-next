import { ListRender } from "@/components/layout/ListRender";
import { KraphGraph } from "@/linkers";
import {
  OffsetPaginationInput,
  OntologyFilter,
  useListGraphsQuery,
} from "../../api/graphql";
import GraphCard from "../cards/GraphCard";

export type Props = {
  filters?: OntologyFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListGraphsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.graphs}
      title={
        <KraphGraph.ListLink className="flex-0">Graphs</KraphGraph.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <GraphCard key={index} item={ex} />}
    </ListRender>
  );
};

export default List;
