import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  SpecimenViewInput,
  useCreateSpecimenViewMutation,
  useSearchEntitiesLazyQuery,
} from "../api/graphql";
import { EntitySearchField } from "../components/fields/EntitySearchField";

export const AddSpecimenViewForm = (props: { image: string }) => {
  const [add] = useCreateSpecimenViewMutation();

  const [search] = useSearchEntitiesLazyQuery();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<SpecimenViewInput>({
    defaultValues: {
      image: props.image,
    },
    resolver: yupResolver(
      yup.object().shape({
        image: yup.string().required(),
        entity: yup.string().required(),
      }),
    ),
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
          <div className="grid grid-cols-2 gap-2">
            <EntitySearchField
              name="entity"
              label="Entity"
              description="Which entity is being imaged?"
              placeholder="Entity"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
