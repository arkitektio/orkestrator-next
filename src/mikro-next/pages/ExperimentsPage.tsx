import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PlusIcon, UploadIcon } from "lucide-react";
import React from "react";
import { useCreateExperimentMutation } from "../api/graphql";
import ExperimentList from "../components/lists/ExperimentList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createExperiment] = useCreateExperimentMutation({
    variables: {
      name: "New Experiment",
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => createExperiment()}
          >
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
      <ExperimentList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
