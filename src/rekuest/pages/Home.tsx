import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { PageLayout } from "@/components/layout/PageLayout";
import ActionList from "@/rekuest/components/lists/ActionList";
import AgentList from "@/rekuest/components/lists/AgentList";
import AssignationList from "@/rekuest/components/lists/AssignationList";
import ReservationList from "@/rekuest/components/lists/ReservationList";
import { HomePageStatisticsSidebar } from "../sidebars/HomePageStatisticsSidebar";
import { HelpSidebar } from "@/components/sidebars/help";

const Page = () => {
  return (
    <PageLayout title={"Dashboard"} sidebars={<MultiSidebar map={{ Statistics: <HomePageStatisticsSidebar />, Help: <HelpSidebar /> }} />}>
      <ActionList />
      <ReservationList />
      <AssignationList />
      <AgentList />
    </PageLayout>
  );
};

export default Page;
