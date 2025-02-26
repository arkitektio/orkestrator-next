import { SubTree } from "@/components/explorer/SubTree";
import { SubTreeTitle } from "@/components/explorer/SubTreeTitle";
import { Tree } from "@/components/explorer/Tree";
import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import { CubeIcon } from "@radix-ui/react-icons";
import { Home } from "lucide-react";
import * as React from "react";
import {
  GlobalSearchQueryVariables,
  useGlobalSearchQuery
} from "../api/graphql";
import RoomCard from "../components/cards/RoomCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";

interface IDataSidebarProps {}

export const NavigationPane = (props: {}) => {

  return (
    <Tree>
      <SubTreeTitle>Explore</SubTreeTitle>
      <SubTree>
        <DroppableNavLink
          to="/elektro"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Home
        </DroppableNavLink>
      </SubTree>

      <SubTreeTitle>Data</SubTreeTitle>
      <SubTree>
        <DroppableNavLink
          to="/elektro/traces"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Traces
        </DroppableNavLink>
      </SubTree>
    </Tree>
  );
};

const variables = {
  search: "",
  noRooms: false,
  pagination: {
    limit: 10,
  },
};

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch } = useGlobalSearchQuery({
    variables: variables,
  });

  const [currentVariables, setCurrentVariables] =
    React.useState<GlobalSearchQueryVariables>(variables);

  const onFilterChanged = (e: GlobalSearchQueryVariables) => {
    refetch(e);
    setCurrentVariables(e);
  };

  return (
    <>
      <SidebarLayout
        searchBar={
          <GlobalSearchFilter
            onFilterChanged={onFilterChanged}
            defaultValue={{ search: "", noRooms: false }}
          />
        }
      >
        {currentVariables?.search == "" ? (
          <>
            <NavigationPane />
          </>
        ) : (
          <>
            <ListRender array={data?.rooms}>
              {(item, i) => <RoomCard item={item} key={i} />}
            </ListRender>
          </>
        )}
      </SidebarLayout>
    </>
  );
};

export default Pane;
