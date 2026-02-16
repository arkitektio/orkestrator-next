import { FormDialog, useFormDialog } from "@/components/dialog/FormDialog";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  CreateMeasurementCategoryMutationVariables,
  CreateMetricCategoryMutationVariables,
  ValueKind,
} from "@/kraph/api/graphql";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useOntologyGraph } from "../OntologyGraphProvider";
import { labelToEdgeAgeName } from "../utils";

export const SelfMeasurementForm = (props: {}) => {
  const run = useFormDialog();

  const form = useForm<CreateMetricCategoryMutationVariables["input"]>({
    defaultValues: {
      label: "",
      description: "",
      kind: ValueKind.Float,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            run.onSubmit(data);
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              <StringField
                label="Label"
                name="label"
                description="Add a label"
              />

              <ParagraphField
                label="Description"
                name="description"
                description="Add a description"
              />

              <ChoicesField
                label="Data Kind"
                name="kind"
                description="Select a data kind"
                options={[
                  { label: "Float", value: ValueKind.Float },
                  { label: "Integer", value: ValueKind.Int },
                  { label: "String", value: ValueKind.String },
                ]}
              />

              <DialogFooter>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export const SelfMeasurementButton = (props: { self: string }) => {
  const { addStagingEdge } = useOntologyGraph();

  const onSubmitGeneric = (
    data: CreateMeasurementCategoryMutationVariables["input"],
  ) => {
    addStagingEdge({
      data: data,
      ageName: labelToEdgeAgeName(data.label),
      type: "measurement",
      source: props.self,
      target: props.self,
    });
  };

  return (
    <FormDialog
      trigger={
        <Button
          className={cn("w-full px-4 hidden")}
          variant={"outline"}
          size="sm"
        >
          Add
        </Button>
      }
      onSubmit={onSubmitGeneric}
      onError={props.onCancel}
    >
      <SelfMeasurementForm />
    </FormDialog>
  );
};
