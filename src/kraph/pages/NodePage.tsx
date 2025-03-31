import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useGetNodeQuery } from "../api/graphql";

import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { KraphEntity, KraphNode } from "@/linkers";
import { useNavigate } from "react-router";

export default asDetailQueryRoute(useGetNodeQuery, ({ data, refetch }) => {
  const nagivate = useNavigate();

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
          {data.node.__typename === "Entity" && (
            <KraphEntity.DetailLink object={data.node.id}>
              Open as Entity
            </KraphEntity.DetailLink>
          )}
        </div>
      </div>
    </KraphNode.ModelPage>
  );
});
