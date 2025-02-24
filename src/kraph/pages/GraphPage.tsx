import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import {
  KraphNode,
  KraphGraph,
  KraphLinkedExpression,
  KraphGraphView,
} from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { Divide, PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  PathFragment,
  useCreateGraphViewMutation,
  useGetGraphQuery,
  useRenderGraphQuery,
} from "../api/graphql";

import { UpdateGraphForm } from "../forms/UpdateGraphForm";
import { useState } from "react";
import { PathGraph } from "../components/renderers/graph/KnowledgeGraph";
import { Card } from "@/components/ui/card";
import { GraphViewRenderer } from "../components/renderers/GraphQueryRenderer";
import NodeCard from "../components/cards/NodeCard";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import GraphViewCard from "../components/cards/GraphViewCard";
import PopularePlotViewsCarousel from "../components/carousels/PopularePlotViewsCarousel";

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
          <KraphGraph.DetailLink object={data.graph.id} subroute="entities">
            <Button variant={"outline"} size={"sm"}>
              All Entities
            </Button>
          </KraphGraph.DetailLink>
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
        <div className="grid grid-cols-6 gap-2">
          {data?.graph?.graphViews?.map((item, i) => (
            <GraphViewCard item={item} />
          ))}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Views</Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            {data.graph.ontology.graphQueries.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => createView(item.id)}
              >
                {item.name}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </KraphGraph.ModelPage>
  );
});
