import { ListRender } from "@/components/layout/ListRender";
import { RekuestNode } from "@/linkers";
import {
  AgentFilter,
  OffsetPaginationInput,
  useToolboxesQuery,
} from "@/rekuest/api/graphql";
import ToolboxCard from "../cards/ToolboxCard";

export type Props = {
  filters?: AgentFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useToolboxesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.toolboxes}
      title={
        <RekuestNode.ListLink className="flex-0">
          Toolboxes
        </RekuestNode.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ToolboxCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
