import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { MikroOntology } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import OntologyList from "../components/lists/OntologyList";
import CreateOntologyForm from "../forms/CreateOntologyForm";

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
      <div className="p-3">
        <Explainer
          title="Ontologies"
          description="Ontologies are ways of establishing a shared vocabulary to talk about your data. They allow you to specifically label biological entities such as cells, animals and other  and then use these labels to analyze your data."
        />
        <OntologyList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default Page;
