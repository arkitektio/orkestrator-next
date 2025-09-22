import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import {
  CreateRedeemTokenMutationVariables,
  useCreateRedeemTokenMutation,
} from "../api/graphql";

export const CreateRedeemTokenForm = (props: { token?: string }) => {
  const [createRedeemToken] = useCreateRedeemTokenMutation();

  const cre = useGraphQlFormDialog(createRedeemToken);

  const form = useForm<CreateRedeemTokenMutationVariables["input"]>({
    defaultValues: {
      token: props.token || uuidv4(),
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
              {!props.token && (
                <StringField
                  label="The token"
                  name="token"
                  description="The token to create"
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
