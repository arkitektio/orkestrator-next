import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  ImageFragment,
  useRgbContextOptionsLazyQuery,
  useUpdateImageMutation,
} from "../api/graphql";

export const UpdateImageForm = (props: { image: ImageFragment }) => {
  const [add] = useUpdateImageMutation();

  const [searchStage] = useRgbContextOptionsLazyQuery();

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
                  id: props.image.id,
                  ...data,
                },
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
