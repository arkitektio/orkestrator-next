import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import {
  ColumnKind,
  CreateNodeQueryMutationVariables,
  MetricKind,
  StructureFragment,
  useCreateNodeQueryMutation,
  ViewKind,
} from "../api/graphql";
import { CypherField } from "../components/cypher/CypherField";

export default (props: { structure: StructureFragment }) => {
  const [add] = useCreateNodeQueryMutation();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateNodeQueryMutationVariables["input"]>({
    defaultValues: {
      query: `MATCH (n) <-[r: DESCRIBES]- (m)
WHERE id(n) = %s
RETURN id(m), head(labels(m)), m.__value`,
      description: "New Measurements",
      name: "Measurments",
      kind: ViewKind.Table,
      graph: props.structure.graph.id,
      columns: [
        {
          name: "rid",
          label: "ID",
          description: "The id of the measurmenet",
          kind: ColumnKind.Edge,
          valueKind: MetricKind.String,
        },
        {
          name: "mlabel",
          label: "Label",
          description: "The value of the entity",
          kind: ColumnKind.Value,
          valueKind: MetricKind.String,
        },
        {
          name: "mvalue",
          label: "Value",
          description: "The value of the entity",
          kind: ColumnKind.Value,
          valueKind: MetricKind.String,
        },
      ],
      testAgainst: props.structure.id,
      relevantFor: [props.structure.category.id],
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
