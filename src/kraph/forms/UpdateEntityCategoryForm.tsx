import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLListSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  EntityCategoryFragment,
  UpdateEntityCategoryMutationVariables,
  useSearchTagsLazyQuery,
  useUpdateEntityCategoryMutation,
} from "../api/graphql";

const enumToOptions = (e: any) => {
  return Object.keys(e).map((key) => ({
    label: key,
    value: e[key],
  }));
};

export default (props: { entityCategory: EntityCategoryFragment }) => {
  const [update] = useUpdateEntityCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const dialog = useGraphQlFormDialog(update);

  const form = useForm<UpdateEntityCategoryMutationVariables["input"]>({
    defaultValues: {
      id: props.entityCategory.id,
      label: props.entityCategory.label,
      description: props.entityCategory.description,
      purl: props.entityCategory.purl || "",
      tags: props.entityCategory.tags.map((tag) => tag.value),
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
