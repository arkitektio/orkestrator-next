import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { DialogButton } from "@/components/ui/dialog-button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "lucide-react";
import React from "react";
import GroupList from "../components/lists/GroupList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Roles"
      pageActions={
        <>
          <DialogButton
            name="createserviceinstance"
            variant={"outline"}
            size={"sm"}
            dialogProps={{}}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Group
          </DialogButton>
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
