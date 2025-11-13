import { ListRender } from "@/components/layout/ListRender";
import { LokComputeNode } from "@/linkers";

import {
  ComputeNodeFilter,
  OffsetPaginationInput,
  useListComputeNodeQuery
} from "@/lok-next/api/graphql";
import ComputeNodeCard from "../cards/ComputeNodeCard";

export type Props = {
  filters?: ComputeNodeFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListComputeNodeQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.computeNodes}
      title={
        <LokComputeNode.ListLink className="flex-0">
          Clients
        </LokComputeNode.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ComputeNodeCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
