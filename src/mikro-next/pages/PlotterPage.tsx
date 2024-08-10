import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { ReturnsContainer } from "@/components/widgets/returns/ReturnsContainer";
import { useNodeDescription } from "@/lib/rekuest/NodeDescription";
import { RekuestNode } from "@/linkers";
import {
  AssignationEventKind,
  DetailNodeFragment,
  useDetailNodeQuery,
} from "@/rekuest/api/graphql";
import { useNodeAction } from "@/rekuest/hooks/useNodeAction";
import { usePortForm } from "@/rekuest/hooks/usePortForm";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { toast } from "sonner";

export const DoNodeForm = ({ node }: { node: DetailNodeFragment }) => {
  const { assign, latestAssignation, cancel } = useNodeAction({
    id: node.id,
  });

  const form = usePortForm({
    ports: node?.args || [],
    overwrites: latestAssignation?.args,
  });

  const description = useNodeDescription({
    description: node.description || "",
  });

  const onSubmit = (data: any) => {
    console.log("Submiftting");
    console.log(data);
    assign({
      node: node.id,
      args: data,
      hooks: [],
    }).then(
      (v) => {
        console.log("Result", v);
      },
      (error) => {
        console.log("Error", error);
        toast.error(error.message);
      },
    );
  };

  const { registry } = useWidgetRegistry();

  const yieldEvent = latestAssignation?.events.find(
    (x) => x.kind == AssignationEventKind.Yield,
  );

  const errorEvent = latestAssignation?.events.find(
    (x) => x.kind == AssignationEventKind.Critical,
  );

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full">
          <ResizablePanelGroup direction="horizontal" className="h-full ">
            <ResizablePanel
              className="h-full flex flex-col"
              minSize={10}
              defaultSize={20}
            >
              <div className="flex-grow">
                <CardTitle className="font-light">{node.name}</CardTitle>
                <div className="text-xs text-muted-foreground">
                  {description}
                </div>
                <div className="w-full">
                  <ArgsContainer
                    registry={registry}
                    ports={node?.args || []}
                    path={[]}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-2">
                {latestAssignation && (
                  <Button type="button" onClick={() => cancel()}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" className="my-auto block h-full w-full">
                  Create Plot
                </Button>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              className="w-full justify-center items-center flex"
              maxSize={80}
              defaultSize={80}
            >
              {yieldEvent ? (
                <ReturnsContainer
                  registry={registry}
                  ports={node.returns}
                  values={yieldEvent?.returns}
                ></ReturnsContainer>
              ) : (
                <Card className="p-3">Please create to see the plot</Card>
              )}

              {errorEvent && (
                <Card className="col-span-11">
                  <CardHeader>
                    <CardTitle className="font-light text-red-800">
                      Errors
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-col gap-2">
                      {errorEvent.message}
                    </div>
                  </CardContent>
                </Card>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </form>
      </Form>
    </>
  );
};

export default asDetailQueryRoute(useDetailNodeQuery, ({ data, refetch }) => {
  return (
    <ModelPageLayout
      identifier="@rekuest/node"
      title={data.node.name}
      object={data.node.id}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <RekuestNode.Komments object={data?.node?.id} />,
          }}
        />
      }
    >
      <DoNodeForm node={data.node} />
    </ModelPageLayout>
  );
});
