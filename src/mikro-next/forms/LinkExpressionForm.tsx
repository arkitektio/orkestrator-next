import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateGraphMutationVariables,
  CreateProtocolStepMutationVariables,
  LinkExpressionMutation,
  LinkExpressionMutationVariables,
  useCreateGraphMutation,
  useCreateProtocolStepMutation,
  useLinkExpressionMutation,
  useSearchExpressionLazyQuery,
  useSearchGraphsLazyQuery,
  useSearchLinkedExpressionLazyQuery,
  useSearchLinkedExpressionQuery,
} from "../api/graphql";
import { ParagraphField } from "@/components/fields/ParagraphField";

export default (props: { expression?: string; graph?: string }) => {
  const [add] = useLinkExpressionMutation();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<LinkExpressionMutationVariables["input"]>({
    defaultValues: {
      expression: props.expression,
      graph: props.graph,
    },
  });

  const [search] = useSearchGraphsLazyQuery();
  const [searchExpression] = useSearchExpressionLazyQuery();

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
            <div className="text-lg font-bold">Link Expression</div>

            <div className="col-span-2 flex-col gap-1 flex">
              {props.expression && (
                <GraphQLSearchField name="graph" searchQuery={search} />
              )}
              {props.graph && (
                <GraphQLSearchField
                  name="expression"
                  searchQuery={searchExpression}
                />
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
