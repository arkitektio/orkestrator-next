import { CommandMenu } from "@/command/Menu";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { PageLayout } from "@/components/layout/PageLayout";
import { HelpSidebar } from "@/components/sidebars/help";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { OmeroArkProject } from "@/linkers";
import { PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import ProjectList from "../components/lists/ProjectList";
import { DeleteMeButton } from "../ConnectedGuard";
import { CreateProjectForm } from "../forms/CreateProjectForm";
import { HomePageStatisticsSidebar } from "../sidebars/HomePageStatisticsSidebar";







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
