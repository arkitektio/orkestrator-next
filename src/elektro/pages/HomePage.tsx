import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import ExperimentList from "../components/lists/ExperimentList";
import NeuronModelList from "../components/lists/NeuronModelList";
import SimulationList from "../components/lists/SimulationList";
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
