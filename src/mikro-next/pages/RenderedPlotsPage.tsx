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
      <RenderedPlotList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
