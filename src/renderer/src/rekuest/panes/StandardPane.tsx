import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { FancyInput } from "@/components/ui/fancy-input";
import { DroppableNavLink } from "@/components/ui/link";
import { RekuestAgent, RekuestDashboard } from "@/linkers";
import { CardStackIcon, CubeIcon } from "@radix-ui/react-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { Box, FunctionSquare, Home, ShoppingCart } from "lucide-react";
import * as React from "react";
import {
  GlobalSearchQueryVariables,
  Ordering,
  useAgentsQuery,
  useGlobalSearchQuery,
  useListDashboardsQuery,
} from "../api/graphql";
import ActionCard from "../components/cards/ActionCard";
import { AgentController } from "@/app/agent/AgentController";
import { PaneLink, SidePaneGroup } from "@/components/ui/sidepane";

export const NavigationPane = () => {
  const { data } = useAgentsQuery({
    variables: {
      filters: {
        pinned: false,
      },
      order: {
        lastSeen: Ordering.Desc,
      },
      pagination: {
        limit: 10,
      },
    },
  });

  const { data: pinnedAgents, error } = useAgentsQuery({
    variables: {
      filters: {
        pinned: true,
      },
    },
  });

  const { data: allDashboards } = useListDashboardsQuery({
    variables: {
      pagination: {
        limit: 10,
      },
    },
  });






  return (
    <div className="flex-1 flex-col h-full overflow-y-auto overflow-x-hidden">
      <nav className="grid items-start px-1 text-xs font-medium lg:px-2 flex-grow p-3 ">
        <SidePaneGroup title="Explore">

          <PaneLink
            to="/rekuest/home"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Home
          </PaneLink>
        </SidePaneGroup>

        <SidePaneGroup title="Manage All">
          <PaneLink
            to="/rekuest/actions"
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <FunctionSquare className="h-4 w-4" />
            Actions
          </PaneLink>
          <PaneLink
            to="/rekuest/assignations"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Box className="h-4 w-4" />
            Tasks
          </PaneLink>
          <PaneLink
            to="/rekuest/implementations"
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <FunctionSquare className="h-4 w-4" />
            Implementations
          </PaneLink>
          <PaneLink
            to="/rekuest/toolboxes"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Box className="h-4 w-4" />
            Toolboxes
          </PaneLink>
          <PaneLink
            to="/rekuest/structurepackages"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Box className="h-4 w-4" />
            Structure Packages
          </PaneLink>
          <PaneLink
            to="/rekuest/dashboards"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Box className="h-4 w-4" />
            Dashboards
          </PaneLink>
          <PaneLink
            to="/rekuest/bloks"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Box className="h-4 w-4" />
            Bloks
          </PaneLink>
          <PaneLink
            to="/rekuest/shortcuts"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <ShoppingCart className="h-4 w-4" />
            Shortcuts
          </PaneLink>
        </SidePaneGroup>

        {pinnedAgents?.agents && pinnedAgents.agents.length > 0 && (
          <>
            <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
              My Pinned Apps
            </div>
            <div className="flex flex-col items-start gap-4 rounded-lg ml-2 mb-4 text-muted-foreground">
              {pinnedAgents?.agents.map((agent, index) => (
                <RekuestAgent.Smart object={agent.id} key={index}>
                  <RekuestAgent.PaneLink
                    object={agent.id}
                    key={index}
                    className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
                  >
                    <CardStackIcon className="h-4 w-4" />
                    {agent.name}
                    <div
                      className="w-3 h-3 rounded rounded-full my-auto animate-pulse"
                      style={{
                        backgroundColor: agent.active
                          ? "#00FF00"
                          : "#FF0000",
                      }}
                    />
                  </RekuestAgent.PaneLink>
                </RekuestAgent.Smart>
              ))}
            </div>
          </>
        )}
        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
          My Apps
        </div>
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
          {data?.agents.map((agent, index) => (
            <RekuestAgent.Smart object={agent.id} key={index}>
              <div className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary">
                <RekuestAgent.PaneLink
                  object={agent.id}
                  key={index}
                  className={"flex flex-row gap-2"}
                >
                  <CardStackIcon
                    className="h-4 w-4"
                    style={{
                      color: agent.active ? "#00FF00" : "#A9A9A9",
                    }}
                  />
                  {agent.name}
                  <div className="w-3 h-3 rounded rounded-full my-auto animate-pulse" />
                </RekuestAgent.PaneLink>
              </div>
            </RekuestAgent.Smart>
          ))}
        </div>
        {allDashboards?.dashboards && allDashboards.dashboards.length > 0 && (
          <>
            <div className="text-muted-foreground text-xs font-semibold uppercase my-4">
              My Dashboards
            </div>
            <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
              {allDashboards.dashboards.map((dashboard, index) => (
                <RekuestDashboard.Smart object={dashboard.id} key={index}>
                  <RekuestDashboard.PaneLink
                    object={dashboard.id}
                    key={index}
                    className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
                  >
                    <CardStackIcon className="h-4 w-4" />
                    {dashboard.name}
                    <div className="w-3 h-3 rounded rounded-full my-auto animate-pulse" />
                  </RekuestDashboard.PaneLink>
                </RekuestDashboard.Smart>
              ))}
            </div>
          </>
        )}
      </nav >

    </div >
  );
};

const Pane: React.FunctionComponent = () => {
  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebounce(search, 300);

  const variables: GlobalSearchQueryVariables = {
    search: debouncedSearch,
    noActions: false,
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
    <SidebarLayout searchBar={searchBar} bottomBar={<AgentController />}>
      {search.trim() === "" ? (
        <NavigationPane />
      ) : (
        <div className="h-full">
          <ListRender array={data?.actions}>
            {(item, i) => <ActionCard item={item} key={i} />}
          </ListRender>
        </div>
      )}
    </SidebarLayout>
  );
};

export default Pane;
