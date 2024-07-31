import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useCreateLabelViewMutation } from "../api/graphql";

export const AddLabelViewForm = (props: { image: string }) => {
  const [add] = useCreateLabelViewMutation();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm({
    defaultValues: {
      fluorophore: "",
      primaryAntibody: "",
      secondaryAntibody: "",
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                image: props.image,
                ...data,
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2"></div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
