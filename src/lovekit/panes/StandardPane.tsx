import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { DroppableNavLink } from "@/components/ui/link";
import { CubeIcon, PlusIcon } from "@radix-ui/react-icons";
import { Group, Home, User } from "lucide-react";
import * as React from "react";
import { RiProfileFill } from "react-icons/ri";
import { Tree } from "@/components/explorer/Tree";
import { SubTreeTitle } from "@/components/explorer/SubTreeTitle";
import { SubTree } from "@/components/explorer/SubTree";

interface IDataSidebarProps {}

export const NavigationPane = (props: {}) => {
  return (
    <Tree>
      <SubTreeTitle>Explore</SubTreeTitle>
      <SubTree>
        <DroppableNavLink
          to="/lovekit/streams"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Streams
        </DroppableNavLink>
        <DroppableNavLink
          to="/lok/me"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <RiProfileFill className="h-4 w-4" />
          Me
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

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  return (
    <>
      <SidebarLayout searchBar={<></>}>
        <NavigationPane />
      </SidebarLayout>
    </>
  );
};

export default Pane;
