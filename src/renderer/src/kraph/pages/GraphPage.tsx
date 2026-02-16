import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { KraphGraph, KraphGraphQuery } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import {
  useGetGraphQuery,
  useUpdateGraphMutation,
} from "../api/graphql";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OntologyGraph from "../components/designer/OntologyGraph";
import { UpdateGraphForm } from "../forms/UpdateGraphForm";
import ScatterPlotList from "../components/lists/ScatterPlotList";
import { useState } from "react";
import { Plus, PlusIcon } from "lucide-react";
import { DialogButton } from "@/components/ui/dialogbutton";
import { SheetButton } from "@/components/ui/sheetbutton";

export const Page = asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  const navigate = useNavigate();
  const [update] = useUpdateGraphMutation({
    refetchQueries: ["GetGraph"],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [queryName, setQueryName] = useState("");



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
          <KraphGraph.ObjectButton object={data.graph.id} />
          <KraphGraph.DetailLink object={data.graph.id} subroute="queries">
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
            Comments: <KraphGraph.Komments object={data.graph.id} />,
            Plots: (
              <>
                <ScatterPlotList filters={{ graph: data.graph.id }} />
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
