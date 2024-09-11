import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { PlusIcon, UploadIcon } from "lucide-react";
import React from "react";
import { useCreateOntologyMutation } from "../api/graphql";
import OntologyList from "../components/lists/OntologyList";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import CreateOntologyForm from "../forms/CreateOntologyForm";
import { MikroOntology } from "@/linkers";
import { useNavigate } from "react-router-dom";
import { Komments } from "@/lok-next/components/komments/Komments";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Datasets"
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormDialogAction
              variant={"outline"}
              size={"sm"}
              label="Create"
              description="Create a new Graph"
              buttonChildren={
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create
                </>
              }
              onSubmit={(item) => {
                console.log(item);
                navigate(MikroOntology.linkBuilder(item.createOntology.id));
              }}
            >
              <CreateOntologyForm />
            </FormDialogAction>
          </>
        </div>
      }
    >
      <OntologyList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
