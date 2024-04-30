import { PageLayout } from "@/components/layout/PageLayout";
import NodeList from "@/rekuest/components/lists/NodeList";
import AgentList from "@/rekuest/components/lists/AgentList";
import ReservationList from "@/rekuest/components/lists/ReservationList";
import { Agent } from "http";

const Page = () => {
  return (
    <PageLayout title={"Dashboard"}>
      <NodeList />
      <ReservationList />
      <AgentList />
    </PageLayout>
  );
};

export default Page;
