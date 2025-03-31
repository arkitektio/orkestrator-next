import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { KraphGraph } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useGetGraphQuery } from "../api/graphql";

import NodeCard from "../components/cards/NodeCard";
import PopularePlotViewsCarousel from "../components/carousels/PopularePlotViewsCarousel";
import { UpdateGraphForm } from "../forms/UpdateGraphForm";
import OntologyGraph from "../components/designer/OntologyGraph";

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  const nagivate = useNavigate();

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
      </div>
    </KraphGraph.ModelPage>
  );
});
