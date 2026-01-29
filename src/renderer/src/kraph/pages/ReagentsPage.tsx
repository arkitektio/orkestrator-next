import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { KraphReagent } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import ReagentList from "../components/lists/ReagentList";
import CreateReagentForm from "../forms/CreateReagentForm";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <KraphReagent.ListPage
      title="Reagents"
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
                navigate(KraphReagent.linkBuilder(item.createReagent.id));
              }}
            >
              <CreateReagentForm />
            </FormDialogAction>
          </>
        </div>
      }
    >
      <div className="p-3">
        <Explainer
          title="Reagents"
          description="Reagents are ingredients used in your protocols. They can be antibodies, chemicals, or other substances."
        />
        <ReagentList pagination={{ limit: 30 }} />
      </div>
    </KraphReagent.ListPage>
  );
};

export default Page;
