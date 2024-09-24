import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
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
  useSearchGraphsLazyQuery,
  useSearchProtocolStepsLazyQuery,
} from "../api/graphql";

export const AddSpecimenViewForm = (props: { image: string }) => {
  const [add] = useCreateSpecimenViewMutation();

  const [search] = useSearchEntitiesLazyQuery();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<SpecimenViewInput>({
    defaultValues: {
      image: props.image,
      entity: null,
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
            <GraphQLSearchField
              name="entity"
              label="Entity"
              searchQuery={search}
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
