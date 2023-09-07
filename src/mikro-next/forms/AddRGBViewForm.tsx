import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { FloatField } from "@/components/fields/FloatField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { useForm } from "react-hook-form";
import {
  useCreateRgbViewMutation,
  useRgbContextOptionsLazyQuery,
} from "../api/graphql";

export const AddRGBViewForm = (props: { image: string }) => {
  const [add] = withMikroNext(useCreateRgbViewMutation)();

  const [searchStage] = withMikroNext(useRgbContextOptionsLazyQuery)();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm({
    defaultValues: {
      context: undefined,
      rScale: 1,
      gScale: 0,
      bScale: 0,
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
              <GraphQLSearchField
                name="context"
                label="Context"
                searchQuery={searchStage}
                description="In which context should this view be added?"
                placeholder="Creating a new one.."
              />
            </div>

            <div className="col-span-2 flex-col gap-1 flex">
              <FloatField
                label="Red Value"
                name="rScale"
                description="The Red Value"
              />
              <FloatField
                label="Green Value"
                name="gScale"
                description="The Green Value"
              />
              <FloatField
                label="Blue Value"
                name="bScale"
                description="The Blue value"
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
