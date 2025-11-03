import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { KraphGraph, KraphGraphQuery, KraphGraphView } from "@/linkers";
import {
  useGetGraphQueryQuery,
  usePinGraphQueryMutation,
  ViewKind,
} from "../api/graphql";

import { Card } from "@/components/ui/card";
import { CypherEditor } from "../components/cypher/CypherEditor";
import { SelectiveGraphQueryRenderer } from "../components/renderers/GraphQueryRenderer";
import { CypherSidebar } from "../components/sidebars/CypherSidebar";
import { FormDialog } from "@/components/dialog/FormDialog";
import CreateScatterPlotForm from "../forms/CreateScatterPlotForm";
import ScatterPlot from "../components/charts/scatterplot/ScatterPlot";
import { Plus } from "lucide-react";

export default asDetailQueryRoute(
  useGetGraphQueryQuery,
  ({ data, refetch }) => {
    const [pin] = usePinGraphQueryMutation({
      onCompleted: () => {
        refetch();
      },
    });

    return (
      <KraphGraphQuery.ModelPage
        object={data.graphQuery.id}
        title={data.graphQuery.name}
        pageActions={
          <div className="flex flex-row gap-2">
            <KraphGraph.DetailLink
              object={data.graphQuery.graph.id}
              subroute="entities"
            >
              <Button variant="outline" size="sm">
                Graph
              </Button>
            </KraphGraph.DetailLink>
            <Button
              onClick={() => {
                pin({
                  variables: {
                    input: {
                      id: data.graphQuery.id,
                      pin: !data.graphQuery.pinned,
                    },
                  },
                });
              }}
              size="sm"
              variant={"outline"}
            >
              {data.graphQuery.pinned ? "Unpin" : "Pin"}
            </Button>

            <KraphGraphQuery.DetailLink
              object={data.graphQuery.id}
              subroute="designer"
            >
              <Button variant="outline" size="sm">
                Edit Query
              </Button>
            </KraphGraphQuery.DetailLink>
            <KraphGraphQuery.ObjectButton object={data.graphQuery.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <KraphGraphView.Komments object={data.graphQuery.id} />,
              Cypher: <CypherSidebar cypher={data.graphQuery.query || ""} />,
            }}
          />
        }
      >
        <div className="grid md:grid-cols-12 gap-4 md:gap-8 xl:gap-20 md:items-center px-6 py-2">
          <div className="col-span-5">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              <KraphGraph.DetailLink
                object={data.graphQuery.graph.id}
                className={"text-slate-400 mr-2"}
              >
                {data.graphQuery.graph.name}
              </KraphGraph.DetailLink>
              {data.graphQuery.name}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.graphQuery.description || "No Description"}
            </p>
          </div>
          <Card className="p-6 h-96 col-span-7">
            <CypherEditor cypher={data.graphQuery.query} />
          </Card>
        </div>

        <SelectiveGraphQueryRenderer graphQuery={data.graphQuery} />

        {/* Scatter Plots Section - Only show for Table views */}
        {data.graphQuery.kind === ViewKind.Table &&
          data.graphQuery.render.__typename === "Table" && (() => {
            const tableRender = data.graphQuery.render;
            if (tableRender.__typename !== "Table") return null;

            return (
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Visualizations</h2>
                  <FormDialog
                    trigger={
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Plot
                      </Button>
                    }
                  >
                    <CreateScatterPlotForm graphQuery={data.graphQuery} />
                  </FormDialog>
                </div>

                {/* Display existing scatter plots */}
                {data.graphQuery.scatterPlots.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {data.graphQuery.scatterPlots.map((plot) => (
                      <ScatterPlot
                        key={plot.id}
                        scatterPlot={plot}
                        table={tableRender}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    No scatter plots yet. Create one to visualize your data.
                  </Card>
                )}
              </div>
            );
          })()}
      </KraphGraphQuery.ModelPage>
    );
  },
);
