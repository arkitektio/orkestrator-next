import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { KraphGraphQuery } from "@/linkers";
import {
  useGetGraphQueryQuery,
  useUpdateGraphQueryMutation,
  useGetGraphQuery,
} from "../../api/graphql";

import { Button } from "@/components/ui/button";
import QueryBuilderGraph from "@/kraph/components/designer/QueryBuilderGraph";

export default asDetailQueryRoute(useGetGraphQueryQuery, ({ data, refetch }) => {
  const [update] = useUpdateGraphQueryMutation({
    refetchQueries: ["GetGraphQuery"],
  });

  const { data: graphData } = useGetGraphQuery({
    variables: {
      id: data.graphQuery.graph.id,
    },
  });

  const pin = async () => {
    await update({
      variables: {
        input: {
          id: data.graphQuery.id,
          name: data.graphQuery.name,
          query: data.graphQuery.query,
          kind: data.graphQuery.kind,
          graph: data.graphQuery.graph.id,
          pin: !data.graphQuery.pinned,
        },
      },
    });
    await refetch();
  };

  if (!graphData?.graph) {
    return <div>Loading graph data...</div>;
  }

  return (
    <KraphGraphQuery.ModelPage
      object={data.graphQuery.id}
      title={data.graphQuery.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <KraphGraphQuery.ObjectButton object={data.graphQuery.id} />
          <Button
            onClick={() => {
              pin();
            }}
            className="w-full"
            variant="outline"
          >
            {data.graphQuery.pinned ? "Unpin" : "Pin"}
          </Button>
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KraphGraphQuery.Komments object={data.graphQuery.id} />,
          }}
        />
      }
    >
      <div className="grid grid-cols-12 gap-4 mb-4 h-full w-full">
        <div className="col-span-12 md:col-span-12">
          <QueryBuilderGraph
            graph={graphData.graph}
            graphQuery={data.graphQuery}
          />
        </div>
      </div>
    </KraphGraphQuery.ModelPage>
  );
});
