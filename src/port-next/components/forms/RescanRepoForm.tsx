import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  CreateGithubRepoMutationVariables,
  useRescanReposMutation,
} from "@/port-next/api/graphql";
import { withPort } from "@jhnnsrs/port-next";
import { useForm } from "react-hook-form";

const TheForm = () => {
  const [rescan] = withPort(useRescanReposMutation)();

  const dialog = useGraphQlFormDialog(rescan);

  const form = useForm<CreateGithubRepoMutationVariables>({
    defaultValues: {},
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog();
          })}
        >
          <div className="grid grid-cols-2 gap-2">Rescan all repos</div>

          <DialogFooter className="mt-2">
            <Button type="submit">Yes</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default TheForm;
