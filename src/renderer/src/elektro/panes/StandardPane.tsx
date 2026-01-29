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
import { FancyInput } from "@/components/ui/fancy-input";
import { useDebounce } from "@/hooks/use-debounce";
import { PaneLink, SidePaneGroup } from "@/components/ui/sidepane";

interface IDataSidebarProps { }

export const NavigationPane = (props: {}) => {
  return (
    <Tree>
      <SidePaneGroup title="Explore">
        <PaneLink
          to="/elektro"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Home
        </PaneLink>
      </SidePaneGroup>

      <SidePaneGroup title="Neuron">
        <PaneLink
          to="/elektro/simulations"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <LineChartIcon className="h-4 w-4" />
          Simulations
        </PaneLink>
        <PaneLink
          to="/elektro/experiments"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <RiCheckboxMultipleLine className="h-4 w-4" />
          Experiments
        </PaneLink>
        <PaneLink
          to="/elektro/neuronmodels"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Network className="h-4 w-4" />
          Neuron models
        </PaneLink>
        <PaneLink
          to="/elektro/modelcollections"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Model Collections
        </PaneLink>
      </SidePaneGroup>

      <SidePaneGroup title="Ephys"  >
        <PaneLink
          to="/elektro/blocks"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Network className="h-4 w-4" />
          Blocks
        </PaneLink>
      </SidePaneGroup>
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


const Pane: React.FunctionComponent = () => {
  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebounce(search, 300);

  const variables: GlobalSearchQueryVariables = {
    search: debouncedSearch,
    pagination: {
      limit: 10,
    },
  };

  const { data, refetch } = useGlobalSearchQuery({ variables });

  React.useEffect(() => {
    refetch(variables);
  }, [debouncedSearch]);

  const searchBar = (
    <div className="w-full flex flex-row">
      <FancyInput
        placeholder="Search..."
        type="string"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-grow h-full bg-background text-foreground w-full"
      />
    </div>
  );

  return (
    <SidebarLayout searchBar={searchBar}>
      {search.trim() === "" ? (
        <NavigationPane />
      ) : (
        <>
          <ListRender array={data?.traces}>
            {(item, i) => <TraceCard item={item} key={i} />}
          </ListRender>
        </>
      )}
    </SidebarLayout>
  );
};



export default Pane;
