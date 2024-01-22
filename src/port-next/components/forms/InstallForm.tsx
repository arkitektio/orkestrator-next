import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  CreateClientMutationVariables,
  useCreateClientMutation,
} from "@/lok-next/api/graphql";
import {
  ReleaseFragment,
  useCreateSetupMutation,
} from "@/port-next/api/graphql";
import { withLokNext } from "@jhnnsrs/lok-next";
import { withPort } from "@jhnnsrs/port-next";
import { useForm } from "react-hook-form";

const TheForm = ({ release }: { release: ReleaseFragment }) => {
  const [createSetup] = withPort(useCreateSetupMutation)();
  const [createToken] = withLokNext(useCreateClientMutation)();

  const dialog = useGraphQlFormDialog(createSetup);

  const form = useForm<CreateClientMutationVariables>({
    defaultValues: {
      scopes: release.scopes,
      version: release.version,
      identifier: release.app.identifier,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            const answer = await createToken({
              variables: data,
            });

            const token = answer.data?.createDevelopmentalClient;

            if (!token) {
              return;
            }

            dialog({
              variables: {
                faktsToken: token,
                release: release.id,
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            Do you want to install {release.app.identifier} {release.version}?
            It will be installed on the following scopes:{" "}
            {release.scopes.join(", ")}
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Install</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default TheForm;
