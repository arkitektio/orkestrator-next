import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { KraphGraph, KraphGraphQuery, KraphGraphView, KraphOntology } from "@/linkers";
import { useGetGraphQueryQuery } from "../api/graphql";

import { PathGraph } from "../components/renderers/graph/KnowledgeGraph";
import { GraphTable } from "../components/renderers/table/GraphTable";

import ScatterPlot from "../components/charts/scatterplot/ScatterPlot";
import { CypherSidebar } from "../components/sidebars/CypherSidebar";
import { CypherEditor } from "../components/cypher/CypherEditor";
import { Card } from "@/components/ui/card";

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
            {data.graphQuery.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            <KraphOntology.DetailLink object={data.graphQuery.ontology.id}>
              {data.graphQuery.ontology.name}
            </KraphOntology.DetailLink>
          </p>
        </div>
      </div>
      <Card className="p-6 h-96">
      <CypherEditor cypher={data.graphQuery.query}  />
      </Card>

      

    
    </KraphGraphQuery.ModelPage>
  );
});
