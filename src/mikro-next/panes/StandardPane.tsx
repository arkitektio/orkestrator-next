import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import { usePrimaryReturnNodesQuery } from "@/rekuest/api/graphql";
import { CubeIcon } from "@radix-ui/react-icons";
import {
  File,
  Folder,
  GitBranchPlusIcon,
  Home,
  Image,
  SparkleIcon,
  Wallet,
} from "lucide-react";
import * as React from "react";
import { FaChartArea } from "react-icons/fa";
import {
  GlobalSearchQueryVariables,
  useGlobalSearchQuery,
} from "../api/graphql";
import FileCard from "../components/cards/FileCard";
import ImageCard from "../components/cards/ImageCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";

interface IDataSidebarProps {}

export const NavigationPane = (props: {}) => {
  const { data } = usePrimaryReturnNodesQuery({
    variables: {
      pagination: {
        limit: 5,
      },
      identifier: "@mikro/renderedplot",
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
            to="/mikro"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </DroppableNavLink>
        </div>

        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
          Data
        </div>
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-5">
          <DroppableNavLink
            to="/mikro/images"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Image className="h-4 w-4" />
            Images
          </DroppableNavLink>
          <DroppableNavLink
            to="/mikro/tables"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Tables
          </DroppableNavLink>
          <DroppableNavLink
            to="/mikro/stages"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <CubeIcon className="h-4 w-4" />
            Stages
          </DroppableNavLink>
          <DroppableNavLink
            to="/mikro/datasets"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Folder className="h-4 w-4" />
            Datasets
          </DroppableNavLink>
          <DroppableNavLink
            to="/mikro/files"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <File className="h-4 w-4" />
            Files
          </DroppableNavLink>
        </div>
        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
          Insights
        </div>

        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
          <DroppableNavLink
            to="/mikro/ontologies"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <GitBranchPlusIcon className="h-4 w-4" />
            Ontologies
          </DroppableNavLink>
          <DroppableNavLink
            to="/mikro/graphs"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <SparkleIcon className="h-4 w-4" />
            Graphs
          </DroppableNavLink>
          <DroppableNavLink
            to="/mikro/renderedplots"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <FaChartArea className="h-4 w-4" />
            Plots
          </DroppableNavLink>
        </div>

        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4 mt-4">
          Experiments
        </div>
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
          <DroppableNavLink
            to="/mikro/protocolsteptemplates"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Folder className="h-4 w-4" />
            Protocols
          </DroppableNavLink>

          <DroppableNavLink
            to="/mikro/experiments"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Wallet className="h-4 w-4" />
            Experiments
          </DroppableNavLink>

          <DroppableNavLink
            to="/mikro/protocolsteps"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <GitBranchPlusIcon className="h-4 w-4" />
            Steps
          </DroppableNavLink>
          <DroppableNavLink
            to="/mikro/reagents"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <File className="h-4 w-4" />
            Reagents
          </DroppableNavLink>
        </div>

        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4 mt-4">
          Plotters
        </div>
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
          {data?.nodes.map((node, i) => (
            <DroppableNavLink
              to={`/mikro/plotters/${node.id}`}
              key={i}
              className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
            >
              <SparkleIcon className="h-4 w-4" />
              {node.name}
            </DroppableNavLink>
          ))}
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
          <>
            <ListRender array={data?.images}>
              {(item, i) => <ImageCard image={item} key={i} />}
            </ListRender>
            <ListRender array={data?.files}>
              {(item, i) => <FileCard file={item} key={i} />}
            </ListRender>
          </>
        )}
      </SidebarLayout>
    </>
  );
};

export default Pane;
