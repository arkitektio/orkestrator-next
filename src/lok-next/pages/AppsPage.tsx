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
import AppList from "../components/lists/AppList";
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
        title="Applications"
        description="Applications are your workhorses. They are the main way you interact with your data and services. Here you see all applications that are available within your Arkitekt Federation."
      />
      <AppList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
