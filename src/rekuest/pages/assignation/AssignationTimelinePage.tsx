import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReturnsContainer } from "@/components/widgets/returns/ReturnsContainer";
import { RekuestAssignation } from "@/linkers";
import {
  AssignationEventKind,
  PostmanAssignationFragment,
  useCancelMutation,
  useDetailAssignationQuery,
  useImplementationQuery,
  useInterruptMutation,
  useNoChildrenDetailAssignationQuery,
} from "@/rekuest/api/graphql";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Timestamp from "react-timestamp";
import { useWidgetRegistry } from "../../widgets/WidgetsContext";
import { isCancalable, isInterruptable, useReassign } from "../AssignationPage";
import { ChildAssignationUpdater } from "@/rekuest/components/updaters/ChildAssignationUpdater";
import { Separator } from "@/components/ui/separator";

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export type TimelineEvent = {
  kind: AssignationEventKind;
  message?: string | null;
  createdAt: string;
  position: number;
};

export type TimelineItem = {
  assignation: PostmanAssignationFragment;
  start: number;
  end: number;
  startTime: number;
  endTime: number;
  events: TimelineEvent[];
};

export type TimelineRow = {
  id: string;
  type: "implementation" | "assignation";
  name?: string;
  items: TimelineItem[];
};

const getStatusColor = (status: AssignationEventKind | undefined | string) => {
  switch (status) {
    case AssignationEventKind.Done:
      return "bg-green-500 border-green-600";
    case AssignationEventKind.Yield:
      return "bg-purple-500 border-purple-600";
    case AssignationEventKind.Error:
    case AssignationEventKind.Critical:
      return "bg-red-500 border-red-600";
    case AssignationEventKind.Cancelled:
      return "bg-gray-500 border-gray-600";
    case AssignationEventKind.Assign:
      return "bg-blue-500 border-blue-600";
    default:
      return "bg-slate-500 border-slate-600";
  }
};

const TimelineImplementationHeader = ({ id }: { id: string }) => {
  const { data, loading } = useImplementationQuery({ variables: { id } });

  if (loading)
    return <div className="w-full h-full animate-pulse bg-muted rounded-md" />;
  if (!data?.implementation)
    return <div className="text-xs text-muted-foreground">Unknown</div>;

  return (
    <div className="flex flex-col justify-center h-full px-2">
      <div className="font-semibold text-sm truncate">
        {data.implementation.agent.name}
      </div>
      <div className="text-xs text-muted-foreground truncate opacity-50">
        {data.implementation.interface}
      </div>
    </div>
  );
};


