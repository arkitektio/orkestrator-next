import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import {
  ColumnKind,
  CreateGraphQueryMutationVariables,
  MetricKind,
  StructureRelationCategoryFragment,
  useCreateGraphQueryMutation,
  ViewKind
} from "../api/graphql";
import { CypherField } from "../components/cypher/CypherField";

export const TForm = (props: {
  category: StructureRelationCategoryFragment;
}) => {
  const [add] = useCreateGraphQueryMutation();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateGraphQueryMutationVariables["input"]>({
    defaultValues: {
      query: `MATCH (n)-[r]->(m)
WHERE r.__category_id = ${props.category.id}
RETURN n, r, m`,
      description: "No Description",
      name: "New Step",
      kind: ViewKind.Pairs,
      graph: props.category.graph.id,
      relevantFor: [props.category.id],
    },
  });

  const columnFieldArray = useFieldArray({
    control: form.control,
    name: "columns",
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
          <div className="grid grid-cols-1 gap-2">
            <StringField
              label="Name"
              name="name"
              description="How do you can to call this Query?"
            />
            <CypherField
              label="Query"
              name="query"
              description="The Cypher query to execute"
            />
            <div className="flex flex-row gap-4 w-full">
              {columnFieldArray.fields.map((item, index) => (
                <Card
                  key={item.id}
                  className="gap-2 flex-col flex group p-2 min-w-lg"
                >
                  <StringField
                    name={`columns.${index}.name`}
                    label="Role"
                    description="Which role does the entity play?"
                  />
                  <div className="group-hover:block group-hover:opacity-100 opacity-0 transition-opacity hidden">
                    <Button
                      type="button"
                      onClick={() => columnFieldArray.remove(index)}
                      variant={"destructive"}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
              <Button
                className="h-full max-w-xs"
                type="button"
                onClick={() =>
                  columnFieldArray.append({
                    name: "",
                    description: "",
                    kind: ColumnKind.Node,
                    valueKind: MetricKind.String,
                  })
                }
                variant={"ghost"}
              >
                +
              </Button>
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

export default TForm;
