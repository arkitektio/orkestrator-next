import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { PlusIcon, UploadIcon } from "lucide-react";
import React from "react";
import { useCreateOntologyMutation } from "../api/graphql";
import OntologyList from "../components/lists/OntologyList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createOntology] = useCreateOntologyMutation({
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
            Open Ontologies
          </Button>
          <Button variant="outline" size="sm" onClick={() => createOntology()}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create
          </Button>
        </>
      }
    >
      <OntologyList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
