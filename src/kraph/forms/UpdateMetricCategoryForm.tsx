import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLListSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  MetricCategoryFragment,
  ReagentCategoryFragment,
  UpdateEntityCategoryMutationVariables,
  UpdateMetricCategoryMutationVariables,
  UpdateReagentCategoryMutationVariables,
  useSearchTagsLazyQuery,
  useUpdateEntityCategoryMutation,
  useUpdateMetricCategoryMutation,
  useUpdateReagentCategoryMutation,
} from "../api/graphql";

const enumToOptions = (e: any) => {
  return Object.keys(e).map((key) => ({
    label: key,
    value: e[key],
  }));
};

export default (props: { metricCategory: MetricCategoryFragment }) => {
  const [update] = useUpdateMetricCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const dialog = useGraphQlFormDialog(update);

  const form = useForm<UpdateMetricCategoryMutationVariables["input"]>({
    defaultValues: {
      id: props.metricCategory.id,
      label: props.metricCategory.label,
      description: props.metricCategory.description,
      purl: props.metricCategory.purl || "",
      tags: props.metricCategory.tags.map((tag) => tag.value),
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
              <GraphQLSearchField
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
