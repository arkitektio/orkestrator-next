import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import {
  EntityCategoryFragment,
  MetricKind,
  UpdateEntityCategoryMutationVariables,
  useCreateGraphTagInlineMutation,
  useSearchTagsLazyQuery,
  useUpdateEntityCategoryMutation,
} from "../api/graphql";
import { GraphQLCreatableListSearchField } from "@/components/fields/GraphQLCreatableListSearchField";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { SwitchField } from "@/components/fields/SwitchField";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

const enumToOptions = (e: Record<string, string>) => {
  return Object.keys(e).map((key) => ({
    label: key.replace(/_/g, " "),
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
      propertyDefinitions: props.entityCategory.propertyDefinitions.map(
        (def) => ({
          key: def.key,
          label: def.label || "",
          description: def.description || "",
          valueKind: def.valueKind,
          optional: def.optional,
          default: def.default,
        })
      ),
    },
  });

  const propertyDefinitionsArray = useFieldArray({
    control: form.control,
    name: "propertyDefinitions",
  });

  const [searchTags] = useSearchTagsLazyQuery();

  const [createTag] = useCreateGraphTagInlineMutation({
    variables: {
      graph: props.entityCategory.graph.id,
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
              <GraphQLCreatableListSearchField
                searchQuery={searchTags}
                label="Tags"
                name="tags"
                description="Search for related entities"
                createMutation={(v) => createTag({ variables: { input: v.variables.input, graph: props.entityCategory.graph.id } })}
              />
            </div>

            <div className="col-span-2 flex-col gap-2 flex">
              <h3 className="text-lg font-semibold">Property Definitions</h3>
              <p className="text-sm text-muted-foreground">
                Define custom properties for entities of this category
              </p>
              <div className="flex flex-col gap-3">
                {propertyDefinitionsArray.fields.map((item, index) => (
                  <Card key={item.id} className="p-4 relative group">
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => propertyDefinitionsArray.remove(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-[1fr_1fr] gap-3 mb-3">
                      <div className="min-w-0">
                        <StringField
                          label="Key"
                          name={`propertyDefinitions.${index}.key`}
                          description="Unique identifier for this property"
                        />
                      </div>
                      <div className="min-w-0">
                        <StringField
                          label="Label"
                          name={`propertyDefinitions.${index}.label`}
                          description="Display name for this property"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <ParagraphField
                        label="Description"
                        name={`propertyDefinitions.${index}.description`}
                        description="Detailed description of this property"
                      />
                    </div>

                    <div className="grid grid-cols-[1fr_auto] gap-3 mb-3 items-start">
                      <div className="min-w-0">
                        <ChoicesField
                          label="Value Type"
                          name={`propertyDefinitions.${index}.valueKind`}
                          description="The data type for this property"
                          options={enumToOptions(MetricKind)}
                        />
                      </div>
                      <div className="flex items-start pt-8 min-w-[180px]">
                        <SwitchField
                          label="Optional"
                          name={`propertyDefinitions.${index}.optional`}
                          description=""
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <StringField
                        label="Default Value"
                        name={`propertyDefinitions.${index}.default`}
                        description="Default value for this property (optional)"
                      />
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    propertyDefinitionsArray.append({
                      key: "",
                      label: "",
                      description: "",
                      valueKind: MetricKind.String,
                      optional: false,
                      default: null,
                    })
                  }
                  className="w-full"
                >
                  + Add Property Definition
                </Button>
              </div>
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
