import { useGraphQLDialog } from "@/app/hooks/useGraphQLDialog";
import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateStructureRelationCategoryMutation,
  CreateStructureRelationCategoryMutationVariables,
  useCreateInlineGraphMutation,
  useCreateStructureRelationCategoryMutation,
  useSearchGraphsLazyQuery,
  useSearchTagsLazyQuery
} from "../api/graphql";



export const TForm = (props: { graph?: string; onSuccess?: (data: CreateStructureRelationCategoryMutation) => void }) => {
  const [add] = useCreateStructureRelationCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const [create] = useCreateInlineGraphMutation();

  const submit = useGraphQLDialog(add, {
    successMessage: "Structure Relation Category created",
    onSuccess: (data) => {
      if (data) {
        props.onSuccess?.(data);
      }
    },
  });

  const form = useForm<CreateStructureRelationCategoryMutationVariables["input"]>({
    defaultValues: {
      graph: props.graph,
    },
  });

  const [searchTags] = useSearchTagsLazyQuery();

  const [search] = useSearchGraphsLazyQuery();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            submit({
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
              {!props.graph && (
                <>
                  <GraphQLCreatableSearchField
                    label="Graph"
                    name="graph"
                    description="What graph do you want to add this expression to?"
                    searchQuery={search}
                    createMutation={create}
                  />
                </>
              )}
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
              <Collapsible>
                <CollapsibleTrigger>Advanced</CollapsibleTrigger>
                <CollapsibleContent>
                  <StringField
                    label="PURL"
                    name="purl"
                    description="What is the PURL of this expression?"
                  />
                  <div className="col-span-2 flex-col gap-1 flex">
                    <GraphQLSearchField
                      name={`source.tags`}
                      label="Tag Filters"
                      searchQuery={searchTags}
                      description="Filters for the source structure's tags."
                    />
                  </div>
                  <div className="col-span-2 flex-col gap-1 flex">
                    <GraphQLSearchField
                      name={`target.tags`}
                      label="Tag Filters"
                      searchQuery={searchTags}
                      description="Filters for the target structure's tags."
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};


export default TForm;
