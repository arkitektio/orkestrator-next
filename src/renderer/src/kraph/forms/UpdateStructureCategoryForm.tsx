import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLCreatableListSearchField } from "@/components/fields/GraphQLCreatableListSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  StructureCategoryFragment,
  UpdateStructureCategoryMutationVariables,
  useCreateGraphTagInlineMutation,
  useSearchTagsLazyQuery,
  useUpdateStructureCategoryMutation,
} from "../api/graphql";


const TForm =  (props: { structureCategory: StructureCategoryFragment }) => {
  const [update] = useUpdateStructureCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const dialog = useGraphQlFormDialog(update);

  const form = useForm<UpdateStructureCategoryMutationVariables["input"]>({
    defaultValues: {
      id: props.structureCategory.id,
      description: props.structureCategory.description,
      tags: props.structureCategory.tags.map((tag) => tag.id),
    },
  });

  const [searchTags] = useSearchTagsLazyQuery();

  const [createTag] = useCreateGraphTagInlineMutation({
    variables: {
      graph: props.structureCategory.graph.id,
      input: "",
    },
  });

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
              <GraphQLCreatableListSearchField
                searchQuery={searchTags}
                label="Tags"
                name="tags"
                description="Search for related entities"
                createMutation={(v) => createTag({ variables: { input: v.variables.input, graph: props.structureCategory.graph.id } })}
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
