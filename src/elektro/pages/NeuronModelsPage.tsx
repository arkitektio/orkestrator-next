import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ElektroExperiment, ElektroNeuronModel, MikroImage } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import NeuronModelList from "../components/lists/NeuronModelList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Neuron models"
      pageActions={
        <>
          <ElektroNeuronModel.NewButton>
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              New
            </Button>
          </ElektroNeuronModel.NewButton>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Neuron Models"
          description="Neuron Models allow for the simulation of various neurons and their networks. They are the ingest point of simulations"
        />
        <NeuronModelList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default ImagesPage;
