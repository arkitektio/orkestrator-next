import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  MeasurementCategoryFragment,
  UpdateMeasurementCategoryMutationVariables,
  useSearchTagsLazyQuery,
  useUpdateMeasurementCategoryMutation
} from "../api/graphql";


const TForm =  (props: {
  measurementCategory: MeasurementCategoryFragment;
}) => {
  const [update] = useUpdateMeasurementCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const dialog = useGraphQlFormDialog(update);

  const form = useForm<UpdateMeasurementCategoryMutationVariables["input"]>({
    defaultValues: {
      id: props.measurementCategory.id,
      label: props.measurementCategory.label,
      description: props.measurementCategory.description,
      purl: props.measurementCategory.purl || "",
      tags: props.measurementCategory.tags.map((tag) => tag.id),
    },
  });

  const [searchTags] = useSearchTagsLazyQuery();

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
              <StringField
                label="Label"
                name="label"
                description="Whats the expression? (e.g. 'Person' or 'Connected to')"
              />
              <ParagraphField
                label="Description"
                name="description"
                description="What describes your expression the best? (e.g. 'A person is a human being')"
              />
              <StringField
                label="PURL"
                name="purl"
                description="What is the PURL of this expression?"
              />
              <GraphQLListSearchField
                searchQuery={searchTags}
                label="Tags"
                name="tags"
                description="Search for related entities"
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};


export default TForm;
