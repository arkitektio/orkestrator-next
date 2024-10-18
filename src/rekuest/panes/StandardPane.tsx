import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import { RekuestAgent } from "@/linkers";
import { CardStackIcon, CubeIcon } from "@radix-ui/react-icons";
import { FunctionSquare, Home } from "lucide-react";
import * as React from "react";
import {
  AgentStatus,
  GlobalSearchQueryVariables,
  Ordering,
  useAgentsQuery,
  useGlobalSearchQuery,
} from "../api/graphql";
import NodeCard from "../components/cards/NodeCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";
import { useDescriptors } from "../interfaces/hooks/useDescriptors";

interface IDataSidebarProps {}

export const NavigationPane = (props: {}) => {
  const { data, refetch, variables } = useAgentsQuery({
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

  const descriptors = useDescriptors();

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
            to="/rekuest/reservations"
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <CubeIcon className="h-4 w-4" />
            Reservations
          </DroppableNavLink>
          <DroppableNavLink
            to="/rekuest/nodes"
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <FunctionSquare className="h-4 w-4" />
            Nodes
          </DroppableNavLink>
          <DroppableNavLink
            to="/rekuest/dashboards"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Dashboards
          </DroppableNavLink>
          <DroppableNavLink
            to="/rekuest/interfaces"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Interfaces
          </DroppableNavLink>
          <DroppableNavLink
            to="/rekuest/panels"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Panels
          </DroppableNavLink>
        </div>
        {JSON.stringify(error)}
        {pinnedAgents?.agents && pinnedAgents.agents.length > 0 && (
          <>
            <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
              My Pinned Apps
            </div>
            <div className="flex flex-col items-start gap-4 rounded-lg ml-2 mb-4 text-muted-foreground">
              {pinnedAgents?.agents.map((agent, index) => (
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
                      backgroundColor:
                        agent.status == AgentStatus.Active
                          ? "#00FF00"
                          : "#FF0000",
                    }}
                  />
                </RekuestAgent.DetailLink>
              ))}
            </div>
          </>
        )}
        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
          My Apps
        </div>
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
          {data?.agents.map((agent, index) => (
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
                  backgroundColor:
                    agent.status == AgentStatus.Active ? "#00FF00" : "#FF0000",
                }}
              />
            </RekuestAgent.DetailLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

const variables = {
  search: "",
  noNodes: false,
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
            defaultValue={{ search: "", noNodes: false }}
          />
        }
      >
        {currentVariables?.search == "" ? (
          <>
            <NavigationPane />
          </>
        ) : (
          <>
            <ListRender array={data?.nodes}>
              {(item, i) => <NodeCard node={item} key={i} />}
            </ListRender>
          </>
        )}
      </SidebarLayout>
    </>
  );
};

export default Pane;
