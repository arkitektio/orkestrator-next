import { ListRender } from "@/components/layout/ListRender";
import { RekuestNode } from "@/linkers";
import {
  AgentFilter,
  OffsetPaginationInput,
  useAgentsQuery,
} from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import AgentCard from "../cards/AgentCard";

export type Props = {
  filters?: AgentFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = withRekuest(useAgentsQuery)(
    {
      variables: { filters, pagination },
    },
  );

  return (
    <ListRender
      array={data?.agents}
      title={
        <RekuestNode.ListLink className="flex-0">Agents</RekuestNode.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <AgentCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
