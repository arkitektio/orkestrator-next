import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { CubeIcon } from "@radix-ui/react-icons";
import { File, Folder, Home, Image } from "lucide-react";
import * as React from "react";
import { GlobalSearchQueryVariables, useGlobalSearchQuery } from "../api/graphql";
import FileCard from "../components/cards/FileCard";
import ImageCard from "../components/cards/ImageCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";

interface IDataSidebarProps {}

export const NavigationPane = (props: { }) => {

  return (
    <div className="flex-1 flex-col">
            <nav className="grid items-start px-1 text-sm font-medium lg:px-2">
              <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
                Explore
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-4">
              <DroppableNavLink
                to="/mikro"
                className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </DroppableNavLink>
              </div>
  
              <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
                Data
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-5">
              <DroppableNavLink
                to="/mikro/images"
                className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
              >
                <Image className="h-4 w-4" />
                Images
              </DroppableNavLink>
              <DroppableNavLink
                to="/mikro/tables"
                className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Tables
              </DroppableNavLink>
              <DroppableNavLink
                to="/mikro/stages"
                className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
              >
                <CubeIcon className="h-4 w-4" />
                Stages
              </DroppableNavLink>
              <DroppableNavLink
                to="/mikro/datasets"
                className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
              >
                <Folder className="h-4 w-4" />
                Datasets
              </DroppableNavLink>
              <DroppableNavLink
                to="/mikro/files"
                className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
              >
                <File className="h-4 w-4" />
                Files
              </DroppableNavLink>
              </div>
              <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
                Recent
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
              </div>

            </nav>
          </div>
  )
}

const variables: GlobalSearchQueryVariables = {
    search: "",
    noImages: false,
    noFiles: false,
    pagination: {
      limit: 10,
    },
}

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch } = withMikroNext(useGlobalSearchQuery)({
    variables: variables
  });

  const [currentVariables, setCurrentVariables] = React.useState<GlobalSearchQueryVariables>(variables);

  const onFilterChanged = (e: GlobalSearchQueryVariables) => {
    refetch(e);
    setCurrentVariables(e);
  }

  return (
    <>
      <SidebarLayout
        searchBar={
          <GlobalSearchFilter
            onFilterChanged={onFilterChanged}
            defaultValue={variables}
          />
        }
      >
        {currentVariables?.search == "" ? <>
            <NavigationPane/>
            </>: <>
        <ListRender array={data?.images}>
          {(item, i) => <ImageCard image={item} key={i} />}
        </ListRender>
        <ListRender array={data?.files}>
          {(item, i) => <FileCard file={item} key={i} />}
        </ListRender>
        </>}
      </SidebarLayout>
    </>
  );
};

export default Pane;
