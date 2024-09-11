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

export default (props: { ontology?: string }) => {
  const [add] = useCreateExpressionMutation();

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
                options={[
                  {
                    label: "Entity",
                    value: "ENTITY",
                    description:
                      "An entity is a thing or concept that can be distinguished from other things.",
                  },
                  {
                    label: "Relation",
                    value: "RELATION",
                    description:
                      "A relation is a connection between two entities.",
                  },
                ]}
              />

              {currentKind === "METRIC" && (
                <>
                  <ChoicesField
                    label="Data Kind"
                    name="kind"
                    description="What kind of value type do you expect for this metric?"
                    options={[
                      {
                        label: "Bool",
                        value: MetricDataType.Boolean,
                        description:
                          "A boolean is a value that can be either true or false.",
                      },
                      {
                        label: "Float",
                        value: MetricDataType.Float,
                        description:
                          "A float is a number that can have a decimal point.",
                      },
                    ]}
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
