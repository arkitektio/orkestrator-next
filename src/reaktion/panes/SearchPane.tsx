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
  useGlobalSearchQuery,
  useListRunsQuery,
  useWorkspacesQuery,
} from "../api/graphql";
import WorkspaceCard from "../components/cards/WorkspaceCard";
import { CreateWorkspaceForm } from "../components/forms/CreateWorkspaceForm";
import NodeSearchFilter from "../components/forms/filter/NodeSearchFilter";

interface IDataSidebarProps {}

export const NavigationPane = (props: {}) => {
  const { data, refetch, variables } = useWorkspacesQuery();
  const { data: rundata } = useListRunsQuery({
    variables: {
      pagination: {
        limit: 5,
      },
    },
  });

  return (
    <Tree>
      <SubTreeTitle>Explore</SubTreeTitle>
      <SubTree>
        <DroppableNavLink
          to="/fluss"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </DroppableNavLink>
      </SubTree>

      <SubTreeTitle>
        <FlussRun.ListLink>Runs</FlussRun.ListLink>
      </SubTreeTitle>
      <SubTree>
        {rundata?.runs.map((run, index) => (
          <FlussRun.DetailLink
            object={run.id}
            key={index}
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <CubeIcon className="h-4 w-4 my-auto" />
            {run.flow.workspace.title}
            <div className="text-muted-foreground text-xs my-auto">
              <Timestamp date={run.createdAt} relative />
            </div>
          </FlussRun.DetailLink>
        ))}
      </SubTree>
      <SubTreeTitle
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
        <FlussWorkspace.ListLink>Workspaces</FlussWorkspace.ListLink>
      </SubTreeTitle>
      <SubTree>
        {data?.workspaces.map((workspace, index) => (
          <FlussWorkspace.DetailLink
            object={workspace.id}
            key={index}
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <CubeIcon className="h-4 w-4" />
            {workspace.title}
          </FlussWorkspace.DetailLink>
        ))}
      </SubTree>
    </Tree>
  );
};

const variables: GlobalSearchQueryVariables = {
  search: "",
  pagination: {
    limit: 20,
  },
};

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch } = useGlobalSearchQuery({
    variables: variables,
  });

  const [currentVariables, setCurrentVariables] =
    React.useState<NodeSearchQueryVariables>(variables);

  const onFilterChanged = (e: NodeSearchQueryVariables) => {
    setCurrentVariables(e);
    refetch(e);
  };

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
        {currentVariables?.search == "" ? (
          <>
            <NavigationPane />
          </>
        ) : (
          <>
            <ListRender array={data?.workspaces}>
              {(item, i) => <WorkspaceCard workspace={item} key={i} />}
            </ListRender>
          </>
        )}
      </SidebarLayout>
    </>
  );
};

export default Pane;
