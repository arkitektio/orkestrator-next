import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { KraphGraph } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useGetGraphQuery, useUpdateGraphMutation } from "../api/graphql";

import NodeCard from "../components/cards/NodeCard";
import PopularePlotViewsCarousel from "../components/carousels/PopularePlotViewsCarousel";
import { UpdateGraphForm } from "../forms/UpdateGraphForm";
import OntologyGraph from "../components/designer/OntologyGraph";
import { Button } from "@/components/ui/button";

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  const nagivate = useNavigate();
  const [update] = useUpdateGraphMutation({
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
          <FormSheet trigger={<HobbyKnifeIcon />}>
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
      <PopularePlotViewsCarousel queries={data.graph.graphQueries} />
      <OntologyGraph graph={data.graph} />

    </KraphGraph.ModelPage>
  );
});
