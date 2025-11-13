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
    <div className="flex-1 flex-col">
      <nav className="grid items-start px-1 text-sm font-medium lg:px-2">
        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
          Explore
        </div>
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-4">
          <DroppableNavLink
            to="/rekuest"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Home
          </DroppableNavLink>
        </div>

        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
          Manage All
        </div>
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-5">
          <DroppableNavLink
            to="/rekuest/actions"
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <FunctionSquare className="h-4 w-4" />
            Actions
          </DroppableNavLink>
          <DroppableNavLink
            to="/rekuest/assignations"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Box className="h-4 w-4" />
            Tasks
          </DroppableNavLink>
          <DroppableNavLink
            to="/rekuest/implementations"
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <FunctionSquare className="h-4 w-4" />
            Implementations
          </DroppableNavLink>
          <DroppableNavLink
            to="/rekuest/toolboxes"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Box className="h-4 w-4" />
            Toolboxes
          </DroppableNavLink>
          <DroppableNavLink
            to="/rekuest/structurepackages"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Box className="h-4 w-4" />
            Structure Packages
          </DroppableNavLink>
          <DroppableNavLink
            to="/rekuest/dashboards"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Box className="h-4 w-4" />
            Dashboards
          </DroppableNavLink>
          <DroppableNavLink
            to="/rekuest/bloks"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Box className="h-4 w-4" />
            Bloks
          </DroppableNavLink>
          <DroppableNavLink
            to="/rekuest/shortcuts"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <ShoppingCart className="h-4 w-4" />
            Shortcuts
          </DroppableNavLink>
        </div>

        {pinnedAgents?.agents && pinnedAgents.agents.length > 0 && (
          <>
            <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
              My Pinned Apps
            </div>
            <div className="flex flex-col items-start gap-4 rounded-lg ml-2 mb-4 text-muted-foreground">
              {pinnedAgents?.agents.map((agent, index) => (
                <RekuestAgent.Smart object={agent.id} key={index}>
                  <RekuestAgent.DetailLink
                    object={agent.id}
                    key={index}
                    className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
                  >
                    <CardStackIcon className="h-4 w-4" />
                    {agent.name}
                    <div
                      className="w-3 h-3 rounded rounded-full my-auto animate-pulse"
                      style={{
                        backgroundColor: agent.connected
                          ? "#00FF00"
                          : "#FF0000",
                      }}
                    />
                  </RekuestAgent.DetailLink>
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
                <RekuestAgent.DetailLink
                  object={agent.id}
                  key={index}
                  className={"flex flex-row gap-2"}
                >
                  <CardStackIcon
                    className="h-4 w-4"
                    style={{
                      color: agent.connected ? "#00FF00" : "#A9A9A9",
                    }}
                  />
                  {agent.name}
                  <div className="w-3 h-3 rounded rounded-full my-auto animate-pulse" />
                </RekuestAgent.DetailLink>
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
                  <RekuestDashboard.DetailLink
                    object={dashboard.id}
                    key={index}
                    className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
                  >
                    <CardStackIcon className="h-4 w-4" />
                    {dashboard.name}
                    <div className="w-3 h-3 rounded rounded-full my-auto animate-pulse" />
                  </RekuestDashboard.DetailLink>
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
    <SidebarLayout searchBar={searchBar}>
      {search.trim() === "" ? (
        <NavigationPane />
      ) : (
        <div className="h-full">
          <ListRender array={data?.actions}>
            {(item, i) => <ActionCard action={item} key={i} />}
          </ListRender>
        </div>
      )}
    </SidebarLayout>
  );
};

export default Pane;
