import { PageLayout } from "@/components/layout/PageLayout";
import WorkspaceList from "../components/lists/WorkspaceList";
import { ActionButton } from "@/components/ui/action";

const Page = () => {
  return (
    <PageLayout
      actions={
        <ActionButton
          label="Create"
          description="Create a new workspace"
          key=""
        >
          Create{" "}
        </ActionButton>
      }
    >
      <WorkspaceList />
    </PageLayout>
  );
};

export default Page;
