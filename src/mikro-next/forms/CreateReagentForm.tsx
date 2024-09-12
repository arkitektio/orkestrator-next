import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateGraphMutationVariables,
  CreateOntologyMutationVariables,
  CreateProtocolStepMutationVariables,
  CreateReagentMutationVariables,
  useCreateGraphMutation,
  useCreateOntologyMutation,
  useCreateProtocolStepMutation,
  useCreateReagentMutation,
  useSearchExpressionLazyQuery,
  useSearchExpressionQuery,
  useSearchLinkedExpressionLazyQuery,
  useSearchLinkedExpressionQuery,
} from "../api/graphql";
import { ParagraphField } from "@/components/fields/ParagraphField";

export default (props) => {
  const [add] = useCreateReagentMutation();

  const dialog = useGraphQlFormDialog(add);

  const [search] = useSearchExpressionLazyQuery();

  const form = useForm<CreateReagentMutationVariables["input"]>({
    defaultValues: {},
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
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
              <GraphQLSearchField
                searchQuery={search}
                name="expression"
                label="Expression"
                description="What type of reagent is this?"
              />
              <StringField name="lotId" label="The ID of the Lot" />
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
