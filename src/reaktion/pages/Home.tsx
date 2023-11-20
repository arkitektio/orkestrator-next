import { PageLayout } from "@/components/layout/PageLayout";
import WorkspaceList from "../components/lists/WorkspaceList";
import { ActionButton } from "@/components/ui/action";
import { DialogAction } from "@/components/ui/dialog-action";
import { FormDialog } from "@/components/dialog/FormDialog";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceForm } from "../components/forms/CreateWorkspaceForm";

const Page = () => {
  return (
    <PageLayout
      actions={
        <>
        <DialogAction
          label="Create"
          description="Create a new workspace"
          key=""
        >
          Create{" "}
        </DialogAction>

              <FormDialog
                  trigger={<Button className="text-xl">Create</Button>}
                >
                  <CreateWorkspaceForm />
                </FormDialog>

                </>

      }
    >
      <WorkspaceList />
    </PageLayout>
  );
};

export default Page;
