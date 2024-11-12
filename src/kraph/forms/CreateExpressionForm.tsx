import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateExpressionMutation,
  CreateExpressionMutationVariables,
  CreateGraphMutationVariables,
  CreateOntologyMutationVariables,
  CreateProtocolStepMutationVariables,
  ExpressionKind,
  MetricDataType,
  useCreateExpressionMutation,
  useCreateGraphMutation,
  useCreateOntologyMutation,
  useCreateProtocolStepMutation,
  useSearchLinkedExpressionLazyQuery,
  useSearchLinkedExpressionQuery,
  useSearchProtocolStepsLazyQuery,
} from "../api/graphql";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { ChoicesField } from "@/components/fields/ChoicesField";

const enumToOptions = (e: any) => {
  return Object.keys(e).map((key) => ({
    label: key,
    value: e[key],
  }));
};

export default (props: { ontology?: string }) => {
  const [add] = useCreateExpressionMutation({
    refetchQueries: ["GetOntology"],
  });

  const dialog = useGraphQlFormDialog(add);

  const search = useSearchProtocolStepsLazyQuery();

  const form = useForm<CreateExpressionMutationVariables["input"]>({
    defaultValues: {
      kind: ExpressionKind.Entity,
      ontology: props.ontology,
    },
  });

  const currentKind = form.watch("kind");

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
            <div className="col-span-2 flex-col gap-1 flex">
              <StringField
                label="Label"
                name="label"
                description="Whats the expression? (e.g. 'Person' or 'Connected to')"
              />
              <ParagraphField
                label="Description"
                name="description"
                description="What describes your expression the best? (e.g. 'A person is a human being')"
              />
              <StringField
                label="PURL"
                name="purl"
                description="What is the PURL of this expression?"
              />
              <ChoicesField
                label="Kind"
                name="kind"
                description="What kind of expression is this?"
                options={enumToOptions(ExpressionKind)}
              />

              {currentKind === "METRIC" && (
                <>
                  <ChoicesField
                    label="Data Kind"
                    name="metricKind"
                    description="What kind of value type do you expect for this metric?"
                    options={enumToOptions(MetricDataType)}
                  />
                </>
              )}
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
