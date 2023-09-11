import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { useForm } from "react-hook-form";
import {
  StageFragment,
  useUpdateImageMutation
} from "../api/graphql";

export const UpdateStageForm = (props: { stage: StageFragment }) => {
  const [add] = withMikroNext(useUpdateImageMutation)();


  const dialog = useGraphQlFormDialog(add);

  const form = useForm({
    defaultValues: {
      name: props.image.name,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                input: {
                  id: props.stage.id,
                  ...data,
              }},
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
              Not Implemented
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
