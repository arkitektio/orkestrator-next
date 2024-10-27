import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  ExpressionFragment,
  useUpdateExpressionMutation,
} from "../api/graphql";

export const UpdateExpressionForm = (props: {
  expression: ExpressionFragment;
}) => {
  const [add] = useUpdateExpressionMutation();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm({
    defaultValues: {
      description: props.expression.description,
      label: props.expression.label,
    },
  });

  const onSubmitted = async (data: any) => {
    dialog({
      variables: {
        input: {
          id: props.expression.id,
          ...data,
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
                label="New label"
                name="label"
                description="The new label"
              />
              <ParagraphField
                label="New Description"
                name="description"
                description="The new description"
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
