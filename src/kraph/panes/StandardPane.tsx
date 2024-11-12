import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import {
  File,
  Folder,
  GitBranchPlusIcon,
  Home,
  SparkleIcon,
} from "lucide-react";
import * as React from "react";
import { FaChartArea } from "react-icons/fa";
import {
  GlobalSearchQueryVariables,
  useGlobalSearchQuery,
} from "../api/graphql";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";

interface IDataSidebarProps {}

export const NavigationPane = (props: {}) => {
  return (
    <div className="flex-1 flex-col">
      <nav className="grid items-start px-1 text-sm font-medium lg:px-2">
        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
          Explore
        </div>
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-4">
          <DroppableNavLink
            to="/kraph"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </DroppableNavLink>
        </div>

        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
          <DroppableNavLink
            to="/kraph/ontologies"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <GitBranchPlusIcon className="h-4 w-4" />
            Ontologies
          </DroppableNavLink>
          <DroppableNavLink
            to="/kraph/graphs"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <SparkleIcon className="h-4 w-4" />
            Graphs
          </DroppableNavLink>
          <DroppableNavLink
            to="/kraph/renderedplots"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <FaChartArea className="h-4 w-4" />
            Plots
          </DroppableNavLink>
        </div>

        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4 mt-4">
          Protocols
        </div>
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
          <DroppableNavLink
            to="/kraph/protocolsteptemplates"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Folder className="h-4 w-4" />
            Templates
          </DroppableNavLink>

          <DroppableNavLink
            to="/kraph/protocolsteps"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <GitBranchPlusIcon className="h-4 w-4" />
            Steps
          </DroppableNavLink>
          <DroppableNavLink
            to="/kraph/reagents"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <File className="h-4 w-4" />
            Reagents
          </DroppableNavLink>
        </div>
      </nav>
    </div>
  );
};

const variables: GlobalSearchQueryVariables = {
  search: "",
  noImages: false,
  noFiles: false,
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
            defaultValue={variables}
          />
        }
      >
        {currentVariables?.search == "" ? (
          <>
            <NavigationPane />
          </>
        ) : (
          <>Not implemented yet</>
        )}
      </SidebarLayout>
    </>
  );
};

export default Pane;
