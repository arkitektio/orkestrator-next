import { AgentController } from "@/app/agent/AgentController";
import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { FancyInput } from "@/components/ui/fancy-input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PaneLink, SidePaneGroup } from "@/components/ui/sidepane";
import { cn } from "@/lib/utils";
import { RekuestAgent, RekuestDashboard } from "@/linkers";
import { ListAgentFragment } from "@/rekuest/api/graphql";
import { CardStackIcon } from "@radix-ui/react-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { Box, ChevronDown, FunctionSquare, Home, Pin, ShoppingCart } from "lucide-react";
import * as React from "react";
import {
  GlobalSearchQueryVariables,
  Ordering,
  useAgentsQuery,
  useGlobalSearchQuery,
  useListDashboardsQuery,
} from "../api/graphql";
import ActionCard from "../components/cards/ActionCard";
import SearchAgentCard from "../components/cards/SearchAgentCard";

const agentStatusDot = (agent: ListAgentFragment) => {
  if (agent.blocked) return "bg-destructive";
  if (agent.connected) return "bg-emerald-500";
  if (agent.active) return "bg-yellow-500";
  return "bg-muted-foreground/30";
};

const AgentNavItem = ({ agent }: { agent: ListAgentFragment }) => (
  <RekuestAgent.Smart object={agent}>
    <RekuestAgent.PaneLink
      object={agent}
      className="flex flex-row w-full items-center gap-2 rounded px-1 py-1 text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50"
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full shrink-0", agentStatusDot(agent))}
      />
      <span className="flex-1 min-w-0">
        <span className="block text-xs leading-tight truncate">{agent.name}</span>
        <span className="block text-[10px] text-muted-foreground/60 leading-tight truncate">
          {agent.app.identifier}
        </span>
      </span>
    </RekuestAgent.PaneLink>
  </RekuestAgent.Smart>
);

export const NavigationPane = () => {
  const { data } = useAgentsQuery({
    variables: {
      filters: { pinned: false },
      order: { lastSeen: Ordering.Desc },
      pagination: { limit: 10 },
    },
  });

  const { data: pinnedAgents } = useAgentsQuery({
    variables: { filters: { pinned: true } },
  });

  const { data: allDashboards } = useListDashboardsQuery();

  const [appsOpen, setAppsOpen] = React.useState(true);
  const [pinnedOpen, setPinnedOpen] = React.useState(true);
  const [dashboardsOpen, setDashboardsOpen] = React.useState(true);

  const hasPinned = (pinnedAgents?.agents.length ?? 0) > 0;
  const hasDashboards = (allDashboards?.dashboards.length ?? 0) > 0;






  return (
    <div className="flex-1 flex-col h-full overflow-y-auto overflow-x-hidden">
      <nav className="grid items-start px-1 text-xs font-medium lg:px-2 flex-grow p-3">
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
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
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
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
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
            to="/rekuest/spaces"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Box className="h-4 w-4" />
            Spaces
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

        {hasPinned && (
          <Collapsible open={pinnedOpen} onOpenChange={setPinnedOpen} className="mb-5">
            <CollapsibleTrigger className="flex w-full items-center justify-between text-muted-foreground text-xs font-semibold uppercase mb-2 hover:text-foreground transition-colors">
              <span className="flex items-center gap-1.5">
                <Pin className="h-3 w-3" />
                Pinned Apps
                <span className="font-normal normal-case opacity-60">
                  ({pinnedAgents!.agents.length})
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-150",
                  pinnedOpen ? "rotate-0" : "-rotate-90",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-0.5 ml-1">
              {pinnedAgents!.agents.map((agent) => (
                <AgentNavItem key={agent.id} agent={agent} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        <Collapsible open={appsOpen} onOpenChange={setAppsOpen} className="mb-5">
          <CollapsibleTrigger className="flex w-full items-center justify-between text-muted-foreground text-xs font-semibold uppercase mb-2 hover:text-foreground transition-colors">
            <span className="flex items-center gap-1.5">
              <CardStackIcon className="h-3 w-3" />
              My Apps
              {data?.agents && data.agents.length > 0 && (
                <span className="font-normal normal-case opacity-60">
                  ({data.agents.length})
                </span>
              )}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform duration-150",
                appsOpen ? "rotate-0" : "-rotate-90",
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-0.5 ml-1">
            {data?.agents.length ? (
              data.agents.map((agent) => (
                <AgentNavItem key={agent.id} agent={agent} />
              ))
            ) : (
              <p className="text-[10px] text-muted-foreground/50 px-1 py-1">
                No agents online
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>

        {hasDashboards && (
          <Collapsible open={dashboardsOpen} onOpenChange={setDashboardsOpen} className="mb-5">
            <CollapsibleTrigger className="flex w-full items-center justify-between text-muted-foreground text-xs font-semibold uppercase mb-2 hover:text-foreground transition-colors">
              <span className="flex items-center gap-1.5">
                <Box className="h-3 w-3" />
                Dashboards
                <span className="font-normal normal-case opacity-60">
                  ({allDashboards!.dashboards.length})
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-150",
                  dashboardsOpen ? "rotate-0" : "-rotate-90",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-0.5 ml-1">
              {allDashboards!.dashboards.map((dashboard) => (
                <RekuestDashboard.Smart object={dashboard} key={dashboard.id}>
                  <RekuestDashboard.PaneLink
                    object={dashboard}
                    className="flex flex-row w-full items-center gap-2 rounded px-1 py-1 text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50"
                  >
                    <Box className="h-3 w-3 shrink-0" />
                    <span className="text-xs truncate">{dashboard.name}</span>
                  </RekuestDashboard.PaneLink>
                </RekuestDashboard.Smart>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </nav>
    </div>
  );
};

const Pane: React.FunctionComponent = () => {
  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebounce(search, 300);

  const variables: GlobalSearchQueryVariables = {
    search: debouncedSearch,
    noActions: false,
    noAgents: false,
    pagination: {
      limit: 10,
    },
  };

  const { data } = useGlobalSearchQuery({ variables });

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
          <ListRender array={data?.agents} >
            {(item, i) => <SearchAgentCard item={item} key={i} />}
          </ListRender>
          <ListRender array={data?.actions}>
            {(item, i) => <ActionCard item={item} key={i} />}
          </ListRender>
        </div>
      )}
    </SidebarLayout>
  );
};

export default Pane;
