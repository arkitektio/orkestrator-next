import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { DroppableNavLink } from "@/components/ui/link";
import { LokRoom } from "@/linkers";
import { withLokNext } from "@jhnnsrs/lok-next";
import { CubeIcon, PlusIcon } from "@radix-ui/react-icons";
import { Group, Home, User } from "lucide-react";
import * as React from "react";
import { RiProfileFill } from "react-icons/ri";
import { GlobalSearchQueryVariables, useCreateRoomMutation, useGlobalSearchQuery, useRoomsQuery } from "../api/graphql";
import GroupCard from "../components/cards/GroupCard";
import UserCard from "../components/cards/UserCard";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";

interface IDataSidebarProps {}

export const NavigationPane = (props: { }) => {

  const [createRoom] = withLokNext(useCreateRoomMutation)({
    refetchQueries: ["Rooms"],
  });


  const { data, refetch, variables } = withLokNext(useRoomsQuery)();

  return (
    <div className="flex-1 flex-col">
            <nav className="grid items-start px-1 text-sm font-medium lg:px-2">
              <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
                Explore
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-4">
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
              </div>
  
              <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
                Users
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-5">
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
             
              </div>
              <div className="text-muted-foreground text-xs font-semibold uppercase mb-4 flex w-full">
                Recent Rooms
                <div className="ml-auto">
                  <Button onClick={() => createRoom()} variant={"ghost"}><PlusIcon className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
              {data?.rooms.map((room, index) => <LokRoom.DetailLink object={room.id} key={index} className="flex flex-row w-full gap-3 rounded-lg  text-muted-foreground transition-all hover:text-primary"
              >
                <CubeIcon className="h-4 w-4" />
                {room.title}
                </LokRoom.DetailLink>)}
              </div>

            </nav>
          </div>
  )
}

const variables = {
  search: "",
  noGroups: false,
  noUsers: false,
  pagination: {
    limit: 10,
  },
};


const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch } = withLokNext(useGlobalSearchQuery)({
    variables: variables,
  });

  const [currentVariables, setCurrentVariables] = React.useState<GlobalSearchQueryVariables>(variables);

  const onFilterChanged = (e: GlobalSearchQueryVariables) => {
    refetch(e);
    setCurrentVariables(e);
  }

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
        {currentVariables?.search == "" ? <>
            <NavigationPane/>
            </>: <>
        <ListRender array={data?.users}>
          {(item, i) => <UserCard item={item} key={i} />}
        </ListRender>
        <ListRender array={data?.groups}>
          {(item, i) => <GroupCard item={item} key={i} />}
        </ListRender>
        </>}
      </SidebarLayout>
    </>
  );
};

export default Pane;
