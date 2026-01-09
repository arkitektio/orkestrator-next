import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";

import { useListRoomsQuery } from "@/alpaka/api/graphql";
import {
  OffsetPaginationInput,
  RoomFilter
} from "@/lok-next/api/graphql";
import RoomCard from "../cards/RoomCard";

export type Props = {
  filters?: RoomFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListRoomsQuery({
    variables: { filter: filters, pagination },
  });

  return (
    <ListRender
      array={data?.rooms}
      title={
        <MikroDataset.ListLink className="flex-0">Rooms</MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <RoomCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
