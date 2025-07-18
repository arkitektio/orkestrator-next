import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PlusIcon, UploadIcon } from "lucide-react";
import React from "react";
import { useCreateDatasetMutation } from "../api/graphql";
import DatasetList from "../components/lists/DatasetList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createDataset] = useCreateDatasetMutation({
    variables: {
      name: "New Dataset",
    },
    refetchQueries: ["GetDatasets"],
  });

  return (
    <PageLayout
      title="Datasets"
      pageActions={
        <>
          <Button variant="outline" size="sm" onClick={() => createDataset()}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New
          </Button>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Datasets"
          description="Datasets allow you to group your images and files together. Just like folders. "
        />
        <DatasetList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default Page;
