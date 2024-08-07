import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";
import { IntField } from "@/components/fields/IntField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  WellPositionViewInput,
  useAutoCreateMultiWellPlateMutation,
  useCreateWellPositionViewMutation,
  useMultiWellPlateOptionsLazyQuery,
} from "../api/graphql";

export const AddMultiPositionViewForm = (props: { image: string }) => {
  const [add] = useCreateWellPositionViewMutation();

  const [search] = useMultiWellPlateOptionsLazyQuery();
  const [create] = useAutoCreateMultiWellPlateMutation();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<WellPositionViewInput>({
    defaultValues: {
      image: props.image,
      row: 0,
      column: 0,
    },
    resolver: yupResolver(
      yup.object().shape({
        row: yup.number().required(),
        column: yup.number().required(),
        image: yup.string().required(),
        well: yup.string().required(),
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
            <GraphQLCreatableSearchField
              name="well"
              label="Well"
              searchQuery={search}
              createMutation={create}
              description="Which stage for the well?"
              placeholder="Fluorophore"
            />
            <div className="col-span-2">
              <IntField
                label="Row"
                name="row"
                description="The wor of the well"
              />
              <IntField
                label="Col"
                name="column"
                description="The wor of the well"
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
