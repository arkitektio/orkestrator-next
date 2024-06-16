import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  CreateGithubRepoMutationVariables,
  useCreateGithubRepoMutation,
} from "@/port-next/api/graphql";
import { withPort } from "@jhnnsrs/port-next";
import { useForm } from "react-hook-form";

const TheForm = () => {
  const [createRepo] = withPort(useCreateGithubRepoMutation)();

  const dialog = useGraphQlFormDialog(createRepo);

  const form = useForm<CreateGithubRepoMutationVariables>({
    defaultValues: {
      repo: "beta",
      user: "jhnnsrs",
      branch: "main",
      name: "beta",
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: data,
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">Here you go</div>
          <StringField
            name="repo"
            label="Repo"
            description="The Github Repo to user"
          />
          <StringField
            name="user"
            label="User"
            description="The User/Organization of this repo"
          />
          <StringField name="branch" label="Branch" description="The branch" />
          <StringField
            name="name"
            label="Name"
            description="How do you want to call this?"
          />

          <DialogFooter className="mt-2">
            <Button type="submit">Install</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default TheForm;
