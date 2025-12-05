import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { ActionDescription } from "@/lib/rekuest/ActionDescription";
import { RekuestAction, RekuestAssignation, RekuestImplementation } from "@/linkers";
import { useFlowQuery } from "@/reaktion/api/graphql";
import { ShowFlow } from "@/reaktion/show/ShowFlow";
import {
  AssignationEventKind,
  DetailImplementationFragment,
  WatchImplementationDocument,
  WatchImplementationSubscription,
  WatchImplementationSubscriptionVariables,
  useImplementationQuery,
} from "@/rekuest/api/graphql";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DependencyCard from "../components/cards/DependencyCard";
import { useImplementationAction } from "../hooks/useImplementationAction";
import { usePortForm } from "../hooks/usePortForm";
import { ReturnsContainer } from "../widgets/tailwind";
import { portToLabel } from "../widgets/utils";
import { useWidgetRegistry } from "../widgets/WidgetsContext";
import { ImplementationStatsSidebar } from "../sidebars/ImplementationStatistics";
import TaskList from "../components/lists/TaskList";

export const DoFormBackup = (props: { id: string }) => {
  const { assign, latestAssignation, cancel, implementation } = useImplementationAction({
    id: props.id,
  });

  const form = usePortForm({
    ports: implementation?.action.args || [],
    overwrites: latestAssignation?.args,
  });

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log("Submitting");
    console.log(data);
    assign({
      implementation: props.id,
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
          {implementation?.action?.description && (
            <ActionDescription
              description={implementation.action.description}
              variables={form.watch()}
            />
          )}
          <ArgsContainer
            registry={registry}
            groups={implementation?.action.portGroups}
            ports={implementation?.action.args || []}
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
  const { assign, latestAssignation, cancel, implementation } = useImplementationAction({
    id: id,
  });

  const form = usePortForm({
    ports: implementation?.action.args || [],
  });

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log("Submitting");
    console.log(data);
    assign({
      implementation: id,
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
                    ports={implementation?.action?.args || []}
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
                      ports={implementation?.action.returns || []}
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
                    {implementation?.action?.returns?.map((p) => (
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

export const ImplementationFlow = (props: { implementation: DetailImplementationFragment }) => {
  const { data } = useFlowQuery({
    variables: {
      id: props.implementation.params.flow,
    },
  });

  return (
    <>
      {data?.flow && <ShowFlow flow={data?.flow} implementation={props.implementation} />}
    </>
  );
};

export const DefaultRenderer = (props: {
  implementation: DetailImplementationFragment;
}) => {
  return (
    <div className=" p-6">
      <div className="mb-3">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer">
          {props?.implementation?.action.name}
        </h1>
        <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
          {props?.implementation?.action.description}
        </p>
      </div>
      <DoForm id={props.implementation.id} />


      <div className="my-2">Dependencies</div>
      <ListRender array={props?.implementation?.dependencies}>
        {(implementation, key) => <DependencyCard item={implementation} key={key} />}
      </ListRender>

      <TaskList filters={{implementation: props.implementation.id}}/>
    </div>
  );
};

export const FlowRender = (props: { implementation: DetailImplementationFragment }) => {
  return (
    <div className="w-full h-full">
      <ImplementationFlow implementation={props.implementation} />
    </div>
  );
};

export default asDetailQueryRoute(
  useImplementationQuery,
  ({ data, refetch, subscribeToMore }) => {
    useEffect(() => {
      return subscribeToMore<
        WatchImplementationSubscription,
        WatchImplementationSubscriptionVariables
      >({
        document: WatchImplementationDocument,
        variables: {
          implementation: data.implementation.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          return { implementation: subscriptionData.data.implementationChange };
        },
      });
    }, [subscribeToMore]);

    return (
      <RekuestImplementation.ModelPage
        title={
          <>
            {data.implementation.action.name} @ {data.implementation.interface}
          </>
        }
        object={data.implementation.id}
        additionalSidebars={{
          "Stats": <ImplementationStatsSidebar implementation={data.implementation.id} />,
        }}
        pageActions={
          <>
            <RekuestAction.DetailLink object={data.implementation.action.id}>
              <Button variant="outline">Go to Action</Button>
            </RekuestAction.DetailLink>
          </>
        }
      >
        {data.implementation?.params?.flow ? (
          <FlowRender implementation={data.implementation} />
        ) : (
          <DefaultRenderer implementation={data.implementation} />
        )}
      </RekuestImplementation.ModelPage>
    );
  },
);
