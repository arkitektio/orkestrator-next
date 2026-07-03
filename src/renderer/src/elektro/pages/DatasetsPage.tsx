import { Explainer } from "@/components/explainer/Explainer";
import { Button } from "@/components/ui/button";
import { ElektroDataset } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { GetDatasetsDocument, useCreateDatasetMutation } from "../api/graphql";
import DatasetList from "../components/lists/DatasetList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createDataset] = useCreateDatasetMutation({
    variables: {
      input: { name: "New Dataset" },
    },
    refetchQueries: [GetDatasetsDocument],
  });

  return (
    <ElektroDataset.ListPage
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
          description="Datasets allow you to group your traces and files together. Just like folders."
        />
        <DatasetList filters={{ parentless: true }} />
      </div>
    </ElektroDataset.ListPage>
  );
};

export default Page;
