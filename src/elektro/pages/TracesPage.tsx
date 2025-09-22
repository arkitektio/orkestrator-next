import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ElektroSimulation } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import TraceList from "../components/lists/TraceList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Traces"
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
          title="Traces"
          description="Traces are just 1D array of data. THey can represent voltage, time, current etc, "
        />
        <TraceList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default ImagesPage;
