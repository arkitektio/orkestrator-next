import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateEntityMetricMutationVariables,
  EntityFragment,
  useCreateEntityMetricMutation,
  useSearchLinkedExpressionLazyQuery,
} from "../api/graphql";

export default (props: { entity: EntityFragment }) => {
  const [add] = useCreateEntityMetricMutation();

  const [search] = useSearchLinkedExpressionLazyQuery({
    variables: {
      graph: props.entity.linkedExpression.graph.id,
    },
  });

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateEntityMetricMutationVariables["input"]>({
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
              <StringField
                label="The Value"
                name="value"
                description="The value of the expression"
              />
              <GraphQLSearchField
                label="The metric"
                name="metric"
                description="The Expression Value"
                searchQuery={search}
              />
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
