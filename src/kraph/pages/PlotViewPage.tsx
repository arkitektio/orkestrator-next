import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import {
  KraphGraph,
  KraphGraphQuery,
  KraphGraphView,
  KraphPlotView,
} from "@/linkers";
import { useGetGraphViewQuery, useGetPlotViewQuery } from "../api/graphql";

import { PathGraph } from "../components/renderers/graph/KnowledgeGraph";
import { GraphTable } from "../components/renderers/table/GraphTable";

import Editor from "@monaco-editor/react";
import { CypherEditor } from "../components/cypher/CypherEditor";
import { CypherSidebar } from "../components/sidebars/CypherSidebar";
import ScatterPlot from "../components/charts/scatterplot/ScatterPlot";

export default asDetailQueryRoute(useGetPlotViewQuery, ({ data, refetch }) => {
  return (
    <KraphPlotView.ModelPage
      object={data.plotView.id}
      title={data.plotView.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <KraphGraphView.DetailLink
            object={data.plotView.view.id}
            subroute="entities"
          >
            <Button variant="outline" size="sm">
              Table
            </Button>
          </KraphGraphView.DetailLink>
          <KraphGraphQuery.DetailLink
            object={data.plotView.plot.id}
            subroute="entities"
          >
            <Button variant="outline" size="sm">
              Plot Definition
            </Button>
          </KraphGraphQuery.DetailLink>
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KraphPlotView.Komments object={data.plotView.id} />,
          }}
        />
      }
    >
      <div className="grid md:grid-cols-12 gap-4 md:gap-8 xl:gap-20 md:items-center px-6 py-2">
        <div className="col-span-5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data.plotView.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            <KraphGraphView.DetailLink object={data.plotView.view.id}>
              {data.plotView.view.name}
            </KraphGraphView.DetailLink>
          </p>
        </div>
      </div>

      <div className="p-6 h-full">
        <ScatterPlot
          scatterPlot={data.plotView.plot}
          table={data.plotView.view.render}
        />
      </div>
    </KraphPlotView.ModelPage>
  );
});
