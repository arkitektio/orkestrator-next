import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
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
  CreateRelationCategoryMutationVariables,
  useCreateInlineGraphMutation,
  useCreateRelationCategoryMutation,
  useCreateStructureRelationCategoryMutation,
  useSearchEntityCategoryLazyQuery,
  useSearchGraphsLazyQuery,
  useSearchTagsLazyQuery
} from "../api/graphql";

const enumToOptions = (e: any) => {
  return Object.keys(e).map((key) => ({
    label: key,
    value: e[key],
  }));
};

export const TForm = (props: { graph?: string }) => {
  const [add] = useCreateStructureRelationCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const [create] = useCreateInlineGraphMutation();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateRelationCategoryMutationVariables["input"]>({
    defaultValues: {
      graph: props.graph,
    },
  });

  const [searchTags] = useSearchTagsLazyQuery();
  const [searchEntityCategory] = useSearchEntityCategoryLazyQuery();

  const [search] = useSearchGraphsLazyQuery();

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
                      name={`sourceDefinition.tagFilters`}
                      label="Tag Filters"
                      searchQuery={searchTags}
                      description="Filters for the entity's tags."
                    />
                    <GraphQLSearchField
                      name={`sourceDefinition.categoryFilters`}
                      label="Category Filters"
                      searchQuery={searchEntityCategory}
                      description="Filters for the entity's categories."
                    />
                  </div>
                  <div className="col-span-2 flex-col gap-1 flex">
                    <GraphQLSearchField
                      name={`targetDefinition.tagFilters`}
                      label="Tag Filters"
                      searchQuery={searchTags}
                      description="Filters for the entity's tags."
                    />
                    <GraphQLSearchField
                      name={`targetDefinition.categoryFilters`}
                      label="Category Filters"
                      searchQuery={searchEntityCategory}
                      description="Filters for the entity's categories."
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