import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { KraphGraph } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import {
  useGetGraphQuery,
  useUpdateGraphMutation,
} from "../api/graphql";

import { Button } from "@/components/ui/button";
import OntologyGraph from "../components/designer/OntologyGraph";
import ScatterPlotList from "../components/lists/ScatterPlotList";
import { UpdateGraphForm } from "../forms/UpdateGraphForm";

export const Page = asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
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
      object={data.graph}
      title={data.graph.name}
      pageActions={
        <>

          <FormSheet
            trigger={
              <Button variant="outline">
                <HobbyKnifeIcon />
              </Button>
            }
          >
            {data?.graph && <UpdateGraphForm graph={data?.graph} />}
          </FormSheet>
          <KraphGraph.ObjectButton object={data.graph} />
          <KraphGraph.DetailLink object={data.graph} subroute="queries">
            <Button variant="outline" size="sm">
              Queries
            </Button>
          </KraphGraph.DetailLink>
          <Button
            onClick={() => {
              pin();
            }}
            variant="outline"
          >
            {data.graph.pinned ? "Unpin" : "Pin"}
          </Button>

        </>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KraphGraph.Komments object={data.graph} />,
            Plots: (
              <>
                <ScatterPlotList />
              </>
            ),
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
            {data.graph.description}{" "}
            {data.graph.ageName && `· ${data.graph.ageName}`}
          </p>
        </div>
        <div className="col-span-7 flex justify-end"></div>
      </div>
      <OntologyGraph graph={data.graph} />
    </KraphGraph.ModelPage>
  );
});


export default Page;
