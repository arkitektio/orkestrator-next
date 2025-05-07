import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";

import {
  ClientFilter,
  OffsetPaginationInput,
  useClientsQuery,
} from "@/lok-next/api/graphql";
import ClientCard from "../cards/RoomCard";
import {
  ProviderFilter,
  useListProvidersQuery,
  useRoomsQuery,
} from "@/alpaka/api/graphql";
import ProviderCard from "../cards/ProviderCard";

export type Props = {
  filters?: ProviderFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListProvidersQuery({
    variables: { filter: filters, pagination },
  });

  return (
    <ListRender
      array={data?.providers}
      title={
        <MikroDataset.ListLink className="flex-0">
          Providers
        </MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ProviderCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
