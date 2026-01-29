import { SubTree } from "@/components/explorer/SubTree";
import { SubTreeTitle } from "@/components/explorer/SubTreeTitle";
import { Tree } from "@/components/explorer/Tree";
import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { DroppableNavLink } from "@/components/ui/link";
import { CubeIcon } from "@radix-ui/react-icons";
import { AppleIcon, Group, GroupIcon, Home, OrigamiIcon, User } from "lucide-react";
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
import { PaneLink, SidePaneGroup } from "@/components/ui/sidepane";

interface IDataSidebarProps { }

export const NavigationPane = (props: {}) => {
  return (
    <Tree>
      <SidePaneGroup title="Explore">
        <PaneLink
          to="/lok"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Home
        </PaneLink>
        <PaneLink
          to="/lok/me"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <RiProfileFill className="h-4 w-4" />
          Me
        </PaneLink>
      </SidePaneGroup>

      <SidePaneGroup title="Organization">
        <PaneLink
          to="/lok/users"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <User className="h-4 w-4" />
          Users
        </PaneLink>
        <PaneLink
          to="/lok/apps"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <AppleIcon className="h-4 w-4" />
          Apps
        </PaneLink>
        <PaneLink
          to="/lok/services"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Services
        </PaneLink>
        <PaneLink
          to="/lok/instances"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Instances
        </PaneLink>
        <PaneLink
          to="/lok/redeemtokens"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Redeem Tokens
        </PaneLink>
        <PaneLink
          to="/lok/computenodes"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Devices
        </PaneLink>
      </SidePaneGroup>
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

