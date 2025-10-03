import { SubTree } from "@/components/explorer/SubTree";
import { SubTreeTitle } from "@/components/explorer/SubTreeTitle";
import { Tree } from "@/components/explorer/Tree";
import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import { CubeIcon } from "@radix-ui/react-icons";
import { Home, LineChartIcon, Network } from "lucide-react";
import * as React from "react";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import {
  GlobalSearchQueryVariables,
  useGlobalSearchQuery,
} from "../api/graphql";
import TraceCard from "../components/cards/TraceCard";
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

      <SubTreeTitle>Neuron</SubTreeTitle>
      <SubTree>
        <DroppableNavLink
          to="/elektro/simulations"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <LineChartIcon className="h-4 w-4" />
          Simulations
        </DroppableNavLink>
        <DroppableNavLink
          to="/elektro/experiments"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <RiCheckboxMultipleLine className="h-4 w-4" />
          Experiments
        </DroppableNavLink>
        <DroppableNavLink
          to="/elektro/neuronmodels"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Network className="h-4 w-4" />
          Neuron models
        </DroppableNavLink>
        <DroppableNavLink
          to="/elektro/modelcollections"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Model Collections
        </DroppableNavLink>
      </SubTree>

      <SubTreeTitle>Ephys</SubTreeTitle>
      <SubTree>
        <DroppableNavLink
          to="/elektro/blocks"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Network className="h-4 w-4" />
          Blocks
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
            <ListRender array={data?.traces}>
              {(item, i) => <TraceCard item={item} key={i} />}
            </ListRender>
          </>
        )}
      </SidebarLayout>
    </>
  );
};

export default Pane;
