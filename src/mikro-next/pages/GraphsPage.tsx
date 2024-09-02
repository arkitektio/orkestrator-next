import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { PlusIcon, UploadIcon } from "lucide-react";
import React from "react";
import { useCreateGraphMutation } from "../api/graphql";
import GraphList from "../components/lists/GraphList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createGraph] = useCreateGraphMutation({
    variables: {
      input: { name: "New Graph" },
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
            Open G
          </Button>
          <Button variant="outline" size="sm" onClick={() => createGraph()}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create
          </Button>
        </>
      }
    >
      <GraphList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
