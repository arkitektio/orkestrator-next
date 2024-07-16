import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateWorkspaceMutation } from "@/reaktion/api/graphql";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { useCreateGithubRepoMutation } from "../api/graphql";

export const CreateRepoForm = (props: {}) => {
  const [add] = useCreateGithubRepoMutation({
    refetchQueries: ["GithubRepos"],
  });

  const dialog = useGraphQlFormDialog(add);

  const form = useForm({});

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                identifier: data.identifier,
              },
            });
          })}
        >
          <DialogHeader>
            <h1>Add a new Github Repo</h1>
          </DialogHeader>

          <DialogDescription className="font-light text-sm mt-2">
            A workspace is way for you to work on a workflow and its various
            versions over time.
          </DialogDescription>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <StringField
              label="Lets give it a name"
              name="identifier"
              description="The name of the workspace"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
