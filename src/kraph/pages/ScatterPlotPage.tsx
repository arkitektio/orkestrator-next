import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Button } from "@/components/ui/button";
import { KraphGraphQuery, KraphScatterPlot } from "@/linkers";
import { useGetScatterPlotQuery } from "../api/graphql";

import { useParams } from "react-router-dom";
import ScatterPlot from "../components/charts/scatterplot/ScatterPlot";

export default asDetailQueryRoute(
  useGetScatterPlotQuery,
  ({ data, refetch }) => {
    const params = useParams<{ node: string }>();

    return (
      <KraphScatterPlot.ModelPage
        object={data.scatterPlot.id}
        title={data.scatterPlot.name}
        pageActions={
          <div className="flex flex-row gap-2">
            <KraphGraphQuery.DetailLink object={data.scatterPlot.query.id}>
              <Button variant="outline" size="sm">
                Query
              </Button>
            </KraphGraphQuery.DetailLink>
          </div>
        }
      >
        <div className="flex-initial grid md:grid-cols-12 gap-4 md:gap-8 xl:gap-20 md:items-center px-6 py-2">
          <div className="col-span-5">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.scatterPlot.name}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              <KraphGraphQuery.DetailLink object={data.scatterPlot.query.id}>
                {data.scatterPlot.query.name}
              </KraphGraphQuery.DetailLink>
            </p>
          </div>
        </div>
        <div className="flex-grow ">
          {data.scatterPlot.query.render.__typename == "Table" && (
            <ScatterPlot
              table={data.scatterPlot.query.render}
              scatterPlot={data.scatterPlot}
              enableMultiselect
            />
          )}
        </div>
      </KraphScatterPlot.ModelPage>
    );
  },
);
