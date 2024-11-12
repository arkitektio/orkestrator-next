import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateProtocolStepMutationVariables,
  ListProtocolStepTemplateFragment,
  useCreateProtocolStepMutation,
  useSearchProtocolStepTemplatesLazyQuery,
} from "../api/graphql";

export default (props: {
  template: ListProtocolStepTemplateFragment;
  entity: id;
}) => {
  const [add] = useCreateProtocolStepMutation();

  const [search] = useSearchProtocolStepTemplatesLazyQuery();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateProtocolStepMutationVariables["input"]>({
    defaultValues: {
      performedAt: new Date().toISOString(),
      reagentMappings: [],
      valueMappings: [],
      template: props.template.id,
      entity: props.entity,
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
            <div className="col-span-2 flex-col gap-1 flex"></div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Change</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
