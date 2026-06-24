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
import { RekuestTask, RekuestImplementation } from "@/linkers";
import { useRunForTaskQuery } from "@/reaktion/api/graphql";
import { TrackFlow } from "@/reaktion/track/TrackFlow";
import {
  TaskEventFragment,
  TaskEventKind,
  DetailTaskFragment,
  useCancelMutation,
  useDetailTaskQuery,
  useInterruptMutation,
} from "@/rekuest/api/graphql";
import { ChevronDown } from "lucide-react";
import { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timestamp from "react-timestamp";
import { useAction } from "../hooks/useAction";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

export const TaskFlow = (props: {
  id: string;
  task: DetailTaskFragment;
}) => {
  const { data, error, refetch } = useRunForTaskQuery({
    variables: {
      id: props.task.id,
    },
  });

  useEffect(() => {
    if (!error) return;
    console.error(error);
    const t = setTimeout(refetch, 1000);
    return () => clearTimeout(t);
  }, [error]);

  return (
    <>
      {data?.runForTask && (
        <TrackFlow
          run={data.runForTask}
          task={props.task}
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

export const DelegateItem = (props: { event: TaskEventFragment }) => {
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
          <RekuestTask.DetailLink
            object={{id: props.event.delegatedTo}}
            className="font-semibold"
          >
            {" "}
            (see details)
          </RekuestTask.DetailLink>
        </TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  );
};

export const YieldItem = (props: {
  task: DetailTaskFragment;
  event: TaskEventFragment;
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
              ports={props.task.action.returns}
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
  task: DetailTaskFragment;
  event: TaskEventFragment;
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
  task: DetailTaskFragment;
}) => {
  return (
    <div className="flex flex-col">

      <TaskTimeLine task={props.task} />
    </div>
  );
};

export const TaskTimeLine = (props: {
  task: DetailTaskFragment;
}) => {
  return (
    <Timeline className="w-full flex-grow">
      {props.task?.events.map((e) => (
        <Fragment key={e.id}>
          {e.kind === TaskEventKind.Yield && (
            <YieldItem task={props.task} event={e} />
          )}
          {e.kind === TaskEventKind.Delegate && (
            <DelegateItem event={e} />
          )}

          {e.kind === TaskEventKind.Failed && (
            <ErrorItem task={props.task} event={e} />
          )}

          {e.kind === TaskEventKind.Critical && (
            <ErrorItem task={props.task} event={e} />
          )}

          {[
            TaskEventKind.Log,
            TaskEventKind.Progress,
          ].includes(e.kind) && <LogItem event={e} />}
        </Fragment>
      ))}
    </Timeline>
  );
};

export const useReassign = ({
  task,
}: {
  task: DetailTaskFragment;
}) => {
  const { assign } = useAction({
    id: task?.implementation.id || "",
  });
  const navigate = useNavigate();

  const reassign = async (options?: { capture: boolean }) => {
    const x = await assign({
      args: task.args,
      implementation: task?.implementation.id || "",
      dependencies: task.dependencies,
      hooks: [],
      capture: options?.capture || false,
    });

    navigate(RekuestTask.linkBuilder(x.id));
  };

  return reassign;
};

export const isCancalable = (task: DetailTaskFragment) => {
  return task.isDone !== true;
};
export const isInterruptable = (task: DetailTaskFragment) => {
  return task.isDone !== true;
};




export const TaskStatsSidebar = (props: { task: DetailTaskFragment }) => {


  // Calculate additional metrics from available data
  const endTime = props.task.finishedAt
  const startTime = props.task.createdAt;

  const statsCards = [
    {
      title: "Total Waltime",
      value: !endTime ? "..." : `${((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000).toFixed(2)}s`,
      description: "Total walltime taken for this task",
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

export const TPage = asDetailQueryRoute(
  useDetailTaskQuery,
  ({ data, refetch, subscribeToMore }) => {
    const navigate = useNavigate();

    const reassign = useReassign({ task: data.task });

    const [cancel, _] = useCancelMutation();
    const [interrupt, __] = useInterruptMutation();

    return (
      <RekuestTask.ModelPage
        title={
          <div className="flex flex-row gap-2">
            {data?.task?.action.name}
            <p className="text-md font-light text-muted-foreground">
              <Timestamp date={data.task.createdAt} relative />
            </p>
          </div>
        }
        additionalSidebars={{ "Stats": <TaskStatsSidebar task={data.task} /> }}
        object={data.task}
        pageActions={
          <div className="flex gap-2">
            <RekuestTask.DetailLink
              object={data?.task}
              subroute="log"
              className="font-semibold"
            >
              <Button
                variant={"outline"}
                size={"sm"}
              >
                Logs
              </Button>
            </RekuestTask.DetailLink>
            <RekuestTask.DetailLink
              object={data?.task}
              subroute="timeline"
              className="font-semibold"
            >
              <Button
                variant={"outline"}
                size={"sm"}
              >
                Timeline
              </Button>
            </RekuestTask.DetailLink>
            <RekuestTask.DetailLink
              object={data?.task}
              subroute="space"
              className="font-semibold"
            >
              <Button
                variant={"outline"}
                size={"sm"}
              >
                Space
              </Button>
            </RekuestTask.DetailLink>
            {data.task.parent && <RekuestTask.DetailLink
              object={data?.task?.parent}
              subroute="log"
              className="font-semibold"
            >
              <Button
                variant={"outline"}
                size={"sm"}
              >
                Logs
              </Button>
            </RekuestTask.DetailLink>}
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
            {isCancalable(data.task) && (
              <Button
                onClick={() =>
                  cancel({
                    variables: { input: { task: data.task.id } },
                  })
                }
                variant={"destructive"}
                size={"sm"}
              >
                Cancel
              </Button>
            )}
            {isInterruptable(data.task) && (
              <Button
                onClick={() =>
                  interrupt({
                    variables: { input: { task: data.task.id } },
                  })
                }
                variant={"destructive"}
                size={"sm"}
              >
                Interrupt
              </Button>
            )}

            <DialogButton name="reportbug" variant="outline" size="sm"
              dialogProps={{ taskId: data?.task.id }}
            >
              Report Bug
            </DialogButton>
          </div>
        }
      >
        <div className="flex h-full w-full relative">
          {data?.task?.implementation?.higherOrderFor?.action?.interfaces?.includes(
            "run_flow",
          ) ? (
            <>
              <Tabs className="flex-grow flex flex-col " defaultValue="flow">
                <TabsList className="h-8 flex-initial">
                  <TabsTrigger value="flow">Flow</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="flow" className="flex-grow">
                  <TaskFlow
                    id={data?.task?.implementation?.interface}
                    task={data.task}
                  />
                </TabsContent>
                <TabsContent value="logs" className="h-full w-full">
                  <TaskTimeLine task={data?.task} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <DefaultRenderer task={data?.task} />
          )}
        </div>
      </RekuestTask.ModelPage>
    );
  },
);


export default TPage;
