import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";

import {
  AppFilter,
  ClientFilter,
  OffsetPaginationInput,
  useAppsQuery,
  useClientsQuery,
} from "@/lok-next/api/graphql";
import ClientCard from "../cards/ClientCard";
import AppCard from "../cards/AppCard";

export type Props = {
  filters?: AppFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useAppsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.apps} // changed from clients to apps  here
      title={
        <MikroDataset.ListLink className="flex-0">Apps</MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <AppCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
