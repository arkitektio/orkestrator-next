import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateMeasurementCategoryMutationVariables,
  CreateStructureRelationCategoryMutationVariables,
  useCreateMeasurementCategoryMutation,
  useSearchEntityCategoryLazyQuery,
  useSearchGraphsLazyQuery,
  useSearchTagsLazyQuery,
} from "../api/graphql";

const TForm = (props: { graph?: string; identifier?: string }) => {
  const [add] = useCreateMeasurementCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateMeasurementCategoryMutationVariables["input"]>({
    defaultValues: {
      graph: props.graph,
      structureDefinition: {
        identifierFilters: [props.identifier],
      },
    },
  });

  const [searchTags] = useSearchTagsLazyQuery();
  const [searchEntityCategory] = useSearchEntityCategoryLazyQuery({
    variables: {
      filters: {
        graph: props.graph,
      },
    },
  });

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
              <div className="col-span-2 flex-col gap-1 flex">
                <GraphQLListSearchField
                  name={`entityDefinition.tagFilters`}
                  label="Tag Filters"
                  searchQuery={searchTags}
                  description="Filters for the entity's tags."
                />
                <GraphQLListSearchField
                  name={`entityDefinition.categoryFilters`}
                  label="Category Filters"
                  searchQuery={searchEntityCategory}
                  description="Filters for the entity's categories."
                />
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
