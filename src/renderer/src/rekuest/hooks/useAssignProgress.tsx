import { TaskEventKind } from "../api/graphql";
import { useLatestTask } from "./useTasks";

/**
 * Latest progress/completion event of the newest still-running task matching
 * the filter. Thin wrapper over `useLatestTask` so the filter semantics stay
 * identical to every other myTasks consumer.
 */
export const useAssignProgress = (options: {
  identifier?: string;
  object?: string;
  action?: string;
  implementation?: string;
  assignedImplementation?: string;
}) => {
  const task = useLatestTask(options);

  const latestProgress = task?.events
    .filter(
      (e) =>
        e.kind == TaskEventKind.Progress ||
        e.kind == TaskEventKind.Completed,
    )
    .at(0);

  return { latestProgress };
};
