import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { useForm } from "react-hook-form";
import {
  ScanDirection,
  useAutoCreateFluorophoreMutation,
  useCreateContinousScanViewMutation,
  useCreateLabelViewMutation,
  useFluorophoreOptionsLazyQuery
} from "../api/graphql";
import { ChoicesField } from "@/components/fields/ChoicesField";

export const AddContinousScanViewForm = (props: { image: string }) => {
  const [add] = withMikroNext(useCreateContinousScanViewMutation)();


  const dialog = useGraphQlFormDialog(add);

  const form = useForm({
    defaultValues: {
      direction: ScanDirection.ColumnRowSlice,
    },

  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                input: {image: props.image,
                  ...data,
                },
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <ChoicesField options={Object.values(ScanDirection).map((v) => ({label: v.toLowerCase(), value: v}))} name="direction" label="Direction" description="Which direction should the scan be?" />

              
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
