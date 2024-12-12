import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Card } from "@/components/ui/card";
import { DroppableNavLink } from "@/components/ui/link";
import { BlokBlok } from "@/linkers";
import { Home, Image } from "lucide-react";
import React from "react";
import GlobalSearchFilter from "../filters/GlobalSearchFilter";
import registry, { Registration } from "../registry";

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
            to="/blok"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </DroppableNavLink>
        </div>

        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
          Bloks
        </div>
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-5">
          <DroppableNavLink
            to="/blok/dashboards"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Image className="h-4 w-4" />
            Dashboards
          </DroppableNavLink>
          <DroppableNavLink
            to="/blok/bloks"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Image className="h-4 w-4" />
            Bloks
          </DroppableNavLink>
        </div>
      </nav>
    </div>
  );
};

export const modules = (search?: string) => {
  return [
    ...registry.components
      .keys()
      .map((key) => {
        if (search) {
          if (key.includes(search)) {
            return registry.components.get(key);
          }
        }
        return registry.components.get(key);
      })
      .filter((x) => x),
  ];
};

export const FilteredBlokCard = (props: { app: Registration }) => {
  return (
    <BlokBlok.Smart object={props.app.name}>
      <Card className="flex flex-col gap-2 p-2 bg-gray-800 rounded-lg h-20">
        <BlokBlok.DetailLink object={props.app.name}>
          <div className="flex flex-row items-center gap-2">
            <h3 className="text-lg font-semibold">{props.app.name}</h3>
          </div>
        </BlokBlok.DetailLink>
      </Card>
    </BlokBlok.Smart>
  );
};

const defaultVariables = { search: undefined };

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const [filteredModules, setFilteredModules] = React.useState(modules());

  const [currentVariables, setCurrentVariables] = React.useState<{
    search?: string;
  }>(defaultVariables);

  const onFilterChanged = (e: { search?: string }) => {
    setFilteredModules(modules(e.search));
    setCurrentVariables(e);
  };

  return (
    <>
      <SidebarLayout
        searchBar={
          <GlobalSearchFilter
            onFilterChanged={onFilterChanged}
            defaultValue={defaultVariables}
          />
        }
      >
        {!currentVariables?.search || currentVariables?.search == "" ? (
          <>
            <NavigationPane />
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredModules.map((item, i) => (
              <FilteredBlokCard app={item} key={i} />
            ))}
          </div>
        )}
      </SidebarLayout>
    </>
  );
};

export default Pane;
