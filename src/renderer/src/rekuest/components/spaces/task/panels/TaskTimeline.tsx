import { useSpaceViewStore } from "../store";
import {
  AssignationEventKind,
  useNoChildrenDetailAssignationQuery,
} from "@/rekuest/api/graphql";
import { ReturnsContainer } from "@/components/widgets/returns/ReturnsContainer";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import Timestamp from "react-timestamp";
import type {
  TimelineDependencyGroup,
  TimelineItem,
  TimelineMethodRow,
} from "../types";
import { Button } from "@/components/ui/button";

// ── status helpers ───────────────────────────────────────────────────

const getStatusColor = (status: AssignationEventKind | undefined | string) => {
  switch (status) {
    case AssignationEventKind.Done:
      return "bg-primary/20 border-primary";
    case AssignationEventKind.Yield:
      return "bg-violet-400/90 border-violet-500";
    case AssignationEventKind.Error:
      return "bg-rose-400/90 border-rose-500";
    case AssignationEventKind.Critical:
      return "bg-rose-400/90 border-rose-500";
    case AssignationEventKind.Cancelled:
      return "bg-zinc-500/80 border-zinc-600";
    case AssignationEventKind.Assign:
      return "bg-sky-400/90 border-sky-500";
    default:
      return "bg-zinc-400/70 border-zinc-500";
  }
};

// ── item detail popover ──────────────────────────────────────────────

