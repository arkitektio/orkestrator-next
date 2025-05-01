import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { NodeDescription } from "@/lib/rekuest/NodeDescription";
import { RekuestAssignation, RekuestNode, RekuestTemplate } from "@/linkers";
import { useFlowQuery } from "@/reaktion/api/graphql";
import { ShowFlow } from "@/reaktion/show/ShowFlow";
import {
  AssignationEventKind,
  DetailTemplateFragment,
  WatchTemplateDocument,
  WatchTemplateSubscription,
  WatchTemplateSubscriptionVariables,
  useTemplateQuery,
} from "@/rekuest/api/graphql";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DependencyCard from "../components/cards/DependencyCard";
import { usePortForm } from "../hooks/usePortForm";
import { useTemplateAction } from "../hooks/useTemplateAction";
import { ReturnsContainer } from "../widgets/tailwind";
import { portToLabel } from "../widgets/utils";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

export const DoFormBackup = (props: { id: string }) => {
  const { assign, latestAssignation, cancel, template } = useTemplateAction({
    id: props.id,
  });

  const form = usePortForm({
    ports: template?.node.args || [],
    overwrites: latestAssignation?.args,
  });

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log("Submitting");
    console.log(data);
    assign({
      template: props.id,
      args: data,
      hooks: [],
    }).then(
      (result) => {
        console.log("Result", result);
        navigate(RekuestAssignation.linkBuilder(result.id));
      },
      (error) => {
        toast.error(error.message);
      },
    );
  };

  const { registry } = useWidgetRegistry();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {template?.node?.description && (
            <NodeDescription
              description={template.node.description}
              variables={form.watch()}
            />
          )}
          <ArgsContainer
            registry={registry}
            groups={template?.node.portGroups}
            ports={template?.node.args || []}
            path={[]}
          />
          <DialogFooter>
            <Button type="submit" className="btn">
              {" "}
              Submit{" "}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export const DoForm = ({ id }: { id: string }) => {
  const { assign, latestAssignation, cancel, template } = useTemplateAction({
    id: id,
  });

  const form = usePortForm({
    ports: template?.node.args || [],
  });

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log("Submitting");
    console.log(data);
    assign({
      template: id,
      args: data,
      hooks: [],
    }).then(
      (result) => {
        console.log("Result", result);
        navigate(RekuestAssignation.linkBuilder(result.id));
      },
      (error) => {
        toast.error(error.message);
      },
    );
  };

  const { registry } = useWidgetRegistry();

  const yieldEvent = latestAssignation?.events?.find(
    (x) => x.kind == AssignationEventKind.Yield,
  );

  const errorEvent = latestAssignation?.events?.find(
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
                    ports={template?.node?.args || []}
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
              <Card className="flex-1 p-2">
                <CardHeader>
                  <CardTitle className="font-light">Outs</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col gap-2">
                    <ReturnsContainer
                      registry={registry}
                      ports={template?.node.returns || []}
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
                    {template?.node?.returns?.map((p) => (
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

export const TemplateFlow = (props: { template: DetailTemplateFragment }) => {
  const { data } = useFlowQuery({
    variables: {
      id: props.template.params.flow,
    },
  });

  return (
    <>
      {data?.flow && <ShowFlow flow={data?.flow} template={props.template} />}
    </>
  );
};

export const DefaultRenderer = (props: {
  template: DetailTemplateFragment;
}) => {
  return (
    <div className=" p-6">
      <div className="mb-3">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer">
          {props?.template?.node.name}
        </h1>
        <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
          {props?.template?.node.description}
        </p>
      </div>
      <DoForm id={props.template.id} />

      <ListRender array={props?.template?.dependencies}>
        {(template, key) => <DependencyCard item={template} key={key} />}
      </ListRender>
    </div>
  );
};

export const FlowRender = (props: { template: DetailTemplateFragment }) => {
  return (
    <div className="w-full h-full">
      <TemplateFlow template={props.template} />
    </div>
  );
};

export default asDetailQueryRoute(
  useTemplateQuery,
  ({ data, refetch, subscribeToMore }) => {
    useEffect(() => {
      return subscribeToMore<
        WatchTemplateSubscription,
        WatchTemplateSubscriptionVariables
      >({
        document: WatchTemplateDocument,
        variables: {
          template: data.template.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          return { template: subscriptionData.data.templateChange };
        },
      });
    }, [subscribeToMore]);

    return (
      <RekuestTemplate.ModelPage
        title={
          <>
            {data.template.node.name} @ {data.template.interface}
          </>
        }
        object={data.template.id}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <RekuestTemplate.Komments object={data?.template?.id} />
              ),
            }}
          />
        }
        pageActions={
          <>
            <RekuestNode.DetailLink object={data.template.node.id}>
              <Button variant="outline">Go to Node</Button>
            </RekuestNode.DetailLink>
          </>
        }
      >
        {data.template?.params?.flow ? (
          <FlowRender template={data.template} />
        ) : (
          <DefaultRenderer template={data.template} />
        )}
      </RekuestTemplate.ModelPage>
    );
  },
);
