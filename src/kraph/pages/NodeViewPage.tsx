import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { KraphGraph, KraphNodeQuery, KraphNodeView } from "@/linkers";
import { useGetNodeViewQuery } from "../api/graphql";

import { PathGraph } from "../components/renderers/graph/KnowledgeGraph";
import { GraphTable } from "../components/renderers/table/GraphTable";
import { Editor } from "@monaco-editor/react";
import { CypherEditor } from "../components/cypher/CypherEditor";
import { CypherSidebar } from "../components/sidebars/CypherSidebar";

export default asDetailQueryRoute(useGetNodeViewQuery, ({ data, refetch }) => {
  return (
    <KraphNodeView.ModelPage
      object={data.nodeView.id}
      title={data.nodeView.query.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <KraphGraph.DetailLink object={data.nodeView.id} subroute="entities">
            <Button variant="outline" size="sm">
              Graph
            </Button>
          </KraphGraph.DetailLink>
          <KraphNodeQuery.DetailLink
            object={data.nodeView.query.id}
            subroute="entities"
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
            Comments: <KraphNodeView.Komments object={data.nodeView.id} />,
            Cypher: <CypherSidebar cypher={data.nodeView.query.query || ""} />,
          }}
        />
      }
    >
      <div className="grid md:grid-cols-12 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
        <div className="col-span-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data.nodeView.label}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            {data.nodeView.id} {data.nodeView.render.__typename}
          </p>
        </div>
      </div>
      <div className="p-6 h-full">
        {data.nodeView.render.__typename === "Pairs" && (
          <div>Pair Rendering</div>
        )}

        {data.nodeView.render.__typename === "Path" && (
          <PathGraph path={data.nodeView.render} />
        )}

        {data.nodeView.render.__typename === "Table" && (
          <GraphTable table={data.nodeView.render} />
        )}
      </div>
    </KraphNodeView.ModelPage>
  );
});
