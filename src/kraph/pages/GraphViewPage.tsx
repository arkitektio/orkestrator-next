import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { KraphGraph, KraphGraphQuery, KraphGraphView } from "@/linkers";
import { useGetGraphViewQuery } from "../api/graphql";

import { PathGraph } from "../components/renderers/graph/KnowledgeGraph";
import { GraphTable } from "../components/renderers/table/GraphTable";

import Editor from "@monaco-editor/react";
import { CypherEditor } from "../components/cypher/CypherEditor";
import { CypherSidebar } from "../components/sidebars/CypherSidebar";
import ScatterPlot from "../components/charts/scatterplot/ScatterPlot";

export default asDetailQueryRoute(useGetGraphViewQuery, ({ data, refetch }) => {
  return (
    <KraphGraphView.ModelPage
      object={data.graphView.id}
      title={data.graphView.query.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <KraphGraph.DetailLink object={data.graphView.id} subroute="entities">
            <Button variant="outline" size="sm">
              Graph
            </Button>
          </KraphGraph.DetailLink>
          <KraphGraphQuery.DetailLink
            object={data.graphView.query.id}
            subroute="entities"
          >
            <Button variant="outline" size="sm">
              Edit Query
            </Button>
          </KraphGraphQuery.DetailLink>
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KraphGraphView.Komments object={data.graphView.id} />,
            Cypher: <CypherSidebar cypher={data.graphView.query.query || ""} />,
          }}
        />
      }
    >
      <div className="grid md:grid-cols-12 gap-4 md:gap-8 xl:gap-20 md:items-center px-6 py-2">
        <div className="col-span-5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data.graphView.label}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            <KraphGraph.DetailLink object={data.graphView.graph.id}>
              {data.graphView.graph.name}
            </KraphGraph.DetailLink>
          </p>
        </div>
      </div>

      <div className="p-6 h-full">
        {data.graphView.render.__typename === "Pairs" && (
          <div>Pair Rendering</div>
        )}

        {data.graphView.render.__typename === "Path" && (
          <PathGraph path={data.graphView.render} />
        )}

        {data.graphView.render.__typename === "Table" && (
          <>
            <div className="p-6">
              {data.graphView.plotViews.map((view) => (
                <ScatterPlot
                  scatterPlot={view.plot}
                  table={data.graphView.render}
                />
              ))}
            </div>
            <GraphTable table={data.graphView.render} />
          </>
        )}
      </div>
    </KraphGraphView.ModelPage>
  );
});
