import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { withLokNext } from "@jhnnsrs/lok-next";
import * as React from "react";
import { useGlobalSearchQuery } from "../api/graphql";
import GroupCard from "../components/cards/GroupCard";
import UserCard from "../components/cards/UserCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";

interface IDataSidebarProps {}

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch } = withLokNext(useGlobalSearchQuery)({
    variables: {
      search: "",
      noGroups: false,
      noUsers: false,
      pagination: {
        limit: 10,
      },
    },
  });

  return (
    <>
      <SidebarLayout
        searchBar={
          <GlobalSearchFilter
            onFilterChanged={(e) => refetch(e)}
            defaultValue={{ search: "", noGroups: false, noUsers: false }}
          />
        }
      >
        <ListRender array={data?.users}>
          {(item, i) => <UserCard item={item} key={i} />}
        </ListRender>
        <ListRender array={data?.groups}>
          {(item, i) => <GroupCard item={item} key={i} />}
        </ListRender>
      </SidebarLayout>
    </>
  );
};

export default Pane;
