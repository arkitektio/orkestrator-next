import { PageLayout } from "@/components/layout/PageLayout";
import AgentList from "@/rekuest/components/lists/AgentList";
import AssignationList from "@/rekuest/components/lists/AssignationList";
import ActionList from "@/rekuest/components/lists/ActionList";
import ReservationList from "@/rekuest/components/lists/ReservationList";

const Page = () => {
  return (
    <PageLayout title={"Dashboard"}>
      <ActionList />
      <ReservationList />
      <AssignationList />
      <AgentList />
    </PageLayout>
  );
};

export default Page;
