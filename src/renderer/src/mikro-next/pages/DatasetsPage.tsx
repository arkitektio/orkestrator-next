import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React from "react";
import { GetDatasetsDocument, useCreateDatasetMutation } from "../api/graphql";
import DatasetList from "../components/lists/DatasetList";
import { MikroDataset } from "@/linkers";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createDataset] = useCreateDatasetMutation({
    variables: {
      input: { name: "New Dataset" }
    },
    refetchQueries: [GetDatasetsDocument]
  });

  return (
    <MikroDataset.ListPage
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
        <DatasetList pagination={{ limit: 30 }} filters={{ parentless: true }} />
      </div>
    </MikroDataset.ListPage>
  );
};

export default Page;
