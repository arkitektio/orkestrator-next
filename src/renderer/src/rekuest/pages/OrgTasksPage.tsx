import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateTimeRangePicker } from "@/components/ui/date-time-range-picker";
import { RekuestTask } from "@/linkers";
import { Ordering, TaskEventKind, TaskStatus } from "@/rekuest/api/graphql";
import TaskList from "@/rekuest/components/lists/TaskList";
import { X } from "lucide-react";
import {
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";

const STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
  { label: "Done", value: TaskStatus.Done },
  { label: "Ongoing", value: TaskStatus.Ongoing },
  { label: "Assigning", value: TaskStatus.Assigning },
  { label: "Cancelled", value: TaskStatus.Cancelled },
  { label: "Critical", value: TaskStatus.Critical },
];

const STATE_OPTIONS: { label: string; value: TaskEventKind }[] = [
  { label: "Queued", value: TaskEventKind.Queued },
  { label: "Assigned", value: TaskEventKind.Bound },
  { label: "Yielded", value: TaskEventKind.Yield },
  { label: "Done", value: TaskEventKind.Completed },
  { label: "Error", value: TaskEventKind.Failed },
  { label: "Cancelled", value: TaskEventKind.Cancelled },
  { label: "Critical", value: TaskEventKind.Critical },
];

/**
 * Org-wide tasks view: every root task across the organization (the `tasks`
 * query, unscoped), paginated and filterable. This is intentionally separate
 * from the per-user "Tasks" page, which is driven by the caller-scoped
 * `mytasks` stream.
 */
const OrgTasksPage = () => {
  const [createdAfter, setCreatedAfter] = useQueryState(
    "after",
    parseAsIsoDateTime,
  );
  const [createdBefore, setCreatedBefore] = useQueryState(
    "before",
    parseAsIsoDateTime,
  );

  const [statusFilter, setStatusFilter] = useQueryState<TaskStatus[]>(
    "status",
    parseAsArrayOf(parseAsStringLiteral(Object.values(TaskStatus))).withDefault(
      [],
    ),
  );

  const [stateFilter, setStateFilter] = useQueryState<TaskEventKind[]>(
    "state",
    parseAsArrayOf(
      parseAsStringLiteral(Object.values(TaskEventKind)),
    ).withDefault([]),
  );

  const toggleStatus = (value: TaskStatus) =>
    setStatusFilter((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );

  const toggleState = (value: TaskEventKind) =>
    setStateFilter((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );

  const hasActiveFilters =
    createdAfter ||
    createdBefore ||
    statusFilter.length > 0 ||
    stateFilter.length > 0;

  const clearFilters = () => {
    setCreatedAfter(null);
    setCreatedBefore(null);
    setStatusFilter([]);
    setStateFilter([]);
  };

  return (
    <RekuestTask.ListPage
      title={"Org Tasks"}
      pageActions={
        <DateTimeRangePicker
          initialDateFrom={createdAfter ?? undefined}
          initialDateTo={createdBefore ?? undefined}
          onUpdate={({ range }) => {
            setCreatedAfter(range.from || null);
            setCreatedBefore(range.to || null);
          }}
        />
      }
    >
      <div className="flex h-full flex-col gap-4 p-6">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Organization Tasks
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Every task running across the organization.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">
              Status:
            </span>
            {STATUS_OPTIONS.map(({ label, value }) => (
              <Badge
                key={value}
                variant={statusFilter.includes(value) ? "default" : "outline"}
                className="cursor-pointer select-none"
                onClick={() => toggleStatus(value)}
              >
                {label}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">
              State:
            </span>
            {STATE_OPTIONS.map(({ label, value }) => (
              <Badge
                key={value}
                variant={stateFilter.includes(value) ? "default" : "outline"}
                className="cursor-pointer select-none"
                onClick={() => toggleState(value)}
              >
                {label}
              </Badge>
            ))}
          </div>

          {hasActiveFilters && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear filters
              </Button>
            </div>
          )}
        </div>

        <TaskList
          order={{ createdAt: Ordering.Desc }}
          filters={{
            createdAfter: createdAfter ?? undefined,
            createdBefore: createdBefore ?? undefined,
            status: statusFilter.length > 0 ? statusFilter : undefined,
            state: stateFilter.length > 0 ? stateFilter : undefined,
          }}
        />
      </div>
    </RekuestTask.ListPage>
  );
};

export default OrgTasksPage;
