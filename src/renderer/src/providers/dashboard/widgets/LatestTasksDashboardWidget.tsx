import { useRegisterDashboardWidget } from "../hooks";
import { ListChecks, Loader2 } from "lucide-react";
import {
  useListTasksQuery,
  TaskEventKind,
  Ordering,
} from "@/rekuest/api/graphql";
import { RekuestTask } from "@/linkers";
import Timestamp from "react-timestamp";
import { Card } from "@/components/ui/card";
import { ResponsiveContainerGrid } from "@/components/layout/ContainerGrid";

const statusColor: Record<string, string> = {
  [TaskEventKind.Completed]: "text-green-500",
  [TaskEventKind.Failed]: "text-red-500",
  [TaskEventKind.Critical]: "text-red-500",
  [TaskEventKind.Cancelled]: "text-muted-foreground",
  [TaskEventKind.Bound]: "text-blue-500",
  [TaskEventKind.Progress]: "text-yellow-500",
  [TaskEventKind.Queued]: "text-muted-foreground",
};

const statusLabel: Record<string, string> = {
  [TaskEventKind.Completed]: "Done",
  [TaskEventKind.Failed]: "Error",
  [TaskEventKind.Critical]: "Critical",
  [TaskEventKind.Cancelled]: "Cancelled",
  [TaskEventKind.Progress]: "Running",
  [TaskEventKind.Queued]: "Queued",
  [TaskEventKind.Bound]: "Bound",
  [TaskEventKind.Yield]: "Yield",
};

const LatestTasksWidget = () => {
  const { data, loading } = useListTasksQuery({
    variables: {
      pagination: { limit: 10 },
      ordering: [{ createdAt: Ordering.Desc }],
    },
    fetchPolicy: "cache-and-network",
  });

  const tasks = data?.tasks ?? [];

  return (
    <div className="flexh-full gap-2 @container">
      {loading && tasks.length === 0 ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : tasks.length === 0 ? (
        <p className="text-xs text-muted-foreground">No tasks yet</p>
      ) : (
        <ResponsiveContainerGrid>
          {tasks.map((task) => (
            <RekuestTask.Smart key={task.id} object={task}>
              <RekuestTask.DetailLink
                object={task}
                className={() =>
                  "block p-2 rounded-lgtransition-colors cursor-pointer"
                }
              >
                <Card className="flex items-center justify-between gap-2  bg-muted/50 hover:bg-muted ">
                  <span className="text-xs font-medium truncate">
                    {task.action.name}
                  </span>
                  <span
                    className={`text-[10px] shrink-0 ${statusColor[task.latestEventKind] ?? "text-muted-foreground"}`}
                  >
                    {statusLabel[task.latestEventKind] ??
                      task.latestEventKind}
                  </span>

                <p className="text-[10px] text-muted-foreground mt-0.5">
                  <Timestamp date={task.createdAt} relative />
                </p>
                </Card>
              </RekuestTask.DetailLink>
            </RekuestTask.Smart>
          ))}
        </ResponsiveContainerGrid>
      )}
    </div>
  );
};

export const LatestTasksDashboardWidget = () => {
  useRegisterDashboardWidget({
    key: "latest-tasks",
    label: "Latest Tasks",
    module: "rekuest",
    icon: <ListChecks className="w-3 h-3" />,
    component: () => <LatestTasksWidget />,
    defaultSize: "1x2",
    defaultWidth: 25,
    defaultHeight: 100,
  });

  return null;
};
