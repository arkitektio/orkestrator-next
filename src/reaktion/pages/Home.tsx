import { PageLayout } from "@/components/layout/PageLayout";
import WorkspaceList from "../components/lists/WorkspaceList";
import { ActionButton } from "@/components/ui/action";
import { DialogAction } from "@/components/ui/dialog-action";
import { FormDialog } from "@/components/dialog/FormDialog";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceForm } from "../components/forms/CreateWorkspaceForm";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { useNavigate } from "react-router-dom";
import { FlussWorkspace } from "@/linkers";

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
