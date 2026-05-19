import { useGraphQLDialog } from "@/app/hooks/useGraphQLDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import {
  CreateGithubRepoMutation,
  ListDefinitionsDocument,
  ListReleasesDocument,
  useCreateGithubRepoMutation,
} from "../api/graphql";

export const CreateRepoForm = (props: { onSuccess?: (data: CreateGithubRepoMutation) => void }) => {
  const [add] = useCreateGithubRepoMutation({
    refetchQueries: [ListReleasesDocument, ListDefinitionsDocument],
  });

  const submit = useGraphQLDialog(add, { successMessage: "Repo added", onSuccess: props.onSuccess });

  const form = useForm({});

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            submit({
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
