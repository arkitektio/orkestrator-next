import { useGraphQLDialog } from "@/app/hooks/useGraphQLDialog";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  CreateMeasurementCategoryMutationVariables,
  useCreateMeasurementCategoryMutation,
  useSearchEntityCategoryLazyQuery,
  useSearchGraphsLazyQuery,
  useSearchTagsLazyQuery,
} from "../api/graphql";
import { keyify } from "./utils";

type FormValues = CreateMeasurementCategoryMutationVariables["input"];

const TForm = (props: { graph?: string; identifier?: string }) => {
  const [add] = useCreateMeasurementCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const submit = useGraphQLDialog(add, {
    successMessage: "Measurement Category created",
    errorPrefix: "Error creating Measurement Category",
  });

  const form = useForm<FormValues>({
    defaultValues: {
      graph: props.graph,
    },
  });

  const [searchTags] = useSearchTagsLazyQuery();
  const [searchEntityC] = useSearchEntityCategoryLazyQuery();
  const [search] = useSearchGraphsLazyQuery();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto-derive `key` from `label`
  const labelValue = useWatch({ control: form.control, name: "label" });
  useEffect(() => {
    const { isDirty } = form.getFieldState("key");
    if (!isDirty && labelValue !== undefined) {
      form.setValue("key", keyify(labelValue), { shouldValidate: true });
    }
  }, [labelValue, form]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            submit({ variables: { input: data } });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              {!props.graph && (
                <GraphQLSearchField
                  label="Graph"
                  name="graph"
                  description="What graph do you want to add this expression to?"
                  searchQuery={search}
                />
              )}
              <StringField
                label="Label"
                name="label"
                description="Human-readable name (e.g. 'Has fluorescence measurement')"
              />
              <StringField
                label="Key"
                name="key"
                description="Machine-readable key (auto-derived from label)"
              />
              <StringField
                label="Source identifier"
                name="source.identifier"
                description="Schema identifier of the structure being measured (e.g. '@mikro/roi')"
              />
              <GraphQLListSearchField
                name="target.keys"
                label="Target category filters"
                searchQuery={searchEntityC}
                additionalVariables={{ graph: props.graph }}
                description="Restrict which entity categories this measurement targets."
              />
              <GraphQLListSearchField
                name="target.keys"
                label="Target category filters"
                searchQuery={searchEntityC}
                additionalVariables={{ graph: props.graph }}
                description="Restrict which entity categories this measurement targets."
              />
              {showAdvanced && (
                <>
                  <ParagraphField
                    label="Description"
                    name="description"
                    description="What does this measurement category represent?"
                  />
                  <GraphQLListSearchField
                    name="target.tags"
                    label="Target tag filters"
                    searchQuery={searchTags}
                    description="Filter target entities by tags."
                  />
                  <GraphQLSearchField
                    label="Default target category"
                    name="target.defaultCategoryKey"
                    description="Fallback category key when no target entities match."
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

          <DialogFooter className="mt-2">
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default TForm;
