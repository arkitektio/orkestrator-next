import { NotImplementedYet } from "@/app/components/fallbacks/NotImplemted";
import { useGraphQLDialog } from "@/app/hooks/useGraphQLDialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  MaskViewInput,
  useCreateMaskViewMutation
} from "../api/graphql";

export const AddMaskViewForm = (props: { image: string }) => {
  const [add] = useCreateMaskViewMutation();

  const submit = useGraphQLDialog(add, { successMessage: "Saved" });

  const form = useForm<MaskViewInput>({
    defaultValues: {
      image: props.image,
    },
    resolver: yupResolver(
      yup.object().shape({
        image: yup.string().required(),
      }),
    ),
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            submit({
              variables: {
                input: {
                  ...data,
                },
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <NotImplementedYet />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
