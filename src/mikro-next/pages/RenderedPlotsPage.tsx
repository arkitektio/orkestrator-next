import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import React from "react";
import RenderedPlotList from "../components/lists/RenderedPlotList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Plots"
      pageActions={
        <>
          <Button variant="outline" size="sm">
            <UploadIcon className="h-4 w-4 mr-2" />
            Open in Plotly
          </Button>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Plots"
          description="Plots are visual representations of your data. They allow you to see your data in a visual way. Arkitekt plots can add annotations to your plots, which can help you understand your data even better."
        />
        <RenderedPlotList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default Page;
