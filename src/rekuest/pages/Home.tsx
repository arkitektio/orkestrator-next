import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import AgentList from "@/rekuest/components/lists/AgentList";
import AssignationList from "@/rekuest/components/lists/AssignationList";
import NodeList from "@/rekuest/components/lists/NodeList";
import ReservationList from "@/rekuest/components/lists/ReservationList";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { useReinitMutation } from "../api/graphql";

const Page = () => {
  const [reinit] = withRekuest(useReinitMutation)();

  return (
    <PageLayout title={"Dashboard"}>
      <Button onClick={() => reinit()}>Reinit</Button>
      <NodeList />
      <ReservationList />
      <AssignationList />
      <AgentList />
    </PageLayout>
  );
};

export default Page;
