import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { useNodeDescription } from "@/lib/rekuest/NodeDescription";
import { RekuestNode, RekuestTemplate } from "@/linkers";
import {
  AssignationEventKind,
  DetailNodeFragment,
  useDetailNodeQuery,
} from "@/rekuest/api/graphql";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { TbMedicalCross } from "react-icons/tb";
import { TiTick } from "react-icons/ti";
import { toast } from "sonner";
import ReservationCard from "../components/cards/ReservationCard";
import { useNodeAction } from "../hooks/useNodeAction";
import { usePortForm } from "../hooks/usePortForm";
import { ReturnsContainer } from "../widgets/tailwind";
import { portToLabel } from "../widgets/utils";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

export const DoNodeForm = ({ node }: { node: DetailNodeFragment }) => {
  const { assign, latestAssignation, cancel } = useNodeAction({
    id: node.id,
  });

  const form = usePortForm({
    ports: node?.args || [],
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="rounded flex gap-2xl max-w-[80%] mt-2 gap-2">
            <Card className="flex-1 p-2">
              <CardHeader>
                <CardTitle className="font-light">Arguments</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="w-full">
                  <ArgsContainer
                    registry={registry}
                    ports={node?.args || []}
                    path={[]}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex-initial h-full flex flex-col ">
              <Button
                type="submit"
                variant={"ghost"}
                className="my-auto block h-full"
              >
                <ArrowRight className="my-auto" />
              </Button>
            </div>

            {yieldEvent ? (
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="font-light">Outs</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col gap-2">
                    <ReturnsContainer
                      registry={registry}
                      ports={node.returns}
                      values={yieldEvent?.returns}
                    ></ReturnsContainer>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="font-light">Outs</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col gap-2">
                    {node?.returns?.map((p) => (
                      <div>
                        <div className=" font-bold">{p.label || p.key}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.description}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {portToLabel(p)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {errorEvent && (
              <Card className="flex-1">
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
          </div>
        </form>
      </Form>
    </>
  );
};

export default asDetailQueryRoute(useDetailNodeQuery, ({ data, refetch }) => {
  const copyHashToClipboard = useCallback(() => {
    navigator.clipboard.writeText(data?.node?.hash || "");
  }, [data?.node?.hash]);

  const [formData, setFormData] = useState({});

  const description = useNodeDescription({
    description: data.node.description || "",
  });

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
      <div className=" p-6">
        <div className="mb-3">
          <h1
            className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer"
            onClick={copyHashToClipboard}
          >
            {data?.node?.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
            {description}
          </p>
        </div>
        <DoNodeForm node={data.node} />

        {(data.node.tests?.length || 0) > 0 && (
          <>
            <h5 className="font-light text-xl mt-2"> Tests for this Node </h5>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {data.node.tests?.map((testCase, key) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle>
                      {testCase.name}
                      <p className="text-muted mt-3">{testCase.description}</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testCase.runs?.map((result, key) => {
                      if (result?.template_id == null) {
                        return null;
                      }

                      return (
                        <div key={key}>
                          <RekuestTemplate.DetailLink
                            object={result?.template_id}
                            className="font-bold"
                          >
                            {result?.template_id}
                          </RekuestTemplate.DetailLink>
                          <div>
                            {result.status == AssignationEventKind.Done ? (
                              <TiTick />
                            ) : (
                              <TbMedicalCross />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <ListRender array={data?.node?.reservations} title="Reservations">
          {(item, key) => <ReservationCard item={item} key={key} />}
        </ListRender>
      </div>
    </ModelPageLayout>
  );
});
