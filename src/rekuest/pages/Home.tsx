import { PageLayout } from "@/components/layout/PageLayout";
import AgentList from "@/rekuest/components/lists/AgentList";
import AssignationList from "@/rekuest/components/lists/AssignationList";
import NodeList from "@/rekuest/components/lists/NodeList";
import ReservationList from "@/rekuest/components/lists/ReservationList";

const Page = () => {
  return (
    <PageLayout title={"Dashboard"}>
      <NodeList />
      <ReservationList />
      <AssignationList />
      <AgentList />
    </PageLayout>
  );
};

export default Page;
