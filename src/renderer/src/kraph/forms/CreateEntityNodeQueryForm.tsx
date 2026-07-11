import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import {
  ColumnKind,
  CreateNodeTableQueryMutationVariables,
  EntityFragment,
  ValueKind,
  useCreateNodeTableQueryMutation,
  useGetGraphQuery,
} from "../api/graphql";
import { CypherField } from "../components/cypher/CypherField";
import { buildCypherSchemaFromGraph } from "../components/renderers/utils";

// Note: the backend now only supports creating node *table* queries
// (`createNodeTableQuery`) — the previous generic `createNodeQuery` mutation
// that could target Path/Pairs view kinds has been removed from the schema,
// so the kind selector has been dropped here.
export default (props: { entity: EntityFragment }) => {
  const [add] = useCreateNodeTableQueryMutation();

  const { data } = useGetGraphQuery({
    variables: {
      id: props.entity.graph.id,
    },
  });

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateNodeTableQueryMutationVariables["input"]>({
    defaultValues: {
      query: `MATCH (n:${props.entity.category.ageName})
WHERE id(n) = %s
RETURN id(n), n.__created_at`,
      description: "No Description",
      name: "New Step",
      key: "new_step",
      graph: props.entity.graph.id,
      columnInput: [
        {
          key: "id",
          label: "ID",
          description: "The id of the entity",
          kind: ColumnKind.Node,
          valueKind: ValueKind.String,
          type: ValueKind.String,
        },
        {
          key: "label",
          label: "Label",
          description: "The name of the entity",
          kind: ColumnKind.Value,
          valueKind: ValueKind.Datetime,
          type: ValueKind.Datetime,
        },
      ],
    },
  });

  const columnFieldArray = useFieldArray({
    control: form.control,
    name: "columnInput",
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
            <StringField
              label="Key"
              name="key"
              description="Unique key for this node query"
            />
            {data && (
              <CypherField
                label="Query"
                name="query"
                schema={buildCypherSchemaFromGraph(data.graph)}
                description="The Cypher query to execute"
              />
            )}
            <div className="flex flex-row gap-4 w-full">
              {columnFieldArray.fields.map((item, index) => (
                <Card
                  key={item.id}
                  className="gap-2 flex-col flex group p-2 min-w-lg"
                >
                  <StringField
                    name={`columnInput.${index}.key`}
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
                    key: "",
                    description: "",
                    kind: ColumnKind.Node,
                    valueKind: ValueKind.String,
                    type: ValueKind.String,
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
