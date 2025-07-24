import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTitle,
} from "@/components/timeline/timeline";
import { Button } from "@/components/ui/button";
import { ReturnsContainer } from "@/components/widgets/returns/ReturnsContainer";
import { RekuestAssignation } from "@/linkers";
import { useRunForAssignationQuery } from "@/reaktion/api/graphql";
import { TrackFlow } from "@/reaktion/track/TrackFlow";
import {
  AssignationEventFragment,
  AssignationEventKind,
  DetailAssignationFragment,
  useCancelMutation,
  useDetailAssignationQuery,
  useInterruptMutation,
} from "@/rekuest/api/graphql";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timestamp from "react-timestamp";
import { useAction } from "../hooks/useAction";
import { useWidgetRegistry } from "../widgets/WidgetsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AssignationFlow = (props: {
  id: string;
  assignation: DetailAssignationFragment;
}) => {
  const { data, error, refetch } = useRunForAssignationQuery({
    variables: {
      id: props.assignation.id,
    },
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      setTimeout(refetch, 1000);
    }
  }, [error]);

  return (
    <>
      {data?.runForAssignation && (
        <TrackFlow
          run={data.runForAssignation}
          assignation={props.assignation}
        />
      )}
      {error && <div>Error: {error.message}</div>}
    </>
  );
};

export const LogItem = (props: { event: any }) => {
  return (
    <TimelineItem className="w-full">
      <TimelineConnector />
      <TimelineHeader>
        <TimelineIcon />
        <TimelineTitle>{props.event.kind}</TimelineTitle>
      </TimelineHeader>
      <TimelineContent>
        <TimelineDescription>
          <p className="text-xs mb-1">
            <Timestamp date={props.event.createdAt} />
          </p>
          {props.event.message}
        </TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  );
};

export const YieldItem = (props: {
  assignation: DetailAssignationFragment;
  event: AssignationEventFragment;
}) => {
  const { registry } = useWidgetRegistry();

  return (
    <TimelineItem className="w-full">
      <TimelineConnector />
      <TimelineHeader>
        <TimelineIcon />
        <TimelineTitle>{"Yield"}</TimelineTitle>
      </TimelineHeader>
      <TimelineContent>
        <TimelineDescription>
          <p className="text-xs mb-1">
            <Timestamp date={props.event.createdAt} />
          </p>
          <ReturnsContainer
            registry={registry}
            ports={props.assignation.action.returns}
            values={props.event.returns}
            options={{ labels: false }}
          />
        </TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  );
};

export const DefaultRenderer = (props: {
  assignation: DetailAssignationFragment;
}) => {
  return (
    <>
      <AssignationTimeLine assignation={props.assignation} />
    </>
  );
};

export const AssignationTimeLine = (props: {
  assignation: DetailAssignationFragment;
}) => {
  return (
    <Timeline className="w-full p-2 flex-grow">
      {props.assignation?.events.map((e) => (
        <>
          {e.kind === AssignationEventKind.Yield && (
            <YieldItem assignation={props.assignation} event={e} />
          )}
          {e.kind !== AssignationEventKind.Yield && <LogItem event={e} />}
        </>
      ))}
    </Timeline>
  );
};

export const useReassign = ({
  assignation,
}: {
  assignation: DetailAssignationFragment;
}) => {
  const { assign } = useAction({
    id: assignation?.implementation.id || "",
  });
  const navigate = useNavigate();

  const reassign = async () => {
    let x = await assign({
      args: assignation.args,
      implementation: assignation?.implementation.id || "",
      hooks: [],
    });

    navigate(RekuestAssignation.linkBuilder(x.id));
  };

  return reassign;
};

export const isCancalable = (assignation: DetailAssignationFragment) => {
  return assignation.isDone;
};
export const isInterruptable = (assignation: DetailAssignationFragment) => {
  return assignation.isDone;
};

export default asDetailQueryRoute(
  useDetailAssignationQuery,
  ({ data, refetch, subscribeToMore }) => {
    const navigate = useNavigate();

    const reassign = useReassign({ assignation: data.assignation });

    const [cancel, _] = useCancelMutation();
    const [interrupt, __] = useInterruptMutation();

    return (
      <RekuestAssignation.ModelPage
        title={
          <div className="flex flex-row gap-2">
            {data?.assignation?.action.name}
            <p className="text-md font-light text-muted-foreground">
              <Timestamp date={data.assignation.createdAt} relative />
            </p>
          </div>
        }
        object={data.assignation.id}
        pageActions={
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                reassign();
              }}
            >
              Rerun
            </Button>
            {isCancalable(data.assignation) && (
              <Button
                onClick={() =>
                  cancel({
                    variables: { input: { assignation: data.assignation.id } },
                  })
                }
                variant={"destructive"}
                size={"sm"}
              >
                Cancel
              </Button>
            )}
            {isInterruptable(data.assignation) && (
              <Button
                onClick={() =>
                  interrupt({
                    variables: { input: { assignation: data.assignation.id } },
                  })
                }
                variant={"destructive"}
                size={"sm"}
              >
                Interrupt
              </Button>
            )}
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <RekuestAssignation.Komments object={data?.assignation?.id} />
              ),
            }}
          />
        }
      >
        <div className="flex h-full w-full relative">
          {data?.assignation?.implementation?.extension === "reaktion" ? (
            <>
              <Tabs className="flex-grow flex flex-col " defaultValue="flow">
                <TabsList className="h-8 flex-initial">
                  <TabsTrigger value="flow">Flow</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="flow" className="flex-grow">
                  <AssignationFlow
                    id={data?.assignation?.implementation?.interface}
                    assignation={data.assignation}
                  />
                </TabsContent>
                <TabsContent value="logs" className="h-full w-full">
                  <AssignationTimeLine assignation={data.assignation} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <DefaultRenderer assignation={data.assignation} />
          )}
        </div>
      </RekuestAssignation.ModelPage>
    );
  },
);
