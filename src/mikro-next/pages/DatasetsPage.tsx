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
          <Button variant="outline" size="sm">
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button variant="outline" size="sm" onClick={() => createDataset()}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download
          </Button>
        </>
      }
    >
      <DatasetList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
