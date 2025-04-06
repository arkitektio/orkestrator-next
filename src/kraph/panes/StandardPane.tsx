import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import {
  CatIcon,
  Divide,
  File,
  FlaskRoundIcon,
  Folder,
  GitBranchPlusIcon,
  Home,
  Notebook,
  Ruler,
  SparkleIcon,
} from "lucide-react";
import * as React from "react";
import { FaChartArea } from "react-icons/fa";
import {
  GlobalSearchQueryVariables,
  useGlobalSearchQuery,
  useStartPaneQuery,
} from "../api/graphql";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";
import {
  KraphEntity,
  KraphEntityCategory,
  KraphProtocolEventCategory,
  KraphReagentCategory,
  KraphRelationCategory,
  KraphStructureCategory,
} from "@/linkers";
import { PiGif, PiNumberCircleEight } from "react-icons/pi";
import { BsRecord } from "react-icons/bs";
import { TbRelationManyToMany, TbRelationOneToOne } from "react-icons/tb";

interface IDataSidebarProps {}

export const NavigationPane = (props: {}) => {
  const { data } = useStartPaneQuery();

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
          <DroppableNavLink
            to="/kraph/graphs"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <SparkleIcon className="h-4 w-4" />
            Graphs
          </DroppableNavLink>
        </div>

        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
          Categories
        </div>

        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
          <DroppableNavLink
            to="/kraph/structurecategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <BsRecord className="h-4 w-4" />
            Structures
          </DroppableNavLink>
          <DroppableNavLink
            to="/kraph/reagentcategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <FlaskRoundIcon className="h-4 w-4" />
            Reagents
          </DroppableNavLink>
          <DroppableNavLink
            to="/kraph/entitycategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <CatIcon className="h-4 w-4" />
            Entities
          </DroppableNavLink>
          <DroppableNavLink
            to="/kraph/protocoleventcategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Notebook className="h-4 w-4" />
            Protocol Events
          </DroppableNavLink>
          <DroppableNavLink
            to="/kraph/naturaleventcategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Divide className="h-4 w-4" />
            Natural Events
          </DroppableNavLink>
          <DroppableNavLink
            to="/kraph/relationcategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <TbRelationOneToOne className="h-4 w-4" />
            Relations
          </DroppableNavLink>
          <DroppableNavLink
            to="/kraph/metriccategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <PiNumberCircleEight className="h-4 w-4" />
            Metrics
          </DroppableNavLink>
          <DroppableNavLink
            to="/kraph/measurementcategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Ruler className="h-4 w-4" />
            Measurement
          </DroppableNavLink>
        </div>

        {data?.entityCategories && data.entityCategories.length > 0 && (
          <>
            <div className="text-muted-foreground text-xs font-semibold uppercase mt-6 mb-4">
              Pinned Entities
            </div>
            {data.entityCategories.map((i) => (
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
                <KraphEntityCategory.DetailLink
                  object={i.id}
                  className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
                >
                  <SparkleIcon className="h-4 w-4" />
                  {i.label}
                </KraphEntityCategory.DetailLink>
              </div>
            ))}
          </>
        )}
        {data?.structureCategories && data.structureCategories.length > 0 && (
          <>
            <div className="text-muted-foreground text-xs font-semibold uppercase mt-6 mb-4">
              Pinned Structures
            </div>
            {data.structureCategories.map((i) => (
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
                <KraphStructureCategory.DetailLink
                  object={i.id}
                  className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
                >
                  <SparkleIcon className="h-4 w-4" />
                  {i.identifier}
                </KraphStructureCategory.DetailLink>
              </div>
            ))}
          </>
        )}
        {data?.reagentCategories && data.reagentCategories.length > 0 && (
          <>
            <div className="text-muted-foreground text-xs font-semibold uppercase mt-6 mb-4">
              Pinned Reagents
            </div>
            {data.reagentCategories.map((i) => (
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
                <KraphReagentCategory.DetailLink
                  object={i.id}
                  className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
                >
                  <SparkleIcon className="h-4 w-4" />
                  {i.label}
                </KraphReagentCategory.DetailLink>
              </div>
            ))}
          </>
        )}
        {data?.relationCategories && data.relationCategories.length > 0 && (
          <>
            <div className="text-muted-foreground text-xs font-semibold uppercase mt-6 mb-4">
              Pinned Relations
            </div>
            {data.relationCategories.map((i) => (
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
                <KraphRelationCategory.DetailLink
                  object={i.id}
                  className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
                >
                  <SparkleIcon className="h-4 w-4" />
                  {i.label}
                </KraphRelationCategory.DetailLink>
              </div>
            ))}
          </>
        )}
        {data?.protocolEventCategories &&
          data.protocolEventCategories.length > 0 && (
            <>
              <div className="text-muted-foreground text-xs font-semibold uppercase mt-6 mb-4">
                Pinned Protocols
              </div>
              {data.protocolEventCategories.map((i) => (
                <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
                  <KraphProtocolEventCategory.DetailLink
                    object={i.id}
                    className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
                  >
                    <SparkleIcon className="h-4 w-4" />
                    {i.label}
                  </KraphProtocolEventCategory.DetailLink>
                </div>
              ))}
            </>
          )}
      </nav>
    </div>
  );
};

const variables: GlobalSearchQueryVariables = {
  search: "",
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
