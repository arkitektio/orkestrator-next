import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { LokService } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import LayerList from "../components/lists/LayerList";
import { CreateServiceInstanceForm } from "../forms/CreateServiceInstance";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Layers"
      pageActions={
        <>
          <FormDialogAction
            variant={"outline"}
            size={"sm"}
            label="Create"
            description="Create a new Layer"
            buttonChildren={
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Layer
              </>
            }
            onSubmit={(item) => {
              console.log(item);
              navigate(LokService.linkBuilder(item.linkedExpression.id));
            }}
          >
            <CreateServiceInstanceForm />
          </FormDialogAction>
        </>
      }
    >
      <Explainer
        title="Layers"
        description="Layers represent connection layers between services and apps. If services are defined within a specific layer, only apps that have access to that layer can access the service."
      />
      <LayerList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
