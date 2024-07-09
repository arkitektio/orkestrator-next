import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import { FlussWorkspace } from "@/linkers";
import { NodeSearchQueryVariables } from "@/rekuest/api/graphql";
import { withFluss } from "@jhnnsrs/fluss-next";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { CubeIcon } from "@radix-ui/react-icons";
import { Home } from "lucide-react";
import * as React from "react";
import Timestamp from "react-timestamp";
import { GlobalSearchQueryVariables, useGlobalSearchQuery, useListRunsQuery, useWorkspacesQuery } from "../api/graphql";
import WorkspaceCard from "../components/cards/WorkspaceCard";
import NodeSearchFilter from "../components/forms/filter/NodeSearchFilter";

interface IDataSidebarProps {}

export const NavigationPane = (props: { }) => {

  const { data, refetch, variables } = withFluss(useWorkspacesQuery)();
  const {data: rundata, } = withFluss(useListRunsQuery)();


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
                Dashboard
              </DroppableNavLink>
              </div>
  
              <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
                Runs
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-5">
              {rundata?.runs.map((run, index) => <FlussWorkspace.DetailLink object={run.id} key={index} className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
              >
                <CubeIcon className="h-4 w-4 my-auto" />
                {run.flow.workspace.title}
                <div className="text-muted-foreground text-xs my-auto"><Timestamp date={run.createdAt} relative/></div>
                </FlussWorkspace.DetailLink>)}
              </div>
              <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
                Workspaces
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
              {data?.workspaces.map((workspace, index) => <FlussWorkspace.DetailLink object={workspace.id} key={index} className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
              >
                <CubeIcon className="h-4 w-4" />
                {workspace.title}
                </FlussWorkspace.DetailLink>)}
              </div>

            </nav>
          </div>
  )
}

const variables: GlobalSearchQueryVariables = {
  search: "",
  pagination: {
    limit: 20,
  },
};

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch } = withRekuest(useGlobalSearchQuery)({
    variables: variables
    },
  );

  const [currentVariables, setCurrentVariables] = React.useState<NodeSearchQueryVariables>(variables);

  const onFilterChanged = (e: NodeSearchQueryVariables) => {
    setCurrentVariables(e);
    refetch(e);
  }


  return (
    <>
      <SidebarLayout
        searchBar={
          <NodeSearchFilter
            onFilterChanged={onFilterChanged}
            defaultValue={variables}
          />
        }
      >
        {currentVariables?.search == "" ? <>
            <NavigationPane/>
            </>: <>
        <ListRender array={data?.workspaces}>
          {(item, i) => <WorkspaceCard workspace={item} key={i} />}
        </ListRender>
        </>}
      </SidebarLayout>
    </>
  );
};

export default Pane;
