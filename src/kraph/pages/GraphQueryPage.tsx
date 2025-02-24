import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { KraphGraph, KraphGraphQuery, KraphGraphView } from "@/linkers";
import { useGetGraphQueryQuery } from "../api/graphql";

import { PathGraph } from "../components/renderers/graph/KnowledgeGraph";
import { GraphTable } from "../components/renderers/table/GraphTable";

import ScatterPlot from "../components/charts/scatterplot/ScatterPlot";
import { CypherSidebar } from "../components/sidebars/CypherSidebar";

export default asDetailQueryRoute(useGetGraphQueryQuery, ({ data, refetch }) => {
  return (
    <KraphGraphQuery.ModelPage
      object={data.graphQuery.id}
      title={data.graphQuery.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <KraphGraph.DetailLink object={data.graphQuery.ontology.id} subroute="entities">
            <Button variant="outline" size="sm">
              Graph
            </Button>
          </KraphGraph.DetailLink>
          <KraphGraphQuery.DetailLink
            object={data.graphQuery.id}
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
            Comments: <KraphGraphView.Komments object={data.graphQuery.id} />,
            Cypher: <CypherSidebar cypher={data.graphQuery.query || ""} />,
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
        {data.graphView.query.scatterPlots.map((scatterPlot) => (
          <ScatterPlot scatterPlot={scatterPlot} table={data.graphView.render}/>
        ))}
</div>
<GraphTable table={data.graphView.render} /></>
          
        )}
      </div>
    </KraphGraphQuery.ModelPage>
  );
});
