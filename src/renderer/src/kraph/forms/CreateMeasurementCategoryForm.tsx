import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreateMeasurementCategoryMutationVariables,
  useCreateMeasurementCategoryMutation,
  useSearchEntityCategoryLazyQuery,
  useSearchGraphsLazyQuery,
  useSearchTagsLazyQuery
} from "../api/graphql";

const TForm = (props: { graph?: string; identifier?: string }) => {
  const [add] = useCreateMeasurementCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateMeasurementCategoryMutationVariables["input"]>({
    defaultValues: {
      graph: props.graph,

    },
  });

  const [searchTags] = useSearchTagsLazyQuery();
  const [searchEntityC] = useSearchEntityCategoryLazyQuery();


  const [search] = useSearchGraphsLazyQuery();
  const [showAdvanced, setShowAdvanced] = useState(false);

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
                  <GraphQLSearchField
                    label="Graph"
                    name="graph"
                    description="What graph do you want to add this expression to?"
                    searchQuery={search}
                  />
                </>
              )}
              <StringField
                label="Label"
                name="label"
                description="Whats the expression? (e.g. 'Person' or 'Connected to')"
              />
              <div className="col-span-2 flex-col gap-1 flex">
                <GraphQLListSearchField
                  name={`entityDefinition.categoryFilters`}
                  label="Category Filters"
                  searchQuery={searchEntityC}
                  additionalVariables={{ graph: props.graph }}
                  description="Filters for the entity's categories."
                />
                {showAdvanced && (
                  <>
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
                      name={`entityDefinition.tagFilters`}
                      label="Tag Filters"
                      searchQuery={searchTags}
                      description="Filters for the entity's tags."
                    />

                    <GraphQLSearchField
                      label="Default Category"
                      name="entityDefinition.defaultUseNew"
                      description="Default category for entities created with this measurement category."
                      searchQuery={searchEntityC}
                      additionalVariables={{ graph: props.graph }}
                    />
                  </>
                )}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? "Hide Advanced" : "Show Advanced"}
                  </Button>
                </div>
              </div>
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
