import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useCreateRoomMutation, useMeQuery } from "../api/graphql";
import { ThreadsCarousel } from "../components/carousels/ThreadsCarousel";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { PlusIcon } from "lucide-react";
import { LokService } from "@/linkers";
import { useNavigate } from "react-router-dom";
import { CreateServiceInstanceForm } from "../forms/CreateServiceInstance";
import ServiceList from "../components/lists/ServiceList";
import { Explainer } from "@/components/explainer/Explainer";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Lok"
      pageActions={
        <>
          <FormDialogAction
            variant={"outline"}
            size={"sm"}
            label="Create"
            description="Create a new Graph"
            buttonChildren={
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Service
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
        title="Services"
        description="Services are the building blocks of every arkitekt server. They define data sources, data sinks, and allow to add in functionality that all apps can use."
      />
      <ServiceList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
