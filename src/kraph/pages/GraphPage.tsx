import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { KraphGraph, KraphGraphQuery } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import {
  useGetGraphQuery,
  useMaterializeGraphMutation,
  useUpdateGraphMutation,
  useCreateGraphQueryMutation,
  ViewKind,
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
import { Plus } from "lucide-react";

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  const navigate = useNavigate();
  const [update] = useUpdateGraphMutation({
    refetchQueries: ["GetGraph"],
  });

  const [materialize] = useMaterializeGraphMutation({
    refetchQueries: ["GetGraph"],
  });

  const [createGraphQuery] = useCreateGraphQueryMutation({
    refetchQueries: ["GetGraph", "GetGraphQuery"],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [queryName, setQueryName] = useState("");

  const handleCreateQuery = async () => {
    if (!queryName.trim()) return;

    try {
      const result = await createGraphQuery({
        variables: {
          input: {
            name: queryName,
            description: "New query created from builder",
            graph: data.graph.id,
            query: "MATCH (n) RETURN n LIMIT 25",
            kind: ViewKind.NodeList,
          },
        },
      });

      if (result.data?.createGraphQuery) {
        setDialogOpen(false);
        setQueryName("");
        // Navigate to the builder page for the newly created query
        navigate(`/kraph/graphqueries/${result.data.createGraphQuery.id}/builder`);
      }
    } catch (error) {
      console.error("Failed to create graph query:", error);
    }
  };

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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Query
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Graph Query</DialogTitle>
                <DialogDescription>
                  Enter a name for your new query. You&apos;ll be taken to the builder to design it.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Query Name</Label>
                  <Input
                    id="name"
                    value={queryName}
                    onChange={(e) => setQueryName(e.target.value)}
                    placeholder="e.g., Sample Analysis Query"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateQuery();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateQuery} disabled={!queryName.trim()}>
                  Create & Open Builder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
