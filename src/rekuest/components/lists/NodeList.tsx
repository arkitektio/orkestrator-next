import { ListRender } from "@/components/layout/ListRender";
import { RekuestNode } from "@/linkers";
import {
  NodeFilter,
  OffsetPaginationInput,
  useAllNodesQuery,
} from "@/rekuest/api/graphql";
import NodeCard from "../cards/NodeCard";

export type Props = {
  filters?: NodeFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useAllNodesQuery;
  ({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.nodes}
      title={
        <RekuestNode.ListLink className="flex-0">Nodes</RekuestNode.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <NodeCard key={index} node={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
