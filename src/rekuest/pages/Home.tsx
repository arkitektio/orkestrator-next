import { PageLayout } from "@/components/layout/PageLayout";
import NodeList from "@/rekuest/components/lists/NodeList";
import AgentList from "@/rekuest/components/lists/AgentList";
import ReservationList from "@/rekuest/components/lists/ReservationList";
import AssignationList from "@/rekuest/components/lists/AssignationList";
import { Agent } from "http";
import { Button } from "@/components/ui/button";
import { useReinitMutation } from "../api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";

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
