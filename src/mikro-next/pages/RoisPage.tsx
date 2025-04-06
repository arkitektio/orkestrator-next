import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { MikroImage } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import RoiList from "../components/lists/RoiList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Rois"
      pageActions={
        <>
          <MikroImage.NewButton>
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              New
            </Button>
          </MikroImage.NewButton>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Rois"
          description="Rois are sections of images that are marked for further analysis. They can be used to define regions of interest in your images."
        />
        <RoiList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default ImagesPage;
