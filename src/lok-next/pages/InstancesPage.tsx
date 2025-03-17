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
import InstancesList from "../components/lists/InstancesList";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Instances"
      pageActions={
        <>
          <FormDialogAction
            variant={"outline"}
            size={"sm"}
            label="Create"
            description="Create a new Instance"
            buttonChildren={
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Instance
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
        title="Instances"
        description="Services are the building blocks of every arkitekt server. They define data sources, data sinks, and allow to add in functionality that all apps can use."
      />
      <InstancesList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
