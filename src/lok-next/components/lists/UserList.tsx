import { ListRender } from "@/components/layout/ListRender";
import { LokGroup, LokUser, MikroDataset } from "@/linkers";

import {
  ClientFilter,
  GroupFilter,
  OffsetPaginationInput,
  useAppsQuery,
  useClientsQuery,
  useGroupsQuery,
  useUsersQuery,
} from "@/lok-next/api/graphql";
import ClientCard from "../cards/ClientCard";
import AppCard from "../cards/AppCard";
import GroupCard from "../cards/GroupCard";
import UserCard from "../cards/UserCard";

export type Props = {
  filters?: GroupFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useUsersQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.users}
      title={<LokUser.ListLink className="flex-0">Users</LokUser.ListLink>}
      refetch={refetch}
    >
      {(ex, index) => <UserCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
