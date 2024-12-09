import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { DroppableNavLink } from "@/components/ui/link";
import { LokRoom } from "@/linkers";
import { CubeIcon, PlusIcon } from "@radix-ui/react-icons";
import { Group, Home, User } from "lucide-react";
import * as React from "react";
import { RiProfileFill } from "react-icons/ri";
import {
  GlobalSearchQueryVariables,
  useCreateRoomMutation,
  useGlobalSearchQuery,
  useRoomsQuery,
} from "../api/graphql";
import GroupCard from "../components/cards/GroupCard";
import UserCard from "../components/cards/UserCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";
import { Tree } from "@/components/explorer/Tree";
import { SubTreeTitle } from "@/components/explorer/SubTreeTitle";
import { SubTree } from "@/components/explorer/SubTree";

interface IDataSidebarProps {}

export const NavigationPane = (props: {}) => {
  const [createRoom] = useCreateRoomMutation({
    refetchQueries: ["Rooms"],
  });

  const { data, refetch, variables } = useRoomsQuery();

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
          to="/lok/rooms"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Rooms
        </DroppableNavLink>
        <DroppableNavLink
          to="/lok/services"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <CubeIcon className="h-4 w-4" />
          Services
        </DroppableNavLink>
      </SubTree>
      <SubTreeTitle
        action={
          <Button onClick={() => createRoom()} variant={"ghost"} size={"icon"}>
            <PlusIcon className="h-3 w-3" />
          </Button>
        }
      >
        Recent Rooms
      </SubTreeTitle>
      <SubTree>
        {data?.rooms.map((room, index) => (
          <LokRoom.DetailLink
            object={room.id}
            key={index}
            className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
          >
            <CubeIcon className="h-4 w-4" />
            {room.title}
          </LokRoom.DetailLink>
        ))}
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
            onFilterChanged={(e) => refetch(e)}
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
            <ListRender array={data?.users}>
              {(item, i) => <UserCard item={item} key={i} />}
            </ListRender>
            <ListRender array={data?.groups}>
              {(item, i) => <GroupCard item={item} key={i} />}
            </ListRender>
          </>
        )}
      </SidebarLayout>
    </>
  );
};

export default Pane;
