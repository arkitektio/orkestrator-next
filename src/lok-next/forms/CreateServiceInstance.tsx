import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateUserDefinedServiceInstanceMutation,
  CreateUserDefinedServiceInstanceMutationFn,
  CreateUserDefinedServiceInstanceMutationVariables,
  FaktValueType,
  useCreateUserDefinedServiceInstanceMutation,
} from "../api/graphql";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";

export const CreateServiceInstanceForm = (props: { identifier?: string }) => {
  const [createServiceInstance] = useCreateUserDefinedServiceInstanceMutation();

  const cre = useGraphQlFormDialog(createServiceInstance);

  const form = useForm<
    CreateUserDefinedServiceInstanceMutationVariables["input"]
  >({
    defaultValues: {
      identifier: props.identifier,
      values: [],
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            console.log("dd");
            return await cre({
              variables: {
                input: data,
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2 w-full">
            <div className="col-span-2 flex-col gap-1 flex">
              {!props.identifier && (
                <StringField
                  label="Service identifier"
                  name="identifier"
                  description="The identifier of the service"
                />
              )}
            </div>
            <div className="grid cols-2 w-full">
              <div className="col-span-2">
                {form.watch("values")?.map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 mb-2 border-1 rounded rounded-md border p-3 border-gray-800"
                  >
                    <StringField
                      label="Key"
                      name={`values.${index}.key`}
                      description="The configuration key"
                    />
                    <StringField
                      label="Value"
                      name={`values.${index}.value`}
                      description="The configuration value"
                    />
                    <ChoicesField
                      label="Type"
                      name={`values.${index}.asType`}
                      options={[
                        { label: "String", value: FaktValueType.String },
                        { label: "Number", value: FaktValueType.Number },
                        { label: "Boolean", value: FaktValueType.Boolean },
                      ]}
                      description="The type of value"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        const values = form.getValues("values");
                        if (!values) {
                          return;
                        }
                        values.splice(index, 1);
                        form.setValue("values", values);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={() => {
                  const values = form.getValues("values") || [];
                  form.setValue("values", [
                    ...(values || []),
                    { key: "", value: "", asType: FaktValueType.String },
                  ]);
                }}
              >
                Add Value
              </Button>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button type="submit">Change</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
