import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { PageLayout } from "@/components/layout/PageLayout";
import { HelpSidebar } from "@/components/sidebars/help";
import { DialogButton } from "@/components/ui/dialog-button";
import { FlussWorkspace } from "@/linkers";
import { useNavigate } from "react-router-dom";
import RunList from "../components/lists/RunList";
import WorkspaceList from "../components/lists/WorkspaceList";
import WorkspaceCarousel from "../edit/carousels/WorkspaceCarousel";
import { HomePageStatisticsSidebar } from "../sidebars/HomePageStatisticsSidebar";

const Page = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Fluss Home"
      pageActions={
        <>
          <DialogButton
            name="createworkspace"
            variant={"outline"}
            dialogProps={{
              onSuccess: (data) => data && navigate(FlussWorkspace.linkBuilder(data.createWorkspace.id)),
            }}
          >
            Create
          </DialogButton>
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
