import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { enumToOptions } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  CreateProviderMutationVariables,
  ProviderKind,
  useCreateProviderMutation,
} from "../api/graphql";

export default () => {
  const [add] = useCreateProviderMutation();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateProviderMutationVariables["input"]>({
    defaultValues: {
      apiKey: "",
      kind: ProviderKind.Openai,
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
          <div className="grid grid-cols-1 gap-2">
            <StringField
              label="Api Key"
              name="apiKey"
              description="How do you can to call this Query?"
            />
            <ChoicesField
              label="Kind"
              name="kind"
              options={enumToOptions(ProviderKind)}
              description="What kind of the provider is it??"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Change</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
