import { ListRender } from "@/components/layout/ListRender";
import * as React from "react";
import { useGlobalSearchQuery } from "../api/graphql";
import NodeCard from "../components/cards/NodeCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { withRekuest } from "@jhnnsrs/rekuest-next";

interface IDataSidebarProps {}

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch } = withRekuest(useGlobalSearchQuery)({
    variables: {
      search: "",
      noNodes: false,
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
          defaultValue={{ search: "", noNodes: false}}
        />}>
        
          <ListRender array={data?.nodes}>
            {(item, i) => <NodeCard node={item} key={i} />}
          </ListRender>
      </SidebarLayout>
    </>
  );
};

export default Pane;
