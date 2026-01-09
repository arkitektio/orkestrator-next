import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { FlussWorkspace } from "@/linkers";
import { useNavigate } from "react-router-dom";
import { CreateWorkspaceForm } from "../components/forms/CreateWorkspaceForm";
import RunList from "../components/lists/RunList";
import WorkspaceList from "../components/lists/WorkspaceList";
import WorkspaceCarousel from "../edit/carousels/WorkspaceCarousel";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { HomePageStatisticsSidebar } from "../sidebars/HomePageStatisticsSidebar";
import { HelpSidebar } from "@/components/sidebars/help";

const Page = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Fluss Home"
      pageActions={
        <>
          <FormDialogAction
            label="Create"
            variant={"outline"}
            onSubmit={(item) => {
              console.log(item);
              navigate(FlussWorkspace.linkBuilder(item.createWorkspace.id));
            }}
          >
            <CreateWorkspaceForm />
          </FormDialogAction>
        </>
      }
      sidebars={
        <MultiSidebar map={{
          Statistics: <HomePageStatisticsSidebar />,
          Help: <HelpSidebar />
        }} />
      }
    >
      <WorkspaceCarousel />
      <div className="p-6">
        <WorkspaceList />
        <RunList />
      </div>
    </PageLayout>
  );
};

export default Page;
