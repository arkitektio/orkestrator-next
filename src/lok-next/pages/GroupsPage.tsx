import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { LokService } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import GroupList from "../components/lists/GroupList";
import { CreateServiceInstanceForm } from "../forms/CreateServiceInstance";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Groups"
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
        title="Groups"
        description="Groups are collections of users that can be used to manage permissions and access to resources. Here you see all groups that are available within your Arkitekt Federation."
      />
      <GroupList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
