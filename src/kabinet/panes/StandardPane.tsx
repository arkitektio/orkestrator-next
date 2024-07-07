import { Arkitekt } from "@/arkitekt";
import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import { KabinetBackend } from "@/linkers";
import { CubeIcon } from "@radix-ui/react-icons";
import {
  Home,
  ShoppingCart
} from "lucide-react";
import React from "react";
import { FaDocker } from "react-icons/fa";
import { useGlobalSearchQuery, useListBackendsQuery } from "../api/graphql";
import DefinitionCard from "../components/cards/ReleaseCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";


interface IDataSidebarProps {}


const IconForType = ({kind, ...props}: {kind: string, className?: string}) => {
  switch (kind) {
    case "docker":
      return <FaDocker {...props}/>;
    default:
      return <CubeIcon  {...props} />;
  }
}


export const NavigationPane = (props: { }) => {

  const { data, refetch, variables } = Arkitekt.withKabinet(useListBackendsQuery)();


  return (
    <div className="flex-1 flex-col">
            <nav className="grid items-start px-1 text-sm font-medium lg:px-2">
              <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
                Explore
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-4">
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
              </div>
  
              <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
                Manage
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-4">
              <DroppableNavLink
                to="/kabinet/pods"
                className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
              >
                <CubeIcon className="h-4 w-4" />
                Pods
              </DroppableNavLink>
              </div>
              <div className="text-muted-foreground text-xs font-semibold uppercase mb-3">
                Backends
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
              {data?.backends.map((backend, index) => <KabinetBackend.DetailLink object={backend.id} key={index} className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
              >
                <IconForType kind={backend.kind} className="h-4 w-4" />
                {backend.name}
              </KabinetBackend.DetailLink>)}
              </div>

            </nav>
          </div>
  )
}

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch, variables } = Arkitekt.withKabinet(useGlobalSearchQuery)({
    variables: {
      search: "",
      pagination: {
        limit: 10,
      },
    },
  });

  const [currentVariables, setCurrentVariables] = React.useState(variables);

  console
  return (
    <>
      <SidebarLayout
        searchBar={
          <GlobalSearchFilter
            onFilterChanged={(e) => {
              console.log("refetching", e)
              refetch(e)
              setCurrentVariables(e)
            }}
            defaultValue={{ search: "", noGroups: false, noUsers: false }}
          />
        }
      >
        {currentVariables?.search == "" ? <>
            <NavigationPane/>
        
        
        </> : <>
        <ListRender array={data?.definitions}>
          {(item, i) => <DefinitionCard item={item} key={i} />}
        </ListRender>
        </>}


      </SidebarLayout>
    </>
  );
};

export default Pane;
