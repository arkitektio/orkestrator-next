import { TaskEventKind, PortKind } from "../api/graphql";
import { useTasks } from "./useTasks";

export const useAssignProgress = (options: {
  identifier?: string;
  object?: string;
  action?: string;
  implementation?: string;
  assignedImplementation?: string;
}) => {
  const { data } = useTasks();

  const tasks = data?.tasks.filter((a) => {
    if (a.isDone || a.latestEventKind == TaskEventKind.Completed) {
      return false;
    }

    if (options.action) {
      if (a.action?.id != options.action) {
        return false;
      }
    }

    if (options.implementation) {
      if (a.implementation?.id != options.implementation) {
        return false;
      }
    }

    if (options.assignedImplementation) {
      console.log(a.implementation?.id, options.assignedImplementation);
      if (a.implementation?.id != options.assignedImplementation) {
        return false;
      }
    }

    if (options.identifier && options.object) {
      let matches = false;
      for (const port of a.action.args) {
        if (
          port.kind == PortKind.Structure &&
          port.identifier == options.identifier
        ) {
          if (a.args[port.key] == options.object) {
            matches = true;
            break;
          }
        }

        if (!matches) {
          return false;
        }
      }
    }

    return true;
  });

  const latestProgress = tasks
    ?.at(-1)
    ?.events.filter(
      (e) =>
        e.kind == TaskEventKind.Progress ||
        e.kind == TaskEventKind.Completed,
    )
    .at(0);

  const latestError = tasks
    ?.at(-1)
    ?.events.filter(
      (e) =>
        e.kind == TaskEventKind.Failed ||
        e.kind == TaskEventKind.Critical,
    )
    .at(0);

  return { latestProgress };
};
