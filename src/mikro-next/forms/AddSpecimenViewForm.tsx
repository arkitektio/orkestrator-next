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
  SpecimenViewInput,
  WellPositionViewInput,
  useAutoCreateMultiWellPlateMutation,
  useCreateSpecimenViewMutation,
  useCreateWellPositionViewMutation,
  useMultiWellPlateOptionsLazyQuery,
  useSearchProtocolStepsLazyQuery,
  useSearchSpecimensLazyQuery,
} from "../api/graphql";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";

export const AddSpecimenViewForm = (props: { image: string }) => {
  const [add] = useCreateSpecimenViewMutation();

  const [search] = useSearchSpecimensLazyQuery();
  const [searchP] = useSearchProtocolStepsLazyQuery();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<SpecimenViewInput>({
    defaultValues: {
      image: props.image,
      step: null,
      specimen: null,
    },
    resolver: yupResolver(
      yup.object().shape({
        image: yup.string().required(),
        step: yup.string().required(),
        specimen: yup.string().required(),
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
              name="specimen"
              label="Specimen"
              searchQuery={search}
              description="Which specimen is being monitored in this view?"
              placeholder="Specimen"
            />
            <GraphQLSearchField
              name="step"
              label="Protocol Step"
              searchQuery={searchP}
              description="Which Protocol Step corresponds to what you see?"
              placeholder="Step"
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
