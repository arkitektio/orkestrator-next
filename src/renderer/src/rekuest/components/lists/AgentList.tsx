import { ListRender } from "@/components/layout/ListRender";
import { RekuestAgent } from "@/linkers";
import {
  AgentFilter,
  AgentOrder,
  OffsetPaginationInput,
  useAgentsQuery,
} from "@/rekuest/api/graphql";
import AgentCard from "../cards/AgentCard";

export type Props = {
  filters?: AgentFilter;
  pagination?: OffsetPaginationInput;
  order: AgentOrder
};

const List = ({ filters, pagination, order }: Props) => {
  const { data, error, subscribeToMore, refetch } = useAgentsQuery({
    variables: { filters, pagination, order: order },
  });

  return (
    <ListRender
      array={data?.agents}
      title={
        <RekuestAgent.ListLink className="flex-0">Latest  Agents</RekuestAgent.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <AgentCard key={index} item={ex} />}
    </ListRender>
  );
};

export default List;
