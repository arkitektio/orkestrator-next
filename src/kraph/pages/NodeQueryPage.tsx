import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { KraphGraph, KraphGraphView, KraphNodeQuery } from "@/linkers";
import { useGetNodeQueryQuery } from "../api/graphql";

import { CypherSidebar } from "../components/sidebars/CypherSidebar";
import { useParams } from "react-router-dom";
import { string } from "zod";
import {
  SelectiveNodeQueryRenderer,
  SelectiveNodeViewRenderer,
} from "../components/renderers/NodeQueryRenderer";

export default asDetailQueryRoute(useGetNodeQueryQuery, ({ data, refetch }) => {
  const params = useParams<{ node: string }>();

  return (
    <KraphNodeQuery.ModelPage
      object={data.nodeQuery.id}
      title={data.nodeQuery.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <KraphGraph.DetailLink
            object={data.nodeQuery.graph.id}
            subroute="entities"
          >
            <Button variant="outline" size="sm">
              Graph
            </Button>
          </KraphGraph.DetailLink>
          <KraphNodeQuery.DetailLink
            object={data.nodeQuery.id}
            subroute="node"
            subobject={params.node || ""}
            deeproute="designer"
          >
            <Button variant="outline" size="sm">
              Edit Query
            </Button>
          </KraphNodeQuery.DetailLink>
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KraphGraphView.Komments object={data.nodeQuery.id} />,
            Cypher: <CypherSidebar cypher={data.nodeQuery.query || ""} />,
          }}
        />
      }
    >
      <div className="grid md:grid-cols-12 gap-4 md:gap-8 xl:gap-20 md:items-center px-6 py-2">
        <div className="col-span-5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data.nodeQuery.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            <KraphGraph.DetailLink object={data.nodeQuery.id}>
              {data.nodeQuery.name}
            </KraphGraph.DetailLink>
          </p>
        </div>
      </div>
      <div className="min-h-full min-w-full ">
        {params.node && (
          <SelectiveNodeQueryRenderer
            query={data.nodeQuery}
            node={params.node}
          />
        )}
      </div>
    </KraphNodeQuery.ModelPage>
  );
});
