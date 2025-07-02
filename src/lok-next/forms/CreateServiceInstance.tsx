import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateServiceInstanceInput,
  CreateUserDefinedServiceInstanceMutationVariables,
  FaktValueType,
  useCreateServiceInstanceMutation,
} from "../api/graphql";

export const CreateServiceInstanceForm = (props: { identifier?: string }) => {
  const [createServiceInstance] = useCreateServiceInstanceMutation();

  const cre = useGraphQlFormDialog(createServiceInstance);

  const form = useForm<CreateServiceInstanceInput>({
    defaultValues: {
      identifier: props.identifier,
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
          </div>
          <DialogFooter className="mt-2">
            <Button type="submit">Change</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
