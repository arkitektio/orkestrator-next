import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateWorkspaceMutation } from "@/reaktion/api/graphql";
import { withFluss } from "@jhnnsrs/fluss";
import { useForm } from "react-hook-form";

export const CreateWorkspaceForm = (props: {}) => {
  const [add] = withFluss(useCreateWorkspaceMutation)();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm({});

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                ...data,
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <StringField
              label="The name of the workspace"
              name="name"
              description="The name of the workspace"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
