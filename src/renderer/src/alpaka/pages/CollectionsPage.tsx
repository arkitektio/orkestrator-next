import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { AlpakaCollection } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import CollectionList from "../components/lists/CollectionList";
import { FormSheet } from "@/components/dialog/FormDialog";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Images"
      pageActions={
        <>
          <AlpakaCollection.NewButton>
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              New
            </Button>
          </AlpakaCollection.NewButton>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Collections"
          description="Collections are searchable groups of data. They allow to retrieve data based on semantic queries."
        />
        <CollectionList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default ImagesPage;
