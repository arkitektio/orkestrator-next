import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { useActionDescription } from "@/lib/rekuest/ActionDescription";
import { RekuestAction, RekuestImplementation } from "@/linkers";
import {
  AssignationEventKind,
  DetailActionFragment,
  useDetailActionQuery,
} from "@/rekuest/api/graphql";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { TbMedicalCross } from "react-icons/tb";
import { TiTick } from "react-icons/ti";
import ReservationCard from "../components/cards/ReservationCard";
import { useAction } from "../hooks/useAction";
import { usePortForm } from "../hooks/usePortForm";
import { ReturnsContainer } from "../widgets/tailwind";
import { portToLabel } from "../widgets/utils";
import { useWidgetRegistry } from "../widgets/WidgetsContext";
import AssignationCard from "../components/cards/AssignationCard";
import MinimalAssignationCard from "../components/cards/MinimalAssignationCard";
import ImplementationCard from "../components/cards/ImplementationCard";
import MinimalImplementationCard from "../components/cards/MinimalImplementationCard";

export const DoActionForm = ({ action }: { action: DetailActionFragment }) => {
  const { assign, latestAssignation, cancel } = useAction({
    id: action.id,
  });

  const form = usePortForm({
    ports: action?.args || [],
  });

  const onSubmit = (data: any) => {
    console.log(data);
    assign({
      action: action.id,
      args: data,
      hooks: [],
    }).then(
      (v) => { },
      (error) => { },
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
                    groups={action?.portGroups || []}
                    ports={action?.args || []}
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
                      ports={action.returns}
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
                    {action?.returns?.map((p) => (
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

export default asDetailQueryRoute(useDetailActionQuery, ({ data, refetch }) => {
  const copyHashToClipboard = useCallback(() => {
    navigator.clipboard.writeText(data?.action?.hash || "");
  }, [data?.action?.hash]);

  const [formData, setFormData] = useState({});

  const description = useActionDescription({
    description: data.action.description || "",
  });

  return (
    <ModelPageLayout
      identifier="@rekuest/action"
      title={data.action.name}
      object={data.action.id}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <RekuestAction.Komments object={data?.action?.id} />,
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
            {data?.action?.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
            {description}
          </p>
        </div>
        <DoActionForm action={data.action} />

        {(data.action.tests?.length || 0) > 0 && (
          <>
            <h5 className="font-light text-xl mt-2"> Tests for this Action </h5>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {data.action.tests?.map((testCase, key) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle>
                      {testCase.name}
                      <p className="text-muted mt-3">{testCase.description}</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testCase.runs?.map((result, key) => {
                      if (result?.implementation_id == null) {
                        return null;
                      }

                      return (
                        <div key={key}>
                          <RekuestImplementation.DetailLink
                            object={result?.implementation_id}
                            className="font-bold"
                          >
                            {result?.implementation_id}
                          </RekuestImplementation.DetailLink>
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

        <ListRender array={data?.action?.assignations} title="Tasks">
          {(item, key) => <MinimalAssignationCard item={item} key={key} />}
        </ListRender>
        <ListRender array={data?.action?.implementations} title="Implementations">
          {(item, key) => <MinimalImplementationCard item={item} key={key} />}
        </ListRender>
      </div>
    </ModelPageLayout>
  );
});
