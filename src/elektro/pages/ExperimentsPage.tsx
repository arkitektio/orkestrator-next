import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ElektroExperiment, MikroImage } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import ImageList from "../components/lists/ImageList";
import ExperimentList from "../components/lists/ExperimentList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Images"
      pageActions={
        <>
          <ElektroExperiment.NewButton>
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              New
            </Button>
          </ElektroExperiment.NewButton>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Experiments"
          description="Experiments are plots combining the results of various simulations (i.e. comparing the soma traces of various models) "
        />
        <ExperimentList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default ImagesPage;