const TimelineItemDetail = ({ item }: { item: TimelineItem }) => {
  const { data } = useNoChildrenDetailAssignationQuery({
    variables: { id: item.assignation.id },
  });

  const setTimelineTimepoint = useSpaceViewStore((s) => s.selectTimepoint);

  const { registry } = useWidgetRegistry();
  const assignation = data?.assignation || item.assignation;
  const latestEvent = assignation.events
    ?.filter((i) => i.kind === AssignationEventKind.Yield)
    .at(-1);

  return (
    <div className="grid gap-4">
      <Button variant="outline" size="sm" onClick={() => setTimelineTimepoint(item.startTime)}>
        Jump Here
      </Button>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">{assignation.action?.name}</h4>
        <p className="text-sm text-muted-foreground">{assignation.id}</p>
      </div>
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-sm font-medium">Status</span>
          <span className="col-span-2 text-sm">{assignation.latestEventKind}</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-sm font-medium">Created</span>
          <span className="col-span-2 text-sm">
            <Timestamp date={assignation.createdAt} relative />
          </span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-sm font-medium">Duration</span>
          <span className="col-span-2 text-sm">{item.endTime - item.startTime} ms</span>
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

// ── bars ─────────────────────────────────────────────────────────────

const TimelineBars = ({
  items,
  highlighted,
  onClickPosition,
}: {
  items: TimelineItem[];
  highlighted: string[];
  onClickPosition: (normalised: number) => void;
}) => {
  const handleBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const normalised = (e.clientX - rect.left) / rect.width;
      onClickPosition(Math.max(0, Math.min(1, normalised)));
    },
    [onClickPosition],
  );

  return (
    <div className="relative h-8 w-full bg-muted/30 rounded-full" onClick={handleBarClick}>
      {items.map((item, index) => (
        <Popover key={index}>
          <PopoverTrigger asChild>
            <div
              className={`${
                highlighted.includes(item.assignation.id)
                  ? "ring-2 ring-offset-1 ring-primary z-20 opacity-100"
                  : "opacity-60 hover:opacity-100 hover:z-20"
              } ${getStatusColor(
                item.assignation.latestEventKind,
              )} absolute h-full border rounded-md cursor-pointer transition-all flex items-center justify-center shadow-sm`}
              style={{
                left: item.start * 100 + "%",
                width: Math.max((item.end - item.start) * 100, 0.5) + "%",
              }}
              onClick={(e) => e.stopPropagation()}
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
          </PopoverTrigger>
          <PopoverContent className="w-[500px]">
            <TimelineItemDetail item={item} />
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};

// ── method row ───────────────────────────────────────────────────────

const TimelineMethodRender = ({
  row,
  highlighted,
  onClickPosition,
}: {
  row: TimelineMethodRow;
  highlighted: string[];
  onClickPosition: (normalised: number) => void;
}) => (
  <>
    <div className="col-span-1 ml-4 rounded-md border border-primary/40 bg-background/50 px-2 py-2 z-10">
      <div className="relative">
        <div className="flex items-center gap-2 min-w-0">
          <div className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-primary shrink-0">
            {row.method}
          </div>
          <div className="ml-auto text-[10px] text-muted-foreground">{row.items.length}</div>
        </div>
      </div>
    </div>
    <div className="col-span-11 flex items-center relative z-10">
      <TimelineBars items={row.items} highlighted={highlighted} onClickPosition={onClickPosition} />
    </div>
  </>
);

// ── dependency group ─────────────────────────────────────────────────

const TimelineGroupRender = ({
  group,
  highlighted,
  onClickPosition,
}: {
  group: TimelineDependencyGroup;
  highlighted: string[];
  onClickPosition: (normalised: number) => void;
}) => {
  const [expanded, setExpanded] = useState(true);
  const itemCount = group.items.length;

  return (
    <>
      <div
        className={
          expanded
            ? "col-span-1 cursor-pointer rounded-md border border-primary/70 bg-primary/40 shadow-sm shadow-primary/20 transition-colors z-10"
            : "col-span-1 cursor-pointer rounded-md border border-border bg-card/60 hover:bg-card transition-colors z-10"
        }
      >
        <div className="w-full relative" onClick={() => setExpanded(!expanded)}>
          <div className="flex flex-col px-2 py-2">
            <div className="flex items-center gap-2 min-w-0">
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-primary-600 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <div className="font-semibold text-sm truncate">{group.dependency}</div>
              <div className="ml-auto rounded bg-primary/10 px-1 py-0.5 text-[10px] text-primary">
                {itemCount}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-11 flex items-center relative z-10">
        {!expanded ? (
          <div className="relative h-6 w-full rounded-full border border-dashed border-primary/70 bg-primary/30 flex items-center px-3 text-xs text-muted-foreground">
            {itemCount} delegated task{itemCount === 1 ? "" : "s"}
          </div>
        ) : (
          <> </>
        )}
      </div>
      {expanded &&
        group.methods.map((row) => (
          <TimelineMethodRender
            key={row.id}
            row={row}
            highlighted={highlighted}
            onClickPosition={onClickPosition}
          />
        ))}
    </>
  );
};

// ── main timeline ────────────────────────────────────────────────────

export const TaskTimeline = () => {
  const timelineGroups = useSpaceViewStore((s) => s.timelineGroups);
  const timelineEvents = useSpaceViewStore((s) => s.timelineEvents);
  const highlighted = useSpaceViewStore((s) => s.highlightedAssignationIds);
  const selectTimepoint = useSpaceViewStore((s) => s.selectTimepoint);
  const startTime = useSpaceViewStore((s) => s.timelineStartTime);
  const endTime = useSpaceViewStore((s) => s.timelineEndTime);
  const selectedTimepoint = useSpaceViewStore((s) => s.selectedTimepoint);

  const setHighlighted = useSpaceViewStore((s) => s.setHighlightedAssignationIds);

  const handleClickPosition = useCallback(
    (normalised: number) => {
      const t = startTime + normalised * (endTime - startTime);
      selectTimepoint(t);
    },
    [startTime, endTime, selectTimepoint],
  );

  const timepointNormalised =
    endTime > startTime ? (selectedTimepoint - startTime) / (endTime - startTime) : 0;

  return (
    <div
      className="w-full h-full justify-end text-white @container overflow-y-auto overflow-x-hidden rounded-b-2xl border border-border/60 bg-gradient-to-b from-background to-background/80  cursor-default"
      onClick={() => setHighlighted([])}
    >
      <div className="relative w-full h-full min-h-[200px] p-3 bg-background">
        {/* event markers (background) */}
        <div className="absolute inset-0 flex pointer-events-none z-0">
          <div className="w-1/12" />
          <div className="w-11/12 relative border-l border-white/5">
            {timelineEvents.map((event, index) => (
              <div
                key={`ev-${index}`}
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

        {/* log event labels */}
        <div className="absolute inset-0 flex pointer-events-none z-0">
          <div className="w-1/12" />
          <div className="w-11/12 relative border-l border-white/5">
            {timelineEvents.map((event, index) => (
              <div
                key={`log-${index}`}
                className="absolute bottom-0 w-px bg-white/20 group"
                style={{ left: `${event.position * 100}%` }}
              >
                <div className="-translate-x-1/2 text-xs flex items-center justify-center w-16 p-1 border bg-background/90 rounded-md">
                  {event.kind === AssignationEventKind.Log && event.message}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* selected timepoint indicator */}
        <div className="absolute inset-0 flex pointer-events-none z-30">
          <div className="w-1/12" />
          <div className="w-11/12 relative">
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary/80"
              style={{ left: `${timepointNormalised * 100}%` }}
            />
          </div>
        </div>

        {/* clickable background to set timepoint */}
        <div className="absolute inset-0 flex z-[1]">
          <div className="w-1/12" />
          <div
            className="w-11/12 cursor-crosshair"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const normalised = (e.clientX - rect.left) / rect.width;
              handleClickPosition(Math.max(0, Math.min(1, normalised)));
            }}
          />
        </div>

        <div className="grid grid-cols-12 gap-y-2 z-10 mb-10">
          {timelineGroups.map((group) => (
            <TimelineGroupRender
              key={group.id}
              group={group}
              highlighted={highlighted}
              onClickPosition={handleClickPosition}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
