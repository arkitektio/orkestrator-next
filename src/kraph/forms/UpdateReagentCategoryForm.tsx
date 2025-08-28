import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  ReagentCategoryFragment,
  UpdateReagentCategoryMutationVariables,
  useCreateGraphTagInlineMutation,
  useSearchTagsLazyQuery,
  useUpdateReagentCategoryMutation
} from "../api/graphql";
import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";

const enumToOptions = (e: any) => {
  return Object.keys(e).map((key) => ({
    label: key,
    value: e[key],
  }));
};

export default (props: { reagentCategory: ReagentCategoryFragment }) => {
  const [update] = useUpdateReagentCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const dialog = useGraphQlFormDialog(update);

  const form = useForm<UpdateReagentCategoryMutationVariables["input"]>({
    defaultValues: {
      id: props.reagentCategory.id,
      label: props.reagentCategory.label,
      description: props.reagentCategory.description,
      purl: props.reagentCategory.purl || "",
      tags: props.reagentCategory.tags.map((tag) => tag.value),
    },
  });

  const [createTag] = useCreateGraphTagInlineMutation({
    variables: {
      graph: props.reagentCategory.graph.id,
      input: "",
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
              <GraphQLCreatableSearchField
                searchQuery={searchTags}
                label="Tags"
                name="tags"
                description="Search for related entities"
                createMutation={(v) => createTag({ variables: { input: v.variables.input, graph: props.reagentCategory.graph.id } })}
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
