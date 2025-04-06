import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import {
  KraphGraph,
  KraphGraphQuery,
  KraphGraphView,
  KraphNodeQuery,
  KraphOntology,
} from "@/linkers";
import {
  useGetGraphQueryQuery,
  useGetNodeQuery,
  useGetNodeQueryQuery,
  useGetNodeViewQuery,
} from "../api/graphql";

import { PathGraph } from "../components/renderers/graph/PathGraph";
import { GraphTable } from "../components/renderers/table/GraphTable";

import ScatterPlot from "../components/charts/scatterplot/ScatterPlot";
import { CypherSidebar } from "../components/sidebars/CypherSidebar";
import { CypherEditor } from "../components/cypher/CypherEditor";
import { Card } from "@/components/ui/card";
import { SelectiveGraphQueryRenderer } from "../components/renderers/GraphQueryRenderer";
import { useParams } from "react-router-dom";
import { SelectiveNodeViewRenderer } from "../components/renderers/NodeQueryRenderer";
import { useDebug } from "@/providers/debug/DebugContext";
import { DebugPage } from "@/app/components/fallbacks/DebugPage";

export default () => {
  const { debug } = useDebug();
  const { id, nodeid } = useParams<{ id: string; nodeid: string }>();
  if (!id || !nodeid) {
    return <>No ID and Node ID </>;
  }

  const { data } = useGetNodeViewQuery({
    variables: {
      query: id,
      nodeId: nodeid,
    },
  });

  if (debug) {
    return <DebugPage data={data} />;
  }

  if (!data) {
    return <>No Data</>;
  }

  return (
    <KraphNodeQuery.ModelPage
      object={data.nodeView.query.id}
      title={data.nodeView.query.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <KraphGraph.DetailLink
            object={data.nodeView.query.graph.id}
            subroute="entities"
          >
            <Button variant="outline" size="sm">
              Graph
            </Button>
          </KraphGraph.DetailLink>
          <KraphNodeQuery.DetailLink object={data.nodeView.query.id}>
            <Button variant="outline" size="sm">
              Edit Query
            </Button>
          </KraphNodeQuery.DetailLink>
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: (
              <KraphGraphView.Komments object={data.nodeView.query.id} />
            ),
            Cypher: <CypherSidebar cypher={data.nodeView.query.query || ""} />,
          }}
        />
      }
    >
      <div className="grid md:grid-cols-12 gap-4 md:gap-8 xl:gap-20 md:items-center px-6 py-2">
        <div className="col-span-5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data.nodeView.query.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            <KraphGraph.DetailLink object={data.nodeView.query.id}>
              {data.nodeView.query.name}
            </KraphGraph.DetailLink>
          </p>
        </div>
        <Card className="p-6 h-96 col-span-7">
          <CypherEditor cypher={data.nodeView.query.query} />
        </Card>
      </div>

      <SelectiveNodeViewRenderer view={data.nodeView} />
    </KraphNodeQuery.ModelPage>
  );
};
