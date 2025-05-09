import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import TraceList from "../components/lists/TraceList";
import SimulationList from "../components/lists/SimulationList";
import NeuronModelList from "../components/lists/NeuronModelList";
import ExperimentList from "../components/lists/ExperimentList";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout title="Elektro" actions={<></>}>
      
      <SimulationList />
      <NeuronModelList />
      <ExperimentList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
