import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { LokService } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserList from "../components/lists/UserList";
import { CreateServiceInstanceForm } from "../forms/CreateServiceInstance";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Users"
      pageActions={
        <>
          <FormDialogAction
            variant={"outline"}
            size={"sm"}
            label="Create"
            description="Create a new Group"
            buttonChildren={
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Group
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
        title="Users"
        description="Users are individuals who can access the system and perform actions based on their permissions. Here you see all users that are available within your Arkitekt Federation."
      />
      <UserList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
