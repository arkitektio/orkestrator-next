import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import { KabinetBackend } from "@/linkers";
import { CubeIcon } from "@radix-ui/react-icons";
import { HelpCircle, Home, ShoppingCart } from "lucide-react";
import React from "react";
import { useGlobalSearchQuery, useListBackendsQuery } from "../api/graphql";
import DefinitionCard from "../components/cards/DefinitionCard";
import { IconForBackendKind } from "../components/IconForBackendKind";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";
import { Tree } from "@/components/explorer/Tree";
import { SubTreeTitle } from "@/components/explorer/SubTreeTitle";
import { SubTree } from "@/components/explorer/SubTree";
import { Tooltip } from "@radix-ui/react-tooltip";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface IDataSidebarProps {}

export const NavigationPane = (props: {}) => {
  const { data, refetch, variables } = useListBackendsQuery();

  return (
    <Tree>
      <SubTreeTitle>Explore</SubTreeTitle>
      <SubTree>
        <DroppableNavLink
          to="/kabinet/home"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </DroppableNavLink>
        <DroppableNavLink
          to="/kabinet/app-store"
          className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
        >
          <ShoppingCart className="h-4 w-4" />
          App Store
        </DroppableNavLink>
      </SubTree>

      <SubTreeTitle>Manage All</SubTreeTitle>
      <SubTree>
        <DroppableNavLink
          to="/kabinet/pods"
          className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Pods
        </DroppableNavLink>
      </SubTree>
      <SubTreeTitle
        action={
          <Popover>
            <PopoverTrigger asChild>
              <HelpCircle className="h-3 w-3 cursor-pointer"></HelpCircle>
            </PopoverTrigger>
            <PopoverContent>
              <h3 className="mb-2 font-bold">What is an engine?</h3>

              <p>
                {" "}
                Engines allow you to executed package plugins on a specific
                computer (computational node). You need to install the engine
                just like an arktiekt app. For more information, please visit
                the documentation.
              </p>
            </PopoverContent>
          </Popover>
        }
      >
        Engines
      </SubTreeTitle>
      <SubTree>
        {data?.backends.map((backend, index) => (
          <KabinetBackend.DetailLink
            object={backend.id}
            key={index}
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <IconForBackendKind kind={backend.kind} className="h-4 w-4" />
            {backend.name}
          </KabinetBackend.DetailLink>
        ))}
        {data?.backends.length == 0 && (
          <div className=" text-xs">...No engines registed..</div>
        )}
      </SubTree>
    </Tree>
  );
};

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch, variables } = useGlobalSearchQuery({
    variables: {
      search: "",
      pagination: {
        limit: 10,
      },
    },
  });

  const [currentVariables, setCurrentVariables] = React.useState(variables);

  console;
  return (
    <>
      <SidebarLayout
        searchBar={
          <GlobalSearchFilter
            onFilterChanged={(e) => {
              console.log("refetching", e);
              refetch(e);
              setCurrentVariables(e);
            }}
            defaultValue={{ search: "", noGroups: false, noUsers: false }}
          />
        }
      >
        {currentVariables?.search == "" ? (
          <>
            <NavigationPane />
          </>
        ) : (
          <>
            <ListRender array={data?.definitions}>
              {(item, i) => <DefinitionCard item={item} key={i} />}
            </ListRender>
          </>
        )}
      </SidebarLayout>
    </>
  );
};

export default Pane;
