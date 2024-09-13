import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { PlusIcon, UploadIcon } from "lucide-react";
import React from "react";
import { useCreateGraphMutation } from "../api/graphql";
import GraphList from "../components/lists/GraphList";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import CreateGraphForm from "../forms/CreateOntologyForm";
import { useNavigate } from "react-router-dom";
import { MikroGraph } from "@/linkers";
import CreateOntologyForm from "../forms/CreateOntologyForm";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Graphs"
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
                navigate(MikroGraph.linkBuilder(item.createGraph.id));
              }}
            >
              <CreateGraphForm />
            </FormDialogAction>
          </>
        </div>
      }
    >
      <GraphList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
