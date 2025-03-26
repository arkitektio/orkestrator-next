import { FormDialog, useFormDialog } from "@/components/dialog/FormDialog"
import { Button } from "@/components/ui/button"
import { CreateMeasurementCategoryMutationVariables, MeasurementKind, OntologyFragment } from "@/kraph/api/graphql";
import { cn } from "@/lib/utils"
import { StagingEdgeParams } from "../types";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { StringField } from "@/components/fields/StringField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { ListSearchField } from "@/components/fields/ListSearchField";
import { DialogFooter } from "@/components/ui/dialog";
import { labelToEdgeAgeName, labelToNodeAgeName } from "../utils";
import { add } from "date-fns";
import { useOntologyGraph } from "../OntologyGraphProvider";

 
export const SelfMeasurementForm = (props: {
}) => {
  const run = useFormDialog();

  const form = useForm<CreateMeasurementCategoryMutationVariables["input"]>({
    defaultValues: {
      label: "",
      kind: MeasurementKind.Float,
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
                  { label: "Float", value: MeasurementKind.Float },
                  { label: "Integer", value: MeasurementKind.Int },
                  { label: "String", value: MeasurementKind.String },
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





export const SelfMeasurementButton = (props: {
  self: string;
}) => {

  const {addStagingEdge} = useOntologyGraph();
 
  const onSubmitGeneric =  (
      data: CreateMeasurementCategoryMutationVariables["input"],
    ) => {
      addStagingEdge({
        data: data,
        ageName: labelToEdgeAgeName(data.label),
        type: "measurement",
        source: props.self,
        target: props.self
      });
    };
 
 return <FormDialog
          trigger={
            <Button className={cn("w-full px-4")} variant={"outline"} size="sm">
              Add
            </Button>
          }
          onSubmit={onSubmitGeneric}
          onError={props.onCancel}
        >
          <SelfMeasurementForm
          />
        </FormDialog>

}