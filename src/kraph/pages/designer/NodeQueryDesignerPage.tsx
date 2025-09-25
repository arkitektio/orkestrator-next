import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  ColumnFragment,
  ColumnInput,
  ColumnKind,
  MetricKind,
  UpdateNodeQueryMutationVariables,
  useGetGraphQuery,
  useGetNodeQueryQuery,
  useUpdateNodeQueryMutation,
  ViewKind,
} from "@/kraph/api/graphql";
import { CypherField } from "@/kraph/components/cypher/CypherField";
import { SelectiveNodeQueryRenderer } from "@/kraph/components/renderers/NodeQueryRenderer";
import { buildCypherSchemaFromGraph } from "@/kraph/components/renderers/utils";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export type IRepresentationScreenProps = {};

export const columnToInput = (column: ColumnFragment): ColumnInput => ({
  ...column,
  __typename: undefined,
});

const Page: React.FC<IRepresentationScreenProps> = asDetailQueryRoute(
  useGetNodeQueryQuery,
  ({ data, id }) => {
    const navigate = useNavigate();
    const [update] = useUpdateNodeQueryMutation();

    const params = useParams<{ node: string }>();

    const { data: graphdata } = useGetGraphQuery({
      variables: {
        id: data.nodeQuery.graph.id,
      },
    });

    const form = useForm<UpdateNodeQueryMutationVariables["input"]>({
      defaultValues: {
        id: data.nodeQuery.id,
        query: data.nodeQuery.query,
        description: data.nodeQuery.description || "No Description",
        name: data.nodeQuery.name,
        kind: data.nodeQuery.kind,
        graph: data.nodeQuery.graph.id,
        columns: data.nodeQuery.columns.map(columnToInput),
        testAgainst: params.node,
      },
    });

    const columnFieldArray = useFieldArray({
      control: form.control,
      name: "columns",
    });

    const kind = form.watch("kind");

    return (
      <PageLayout
        title={<>{data.nodeQuery.name} - Designer</>}
        pageActions={
          <div className="flex flex-row gap-2">
            <></>
          </div>
        }
      >
        <div className="grid grid-cols-12 h-full w-full">
          <div className="col-span-2 h-full px-2 bg-gray-900 rounded-lg py-4 border border-gray-800">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (data) => {
                  update({
                    variables: {
                      input: {
                        ...data,
                      },
                    },
                  });
                })}
              >
                <div className="grid grid-cols-1 gap-2 h-full justify-between">
                  <StringField
                    label="Name"
                    name="name"
                    description="How do you can to call this Query?"
                  />
                  <ParagraphField
                    label="Description"
                    name="description"
                    description="Provide a brief description of the query"
                  />

                  <ChoicesField
                    label="Kind"
                    name="kind"
                    options={[
                      { value: ViewKind.Table, label: "Table" },
                      { value: ViewKind.Path, label: "Graph" },
                      { value: ViewKind.Pairs, label: "Pairs" },
                      { value: ViewKind.NodeList, label: "Node List" },
                    ]}
                  />

                  {graphdata?.graph && (
                    <CypherField
                      label="Query"
                      name="query"
                      schema={buildCypherSchemaFromGraph(graphdata.graph)}
                      description="The Cypher query to execute"
                    />
                  )}
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
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2"
                  variant={"outline"}
                >
                  Render
                </Button>
              </form>
            </Form>
          </div>
          <div className="col-span-10 ml-2 h-full w-full">
            {params.node && (
              <SelectiveNodeQueryRenderer
                query={data.nodeQuery}
                node={params.node}
              />
            )}
          </div>
        </div>
      </PageLayout>
    );
  },
);

export default Page;
