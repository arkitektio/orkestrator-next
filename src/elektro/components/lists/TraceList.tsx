import { ListRender } from "@/components/layout/ListRender";
import { ElektroTrace } from "@/linkers";

import { TraceFilter, useTracesQuery } from "@/elektro/api/graphql";
import {
  OffsetPaginationInput
} from "@/lok-next/api/graphql";
import TraceCard from "../cards/TraceCard";

export type Props = {
  filters?: TraceFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useTracesQuery({
    
  });

  return (
    <ListRender
      array={data?.traces}
      title={
        <ElektroTrace.ListLink className="flex-0">
          Traces
        </ElektroTrace.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <TraceCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
