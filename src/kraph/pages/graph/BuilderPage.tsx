import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { KraphGraph } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import {
  useGetGraphQuery,
  useMaterializeGraphMutation,
  useUpdateGraphMutation,
} from "../../api/graphql";

import { Button } from "@/components/ui/button";
import QueryBuilderGraph from "@/kraph/components/designer/QueryBuilderGraph";
import { UpdateGraphForm } from "../../forms/UpdateGraphForm";

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  const [update] = useUpdateGraphMutation({
    refetchQueries: ["GetGraph"],
  });

  const [materialize] = useMaterializeGraphMutation({
    refetchQueries: ["GetGraph"],
  });

  const pin = async () => {
    await update({
      variables: {
        input: {
          id: data.graph.id,
          pin: !data.graph.pinned,
        },
      },
    });
    await refetch();
  };

  return (
    <KraphGraph.ModelPage
      object={data.graph.id}
      title={data.graph.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <FormSheet
            trigger={
              <Button variant="outline">
                <HobbyKnifeIcon />
              </Button>
            }
          >
            {data?.graph && <UpdateGraphForm graph={data?.graph} />}
          </FormSheet>
          <KraphGraph.ObjectButton object={data.graph.id} />
          <Button
            onClick={() => {
              pin();
            }}
            className="w-full"
            variant="outline"
          >
            {data.graph.pinned ? "Unpin" : "Pin"}
          </Button>
          <Button
            onClick={() => {
              materialize({
                variables: { input: { id: data.graph.id } },
              });
            }}
            className="w-full"
            variant="outline"
          >
            Materialize
          </Button>
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KraphGraph.Komments object={data.graph.id} />,
          }}
        />
      }
    >
      <div className="grid grid-cols-12 gap-4 mb-4 h-full w-full">
        <div className="col-span-12 md:col-span-12">

          <QueryBuilderGraph graph={data.graph} />
        </div>




      </div>
    </KraphGraph.ModelPage>
  );
});
