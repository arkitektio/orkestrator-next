import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { KraphGraph, KraphGraphQuery, KraphGraphView } from "@/linkers";
import {
  useGetGraphTableQueryQuery,
} from "../api/graphql";

import { FormDialog } from "@/components/dialog/FormDialog";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import ScatterPlotCard from "../components/cards/ScatterPlotCard";
import { CypherSidebar } from "../components/sidebars/CypherSidebar";
import CreateScatterPlotForm from "../forms/CreateScatterPlotForm";
import { RenderGraphQueryTable } from "../components/renderers/table/GraphTable";

const Page =  asDetailQueryRoute(
  useGetGraphTableQueryQuery,
  ({ data, refetch }) => {

    const pin = async (variables: { input: { id: string; pin: boolean } }) => {
      // Implement the pinning logic here, e.g., call a mutation to update the pinned state
      // For example:
      // await updateGraphQueryPin(variables);
      // After updating, you might want to refetch the data to reflect the changes
      await refetch();
    }
    return (
      <KraphGraphQuery.ModelPage
        object={data.graphTableQuery.id}
        title={data.graphTableQuery.label}
        pageActions={
          <div className="flex flex-row gap-2">
            <KraphGraph.DetailLink
              object={data.graphTableQuery.graph.id}
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
                      id: data.graphTableQuery.id,
                      pin: !data.graphTableQuery.pinned,
                    },
                  },
                });
              }}
              size="sm"
              variant={"outline"}
            >
              {data.graphTableQuery.pinned ? "Unpin" : "Pin"}
            </Button>

            <KraphGraphQuery.DetailLink
              object={data.graphTableQuery.id}
              subroute="builder"
            >
              <Button variant="outline" size="sm">
                Builder
              </Button>
            </KraphGraphQuery.DetailLink>
            <FormDialog
              trigger={
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plot
                </Button>
              }
            >
              <CreateScatterPlotForm graphQuery={data.graphTableQuery} />
            </FormDialog>

            <KraphGraphQuery.DetailLink
              object={data.graphTableQuery.id}
              subroute="designer"
            >
              <Button variant="outline" size="sm">
                Designer
              </Button>
            </KraphGraphQuery.DetailLink>
            <KraphGraphQuery.ObjectButton object={data.graphTableQuery.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <KraphGraphView.Komments object={data.graphTableQuery.id} />,
              Cypher: <CypherSidebar cypher={data.graphTableQuery.query || ""} />,
              Plots: <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Visualizations</h2>

                </div>

                {/* Display existing scatter plots */}
                {data.graphTableQuery.scatterPlots.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {data.graphTableQuery.scatterPlots.map((plot) => (
                      <ScatterPlotCard key={plot.id} item={plot} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    No scatter plots yet. Create one to visualize your data.
                  </Card>
                )}
              </div>,
            }}
          />
        }
      >
        <div className="grid md:grid-cols-12 gap-4 md:gap-8 xl:gap-20 md:items-center px-6 py-2">
          <div className="col-span-5">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              <KraphGraph.DetailLink
                object={data.graphTableQuery.graph.id}
                className={"text-slate-400 mr-2"}
              >
                {data.graphTableQuery.graph.name}
              </KraphGraph.DetailLink>
              {data.graphTableQuery.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.graphTableQuery.description || "No Description"}
            </p>
          </div>
        </div>

        <RenderGraphQueryTable graphQuery={data.graphTableQuery.id} />



      </KraphGraphQuery.ModelPage>
    );
  },
);


export default Page;
