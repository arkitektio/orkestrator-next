import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import ProjectList from "../components/lists/ProjectList";
import { MeDocument, useDeleteMeMutation } from "../api/graphql";
import { Button } from "@/components/ui/button";
import { CreateProjectForm } from "../forms/CreateProjectForm";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { PlusIcon } from "@radix-ui/react-icons";
import { OmeroArkProject } from "@/linkers";
import { useNavigate } from "react-router-dom";
import { DeleteMeButton } from "../ConnectedGuard";
import { CommandMenu } from "@/command/Menu";
import { HomePageStatisticsSidebar } from "../sidebars/HomePageStatisticsSidebar";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { HelpSidebar } from "@/components/sidebars/help";







const Page = () => {

  const navigate = useNavigate();

  return (
    <PageLayout title="Projects" pageActions={<> <DeleteMeButton />


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
          navigate(OmeroArkProject.linkBuilder(item.createProject.id));
        }}
      >
        <CreateProjectForm />
      </FormDialogAction>

    </>} sidebars={
      <MultiSidebar map={{
        Statistics: <HomePageStatisticsSidebar />,
        Help: <HelpSidebar />
      }} />
    }>
      <CommandMenu />
      <ProjectList />
    </PageLayout>
  );
};

export default Page;
