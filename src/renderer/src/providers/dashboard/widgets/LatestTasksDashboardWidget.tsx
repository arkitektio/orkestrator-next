import { useRegisterDashboardWidget } from "../hooks";
import { ListChecks, Loader2 } from "lucide-react";
import {
  useListAssignationsQuery,
  AssignationEventKind,
  Ordering,
} from "@/rekuest/api/graphql";
import { RekuestAssignation } from "@/linkers";
import Timestamp from "react-timestamp";
import { Card } from "@/components/ui/card";
import { ResponsiveContainerGrid } from "@/components/layout/ContainerGrid";

const statusColor: Record<string, string> = {
  [AssignationEventKind.Done]: "text-green-500",
  [AssignationEventKind.Error]: "text-red-500",
  [AssignationEventKind.Critical]: "text-red-500",
  [AssignationEventKind.Cancelled]: "text-muted-foreground",
  [AssignationEventKind.Assign]: "text-blue-500",
  [AssignationEventKind.Progress]: "text-yellow-500",
  [AssignationEventKind.Queued]: "text-muted-foreground",
};

const statusLabel: Record<string, string> = {
  [AssignationEventKind.Done]: "Done",
  [AssignationEventKind.Error]: "Error",
  [AssignationEventKind.Critical]: "Critical",
  [AssignationEventKind.Cancelled]: "Cancelled",
  [AssignationEventKind.Assign]: "Assigned",
  [AssignationEventKind.Progress]: "Running",
  [AssignationEventKind.Queued]: "Queued",
  [AssignationEventKind.Bound]: "Bound",
  [AssignationEventKind.Yield]: "Yield",
};

const LatestTasksWidget = () => {
  const { data, loading } = useListAssignationsQuery({
    variables: {
      pagination: { limit: 10 },
      order: { createdAt: Ordering.Desc },
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
            <RekuestAssignation.Smart key={task.id} object={task}>
              <RekuestAssignation.DetailLink
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
                    className={`text-[10px] shrink-0 text-primary "text-muted-foreground"}`}
                  >
                    {statusLabel[task.latestEventKind] ??
                      task.latestEventKind}
                  </span>

                <p className="text-[10px] text-muted-foreground mt-0.5">
                  <Timestamp date={task.createdAt} relative />
                </p>
                </Card>
              </RekuestAssignation.DetailLink>
            </RekuestAssignation.Smart>
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
