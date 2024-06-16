import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { useNodeSearchQuery } from "@/rekuest/api/graphql";
import NodeCard from "@/rekuest/components/cards/NodeCard";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import * as React from "react";
import NodeSearchFilter from "../components/forms/filter/NodeSearchFilter";

interface IDataSidebarProps {}

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch } = withRekuest(useNodeSearchQuery)({
    variables: {
      pagination: {
        limit: 20,
      },
    },
  });

  return (
    <>
      <SidebarLayout
        searchBar={
          <NodeSearchFilter
            onFilterChanged={(e) => refetch({ filters: e })}
            defaultValue={{ search: "" }}
          />
        }
      >
        <ListRender array={data?.nodes}>
          {(item, i) => <NodeCard node={item} key={i} />}
        </ListRender>
      </SidebarLayout>
    </>
  );
};

export default Pane;