const TimelineItemDetail = ({ item }: { item: TimelineItem }) => {
  const { data } = useNoChildrenDetailAssignationQuery({
    variables: { id: item.assignation.id },
  });

  const { registry } = useWidgetRegistry();

  const assignation = data?.assignation || item.assignation;
  const latestEvent = assignation.events
    ?.filter((i) => i.kind == AssignationEventKind.Yield)
    .at(-1);

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">{assignation.action?.name}</h4>
        <p className="text-sm text-muted-foreground">{assignation.id}</p>
      </div>
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-sm font-medium">Status</span>
          <span className="col-span-2 text-sm">
            {assignation.latestEventKind}
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-sm font-medium">Created</span>
          <span className="col-span-2 text-sm">
            <Timestamp date={assignation.createdAt} relative />
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-sm font-medium">Duration</span>
          <span className="col-span-2 text-sm">
            {item.endTime - item.startTime} ms
          </span>
        </div>
        {latestEvent && latestEvent.returns && assignation.action?.returns && (
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-sm font-medium">Latest Result</span>
            <div className="bg-muted p-2 rounded-md">
              <ReturnsContainer
                registry={registry}
                ports={assignation.action.returns}
                values={latestEvent.returns}
                showKeys={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TimelineItemPopover = ({
  item,
  children,
}: {
  item: TimelineItem;
  children: React.ReactNode;
  highlighted: boolean;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[500px]">
        <TimelineItemDetail item={item} />
      </PopoverContent>
    </Popover>
  );
};

export const TimelineRender = ({
  node,
  highlighted,
}: {
  node: TimelineRow;
  highlighted: string[];
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div
        className={
          expanded
            ? "col-span-2 cursor-pointer bg-card border rounded-md border-border shadow-sm z-10"
            : "col-span-2 cursor-pointer border rounded-md border-border bg-card/50 hover:bg-card transition-colors z-10"
        }
      >
        <div
          className="w-full h-12 relative"
          onClick={() => setExpanded(!expanded)}
        >
          {node.type === "implementation" ? (
            <TimelineImplementationHeader id={node.id} />
          ) : (
            <div className="flex flex-col justify-center h-full px-2">
              <div className="font-semibold text-sm truncate">{node.name}</div>
            </div>
          )}
        </div>
      </div>
      <div className="col-span-10 flex items-center relative z-10">
        <div className="relative h-8 w-full bg-muted/30 rounded-full">
          {node.items.map((item, index) => {
            return (
              <TimelineItemPopover
                key={index}
                item={item}
                highlighted={highlighted.includes(item.assignation.id)}
              >
                <div
                  className={`${
                    highlighted.includes(item.assignation.id)
                      ? "ring-2 ring-offset-1 ring-primary z-20 opacity-100"
                      : "opacity-60 hover:opacity-100 hover:z-20"
                  } ${getStatusColor(
                    item.assignation.latestEventKind
                  )} absolute h-full border rounded-md cursor-pointer transition-all flex items-center justify-center shadow-sm`}
                  style={{
                    left: item.start * 100 + "%",
                    width: Math.max((item.end - item.start) * 100, 0.5) + "%",
                  }}
                >
                  <div className="text-[10px] truncate w-full text-center px-1 text-white font-medium drop-shadow-md">
                    {item.assignation.action?.name}
                  </div>
                  {!item.assignation.isDone && (
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-3 h-3 animate-spin text-white" />
                    </div>
                  )}
                </div>
              </TimelineItemPopover>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const AssignationTimeline = ({ id }: { id: string }) => {
  const { data } = useDetailAssignationQuery({
    variables: { id },
  });

  const [timeline, setTimeline] = useState<TimelineRow[]>([]);
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [showReactive, setShowReactive] = useState(true);
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (data?.assignation) {
      const assignation = data.assignation;
      const children = (assignation.children || []).filter(notEmpty);

      const allAssignations = children

      const getEndTime = (a: PostmanAssignationFragment) => {
        if (a.finishedAt) return new Date(a.finishedAt).getTime();
        if (a.events && a.events.length > 0) {
          const eventTimes = a.events.map((e) =>
            new Date(e.createdAt).getTime()
          );
          if (eventTimes.length > 0) return Math.max(...eventTimes);
        }
        return new Date().getTime();
      };

      const times = allAssignations.flatMap((a) => [
        new Date(a.createdAt).getTime(),
        getEndTime(a),
      ]);

      const min = Math.min(...times);
      const max = Math.max(...times);

      const interpolate = (time: number) => {
        if (max === min) return 0;
        return (time - min) / (max - min);
      };

      const parentEvents = (assignation.events || []).map((e) => ({
        kind: e.kind,
        message: e.message,
        createdAt: e.createdAt,
        position: interpolate(new Date(e.createdAt).getTime()),
      }));
      setEvents(parentEvents);

      const rowMap = new Map<string, TimelineRow>();

      allAssignations.forEach((a) => {
        const startTime = new Date(a.createdAt).getTime();
        const endTime = getEndTime(a);

        const item: TimelineItem = {
          assignation: a,
          start: interpolate(startTime),
          end: interpolate(endTime),
          startTime: startTime,
          endTime: endTime,
          events: [],
        };

        const id = a.implementation?.id || a.id;

        if (!rowMap.has(id)) {
          rowMap.set(id, {
            id: id,
            type: "implementation",
            items: [],
          });
        }

        rowMap.get(id)?.items.push(item);
      });

      setTimeline(Array.from(rowMap.values()));
    }
  }, [data]);

  return (
    <div
      className="flex flex-grow flex-col text-white @container"
      onClick={() => setHighlighted([])}
    >

      <div className="flex flex-col gap-2 relative">
        <div className="absolute inset-0 flex pointer-events-none z-0">
          <div className="w-2/12"></div>
          <div className="w-10/12 relative border-l  border-white/5">
            {events.map((event, index) => (
              <div
                key={`global-event-${index}`}
                className="absolute top-0 bottom-0 w-px bg-white/20 group"
                style={{ left: `${event.position * 100}%` }}
              >
                <div className="absolute top-full mt-1 text-[8px] text-muted-foreground whitespace-nowrap -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 px-1 rounded border z-50">
                  {event.kind}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex pointer-events-none z-0">
          <div className="w-2/12"></div>
          <div className="w-10/12 relative border-l  border-white/5">
            {events.map((event, index) => (
              <div
                key={`global-event-${index}`}
                className="absolute bottom-0 w-px bg-white/20 group "
                style={{ left: `${event.position * 100}%` }}
              >
                <div className="-translate-x-1/2 text-xs flex items-center justify-center w-16 p-1 border bg-background/90 rounded-md ">
                  {event.kind == AssignationEventKind.Log && event.message}
                  </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-y-2 z-10 mb-10">
          {timeline.map((node) => (
            <TimelineRender
              key={node.id}
              node={node}
              highlighted={highlighted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default asDetailQueryRoute(
  useDetailAssignationQuery,
  ({ data, id }) => {
    const reassign = useReassign({ assignation: data.assignation });

    const [cancel] = useCancelMutation();
    const [interrupt] = useInterruptMutation();

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
        <ChildAssignationUpdater assignationId={id} />
        <AssignationTimeline id={id} />
      </RekuestAssignation.ModelPage>
    );
  }
);
