import { SubTree } from "@/components/explorer/SubTree";
import { SubTreeTitle } from "@/components/explorer/SubTreeTitle";
import { Tree } from "@/components/explorer/Tree";
import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import { CubeIcon } from "@radix-ui/react-icons";
import { Group, Home, User } from "lucide-react";
import * as React from "react";
import { RiProfileFill } from "react-icons/ri";
import {
  GlobalSearchQueryVariables,
  useGlobalSearchQuery,
} from "../api/graphql";
import GroupCard from "../components/cards/GroupCard";
import UserCard from "../components/cards/UserCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";
import { useDebounce } from "@/hooks/use-debounce";
import { FancyInput } from "@/components/ui/fancy-input";

interface IDataSidebarProps { }

export const NavigationPane = (props: {}) => {
  return (
    <Tree>
      <SubTreeTitle>Explore</SubTreeTitle>
      <SubTree>
        <DroppableNavLink
          to="/lok"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Home
        </DroppableNavLink>
        <DroppableNavLink
          to="/lok/me"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <RiProfileFill className="h-4 w-4" />
          Me
        </DroppableNavLink>
      </SubTree>

      <SubTreeTitle>Users</SubTreeTitle>
      <SubTree>
        <DroppableNavLink
          to="/lok/groups"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Group className="h-4 w-4" />
          Groups
        </DroppableNavLink>
        <DroppableNavLink
          to="/lok/users"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <User className="h-4 w-4" />
          Users
        </DroppableNavLink>
        <DroppableNavLink
          to="/lok/apps"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <User className="h-4 w-4" />
          Apps
        </DroppableNavLink>
        <DroppableNavLink
          to="/lok/organizations"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Organizations
        </DroppableNavLink>
        <DroppableNavLink
          to="/lok/services"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Services
        </DroppableNavLink>
        <DroppableNavLink
          to="/lok/instances"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Instances
        </DroppableNavLink>
        <DroppableNavLink
          to="/lok/redeemtokens"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Redeem Tokens
        </DroppableNavLink>
        <DroppableNavLink
          to="/lok/computenodes"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Compute Nodes
        </DroppableNavLink>
      </SubTree>
    </Tree>
  );
};

const variables = {
  search: "",
  noGroups: false,
  noUsers: false,
  pagination: {
    limit: 10,
  },
};



const Pane: React.FunctionComponent = () => {
  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebounce(search, 300);

  const variables: GlobalSearchQueryVariables = {
    search: debouncedSearch,
    noGroups: false,
    noUsers: false,
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
        <>
          <ListRender array={data?.users}>
            {(item, i) => <UserCard item={item} key={i} />}
          </ListRender>
          <ListRender array={data?.groups}>
            {(item, i) => <GroupCard item={item} key={i} />}
          </ListRender>
        </>
      )}
    </SidebarLayout>
  );
};


export default Pane;

