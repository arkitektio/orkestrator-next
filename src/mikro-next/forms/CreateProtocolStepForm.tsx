import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateProtocolStepMutationVariables,
  useCreateProtocolStepMutation,
  useSearchLinkedExpressionLazyQuery,
  useSearchLinkedExpressionQuery,
} from "../api/graphql";

export default (props) => {
  const [add] = useCreateProtocolStepMutation();

  const [search] = useSearchLinkedExpressionLazyQuery();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateProtocolStepMutationVariables["input"]>({
    defaultValues: {
      name: "New Step",
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                input: data,
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              <StringField
                label="New Name"
                name="name"
                description="The Name Value"
              />
              <StringField
                label="New Description"
                name="description"
                description="The Description Value"
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
