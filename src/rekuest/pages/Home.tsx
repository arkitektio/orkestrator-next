import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { PageLayout } from "@/components/layout/PageLayout";
import ActionList from "@/rekuest/components/lists/ActionList";
import AgentList from "@/rekuest/components/lists/AgentList";
import AssignationList from "@/rekuest/components/lists/AssignationList";
import ReservationList from "@/rekuest/components/lists/ReservationList";
import { HomePageStatisticsSidebar } from "../sidebars/HomePageStatisticsSidebar";
import { HelpSidebar } from "@/components/sidebars/help";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useUserOptionsQuery, useUsersQuery } from "@/lok-next/api/graphql";
import { DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/plate-ui/dropdown-menu";
import { Button } from "@/components/ui/button";




const UserFitlerButton = (props: {onSelect: (value: string | undefined) => void}) => {

  const { data }= useUsersQuery();








  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
      Filter Users
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-popover text-popover-foreground rounded-md shadow-md p-2">
      <DropdownMenuItem
        key={"all"}
        onSelect={() => {
          props.onSelect(undefined)

        }}
        className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
      >
        All Users
      </DropdownMenuItem>
      {data?.users.map((option) => (
        <DropdownMenuItem
          key={option.id}
          onSelect={() => {
            props.onSelect(option.id)

          }}
          className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          {option.username}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>



  </DropdownMenu>


};





const Page = () => {


  const [userSub, setUserSub] = useState<string | undefined>();









  return (
    <PageLayout title={"Dashboard"} pageActions={<UserFitlerButton onSelect={setUserSub}/>} sidebars={<MultiSidebar map={{ Statistics: <HomePageStatisticsSidebar />, Help: <HelpSidebar /> }} />}>
      <ActionList />
      <ReservationList />
      <AssignationList />
      <AgentList filters={{user: userSub}}/>
    </PageLayout>
  );
};

export default Page;
