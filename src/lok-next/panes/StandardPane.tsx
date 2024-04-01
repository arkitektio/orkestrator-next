import { ListRender } from "@/components/layout/ListRender";
import * as React from "react";
import { useGlobalSearchQuery } from "../api/graphql";
import UserCard from "../components/cards/UserCard";
import GroupCard from "../components/cards/GroupCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { withLokNext } from "@jhnnsrs/lok-next";

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
      <SidebarLayout searchBar={
        <GlobalSearchFilter
          onFilterChanged={(e) => refetch(e)}
          defaultValue={{ search: "", noGroups: false, noUsers: false }}
        />}>
        
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
