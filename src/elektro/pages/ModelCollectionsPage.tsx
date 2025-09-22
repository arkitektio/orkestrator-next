import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ElektroModelCollection } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import ModelCollectionList from "../components/lists/ModelCollectionList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Model Collection"
      pageActions={
        <>
          <ElektroModelCollection.NewButton>
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              New
            </Button>
          </ElektroModelCollection.NewButton>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Model Collections"
          description="Model collections allow you to group multiple models together. This is useful for organizing your models and sharing them with others."
        />
        <ModelCollectionList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default ImagesPage;
