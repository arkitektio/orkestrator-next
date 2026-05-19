import { useGraphQLDialog } from "@/app/hooks/useGraphQLDialog";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateGraphMutation,
  CreateGraphMutationVariables,
  HomePageDocument,
  useCreateGraphMutation,
} from "../api/graphql";

const TForm = (props: { onSuccess?: (data: CreateGraphMutation) => void }) => {
  const [add] = useCreateGraphMutation({
    refetchQueries: [HomePageDocument],
  });

  const submit = useGraphQLDialog(add, { successMessage: "Graph created", onSuccess: props.onSuccess });

  const form = useForm<CreateGraphMutationVariables["input"]>({
    defaultValues: {
      name: "New Step",
      description: "No Description",
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            submit({
              variables: {
                input: {
                  ...data,
                },
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              <StringField
                label="Name"
                name="name"
                description="How do you can to call this Ontology"
              />
              <ParagraphField
                label="Description"
                name="description"
                description="What describes your ontology the best?"
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Change</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};


export default TForm;
