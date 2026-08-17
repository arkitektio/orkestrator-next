import { useGraphQLDialog } from "@/app/hooks/useGraphQLDialog";
import { FreeformListField } from "@/components/fields/FreeformListField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { AutoDerivedStringField, StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreateMeasurementDefinitionInput,
  useCreateMeasurementCategoryMutation,
  useSearchGraphsLazyQuery,
} from "../api/graphql";
import { ageNameify, validateAgeName } from "./utils";

type StructureDescriptorFieldsProps = {
  prefix: "source";
  identifierDescription?: string;
  showAdvanced?: boolean;
};

const StructureDescriptorFields = ({
  prefix,
  identifierDescription,
  showAdvanced,
}: StructureDescriptorFieldsProps) => {
  return (
    <>
      <FreeformListField
        label="Source identifiers"
        name={`${prefix}.identifiers`}
        description={identifierDescription ?? "Structure identifiers to match for the source descriptor"}
        placeholder="Add an identifier"
      />
      {showAdvanced && (
        <>
          <StringField
            label="Default source category key"
            name={`${prefix}.defaultCategoryKey`}
            description="Fallback structure category key when no source structures match"
          />
        </>
      )}
    </>
  );
};

type EntityDescriptorFieldsProps = {
  prefix: "target";
  showAdvanced?: boolean;
};

const EntityDescriptorFields = ({
  prefix,
  showAdvanced,
}: EntityDescriptorFieldsProps) => {
  return (
    <>
      <FreeformListField
        name={`${prefix}.keys`}
        label="Target category keys"
        description="Entity category keys to match for the target descriptor"
        placeholder="Add a target category key"
      />
      {showAdvanced && (
        <>
          <FreeformListField
            name={`${prefix}.ontologyTerms`}
            label="Target ontology terms"
            description="Ontology terms to match for the target descriptor"
            placeholder="Add an ontology term"
          />
          <StringField
            label="Default target category key"
            name={`${prefix}.defaultCategoryKey`}
            description="Fallback entity category key when no target entities match"
          />
        </>
      )}
    </>
  );
};

const normalizeInput = (
  data: CreateMeasurementDefinitionInput,
): CreateMeasurementDefinitionInput => ({
  ...data,
  label: data.label || undefined,
  description: data.description || undefined,
  source: {
    ...data.source,
    identifiers: data.source.identifiers?.length ? data.source.identifiers : undefined,
    defaultCategoryKey: data.source.defaultCategoryKey || undefined,
  },
  target: {
    ...data.target,
    keys: data.target.keys?.length ? data.target.keys : undefined,
    ontologyTerms: data.target.ontologyTerms?.length ? data.target.ontologyTerms : undefined,
    defaultCategoryKey: data.target.defaultCategoryKey || undefined,
  },
});

const TForm = (props: { graph?: string; identifier?: string }) => {
  const [add] = useCreateMeasurementCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const submit = useGraphQLDialog(add, {
    successMessage: "Measurement Category created",
    errorPrefix: "Error creating Measurement Category",
  });

  const form = useForm<CreateMeasurementDefinitionInput>({
    defaultValues: {
      graph: props.graph ?? "",
      label: "",
      key: "",
      description: "",
      source: {
        identifiers: props.identifier ? [props.identifier] : [],
        defaultCategoryKey: "",
      },
      target: {
        keys: [],
        ontologyTerms: [],
        defaultCategoryKey: "",
      },
    },
  });

  const [search] = useSearchGraphsLazyQuery();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            await submit({ variables: { input: normalizeInput(data) } });
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
              <AutoDerivedStringField
                label="Key"
                name="key"
                sourceName="label"
                deriveValue={ageNameify}
                normalizeValue={ageNameify}
                validate={validateAgeName}
                description="AGE-name compatible key, auto-derived from label until manually changed"
              />
              <StructureDescriptorFields
                prefix="source"
                identifierDescription="Schema identifier of the structure being measured (e.g. '@mikro/arraydataset')"
                showAdvanced={showAdvanced}
              />
              <EntityDescriptorFields
                prefix="target"
                showAdvanced={showAdvanced}
              />
              {showAdvanced && (
                <>
                  <ParagraphField
                    label="Description"
                    name="description"
                    description="What does this measurement category represent?"
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
