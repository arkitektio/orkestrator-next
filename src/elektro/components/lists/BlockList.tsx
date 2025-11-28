import { ListRender } from "@/components/layout/ListRender";
import { ElektroBlock, ElektroExperiment } from "@/linkers";

import { Button } from "@/components/ui/button";
import { BlockFilter, useListBlocksQuery } from "@/elektro/api/graphql";
import { OffsetPaginationInput } from "@/lok-next/api/graphql";
import BlockCard from "../cards/BlockCard";

export type Props = {
  filters?: BlockFilter;
  pagination?: OffsetPaginationInput;
  order?: BlockOrder;
};

const List = ({ filters, pagination, order }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListBlocksQuery({
    variables: {
      filters: filters,
      pagination: pagination,
      order: order,
    },
  });

  return (
    <ListRender
      array={data?.blocks}
      title={
        <ElektroBlock.ListLink className="flex-0">Blocks</ElektroBlock.ListLink>
      }
      refetch={refetch}
      actions={
        <ElektroExperiment.NewButton className="flex-1">
          <Button>x</Button>
        </ElektroExperiment.NewButton>
      }
    >
      {(ex, index) => <BlockCard key={index} item={ex} />}
    </ListRender>
  );
};

export default List;
