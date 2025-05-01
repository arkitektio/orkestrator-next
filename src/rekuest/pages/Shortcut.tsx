import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { useNodeDescription } from "@/lib/rekuest/NodeDescription";
import { RekuestNode, RekuestShortcut, RekuestTemplate } from "@/linkers";
import {
  AssignationEventKind,
  DetailNodeFragment,
  ShortcutFragment,
  useDetailNodeQuery,
  useShortcutQuery,
} from "@/rekuest/api/graphql";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { TbMedicalCross } from "react-icons/tb";
import { TiTick } from "react-icons/ti";
import ReservationCard from "../components/cards/ReservationCard";
import { useNodeAction } from "../hooks/useNodeAction";
import { usePortForm } from "../hooks/usePortForm";
import { ReturnsContainer } from "../widgets/tailwind";
import { portToLabel } from "../widgets/utils";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

export const ShortcutForm= ({ shortcut }: { shortcut: ShortcutFragment }) => {
  const { assign, latestAssignation, cancel } = useNodeAction({
    id: shortcut.node.id,
  });

  const form = usePortForm({
    ports: shortcut?.args || [],
  });

  const onSubmit = (data: any) => {
    console.log("Submiftting");
    console.log(data);
    assign({
      node: shortcut.node.id,
      args: {...data, ...shortcut.savedArgs},
      hooks: [],
    }).then(
      (v) => {
        console.log("Result", v);
      },
      (error) => {
        console.log("Error", error);
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
                    groups={shortcut?.node.portGroups || []}
                    ports={shortcut?.args || []}
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
                      ports={shortcut.returns}
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
                    {shortcut?.returns?.map((p) => (
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

export default asDetailQueryRoute(useShortcutQuery, ({ data, refetch }) => {
  const copyHashToClipboard = useCallback(() => {
    navigator.clipboard.writeText(data?.shortcut.node?.hash || "");
  }, [data?.shortcut.node?.hash]);

  const [formData, setFormData] = useState({});

  const description = useNodeDescription({
    description: data.shortcut.node.description || "",
  });

  return (
    <RekuestShortcut.ModelPage
      title={data.shortcut.name}
      object={data.shortcut.id}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <RekuestShortcut.Komments object={data?.shortcut?.id} />,
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
            {data?.shortcut?.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
            {description}
          </p>
        </div>
        <ShortcutForm shortcut={data.shortcut} />

        
      </div>
    </RekuestShortcut.ModelPage>
  );
});
