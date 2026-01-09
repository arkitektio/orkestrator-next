import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import {
  KraphEntityCategory,
  KraphGraphQuery,
  KraphNode,
  KraphProtocolEventCategory,
  KraphReagentCategory,
  KraphRelationCategory,
  KraphStructureCategory,
} from "@/linkers";
import {
  CatIcon,
  Divide,
  FlaskRoundIcon,
  Home,
  Notebook,
  Ruler,
  SparkleIcon,
} from "lucide-react";
import * as React from "react";
import { BsRecord } from "react-icons/bs";
import { PiNumberCircleEight } from "react-icons/pi";
import { TbRelationOneToOne } from "react-icons/tb";
import {
  GlobalSearchQueryVariables,
  useGlobalSearchQuery,
  useStartPaneQuery,
} from "../api/graphql";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";
import { FancyInput } from "@/components/ui/fancy-input";
import { useDebounce } from "@/hooks/use-debounce";
import { PaneLink, SidePaneGroup } from "@/components/ui/sidepane";

interface IDataSidebarProps { }

export const NavigationPane = (props: {}) => {
  const { data } = useStartPaneQuery();

  return (
    <div className="flex-1 flex-col">
      <nav className="grid items-start px-1 text-sm font-medium lg:px-2">
        <SidePaneGroup title="Explore">
          <PaneLink
            to="/kraph/home"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </PaneLink>
          <PaneLink
            to="/kraph/graphs"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <SparkleIcon className="h-4 w-4" />
            Graphs
          </PaneLink>
        </SidePaneGroup>

        <SidePaneGroup title="Categories">
          <PaneLink
            to="/kraph/structurecategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <BsRecord className="h-4 w-4" />
            Structures
          </PaneLink>
          <PaneLink
            to="/kraph/reagentcategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <FlaskRoundIcon className="h-4 w-4" />
            Reagents
          </PaneLink>
          <PaneLink
            to="/kraph/entitycategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <CatIcon className="h-4 w-4" />
            Entities
          </PaneLink>
          <PaneLink
            to="/kraph/protocoleventcategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Notebook className="h-4 w-4" />
            Protocol Events
          </PaneLink>
          <PaneLink
            to="/kraph/naturaleventcategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Divide className="h-4 w-4" />
            Natural Events
          </PaneLink>
          <PaneLink
            to="/kraph/relationcategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <TbRelationOneToOne className="h-4 w-4" />
            Relations
          </PaneLink>
          <PaneLink
            to="/kraph/structurerelationcategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <TbRelationOneToOne className="h-4 w-4" />
            Structure Relations
          </PaneLink>
          <PaneLink
            to="/kraph/metriccategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <PiNumberCircleEight className="h-4 w-4" />
            Metrics
          </PaneLink>
          <PaneLink
            to="/kraph/notes"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <PiNumberCircleEight className="h-4 w-4" />
            Notes
          </PaneLink>
          <PaneLink
            to="/kraph/measurementcategories"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Ruler className="h-4 w-4" />
            Measurement
          </PaneLink>
        </SidePaneGroup>

        {data?.entityCategories && data.entityCategories.length > 0 && (
          <>
            <div className="text-muted-foreground text-xs font-semibold uppercase mt-6 mb-4">
              Pinned Entities
            </div>
            {data.entityCategories.map((i) => (
              <div
                className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground"
                key={i.id}
              >
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
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground" key={i.id}>
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
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground" key={i.id}>
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
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground" key={i.id}>
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
        {data?.graphQueries && data.graphQueries.length > 0 && (
          <>
            {data.graphQueries.map((i) => (
              <>
                <KraphGraphQuery.DetailLink
                  className="text-muted-foreground text-xs font-semibold uppercase mt-6 mb-4"
                  object={i.id}
                >
                  {i.name}
                </KraphGraphQuery.DetailLink>
                {i.render.__typename == "NodeList" && (
                  <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
                    {i.render.nodes.map((entity) => (
                      <KraphNode.Smart key={entity.id} object={entity.id}>
                        <div className="flex flex-col  gap-4 rounded-lg ml-2 text-muted-foreground w-full">
                          <KraphNode.DetailLink
                            object={entity.id}
                            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
                          >
                            <SparkleIcon className="h-4 w-4" />
                            {entity.label}
                          </KraphNode.DetailLink>
                        </div>
                      </KraphNode.Smart>
                    ))}
                  </div>
                )}
              </>
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
                <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground" key={i.id}>
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
          Not implemented yet
        </div>
      )}
    </SidebarLayout>
  );
};

export default Pane;
