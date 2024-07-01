import { Arkitekt } from "@/arkitekt";
import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import * as React from "react";
import { useGlobalSearchQuery } from "../api/graphql";
import DefinitionCard from "../components/cards/ReleaseCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";

interface IDataSidebarProps {}

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch } = Arkitekt.withKabinet(useGlobalSearchQuery)({
    variables: {
      search: "",
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
        <ListRender array={data?.definitions}>
          {(item, i) => <DefinitionCard item={item} key={i} />}
        </ListRender>
      </SidebarLayout>
    </>
  );
};

export default Pane;
