import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateEntityMetricMutationVariables,
  CreateProtocolStepMutationVariables,
  EntityFragment,
  ProtocolStepKind,
  useCreateEntityMetricMutation,
  useCreateProtocolStepMutation,
  useSearchExpressionLazyQuery,
  useSearchExpressionQuery,
  useSearchLinkedExpressionLazyQuery,
  useSearchReagentsLazyQuery,
} from "../api/graphql";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { FloatField } from "@/components/fields/FloatField";
import { DateTimeField } from "@/components/fields/DateTimeField";

const options = [
  { value: ProtocolStepKind.Measurement, label: "Measurement" },
  { value: ProtocolStepKind.AddReagent, label: "Reagent" },
];

export default (props: { entity: EntityFragment }) => {
  const [add] = useCreateProtocolStepMutation();

  const [search] = useSearchExpressionLazyQuery({
    variables: {},
  });

  const [searchR] = useSearchReagentsLazyQuery({
    variables: {},
  });

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateProtocolStepMutationVariables["input"]>({
    defaultValues: {
      entity: props.entity.id,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                input: data,
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              <ChoicesField
                label="What type of task was performed?"
                name="kind"
                description="The Expression Value"
                options={options}
              />
              <StringField
                label="What was the name of the task?"
                name="name"
                description="The Expression Value"
              />

              <GraphQLSearchField
                label="What type of task was performed?"
                name="expression"
                description="The Expression Value"
                searchQuery={search}
              />

              <DateTimeField
                label="When was the task performed?"
                name="performedAt"
                description="The Expression Value"
              />

              {form.watch("kind") === ProtocolStepKind.AddReagent && (
                <>
                  <GraphQLSearchField
                    label="What type of reagent was used?"
                    name="usedReagent"
                    description="The Expression Value"
                    searchQuery={searchR}
                  />
                  <FloatField
                    label="How much was used?"
                    name="usedReagentVolume"
                    description="The Expression Value"
                  />
                </>
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
