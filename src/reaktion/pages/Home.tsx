import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { FlussWorkspace } from "@/linkers";
import { useNavigate } from "react-router-dom";
import { CreateWorkspaceForm } from "../components/forms/CreateWorkspaceForm";
import WorkspaceList from "../components/lists/WorkspaceList";

const Page = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Fluss Home"
      actions={
        <>
          <FormDialogAction
            label="Create"
            onSubmit={(item) => {
              console.log(item);
              navigate(FlussWorkspace.linkBuilder(item.createWorkspace.id));
            }}
          >
            <CreateWorkspaceForm />
          </FormDialogAction>
        </>
      }
    >
      <WorkspaceList />
    </PageLayout>
  );
};

export default Page;
