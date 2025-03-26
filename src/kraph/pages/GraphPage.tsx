import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import {
  KraphGraph,
  KraphGraphView,
  KraphOntology
} from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import {
  useCreateGraphViewMutation,
  useGetGraphQuery
} from "../api/graphql";

import { ListRender } from "@/components/layout/ListRender";
import GraphViewCard from "../components/cards/GraphViewCard";
import NodeCard from "../components/cards/NodeCard";
import PopularePlotViewsCarousel from "../components/carousels/PopularePlotViewsCarousel";
import { UpdateGraphForm } from "../forms/UpdateGraphForm";

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  const [createGraphView] = useCreateGraphViewMutation();
  const nagivate = useNavigate();

  const createView = async (queryId: string) => {
    createGraphView({
      variables: {
        input: {
          graph: data.graph.id,
          query: queryId,
        },
      },
    }).then((x) => {
      nagivate(KraphGraphView.linkBuilder(x.data?.createGraphView.id));
    });
  };

  return (
    <KraphGraph.ModelPage
      object={data.graph.id}
      title={data.graph.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <KraphOntology.DetailLink object={data.graph.ontology.id}>
            <Button variant={"outline"} size={"sm"}>
              Ontology{" "}
            </Button>
          </KraphOntology.DetailLink>
          <FormSheet trigger={<HobbyKnifeIcon />}>
            {data?.graph && <UpdateGraphForm graph={data?.graph} />}
          </FormSheet>
          <KraphGraph.ObjectButton object={data.graph.id} />
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
      <PopularePlotViewsCarousel plots={data.graph.plotViews} />

      <div className="p-6">
        <KraphGraph.DetailLink
          object={data.graph.id}
          subroute="entities"
          className="mb-5"
        >
          Latest Nodes{" "}
        </KraphGraph.DetailLink>
        <div className="grid grid-cols-6 gap-2">
          {data?.graph?.latestNodes?.map((item, i) => <NodeCard item={item} />)}
        </div>
        <KraphGraph.DetailLink
          object={data.graph.id}
          subroute="entities"
          className="mb-5"
        >
          Views
        </KraphGraph.DetailLink>
        <ListRender title="Views" array={data.graph.graphViews}>
          {(item) => <GraphViewCard item={item} />}
        </ListRender>
      </div>
    </KraphGraph.ModelPage>
  );
});
