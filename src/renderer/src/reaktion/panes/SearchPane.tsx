import { SubTree } from "@/components/explorer/SubTree";
import { SubTreeTitle } from "@/components/explorer/SubTreeTitle";
import { Tree } from "@/components/explorer/Tree";
import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { DroppableNavLink } from "@/components/ui/link";
import { FlussRun, FlussWorkspace } from "@/linkers";
import { NodeSearchQueryVariables } from "@/rekuest/api/graphql";
import { CubeIcon } from "@radix-ui/react-icons";
import { Home, PlusIcon } from "lucide-react";
import * as React from "react";
import Timestamp from "react-timestamp";
import {
  GlobalSearchQueryVariables,
  Ordering,
  useGlobalSearchQuery,
  useListRunsQuery,
  useWorkspacesQuery,
} from "../api/graphql";
import WorkspaceCard from "../components/cards/WorkspaceCard";
import { CreateWorkspaceForm } from "../components/forms/CreateWorkspaceForm";
import NodeSearchFilter from "../components/forms/filter/NodeSearchFilter";
import { useDebounce } from "@/hooks/use-debounce";
import { FancyInput } from "@/components/ui/fancy-input";
import { PaneLink, SidePaneGroup } from "@/components/ui/sidepane";

interface IDataSidebarProps { }

export const NavigationPane = (props: {}) => {
  const { data, refetch, variables } = useWorkspacesQuery();
  const { data: rundata } = useListRunsQuery({
    variables: {
      pagination: {
        limit: 5,
      },
      order : { createdAt: Ordering.Desc}
    },
  });

  return (
    <Tree>
      <SidePaneGroup title="Explore">
        <PaneLink
          to="/fluss/home"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </PaneLink>
      </SidePaneGroup>


      <SidePaneGroup title={<FlussWorkspace.ListLink>Workspaces</FlussWorkspace.ListLink>}
        action={
          <FormDialogAction
            label="Create"
            variant={"ghost"}
            buttonChildren={<PlusIcon className="h-4 w-4" />}
            onSubmit={(item) => {
              console.log(item);
            }}
          >
            <CreateWorkspaceForm />
          </FormDialogAction>
        }
      >
        {data?.workspaces.map((workspace, index) => (
          <FlussWorkspace.PaneLink
            object={workspace.id}
            key={index}
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <CubeIcon className="h-4 w-4" />
            {workspace.title}
          </FlussWorkspace.PaneLink>
        ))}
      </SidePaneGroup>

       <SidePaneGroup title={
        <FlussRun.ListLink>Runs</FlussRun.ListLink>}>
        {rundata?.runs.map((run, index) => (
          <FlussRun.PaneLink
            object={run.id}
            key={index}
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <CubeIcon className="h-4 w-4 my-auto" />
            {run.flow.workspace.title}
            <div className="text-slate-600 text-xs my-auto">
              <Timestamp date={run.createdAt} relative />
            </div>
          </FlussRun.PaneLink>
        ))}
      </SidePaneGroup>
    </Tree>
  );
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
        <div className="h-full">
          <ListRender array={data?.workspaces}>
            {(item, i) => <WorkspaceCard workspace={item} key={i} />}
          </ListRender>
        </div>
      )}
    </SidebarLayout>
  );
};


export default Pane;
