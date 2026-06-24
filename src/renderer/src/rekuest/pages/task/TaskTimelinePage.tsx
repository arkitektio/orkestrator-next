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
  useInterruptMutation,
  useNoChildrenDetailAssignationQuery,
} from "@/rekuest/api/graphql";
import { ChildAssignationUpdater } from "@/rekuest/components/updaters/ChildAssignationUpdater";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Timestamp from "react-timestamp";
import { useWidgetRegistry } from "../../widgets/WidgetsContext";
import { isCancalable, isInterruptable, useReassign } from "../AssignationPage";

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

export type TimelineMethodRow = {
  id: string;
  method: string;
  summary?: string;
  items: TimelineItem[];
};

export type TimelineDependencyGroup = {
  id: string;
  dependency: string;
  summary?: string;
  items: TimelineItem[];
  methods: TimelineMethodRow[];
};

const dependencyCandidateToLabel = (candidate: unknown): string | undefined => {
  if (typeof candidate === "string" || typeof candidate === "number") {
    const label = String(candidate).trim();
    return label.length > 0 ? label : undefined;
  }

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return undefined;
  }

  const objectCandidate = candidate as Record<string, unknown>;
  const preferredKeys = ["name", "title", "reference", "key", "id"];

  for (const key of preferredKeys) {
    const value = objectCandidate[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
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

const TimelineBars = ({
  items,
  highlighted,
}: {
  items: TimelineItem[];
  highlighted: string[];
}) => {
  return (
    <div className="relative h-8 w-full bg-muted/30 rounded-full">
      {items.map((item, index) => {
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
  );
};

const TimelineMethodRender = ({
  row,
  highlighted,
}: {
  row: TimelineMethodRow;
  highlighted: string[];
}) => {
  return (
    <>
      <div className="col-span-2 ml-4 rounded-md border border-amber-200/70 bg-background/50 px-2 py-2 z-10">
        <div className="relative pl-5">
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-amber-300/70" />
          <span className="absolute left-0 -top-3 h-6 w-px bg-amber-300/70" />
          <div className="flex items-center gap-2 min-w-0">
            <div className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-amber-700 shrink-0">
              {row.method}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {row.summary}
            </div>
            <div className="ml-auto text-[10px] text-muted-foreground">
              {row.items.length}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-10 flex items-center relative z-10">
        <TimelineBars items={row.items} highlighted={highlighted} />
      </div>
    </>
  );
};

export const TimelineRender = ({
  group,
  highlighted,
}: {
  group: TimelineDependencyGroup;
  highlighted: string[];
}) => {
  const [expanded, setExpanded] = useState(true);
  const methodCount = group.methods.length;
  const itemCount = group.items.length;

  return (
    <>
      <div
        className={
          expanded
            ? "col-span-2 cursor-pointer rounded-md border border-amber-300/70 bg-amber-50/40 shadow-sm shadow-amber-200/20 transition-colors z-10"
            : "col-span-2 cursor-pointer rounded-md border border-border bg-card/60 hover:bg-card transition-colors z-10"
        }
      >
        <div className="w-full relative" onClick={() => setExpanded(!expanded)}>
          <div className="flex flex-col px-2 py-2">
            <div className="flex items-center gap-2 min-w-0">
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <div className="font-semibold text-sm truncate">{group.dependency}</div>
              <div className="ml-auto rounded bg-amber-500/10 px-1 py-0.5 text-[10px] text-amber-700">
                {itemCount}
              </div>
            </div>

            <div className="pl-6 pt-2">
              <div className="relative rounded-lg border border-dashed border-amber-300/80 bg-background/70 px-2 py-1 text-xs text-muted-foreground truncate">
                <span className="absolute -left-3 top-1/2 h-px w-3 -translate-y-1/2 bg-amber-300/70" />
                <span className="absolute -left-3 top-0 h-1/2 w-px bg-amber-300/70" />
                {group.summary || `${methodCount} method${methodCount === 1 ? "" : "s"}`}
              </div>
            </div>

            {!expanded && (
              <div className="pl-6 pt-1 text-[11px] text-muted-foreground truncate">
                {methodCount} method{methodCount === 1 ? "" : "s"}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-10 flex items-center relative z-10">
        {!expanded ? (
          <div className="relative h-6 w-full rounded-full border border-dashed border-amber-300/70 bg-amber-50/30 flex items-center px-3 text-xs text-muted-foreground">
            {itemCount} delegated task{itemCount === 1 ? "" : "s"}
          </div>
        ) : (
          <div className="relative h-6 w-full rounded-full border border-dashed border-amber-300/70 bg-amber-50/20 flex items-center px-3 text-xs text-muted-foreground">
            {methodCount} method{methodCount === 1 ? "" : "s"} grouped under this dependency
          </div>
        )}
      </div>

      {expanded &&
        group.methods.map((row) => (
          <TimelineMethodRender
            key={row.id}
            row={row}
            highlighted={highlighted}
          />
        ))}
    </>
  );
};

export const AssignationTimeline = ({ id }: { id: string }) => {
  const { data } = useDetailAssignationQuery({
    variables: { id },
  });

  const [timeline, setTimeline] = useState<TimelineDependencyGroup[]>([]);
  const [highlighted, setHighlighted] = useState<string[]>([]);
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

      const groupMap = new Map<string, TimelineDependencyGroup>();
      const methodMap = new Map<string, Map<string, TimelineMethodRow>>();

      const buildDependencyGroup = (a: PostmanAssignationFragment) => {
        const dependencyMethod = a.dependencyMethod?.trim() || "dynamic";
        const dependencyKey = a.dependency?.trim() || "catch-all";

        const dependencies = a.dependencies;
        const dependenciesByKey =
          dependencies &&
          typeof dependencies === "object" &&
          !Array.isArray(dependencies)
            ? (dependencies as Record<string, unknown>)
            : undefined;

        const selectedDependencyValue = dependenciesByKey?.[dependencyKey];
        const selectedMethodValue =
          selectedDependencyValue &&
          typeof selectedDependencyValue === "object" &&
          !Array.isArray(selectedDependencyValue)
            ? (selectedDependencyValue as Record<string, unknown>)[dependencyMethod]
            : undefined;

        const dependencyLabel =
          dependencyKey === "catch-all"
            ? "Catch-all dependency"
            : dependencyKey;

        const resolvedDependencyLabel =
          dependencyCandidateToLabel(selectedDependencyValue);
        const resolvedMethodLabel = dependencyCandidateToLabel(selectedMethodValue);

        return {
          dependencyKey,
          dependencyLabel,
          dependencyMethod,
          dependencySummary:
            resolvedDependencyLabel
              ? `resolved via ${resolvedDependencyLabel}`
              : "Dependency group",
          methodSummary:
            resolvedMethodLabel ||
            resolvedDependencyLabel ||
            "Delegated path",
        };
      };

      allAssignations.forEach((a) => {
        const startTime = new Date(a.createdAt).getTime();
        const endTime = getEndTime(a);
        const dependencyGroup = buildDependencyGroup(a);

        const item: TimelineItem = {
          assignation: a,
          start: interpolate(startTime),
          end: interpolate(endTime),
          startTime: startTime,
          endTime: endTime,
          events: [],
        };

        if (!groupMap.has(dependencyGroup.dependencyKey)) {
          groupMap.set(dependencyGroup.dependencyKey, {
            id: dependencyGroup.dependencyKey,
            dependency: dependencyGroup.dependencyLabel,
            summary: dependencyGroup.dependencySummary,
            items: [],
            methods: [],
          });
          methodMap.set(dependencyGroup.dependencyKey, new Map());
        }

        const group = groupMap.get(dependencyGroup.dependencyKey);
        group?.items.push(item);

        const methodsForDependency = methodMap.get(dependencyGroup.dependencyKey);

        if (
          methodsForDependency &&
          !methodsForDependency.has(dependencyGroup.dependencyMethod)
        ) {
          const methodRow = {
            id: `${dependencyGroup.dependencyKey}:${dependencyGroup.dependencyMethod}`,
            method: dependencyGroup.dependencyMethod,
            summary: dependencyGroup.methodSummary,
            items: [],
          };

          methodsForDependency.set(dependencyGroup.dependencyMethod, methodRow);
          group?.methods.push(methodRow);
        }

        methodsForDependency
          ?.get(dependencyGroup.dependencyMethod)
          ?.items.push(item);
      });

      const orderedTimeline = Array.from(groupMap.values())
        .map((group) => ({
          ...group,
          methods: [...group.methods].sort((left, right) =>
            left.method.localeCompare(right.method)
          ),
        }))
        .sort((left, right) => left.dependency.localeCompare(right.dependency));

      setTimeline(orderedTimeline);
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
          {timeline.map((group) => (
            <TimelineRender
              key={group.id}
              group={group}
              highlighted={highlighted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const AssignationTimelinePage = asDetailQueryRoute(
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
        object={data.assignation}
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
                <RekuestAssignation.Komments object={data?.assignation} />
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


export default AssignationTimelinePage;
