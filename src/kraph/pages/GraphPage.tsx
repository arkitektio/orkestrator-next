import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { KraphGraph, KraphGraphQuery } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useGetGraphQuery, useUpdateGraphMutation } from "../api/graphql";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OntologyGraph from "../components/designer/OntologyGraph";
import { UpdateGraphForm } from "../forms/UpdateGraphForm";

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
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
          <FormSheet trigger={<Button variant="outline"><HobbyKnifeIcon /></Button>}>
            {data?.graph && <UpdateGraphForm graph={data?.graph} />}</FormSheet>
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
      <div className="grid md:grid-cols-12 gap-4 md:gap-8 xl:gap-20 md:items-center px-6 py-2">
        <div className="col-span-5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data.graph.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            {data.graph.description}
          </p>
        </div>
        <div className="col-span-7 flex justify-end"></div>
      </div>
      <OntologyGraph graph={data.graph} />
      {data.graph.graphQueries.length > 0 && (
        <>
          <h2 className="mt-4 text-xl f">Popular Queries</h2>

          <div className="mt-1 flex flex-row gap-2">
            {data.graph.graphQueries.map((x) => (
              <>
                <Card className=" p-3">
                  <KraphGraphQuery.DetailLink
                    object={x.id}
                    className="scroll-m-20 text-xl font-semibold tracking-tight"
                  >
                    <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      {x.name}
                    </h3>
                  </KraphGraphQuery.DetailLink>
                </Card>
              </>
            ))}
          </div>
        </>
      )}
    </KraphGraph.ModelPage>
  );
});
