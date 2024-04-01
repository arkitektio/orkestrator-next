import { ListRender } from "@/components/layout/ListRender";
import { ScrollArea } from "@/components/ui/scroll-area";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import * as React from "react";
import { useGlobalSearchQuery } from "../api/graphql";
import FileCard from "../components/cards/FileCard";
import ImageCard from "../components/cards/ImageCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";
import { SidebarLayout } from "@/components/layout/SidebarLayout";

interface IDataSidebarProps {}

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch } = withMikroNext(useGlobalSearchQuery)({
    variables: {
      search: "",
      noImages: false,
      noFiles: false,
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
          defaultValue={{ search: "", noImages: false, noFiles: false }}
        />}>
        
          <ListRender array={data?.images}>
            {(item, i) => <ImageCard image={item} key={i} />}
          </ListRender>
          <ListRender array={data?.files}>
            {(item, i) => <FileCard file={item} key={i} />}
          </ListRender>
      </SidebarLayout>
    </>
  );
};

export default Pane;
