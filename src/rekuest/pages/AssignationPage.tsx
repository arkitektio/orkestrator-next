import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";

import {
  Images
} from "lucide-react";

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
import { DialogButton } from "@/components/ui/dialogbutton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReturnsContainer } from "@/components/widgets/returns/ReturnsContainer";
import { RekuestAssignation, RekuestImplementation } from "@/linkers";
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
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timestamp from "react-timestamp";
import { useAction } from "../hooks/useAction";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

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

export const DelegateItem = (props: { event: AssignationEventFragment }) => {
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
          This assignmenent was delegated to{" "}
          {props.event.delegatedTo?.implementation.action.name}
          <RekuestAssignation.DetailLink
            object={props.event.delegatedTo?.id || ""}
            className="font-semibold"
          >
            {" "}
            (see details)
          </RekuestAssignation.DetailLink>
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
        <TimelineTitle>Yielded</TimelineTitle>
      </TimelineHeader>
      <TimelineContent>
        <TimelineDescription>
          <p className="text-xs mb-1">
            <Timestamp date={props.event.createdAt} />
          </p>
          <div className="flex items-center justify-center flex-row gap-2 mb-4 p-3 bg-muted rounded-md">
            <ReturnsContainer
              registry={registry}
              ports={props.assignation.action.returns}
              values={props.event.returns}
              options={{ labels: false }}
            />
          </div>
        </TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  );
};


export const ErrorItem = (props: {
  assignation: DetailAssignationFragment;
  event: AssignationEventFragment;
}) => {
  const { registry } = useWidgetRegistry();

  return (
    <TimelineItem className="w-full">
      <TimelineConnector />
      <TimelineHeader>
        <TimelineIcon />
        <TimelineTitle>Yielded</TimelineTitle>
      </TimelineHeader>
      <TimelineContent>
        <TimelineDescription>
          <p className="text-xs mb-1">
            <Timestamp date={props.event.createdAt} />
          </p>
          <div className="flex items-center justify-center flex-row gap-2 mb-4 p-3 bg-red-900 text-white border-red-300 border border-1 rounded-md">
            {props.event.message}
          </div>
        </TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  );
};

export const DefaultRenderer = (props: {
  assignation: DetailAssignationFragment;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex-initial mb-3">Runnning on: <RekuestImplementation.DetailLink object={props.assignation.implementation.id}>{props.assignation.implementation.interface} @ {props.assignation.implementation.agent.name}</RekuestImplementation.DetailLink></div>

      <AssignationTimeLine assignation={props.assignation} />
    </div>
  );
};

export const AssignationTimeLine = (props: {
  assignation: DetailAssignationFragment;
}) => {
  return (
    <Timeline className="w-full flex-grow">
      {props.assignation?.events.map((e) => (
        <>
          {e.kind === AssignationEventKind.Yield && (
            <YieldItem assignation={props.assignation} event={e} />
          )}
          {e.kind === AssignationEventKind.Delegate && (
            <DelegateItem event={e} />
          )}

          {e.kind === AssignationEventKind.Error && (
            <ErrorItem assignation={props.assignation} event={e} />
          )}

          {e.kind === AssignationEventKind.Critical && (
            <ErrorItem assignation={props.assignation} event={e} />
          )}

          {[
            AssignationEventKind.Log,
            AssignationEventKind.Progress,
          ].includes(e.kind) && <LogItem event={e} />}
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

  const reassign = async (options?: { capture: boolean }) => {
    const x = await assign({
      args: assignation.args,
      implementation: assignation?.implementation.id || "",
      dependencies: assignation.dependencies,
      hooks: [],
      capture: options?.capture || false,
    });

    navigate(RekuestAssignation.linkBuilder(x.id));
  };

  return reassign;
};

export const isCancalable = (assignation: DetailAssignationFragment) => {
  return assignation.isDone !== true;
};
export const isInterruptable = (assignation: DetailAssignationFragment) => {
  return assignation.isDone !== true;
};




export const AssignationStatsSidebar = (props: { assignation: DetailAssignationFragment }) => {


  // Calculate additional metrics from available data
  const endTime = props.assignation.finishedAt
  const startTime = props.assignation.createdAt;

  const statsCards = [
    {
      title: "Total Waltime",
      value: !endTime ? "..." : `${((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000).toFixed(2)}s`,
      description: "Total walltime taken for this assignation",
      icon: Images,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Task Overview</h2>
        <p className="text-sm text-muted-foreground">
          Some basic statistics about this task.
        </p>
      </div>
      {statsCards.map((card) => (
        <div
          key={card.title}
          className="p-4 rounded-lg border dark:border-gray-700 flex items-center gap-4"
        >
          <div
            className={`p-3 rounded-lg ${card.bgColor} ${card.color}`}
          >
            <card.icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <p className="text-2xl font-semibold">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
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
        additionalSidebars={{ "Stats": <AssignationStatsSidebar assignation={data.assignation} /> }}
        object={data.assignation.id}
        pageActions={
          <div className="flex gap-2">
            <RekuestAssignation.DetailLink
              object={data?.assignation?.id || ""}
              subroute="log"
              className="font-semibold"
            >
              <Button
                variant={"outline"}
                size={"sm"}
              >
                Logs
              </Button>
            </RekuestAssignation.DetailLink>

            {data.assignation.parent && <RekuestAssignation.DetailLink
              object={data?.assignation?.parent.id || ""}
              subroute="log"
              className="font-semibold"
            >
              <Button
                variant={"outline"}
                size={"sm"}
              >
                Logs
              </Button>
            </RekuestAssignation.DetailLink>  }
            <div className="flex">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  reassign();
                }}
                className="rounded-r-none"
              >
                Rerun
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="rounded-l-none border-l-0 px-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      reassign({ capture: true });
                    }}
                  >
                    Rerun with Capture
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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

            <DialogButton name="reportbug" variant="outline" size="sm"
              dialogProps={{ assignationId: data?.assignation.id }}
            >
              Report Bug
            </DialogButton>
          </div>
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
                  <AssignationTimeLine assignation={data?.assignation} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <DefaultRenderer assignation={data?.assignation} />
          )}
        </div>
      </RekuestAssignation.ModelPage>
    );
  },
);
