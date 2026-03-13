import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { KraphGraphQuery } from "@/linkers";
import {
  useGetGraphTableQueryQuery,
  useUpdateGraphTableQueryMutation,
} from "../../api/graphql";

import { Button } from "@/components/ui/button";
import QueryBuilderGraph from "@/kraph/components/designer/QueryBuilderGraph";

const Page = asDetailQueryRoute(useGetGraphTableQueryQuery, ({ data, refetch }) => {
  const [update] = useUpdateGraphTableQueryMutation({
    refetchQueries: ["GetGraphTableQuery"],
  });

  const { data: graphData } = useGetGraphTableQueryQuery({
    variables: {
      id: data.graphTableQuery.graph.id,
    },
  });

  const pin = async () => {
    await update({
      variables: {
        input: {
          id: data.graphTableQuery.id,
          name: data.graphTableQuery.label,
          query: data.graphTableQuery.query,
        },
      },
    });
    await refetch();
  };

  if (!graphData?.graphTableQuery) {
    return <div>Loading graph data...</div>;
  }

  return (
    <KraphGraphQuery.ModelPage
      object={data.graphTableQuery.id}
      title={data.graphTableQuery.label}
      pageActions={
        <div className="flex flex-row gap-2">
          <KraphGraphQuery.ObjectButton object={data.graphTableQuery.id} />
          <Button
            onClick={() => {
              pin();
            }}
            className="w-full"
            variant="outline"
          >
            {data.graphTableQuery.pinned ? "Unpin" : "Pin"}
          </Button>
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KraphGraphQuery.Komments object={data.graphTableQuery.id} />,
          }}
        />
      }
    >
      <div className="grid grid-cols-12 gap-4 mb-4 h-full w-full">
        <div className="col-span-12 md:col-span-12">
          <QueryBuilderGraph
            graph={graphData.graph}
            graphQuery={data.graphTableQuery}
          />
        </div>
      </div>
    </KraphGraphQuery.ModelPage>
  );
});


export default Page;
