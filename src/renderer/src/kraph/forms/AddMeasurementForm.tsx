import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateMeasurementMutationVariables,
  useCreateMeasurementMutation,
  useSearchMeasurmentCategoryLazyQuery
} from "../api/graphql";

const TForm = (_props: {
  identifier: string
  object: string
}) => {
  const [add] = useCreateMeasurementMutation();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateMeasurementMutationVariables["input"]>({
    defaultValues: {

    },
  });

  // Note: the backend no longer supports filtering measurement categories by
  // a source identifier (the `source` filter has been removed from
  // `SearchMeasurmentCategory`); results are now unfiltered by source.
  const [searchMeasurements] = useSearchMeasurmentCategoryLazyQuery();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                input: {
                  ...data,
                },
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              <GraphQLSearchField
                searchQuery={searchMeasurements}
                label="Tags"
                name="category"
                description="Search for related entities"
              />
              { }
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


export default TForm
