import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { useForm } from "react-hook-form";
import {
  useAutoCreateFluorophoreMutation,
  useCreateLabelViewMutation,
  useFluorophoreOptionsLazyQuery
} from "../api/graphql";

export const AddLabelViewForm = (props: { image: string }) => {
  const [add] = withMikroNext(useCreateLabelViewMutation)();

  const [searchFluorophoes] = withMikroNext(useFluorophoreOptionsLazyQuery)();
  const [createFluorophore] = withMikroNext(useAutoCreateFluorophoreMutation)();

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
            <div className="col-span-2">
              <GraphQLCreatableSearchField
                name="fluorophore"
                label="Context"
                searchQuery={searchFluorophoes}
                createMutation={createFluorophore}
                description="Which fluorophore is this label using?"
                placeholder="Fluorophore"
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
