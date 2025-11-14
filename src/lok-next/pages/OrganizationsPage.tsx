import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { LokOrganization, LokService, LokUser } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserList from "../components/lists/UserList";
import { CreateServiceInstanceForm } from "../forms/CreateServiceInstance";
import OrganizationList from "../components/lists/OrganizationList";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <LokOrganization.ListPage
      title="Organizations"
      pageActions={
        <>
          <FormDialogAction
            variant={"outline"}
            size={"sm"}
            label="Create"
            description="Create a new Organization"
            buttonChildren={
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Organization
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
        title="Organizations"
        description="Organizations are groups or entities that can have multiple users and resources associated with them. Here you see all organizations that are available within your Arkitekt Federation."
      />
      <OrganizationList />

      <Separator />
    </LokOrganization.ListPage>
  );
};

export default Page;
