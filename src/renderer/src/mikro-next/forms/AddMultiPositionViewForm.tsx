import { useGraphQLDialog } from "@/app/hooks/useGraphQLDialog";
import { GraphQLCreatableSearchField } from "@/components/fields/GraphQLCreateableSearchField";
import { IntField } from "@/components/fields/IntField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  useAutoCreateMultiWellPlateMutation,
  useCreateWellPositionViewMutation,
  useMultiWellPlateOptionsLazyQuery,
} from "../api/graphql";

export const AddMultiPositionViewForm = (props: { image: string }) => {
  const [add] = useCreateWellPositionViewMutation();

  const [searchMultiWellPlateOptions] = useMultiWellPlateOptionsLazyQuery();
  const search = async (x: {
    variables: { search?: string; values?: string[] };
  }) => {
    const result = await searchMultiWellPlateOptions({
      variables: x.variables,
    });
    return {
      data: result.data
        ? {
          options: result.data.options.map((option) => ({
            value: option.value,
            label: option.label ?? option.value,
          })),
        }
        : undefined,
      errors: result.error ? [result.error] : undefined,
    };
  };
  const [create] = useAutoCreateMultiWellPlateMutation();

  const submit = useGraphQLDialog(add, { successMessage: "Saved" });

  const form = useForm({
    defaultValues: {
      image: props.image,
      row: 0,
      column: 0,
      well: "",
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
            submit({
              variables: {
                input: {
                  image: data.image,
                  row: data.row,
                  column: data.column,
                  well: data.well,
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
