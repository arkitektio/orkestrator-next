import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset, RekuestNode } from "@/linkers";
import {
  NodeFilter,
  OffsetPaginationInput,
  useAllNodesQuery,
} from "@/rekuest/api/graphql";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import NodeCard from "../cards/NodeCard";
import { withRekuest } from "@jhnnsrs/rekuest-next";

export type Props = {
  filters?: NodeFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = withRekuest(
    useAllNodesQuery,
  )({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.nodes}
      title={
        <RekuestNode.ListLink className="flex-0">
          Nodes
        </RekuestNode.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <NodeCard key={index} node={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
