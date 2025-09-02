import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { KraphGraph, KraphGraphQuery, KraphGraphView } from "@/linkers";
import { useGetGraphQueryQuery } from "../api/graphql";

import { Card } from "@/components/ui/card";
import { CypherEditor } from "../components/cypher/CypherEditor";
import { SelectiveGraphQueryRenderer } from "../components/renderers/GraphQueryRenderer";
import { CypherSidebar } from "../components/sidebars/CypherSidebar";

export default asDetailQueryRoute(
  useGetGraphQueryQuery,
  ({ data, refetch }) => {
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
            <KraphGraphQuery.DetailLink object={data.graphQuery.id} subroute="designer">
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
              <KraphGraph.DetailLink object={data.graphQuery.graph.id} className={"text-slate-400 mr-2"}>
                {data.graphQuery.graph.name}
              </KraphGraph.DetailLink>{data.graphQuery.name}
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
      </KraphGraphQuery.ModelPage>
    );
  },
);
