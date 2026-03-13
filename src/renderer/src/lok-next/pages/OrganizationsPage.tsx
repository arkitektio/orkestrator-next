import { Explainer } from "@/components/explainer/Explainer";
import { DialogButton } from "@/components/ui/dialogbutton";
import { LokOrganization } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import OrganizationList from "../components/lists/OrganizationList";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <LokOrganization.ListPage
      title="Organizations"
      pageActions={
        <>
          <DialogButton
            name="createorganization"
            variant="outline"
            size="sm"
            dialogProps={{}}
          >

            <PlusIcon className="mr-2 h-4 w-4" />Create Organization
          </DialogButton>
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
