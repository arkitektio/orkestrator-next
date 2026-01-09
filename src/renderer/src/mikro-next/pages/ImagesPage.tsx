import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { MikroImage } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import ImageList from "../components/lists/ImageList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <MikroImage.ListPage
      title="Images"
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
          title="Images"
          description="Images are the building blocks of your data management. They represent your microscope images and are part of your datasets."
        />
        <ImageList pagination={{ limit: 30 }} />
      </div>
    </MikroImage.ListPage>
  );
};

export default ImagesPage;
