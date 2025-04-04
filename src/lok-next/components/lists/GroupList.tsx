import { ListRender } from "@/components/layout/ListRender";
import { LokGroup, MikroDataset } from "@/linkers";

import {
  ClientFilter,
  GroupFilter,
  OffsetPaginationInput,
  useAppsQuery,
  useClientsQuery,
  useGroupsQuery,
} from "@/lok-next/api/graphql";
import ClientCard from "../cards/ClientCard";
import AppCard from "../cards/AppCard";
import GroupCard from "../cards/GroupCard";

export type Props = {
  filters?: GroupFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useGroupsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.groups} // changed from clients to apps  here
      title={<LokGroup.ListLink className="flex-0">Groups</LokGroup.ListLink>}
      refetch={refetch}
    >
      {(ex, index) => <GroupCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
