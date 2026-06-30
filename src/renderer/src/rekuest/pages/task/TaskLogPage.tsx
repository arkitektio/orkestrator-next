import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { buildAssignInput } from "@/rekuest/assign";
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
import { RekuestTask } from "@/linkers";
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
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timestamp from "react-timestamp";
import { useAction } from "../../hooks/useAction";
import { useWidgetRegistry } from "../../widgets/WidgetsContext";

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
            object={props.event.delegatedTo?.id || ""}
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
          <ReturnsContainer
            registry={registry}
            ports={props.task.action.returns}
            values={props.event.returns}
            options={{ labels: false }}
          />
        </TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  );
};

export const DefaultRenderer = (props: {
  task: DetailTaskFragment;
}) => {
  return (
    <>
      <TaskTimeLine task={props.task} />
    </>
  );
};

export const TaskTimeLine = (props: {
  task: DetailTaskFragment;
}) => {
  return (
    <Timeline className="w-full p-2 flex-grow">
      {props.task?.events.map((e) => (
        <>
          {e.kind === TaskEventKind.Yield && (
            <YieldItem task={props.task} event={e} />
          )}
          {e.kind === TaskEventKind.Delegate && (
            <DelegateItem event={e} />
          )}

          {![
            TaskEventKind.Yield,
            TaskEventKind.Delegate,
          ].includes(e.kind) && <LogItem event={e} />}
        </>
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

  const reassign = async () => {
    const x = await assign(buildAssignInput({
      args: task.args,
      implementation: task?.implementation.id || "",
      hooks: [],
    }));

    navigate(RekuestTask.linkBuilder(x.id));
  };

  return reassign;
};

export const isCancalable = (task: DetailTaskFragment) => {
  return task.isDone;
};
export const isInterruptable = (task: DetailTaskFragment) => {
  return task.isDone;
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
        object={data.task}
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
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <RekuestTask.Komments object={data?.task} />
              ),
            }}
          />
        }
      >
        <pre className="rounded rounded-md p-3 bg-gray-900 border border-gray-800 text-sm mb-4 overflow-x-auto">
          {data.task.events.map((event) => (
            <div key={event.id}>[<Timestamp date={event.createdAt} />] {event.kind}[{event.level}]: {event.message} {event.returns && JSON.stringify(event.returns)}</div>
          ))}
        </pre>

      </RekuestTask.ModelPage>
    );
  },
);


export default TPage;
