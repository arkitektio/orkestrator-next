import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import {
  BaseCategoryFragment,
  ColumnKind,
  CreateGraphQueryMutationVariables,
  GraphFragment,
  MetricKind,
  useCreateGraphQueryMutation,
  useGetGraphQuery,
  ViewKind
} from "../api/graphql";
import { CypherField, CypherSchema } from "../components/cypher/CypherField";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { buildCypherSchemaFromGraph } from "../components/renderers/utils";








export default (props: { category: BaseCategoryFragment }) => {
  const [add] = useCreateGraphQueryMutation();

  const dialog = useGraphQlFormDialog(add);

  const { data } = useGetGraphQuery({
    variables: {
      id: props.category.graph.id,
    },
  });






  const form = useForm<CreateGraphQueryMutationVariables["input"]>({
    defaultValues: {
      query: `MATCH (n:${props.category.ageName})
RETURN id(n), n.__created_at`,
      description: "No Description",
      name: "New Step",
      kind: ViewKind.Table,
      graph: props.category.graph.id,
      columns: [
        {
          name: "id",
          label: "ID",
          description: "The id of the entity",
          kind: ColumnKind.Node,
          valueKind: MetricKind.String,
        },
        {
          name: "label",
          label: "ID",
          description: "The name of the entity",
          kind: ColumnKind.Value,
          valueKind: MetricKind.Datetime,
        },
      ],
      relevantFor: [props.category.id],
    },
  });

  const columnFieldArray = useFieldArray({
    control: form.control,
    name: "columns",
  });

  const kind = form.watch("kind");

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
            <ChoicesField
              label="Kind"
              name="kind"
              options={[
                { value: ViewKind.Table, label: "Table" },
                { value: ViewKind.Path, label: "Graph" },
                { value: ViewKind.Pairs, label: "Pairs" }
              ]}
            />

            {data && <CypherField
              label="Query"
              name="query"
              schema={buildCypherSchemaFromGraph(data.graph)}
              description="The Cypher query to execute"
            />}
            {kind == "TABLE" && (
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
              </div>)}
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Change</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
