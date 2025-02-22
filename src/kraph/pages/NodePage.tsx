import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useCreateNodeViewMutation, useGetNodeQuery } from "../api/graphql";

import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import {
  KraphLinkedExpression,
  KraphNode,
  KraphNodeQuery,
  KraphNodeView,
} from "@/linkers";
import {
  NodeQueryRenderer,
  NodeViewRenderer,
} from "../components/renderers/NodeQueryRenderer";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/components/ui/card";
import NodeViewCard from "../components/cards/NodeViewCard";

export default asDetailQueryRoute(useGetNodeQuery, ({ data, refetch }) => {
  const [view, setView] = useState<string | undefined>(
    data.node.nodeViews[0]?.id,
  );

  const [createNodeView] = useCreateNodeViewMutation();
  const nagivate = useNavigate();

  const createView = async (queryId: string) => {
    createNodeView({
      variables: {
        input: {
          node: data.node.id,
          query: queryId,
        },
      },
    }).then((x) => {
      nagivate(KraphNodeView.linkBuilder(x.data?.createNodeView.id));
    });
  };

  return (
    <KraphNode.ModelPage
      title={data.node.label}
      object={data.node.id}
      pageActions={
        <div className="flex flex-row gap-2">
          <KraphNode.DetailLink object={data.node.id} subroute="graph">
            <Button variant="outline" size="sm">
              Open in Graph
            </Button>
          </KraphNode.DetailLink>
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KraphNode.Komments object={data.node.id} />,
          }}
        />
      }
    >
      <div className=" grid md:grid-cols-12 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
        <div className="col-span-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ">
            {data.node.label}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            {data.node.graph.name}
          </p>
        </div>
        <Card className="p-6 h-96 col-span-8 overflow-y-hidden">
          {view && <NodeViewRenderer id={view} />}
        </Card>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-6 gap-2">
          {data?.node.nodeViews?.map((item, i) => <NodeViewCard item={item} />)}
        </div>
        <>
          {data.node?.graph.ontology.nodeQueries.map((item) => (
            <>
              <div onClick={() => createView(item.id)}>{item.name}</div>
            </>
          ))}
        </>
      </div>
    </KraphNode.ModelPage>
  );
});
