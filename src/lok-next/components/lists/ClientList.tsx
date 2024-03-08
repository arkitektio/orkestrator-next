import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";

import { ClientFilter, OffsetPaginationInput, useClientsQuery } from "@/lok-next/api/graphql";
import { withLokNext } from "@jhnnsrs/lok-next";
import ClientCard from "../cards/ClientCard";

export type Props = {
  filters?: ClientFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = withLokNext(
    useClientsQuery,
  )({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.clients}
      title={
        <MikroDataset.ListLink className="flex-0">
          Clients
        </MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ClientCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
