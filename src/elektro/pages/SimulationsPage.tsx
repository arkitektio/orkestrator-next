import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ElektroExperiment, ElektroNeuronModel, ElektroSimulation, MikroImage } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import NeuronModelList from "../components/lists/NeuronModelList";
import SimulationList from "../components/lists/SimulationList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Simulations"
      pageActions={
        <>
          <ElektroSimulation.NewButton>
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              New
            </Button>
          </ElektroSimulation.NewButton>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Simulations"
          description="Simulations are runs of neuron models, where specific recording and stimulation protocols are applied. They are the result of a simulation run."
        />
        <SimulationList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default ImagesPage;
