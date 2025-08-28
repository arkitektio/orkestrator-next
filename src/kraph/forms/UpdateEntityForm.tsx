import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { EntityFragment, UpdateEntityMutationVariables, useUpdateEntityMutation } from "../api/graphql";

export const UpdateEntityForm = (props: { entity: EntityFragment }) => {
  const [add] = useUpdateEntityMutation();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<UpdateEntityMutationVariables["input"]>({
    defaultValues: {
      externalId: props.entity.externalId,
    },
  });

  const onSubmitted = async (data: UpdateEntityMutationVariables["input"]) => {
    dialog({
      variables: {
        input: {

          ...data,
          id: props.entity.id,
        },
      },
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitted)}>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              <StringField
                label="New external ID"
                name="externalId"
                description="The new external ID. Not overwritable"
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
